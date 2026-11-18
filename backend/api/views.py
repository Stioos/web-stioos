"""
STIOOS GLOBAL — DRF function-based views for the marketplace + dashboards API.

These views mirror the existing Next.js route handlers in
``src/app/api/**/route.ts`` one-to-one: same URL paths, same auth guards,
same request/response JSON shapes, and the same side-effects
(Notification + ActivityLog creation on mutations).

Conventions:
- ``@api_view`` declares the accepted methods; DRF's AllowAny + JSONParser
  + JSONRenderer settings are already configured globally.
- Auth is resolved per-request via ``get_current_admin`` / ``get_current_buyer``
  from ``api.auth``.
- Body parsing goes through ``_body(request)`` which returns ``None`` when the
  JSON is malformed (mirrors Next.js's ``parseBody`` returning ``null``).
- Mutations emit a ``Notification`` and / or ``ActivityLog`` row via the
  ``_notify`` / ``_log_activity`` helpers, both wrapped in ``try/except`` so a
  logging failure never breaks the mutation.
- Every response is a ``JsonResponse`` with the same shape & status code the
  Next.js route returns.
"""
from __future__ import annotations

import json
import re
import secrets
import time
from datetime import timezone as dt_timezone

from django.contrib.auth.hashers import make_password
from django.db import IntegrityError, transaction
from django.db.models import Q
from django.http import JsonResponse
from django.utils import timezone
from rest_framework.decorators import api_view

from api.auth import (
    SESSION_COOKIE,
    clear_session,
    get_current_admin,
    get_current_buyer,
    get_session,
    json_error,
    sign_in_admin,
    sign_in_buyer,
    sign_up_buyer,
)
from api.dto import (
    activity_dto,
    admin_dto,
    category_dto,
    inquiry_dto,
    message_dto,
    notification_dto,
    order_dto,
    request_dto,
    role_dto,
    service_dto,
    subcategory_dto,
    thread_dto,
    user_dto,
)
from api.models import (
    ActivityLog,
    AdminUser,
    Category,
    Inquiry,
    MarketMessage,
    MarketOrder,
    MarketRequest,
    MarketThread,
    Notification,
    Role,
    Service,
    Setting,
    Subcategory,
    User,
    Wishlist,
)


# --------------------------------------------------------------------------
# response / side-effect helpers
# --------------------------------------------------------------------------

def _json(data, status: int = 200) -> JsonResponse:
    return JsonResponse(data, status=status)


def _ok(data) -> JsonResponse:
    return JsonResponse(data, status=200)


def _created(data) -> JsonResponse:
    return JsonResponse(data, status=201)


def _bad(message: str) -> JsonResponse:
    return JsonResponse({"error": message}, status=400)


def _unauth(message: str = "Sign in required.") -> JsonResponse:
    return JsonResponse({"error": message}, status=401)


def _not_found(message: str = "Not found.") -> JsonResponse:
    return JsonResponse({"error": message}, status=404)


def _server_error(message: str = "Server error.") -> JsonResponse:
    return JsonResponse({"error": message}, status=500)


def _body(request):
    """Mirror Next.js ``parseBody``: return parsed JSON dict or ``None``."""
    try:
        data = request.data
    except Exception:
        return None
    if data is None:
        return None
    if not isinstance(data, dict):
        return None
    return data


def _log_activity(actor: str, action: str, module: str, target: str, description: str) -> None:
    try:
        ActivityLog.objects.create(
            actor=actor,
            action=action,
            module=module,
            target=target,
            description=description,
        )
    except Exception:
        # Never fail a mutation because logging failed.
        pass


def _notify(type_: str, title: str, message: str) -> None:
    try:
        Notification.objects.create(type=type_, title=title, message=message)
    except Exception:
        pass


# --------------------------------------------------------------------------
# misc helpers
# --------------------------------------------------------------------------

_REQUEST_REF_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"


def new_request_reference() -> str:
    s = "".join(secrets.choice(_REQUEST_REF_CHARS) for _ in range(5))
    return f"REQ-{s}"


_SLUG_RE = re.compile(r"[^a-z0-9\s-]")


def slugify(input_str: str) -> str:
    s = (input_str or "").lower().strip()
    s = _SLUG_RE.sub("", s)
    s = re.sub(r"\s+", "-", s)
    s = re.sub(r"-+", "-", s)
    s = re.sub(r"^-|-$", "", s)
    return s


def _avatar_initials(name: str) -> str | None:
    words = [w for w in (name or "").split() if w]
    initials = "".join(w[0].upper() for w in words[:2])
    return initials or None


def _to_base36(n: int) -> str:
    if n == 0:
        return "0"
    chars = "0123456789abcdefghijklmnopqrstuvwxyz"
    out = ""
    while n > 0:
        out = chars[n % 36] + out
        n //= 36
    return out


def _iso_now() -> str:
    """ISO-8601 timestamp for ``timezone.now()`` (used inside JSON payloads)."""
    dt = timezone.now()
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=dt_timezone.utc)
    return dt.isoformat()


# ==========================================================================
# AUTH
# ==========================================================================

@api_view(["POST"])
def auth_signup(request):
    payload = _body(request)
    if payload is None:
        return _bad("Invalid JSON body.")
    # The auth helper calls ``response.set_cookie`` on the response we pass in,
    # so we build a placeholder body now and overwrite its content once the
    # user object is available.
    response = JsonResponse({}, status=200)
    user, err = sign_up_buyer(payload, response, request.META.get("HTTP_USER_AGENT", ""))
    if err:
        return json_error(err, 400)
    response.content = json.dumps({"ok": True, "user": user_dto(user)}).encode("utf-8")
    return response


@api_view(["POST"])
def auth_login(request):
    body = _body(request)
    if body is None:
        return _bad("Invalid JSON body.")
    email = str(body.get("email") or "").strip()
    password = str(body.get("password") or "")
    if not email or not password:
        return _bad("Email and password are required.")

    ua = request.META.get("HTTP_USER_AGENT", "")

    # Try admin first (platform staff).
    admin_response = JsonResponse({}, status=200)
    admin, admin_err = sign_in_admin(email, password, admin_response, ua)
    if admin is not None:
        admin_response.content = json.dumps(
            {"ok": True, "role": "admin", "admin": admin_dto(admin)}
        ).encode("utf-8")
        return admin_response
    # If the email matched an admin but the password was wrong / account
    # inactive, surface that error instead of falling through to a buyer
    # "no account" message.
    if admin_err and "no admin" not in admin_err.lower():
        return json_error(admin_err, 401)

    # Fall back to buyer.
    buyer_response = JsonResponse({}, status=200)
    buyer, buyer_err = sign_in_buyer(email, password, buyer_response, ua)
    if buyer is not None:
        buyer_response.content = json.dumps(
            {"ok": True, "role": "buyer", "user": user_dto(buyer)}
        ).encode("utf-8")
        return buyer_response
    return json_error(buyer_err or "Sign in failed.", 401)


@api_view(["POST"])
def auth_logout(request):
    response = JsonResponse({"ok": True}, status=200)
    clear_session(response, request.COOKIES.get(SESSION_COOKIE))
    return response


@api_view(["GET"])
def auth_me(request):
    kind, principal = get_session(request)
    if not kind or principal is None:
        return JsonResponse({"ok": False}, status=200)
    if kind == "admin":
        return JsonResponse({"ok": True, "kind": "admin", "admin": admin_dto(principal)}, status=200)
    return JsonResponse({"ok": True, "kind": "buyer", "user": user_dto(principal)}, status=200)


# ==========================================================================
# INQUIRIES
# ==========================================================================

@api_view(["GET", "POST"])
def inquiries_view(request):
    if request.method == "GET":
        admin = get_current_admin(request)
        if not admin:
            return _unauth("Admin sign in required.")
        qs = Inquiry.objects.all().order_by("-created_at")
        type_ = request.query_params.get("type")
        status = request.query_params.get("status")
        if type_:
            qs = qs.filter(type=type_)
        if status:
            qs = qs.filter(status=status)
        return _ok({"inquiries": [inquiry_dto(i) for i in qs]})

    # POST — anonymous OR buyer
    body = _body(request)
    if body is None:
        return _bad("Invalid JSON body.")
    name = str(body.get("name") or "").strip()
    email = str(body.get("email") or "").strip()
    type_ = str(body.get("type") or "").strip()
    if not name or not email or not type_:
        return _bad("name, email and type are required.")
    if type_ not in ("quote", "service_request", "contact", "consultation"):
        return _bad("Invalid inquiry type.")

    buyer = get_current_buyer(request)
    inquiry = Inquiry.objects.create(
        name=name,
        email=email,
        company=str(body.get("company") or ""),
        phone=str(body.get("phone") or ""),
        type=type_,
        service_id=body.get("serviceId") or None,
        service_name=body.get("serviceName") or None,
        requirements=str(body.get("requirements") or ""),
        budget_range=str(body.get("budgetRange") or ""),
        timeline=str(body.get("timeline") or ""),
        status="new",
        buyer_id=buyer.id if buyer else None,
    )
    if buyer:
        User.objects.filter(id=buyer.id).update(inquiries_count=(buyer.inquiries_count or 0) + 1)

    service_name = body.get("serviceName")
    company = body.get("company")
    notif_type = "contact_inquiry" if type_ == "contact" else "service_request"
    if type_ == "contact":
        title = "New contact inquiry"
    elif type_ == "consultation":
        title = "Consultation request"
    elif type_ == "quote":
        title = "New quote request"
    else:
        title = "New service request"
    msg = name
    if company:
        msg += f" ({company})"
    if service_name:
        msg += f" — {service_name}"
    msg += "."
    _notify(notif_type, title, msg)
    _log_activity(
        actor=name,
        action="created",
        module="Inquiry Management",
        target=inquiry.id,
        description=f"{type_.replace('_', ' ')} submitted" + (f" for {service_name}" if service_name else "") + ".",
    )

    return _created({"ok": True, "inquiry": {"id": inquiry.id, "reference": inquiry.id.upper()}})


@api_view(["PATCH", "DELETE"])
def inquiry_detail(request, id: str):
    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")

    try:
        inquiry = Inquiry.objects.get(id=id)
    except Inquiry.DoesNotExist:
        return _not_found("Inquiry not found.")

    if request.method == "PATCH":
        body = _body(request)
        if body is None:
            return _bad("Invalid JSON body.")
        status = body.get("status")
        if not status:
            return _bad("status is required.")
        if status not in ("new", "in_progress", "contacted", "closed"):
            return _bad("Invalid status.")
        inquiry.status = status
        inquiry.save(update_fields=["status"])
        _log_activity(
            actor=admin.name,
            action="updated",
            module="Inquiry Management",
            target=id,
            description=f"Status changed to {status.replace('_', ' ')}.",
        )
        return _ok({"inquiry": {"id": inquiry.id, "status": inquiry.status}})

    # DELETE
    inquiry.delete()
    _log_activity(
        actor=admin.name,
        action="deleted",
        module="Inquiry Management",
        target=id,
        description="Inquiry deleted.",
    )
    return _ok({"ok": True})


# ==========================================================================
# REQUESTS (marketplace briefs)
# ==========================================================================

@api_view(["GET", "POST"])
def requests_view(request):
    if request.method == "GET":
        admin = get_current_admin(request)
        if admin:
            qs = MarketRequest.objects.all().order_by("-created_at")
            return _ok({"requests": [request_dto(r) for r in qs]})
        buyer = get_current_buyer(request)
        if not buyer:
            return _unauth("Sign in required.")
        qs = MarketRequest.objects.filter(buyer_id=buyer.id).order_by("-created_at")
        return _ok({"requests": [request_dto(r) for r in qs]})

    # POST — buyer only
    buyer = get_current_buyer(request)
    if not buyer:
        return _unauth("Sign in to submit a request.")
    body = _body(request)
    if body is None:
        return _bad("Invalid JSON body.")
    title = str(body.get("title") or "").strip()
    category_id = str(body.get("categoryId") or "").strip()
    category_name = str(body.get("categoryName") or "").strip()
    if not title or not category_id or not category_name:
        return _bad("title, categoryId and categoryName are required.")

    reference = new_request_reference()
    for _ in range(3):
        if not MarketRequest.objects.filter(reference=reference).exists():
            break
        reference = new_request_reference()

    kind = body.get("kind") or "service"
    now_iso = _iso_now()
    req = MarketRequest.objects.create(
        buyer_id=buyer.id,
        buyer_name=buyer.name,
        buyer_company=buyer.company or "",
        category_id=category_id,
        category_name=category_name,
        title=title,
        details=str(body.get("details") or ""),
        budget_range=str(body.get("budgetRange") or ""),
        timeline=str(body.get("timeline") or ""),
        status="open",
        kind=kind,
        reference=reference,
        meta=body.get("meta") or {},
        status_history=[
            {"status": "open", "at": now_iso, "by": buyer.name, "note": "Request submitted"}
        ],
    )

    buyer_label = buyer.name
    if buyer.company:
        buyer_label += f" ({buyer.company})"
    _notify(
        "service_request",
        "New service request",
        f'{buyer_label} submitted "{title}".',
    )
    _log_activity(
        actor=buyer.name,
        action="created",
        module="Service Requests",
        target=req.id,
        description=f"Submitted request {reference}: {title}.",
    )
    return _created({"ok": True, "request": {"id": req.id, "reference": reference}})


@api_view(["GET", "PATCH"])
def request_detail(request, id: str):
    if request.method == "GET":
        admin = get_current_admin(request)
        if not admin:
            return _unauth()
        try:
            req = MarketRequest.objects.get(id=id)
        except MarketRequest.DoesNotExist:
            return _not_found()
        return _ok({"request": request_dto(req)})

    # PATCH — admin
    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    try:
        req = MarketRequest.objects.get(id=id)
    except MarketRequest.DoesNotExist:
        return _not_found("Request not found.")

    body = _body(request)
    if body is None:
        return _bad("Invalid JSON body.")
    status = body.get("status")
    if not status:
        return _bad("status is required.")
    if status not in ("open", "in_review", "in_progress", "fulfilled", "rejected", "closed"):
        return _bad("Invalid status.")

    history = list(req.status_history or [])
    history.append({
        "status": status,
        "at": _iso_now(),
        "by": admin.name,
        "note": body.get("note") or "",
    })
    req.status = status
    req.status_history = history
    req.save(update_fields=["status", "status_history"])
    _log_activity(
        actor=admin.name,
        action="updated",
        module="Service Requests",
        target=id,
        description=f"Request {req.reference} moved to {status.replace('_', ' ')}" + (f" — {body.get('note')}" if body.get("note") else "") + ".",
    )
    return _ok({"request": {"id": req.id, "status": req.status}})


@api_view(["POST"])
def request_convert(request, id: str):
    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    try:
        req = MarketRequest.objects.get(id=id)
    except MarketRequest.DoesNotExist:
        return _not_found("Request not found.")

    body = _body(request)
    if body is None:
        return _bad("Invalid JSON body.")
    amount = body.get("amount")
    if amount is None:
        return _bad("amount is required.")
    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return _bad("amount must be a non-negative number.")
    if amount < 0:
        return _bad("amount must be a non-negative number.")

    if req.order_id:
        return _bad("This request has already been converted to an order.")

    # Resolve a service for the order: most popular in the request's category;
    # otherwise the most popular overall; otherwise 400.
    service = (
        Service.objects.filter(category_id=req.category_id).order_by("-popularity").first()
    )
    if service is None:
        service = Service.objects.all().order_by("-popularity").first()
    if service is None:
        return _bad("No service exists to attach an order to.")

    try:
        with transaction.atomic():
            order = MarketOrder.objects.create(
                service_id=service.id,
                service_slug=service.slug,
                service_name=service.name,
                service_icon=service.icon or "",
                buyer_id=req.buyer_id,
                buyer_name=req.buyer_name,
                buyer_company=req.buyer_company or "",
                amount=amount,
                status="pending",
                delivery_type=service.delivery_type,
                placed_at=timezone.now(),
                requirements=req.details,
            )
            history = list(req.status_history or [])
            note = body.get("note") or f"Converted to order {order.id} — quoted ${amount}"
            history.append({
                "status": "fulfilled",
                "at": _iso_now(),
                "by": admin.name,
                "note": note,
            })
            req.quoted_amount = amount
            req.order_id = order.id
            req.status = "fulfilled"
            req.status_history = history
            req.save(update_fields=["quoted_amount", "order_id", "status", "status_history"])
    except Exception:
        return _server_error("Failed to convert request to order.")

    _log_activity(
        actor=admin.name,
        action="converted",
        module="Service Requests",
        target=req.id,
        description=f"Converted request {req.reference} into order {order.id} (${amount}).",
    )
    return _ok({"ok": True, "orderId": order.id})


# ==========================================================================
# ORDERS
# ==========================================================================

@api_view(["GET"])
def orders_view(request):
    admin = get_current_admin(request)
    if admin:
        qs = MarketOrder.objects.all().order_by("-placed_at")
        return _ok({"orders": [order_dto(o) for o in qs]})
    buyer = get_current_buyer(request)
    if not buyer:
        return _unauth("Sign in required.")
    qs = MarketOrder.objects.filter(buyer_id=buyer.id).order_by("-placed_at")
    return _ok({"orders": [order_dto(o) for o in qs]})


@api_view(["PATCH"])
def order_detail(request, id: str):
    body = _body(request)
    if body is None:
        return _bad("Invalid JSON body.")
    status = body.get("status")
    if not status:
        return _bad("status is required.")
    if status not in ("pending", "in_progress", "delivered", "completed", "cancelled"):
        return _bad("Invalid status.")

    try:
        order = MarketOrder.objects.get(id=id)
    except MarketOrder.DoesNotExist:
        return _not_found("Order not found.")

    admin = get_current_admin(request)
    buyer = get_current_buyer(request)
    if not admin and not buyer:
        return _unauth()
    if buyer and not admin and buyer.id != order.buyer_id:
        return _bad("You can only update your own orders.")
    if buyer and not admin and status != "completed":
        return _bad("Buyers can only accept delivery (mark completed).")

    order.status = status
    order.save(update_fields=["status"])

    actor = admin.name if admin else buyer.name
    _log_activity(
        actor=actor,
        action="updated",
        module="Orders",
        target=id,
        description=f"Order {order.service_name} status → {status.replace('_', ' ')}.",
    )
    return _ok({"order": {"id": order.id, "status": order.status}})


# ==========================================================================
# WISHLIST
# ==========================================================================

@api_view(["GET", "POST"])
def wishlist_view(request):
    if request.method == "GET":
        buyer = get_current_buyer(request)
        if not buyer:
            return _unauth()
        items = Wishlist.objects.filter(user_id=buyer.id)
        slugs = [w.service_slug for w in items]
        services = []
        if slugs:
            services = list(Service.objects.filter(slug__in=slugs))
        return _ok({
            "services": [service_dto(s) for s in services],
            "slugs": [s.slug for s in services],
        })

    # POST — toggle
    buyer = get_current_buyer(request)
    if not buyer:
        return _unauth("Sign in to save services.")
    body = _body(request)
    if body is None:
        return _bad("Invalid JSON body.")
    slug = body.get("serviceSlug")
    if not slug:
        return _bad("serviceSlug is required.")
    slug = str(slug)
    existing = Wishlist.objects.filter(user_id=buyer.id, service_slug=slug).first()
    if existing:
        existing.delete()
        return _ok({"ok": True, "saved": False})
    Wishlist.objects.create(user_id=buyer.id, service_slug=slug)
    return _ok({"ok": True, "saved": True})


# ==========================================================================
# THREADS / MESSAGES
# ==========================================================================

@api_view(["GET"])
def threads_view(request):
    buyer = get_current_buyer(request)
    if not buyer:
        return _unauth("Sign in required.")
    threads = MarketThread.objects.filter(buyer_id=buyer.id).order_by("-last_message_at")
    out = []
    for t in threads:
        messages = list(MarketMessage.objects.filter(thread_id=t.id).order_by("sent_at"))
        out.append(thread_dto(t, messages))
    return _ok({"threads": out})


@api_view(["POST"])
def thread_messages(request, id: str):
    buyer = get_current_buyer(request)
    if not buyer:
        return _unauth("Sign in to send messages.")
    body = _body(request)
    if body is None:
        return _bad("Invalid JSON body.")
    body_val = body.get("body")
    if not body_val:
        return _bad("body is required.")
    text = str(body_val).strip()
    if not text:
        return _bad("Message cannot be empty.")

    try:
        thread = MarketThread.objects.get(id=id)
    except MarketThread.DoesNotExist:
        return _not_found("Conversation not found.")
    if thread.buyer_id != buyer.id:
        return _bad("You can only message in your own conversations.")

    now = timezone.now()
    message = MarketMessage.objects.create(
        thread_id=id,
        sender_id=buyer.id,
        sender_name=buyer.name,
        sender_role="buyer",
        body=text,
        sent_at=now,
    )
    thread.last_message_at = now
    thread.save(update_fields=["last_message_at"])
    return _ok({"ok": True, "message": {"id": message.id, "sentAt": now.isoformat()}})


# ==========================================================================
# SERVICES
# ==========================================================================

def _list_services(request):
    qs = Service.objects.all()
    status = request.query_params.get("status")
    if status:
        qs = qs.filter(status=status)
    category_id = request.query_params.get("categoryId")
    if category_id:
        qs = qs.filter(category_id=category_id)
    subcategory_id = request.query_params.get("subcategoryId")
    if subcategory_id:
        qs = qs.filter(subcategory_id=subcategory_id)
    featured_raw = request.query_params.get("featured")
    if featured_raw == "true":
        qs = qs.filter(featured=True)
    elif featured_raw == "false":
        qs = qs.filter(featured=False)
    search = request.query_params.get("search")
    if search:
        qs = qs.filter(
            Q(name__icontains=search)
            | Q(short_description__icontains=search)
            | Q(tags__icontains=search)
        )
    sort = request.query_params.get("sort")
    if sort == "popular":
        qs = qs.order_by("-popularity")
    elif sort == "rating":
        qs = qs.order_by("-rating")
    elif sort == "newest":
        qs = qs.order_by("-created_at")
    else:
        qs = qs.order_by("-popularity")
    limit_raw = request.query_params.get("limit")
    if limit_raw:
        try:
            n = int(limit_raw)
            if n > 0:
                qs = qs[:n]
        except (TypeError, ValueError):
            pass
    else:
        qs = qs[:1000]
    return qs


@api_view(["GET", "POST"])
def services_view(request):
    if request.method == "GET":
        qs = _list_services(request)
        return _ok({"services": [service_dto(s) for s in qs]})

    # POST — admin
    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    body = _body(request)
    if body is None:
        return _bad("Invalid JSON body.")
    name = str(body.get("name") or "").strip()
    category_id = str(body.get("categoryId") or "").trim()
    subcategory_id = str(body.get("subcategoryId") or "").trim()
    if not name:
        return _bad("name is required.")
    if not category_id:
        return _bad("categoryId is required.")
    if not subcategory_id:
        return _bad("subcategoryId is required.")

    slug_raw = str(body.get("slug") or "").strip()
    slug = slug_raw if slug_raw else slugify(name)
    if not slug:
        return _bad("Could not derive a slug from name.")

    if not Category.objects.filter(id=category_id).exists():
        return _bad("Category does not exist.")
    sub = Subcategory.objects.filter(id=subcategory_id).first()
    if not sub or sub.category_id != category_id:
        return _bad("Subcategory does not exist for this category.")

    if body.get("status") and body.get("status") not in ("draft", "published", "archived"):
        return _bad("Invalid status.")
    if body.get("deliveryType") and body.get("deliveryType") not in (
        "project", "subscription", "retainer", "on_demand", "self_serve"
    ):
        return _bad("Invalid deliveryType.")

    try:
        service = Service.objects.create(
            name=name,
            slug=slug,
            category_id=category_id,
            subcategory_id=subcategory_id,
            short_description=body.get("shortDescription") or "",
            full_description=body.get("fullDescription") or "",
            tags=body.get("tags") or [],
            industries=body.get("industries") or [],
            delivery_type=body.get("deliveryType") or "project",
            timeline=body.get("timeline") or "",
            rating=body.get("rating") or 0,
            reviews=body.get("reviews") or 0,
            popularity=body.get("popularity") or 0,
            featured=bool(body.get("featured") or False),
            status=body.get("status") or "published",
            accent=body.get("accent") or "",
            icon=body.get("icon") or "",
            problems_solved=body.get("problemsSolved") or [],
            capabilities=body.get("capabilities") or [],
            deliverables=body.get("deliverables") or [],
            process=body.get("process") or [],
            technologies=body.get("technologies") or [],
            faqs=body.get("faqs") or [],
            meta_title=body.get("metaTitle") or None,
            meta_description=body.get("metaDescription") or None,
            created_by=admin.name,
        )
    except IntegrityError:
        return _bad("Slug already exists for a service.")

    _log_activity(
        actor=admin.name,
        action="created",
        module="Service Management",
        target=service.id,
        description=f'Created service "{name}" ({slug}).',
    )
    return _created({"ok": True, "service": {"id": service.id, "slug": service.slug, "name": service.name}})


@api_view(["GET", "PATCH", "DELETE"])
def service_detail(request, id: str):
    try:
        service = Service.objects.get(id=id)
    except Service.DoesNotExist:
        if request.method == "GET":
            return _not_found("Service not found.")
        return _not_found("Service not found.")

    if request.method == "GET":
        return _ok({"service": service_dto(service)})

    # PATCH / DELETE — admin
    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")

    if request.method == "PATCH":
        body = _body(request)
        if body is None:
            return _bad("Invalid JSON body.")

        if body.get("categoryId") is not None:
            if not Category.objects.filter(id=str(body.get("categoryId"))).exists():
                return _bad("Category does not exist.")
        if body.get("subcategoryId") is not None:
            if not Subcategory.objects.filter(id=str(body.get("subcategoryId"))).exists():
                return _bad("Subcategory does not exist.")
        if body.get("status") is not None and str(body.get("status")) not in (
            "draft", "published", "archived"
        ):
            return _bad("Invalid status.")
        if body.get("deliveryType") is not None and str(body.get("deliveryType")) not in (
            "project", "subscription", "retainer", "on_demand", "self_serve"
        ):
            return _bad("Invalid deliveryType.")

        allowed = {
            "name": "name",
            "slug": "slug",
            "categoryId": "category_id",
            "subcategoryId": "subcategory_id",
            "shortDescription": "short_description",
            "fullDescription": "full_description",
            "tags": "tags",
            "industries": "industries",
            "deliveryType": "delivery_type",
            "timeline": "timeline",
            "rating": "rating",
            "reviews": "reviews",
            "popularity": "popularity",
            "featured": "featured",
            "status": "status",
            "accent": "accent",
            "icon": "icon",
            "problemsSolved": "problems_solved",
            "capabilities": "capabilities",
            "deliverables": "deliverables",
            "process": "process",
            "technologies": "technologies",
            "faqs": "faqs",
            "metaTitle": "meta_title",
            "metaDescription": "meta_description",
        }
        update_fields = []
        for camel, snake in allowed.items():
            if camel in body and body.get(camel) is not None:
                val = body.get(camel)
                if snake == "featured":
                    val = bool(val)
                elif snake in ("rating", "popularity"):
                    try:
                        val = float(val) if val is not None else 0
                    except (TypeError, ValueError):
                        val = 0
                elif snake == "reviews":
                    try:
                        val = int(val) if val is not None else 0
                    except (TypeError, ValueError):
                        val = 0
                elif snake in ("meta_title", "meta_description"):
                    val = val if val else None
                setattr(service, snake, val)
                update_fields.append(snake)
        try:
            if update_fields:
                service.save(update_fields=update_fields)
        except IntegrityError:
            return _bad("Update failed — slug may already be in use.")

        _log_activity(
            actor=admin.name,
            action="updated",
            module="Service Management",
            target=id,
            description=f'Updated service "{service.name}".',
        )
        return _ok({"ok": True})

    # DELETE
    name_snapshot = service.name
    service.delete()
    _log_activity(
        actor=admin.name,
        action="deleted",
        module="Service Management",
        target=id,
        description=f'Deleted service "{name_snapshot}".',
    )
    return _ok({"ok": True})


@api_view(["PATCH"])
def service_status(request, id: str):
    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    try:
        service = Service.objects.get(id=id)
    except Service.DoesNotExist:
        return _not_found("Service not found.")
    body = _body(request)
    if body is None:
        return _bad("Invalid JSON body.")
    status = body.get("status")
    if not status:
        return _bad("status is required.")
    if status not in ("draft", "published", "archived"):
        return _bad("Invalid status.")
    service.status = status
    service.save(update_fields=["status"])
    _log_activity(
        actor=admin.name,
        action="updated",
        module="Service Management",
        target=id,
        description=f"Status → {status}.",
    )
    return _ok({"ok": True, "status": status})


@api_view(["POST"])
def service_featured(request, id: str):
    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    try:
        service = Service.objects.get(id=id)
    except Service.DoesNotExist:
        return _not_found("Service not found.")
    service.featured = not service.featured
    service.save(update_fields=["featured"])
    _log_activity(
        actor=admin.name,
        action="updated",
        module="Service Management",
        target=id,
        description=f"Featured toggled → {'on' if service.featured else 'off'}.",
    )
    return _ok({"ok": True, "featured": service.featured})


@api_view(["POST"])
def service_duplicate(request, id: str):
    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    try:
        existing = Service.objects.get(id=id)
    except Service.DoesNotExist:
        return _not_found("Service not found.")

    stamp = _to_base36(int(time.time() * 1000))
    new_slug = f"{existing.slug}-copy-{stamp}"
    new_name = f"{existing.name} (Copy)"

    copy = Service.objects.create(
        name=new_name,
        slug=new_slug,
        category_id=existing.category_id,
        subcategory_id=existing.subcategory_id,
        short_description=existing.short_description,
        full_description=existing.full_description,
        tags=list(existing.tags or []),
        industries=list(existing.industries or []),
        delivery_type=existing.delivery_type,
        timeline=existing.timeline,
        rating=0,
        reviews=0,
        popularity=0,
        featured=False,
        status="draft",
        accent=existing.accent,
        icon=existing.icon,
        problems_solved=list(existing.problems_solved or []),
        capabilities=list(existing.capabilities or []),
        deliverables=list(existing.deliverables or []),
        process=list(existing.process or []),
        technologies=list(existing.technologies or []),
        faqs=list(existing.faqs or []),
        meta_title=existing.meta_title,
        meta_description=existing.meta_description,
        created_by=admin.name,
    )
    _log_activity(
        actor=admin.name,
        action="duplicated",
        module="Service Management",
        target=copy.id,
        description=f'Duplicated service "{existing.name}" → "{new_name}".',
    )
    return _created({"ok": True, "service": {"id": copy.id, "slug": copy.slug}})


# ==========================================================================
# CATEGORIES
# ==========================================================================

@api_view(["GET", "POST"])
def categories_view(request):
    if request.method == "GET":
        qs = Category.objects.all().order_by("name")
        return _ok({"categories": [category_dto(c) for c in qs]})

    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    body = _body(request)
    if body is None:
        return _bad("Invalid JSON body.")
    name = str(body.get("name") or "").trim()
    if not name:
        return _bad("name is required.")
    slug_raw = str(body.get("slug") or "").trim()
    slug = slug_raw if slug_raw else slugify(name)
    if not slug:
        return _bad("Could not derive a slug from name.")
    if body.get("status") and body.get("status") not in ("active", "disabled"):
        return _bad("Invalid status.")
    try:
        category = Category.objects.create(
            name=name,
            slug=slug,
            icon=body.get("icon") or "",
            tagline=body.get("tagline") or "",
            description=body.get("description") or "",
            featured=bool(body.get("featured") or False),
            status=body.get("status") or "active",
        )
    except IntegrityError:
        return _bad("Slug already exists for a category.")
    _log_activity(
        actor=admin.name,
        action="created",
        module="Category Management",
        target=category.id,
        description=f'Created category "{name}" ({slug}).',
    )
    return _created({"ok": True, "category": {"id": category.id, "slug": category.slug}})


@api_view(["PATCH", "DELETE"])
def category_detail(request, id: str):
    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    try:
        category = Category.objects.get(id=id)
    except Category.DoesNotExist:
        return _not_found("Category not found.")

    if request.method == "PATCH":
        body = _body(request)
        if body is None:
            return _bad("Invalid JSON body.")
        if body.get("status") is not None and str(body.get("status")) not in ("active", "disabled"):
            return _bad("Invalid status.")
        allowed = {
            "name": "name",
            "slug": "slug",
            "icon": "icon",
            "tagline": "tagline",
            "description": "description",
            "featured": "featured",
            "status": "status",
        }
        update_fields = []
        for camel, snake in allowed.items():
            if camel in body and body.get(camel) is not None:
                val = body.get(camel)
                if snake == "featured":
                    val = bool(val)
                setattr(category, snake, val)
                update_fields.append(snake)
        try:
            if update_fields:
                category.save(update_fields=update_fields)
        except IntegrityError:
            return _bad("Update failed — slug may already be in use.")
        _log_activity(
            actor=admin.name,
            action="updated",
            module="Category Management",
            target=id,
            description=f'Updated category "{category.name}".',
        )
        return _ok({"ok": True})

    # DELETE — cascade subcategories first.
    name_snapshot = category.name
    Subcategory.objects.filter(category_id=id).delete()
    category.delete()
    _log_activity(
        actor=admin.name,
        action="deleted",
        module="Category Management",
        target=id,
        description=f'Deleted category "{name_snapshot}" and its subcategories.',
    )
    return _ok({"ok": True})


# ==========================================================================
# SUBCATEGORIES
# ==========================================================================

@api_view(["GET", "POST"])
def subcategories_view(request):
    if request.method == "GET":
        category_id = request.query_params.get("categoryId")
        qs = Subcategory.objects.all()
        if category_id:
            qs = qs.filter(category_id=category_id)
        qs = qs.order_by("name")
        return _ok({"subcategories": [subcategory_dto(s) for s in qs]})

    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    body = _body(request)
    if body is None:
        return _bad("Invalid JSON body.")
    name = str(body.get("name") or "").trim()
    slug = str(body.get("slug") or "").trim()
    category_id = str(body.get("categoryId") or "").trim()
    if not name:
        return _bad("name is required.")
    if not slug:
        return _bad("slug is required.")
    if not category_id:
        return _bad("categoryId is required.")
    category = Category.objects.filter(id=category_id).first()
    if not category:
        return _bad("Category does not exist.")
    if body.get("status") and body.get("status") not in ("active", "disabled"):
        return _bad("Invalid status.")
    try:
        sub = Subcategory.objects.create(
            name=name,
            slug=slug,
            category_id=category_id,
            description=body.get("description") or "",
            status=body.get("status") or "active",
        )
    except IntegrityError:
        return _bad("Subcategory with this slug already exists for the category.")
    _log_activity(
        actor=admin.name,
        action="created",
        module="Category Management",
        target=sub.id,
        description=f'Created subcategory "{name}" under "{category.name}".',
    )
    return _created({"ok": True, "subcategory": {"id": sub.id, "slug": sub.slug}})


@api_view(["PATCH", "DELETE"])
def subcategory_detail(request, id: str):
    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    try:
        sub = Subcategory.objects.get(id=id)
    except Subcategory.DoesNotExist:
        return _not_found("Subcategory not found.")

    if request.method == "PATCH":
        body = _body(request)
        if body is None:
            return _bad("Invalid JSON body.")
        if body.get("categoryId") is not None and str(body.get("categoryId")) != sub.category_id:
            if not Category.objects.filter(id=str(body.get("categoryId"))).exists():
                return _bad("Category does not exist.")
        if body.get("status") is not None and str(body.get("status")) not in ("active", "disabled"):
            return _bad("Invalid status.")
        allowed = {
            "name": "name",
            "slug": "slug",
            "categoryId": "category_id",
            "description": "description",
            "status": "status",
        }
        update_fields = []
        for camel, snake in allowed.items():
            if camel in body and body.get(camel) is not None:
                setattr(sub, snake, body.get(camel))
                update_fields.append(snake)
        try:
            if update_fields:
                sub.save(update_fields=update_fields)
        except IntegrityError:
            return _bad("Update failed — slug may already exist for the category.")
        _log_activity(
            actor=admin.name,
            action="updated",
            module="Category Management",
            target=id,
            description=f'Updated subcategory "{sub.name}".',
        )
        return _ok({"ok": True})

    # DELETE
    name_snapshot = sub.name
    sub.delete()
    _log_activity(
        actor=admin.name,
        action="deleted",
        module="Category Management",
        target=id,
        description=f'Deleted subcategory "{name_snapshot}".',
    )
    return _ok({"ok": True})


# ==========================================================================
# USERS (buyers)
# ==========================================================================

@api_view(["GET", "POST"])
def users_view(request):
    if request.method == "GET":
        admin = get_current_admin(request)
        if not admin:
            return _unauth("Admin sign in required.")
        qs = User.objects.all().order_by("-created_at")
        return _ok({"users": [user_dto(u) for u in qs]})

    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    body = _body(request)
    if body is None:
        return _bad("Invalid JSON body.")
    name = str(body.get("name") or "").trim()
    email = str(body.get("email") or "").strip().lower()
    if not name:
        return _bad("name is required.")
    if not email:
        return _bad("email is required.")
    if body.get("role") and body.get("role") not in ("buyer", "member"):
        return _bad("Invalid role.")
    if body.get("status") and body.get("status") not in ("active", "inactive", "suspended"):
        return _bad("Invalid status.")

    raw_pw = body.get("password")
    password = make_password(raw_pw if isinstance(raw_pw, str) and raw_pw else "demo1234")

    try:
        user = User.objects.create(
            name=name,
            email=email,
            password=password,
            company=body.get("company") or "",
            phone=body.get("phone") or "",
            country=body.get("country") or "",
            role=body.get("role") or "buyer",
            status=body.get("status") or "active",
            phone_country=body.get("phoneCountry") or None,
            registration_type=body.get("registrationType") or None,
            account_type=body.get("accountType") or None,
            profession=body.get("profession") or None,
            company_size=body.get("companySize") or None,
            intent=body.get("intent") or None,
            intent_timeline=body.get("intentTimeline") or None,
            registration_source=body.get("registrationSource") or None,
        )
    except IntegrityError:
        return _bad("An account with this email already exists.")

    _log_activity(
        actor=admin.name,
        action="created",
        module="User Management",
        target=user.id,
        description=f"Created buyer account for {name} ({email}).",
    )
    return _created({"ok": True, "user": {"id": user.id}})


@api_view(["PATCH", "DELETE"])
def user_detail(request, id: str):
    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return _not_found("User not found.")

    if request.method == "PATCH":
        body = _body(request)
        if body is None:
            return _bad("Invalid JSON body.")
        if body.get("role") is not None and str(body.get("role")) not in ("buyer", "member"):
            return _bad("Invalid role.")
        if body.get("status") is not None and str(body.get("status")) not in ("active", "inactive", "suspended"):
            return _bad("Invalid status.")
        allowed = {
            "name": "name",
            "email": "email",
            "company": "company",
            "phone": "phone",
            "country": "country",
            "role": "role",
            "status": "status",
            "phoneCountry": "phone_country",
            "registrationType": "registration_type",
            "accountType": "account_type",
            "profession": "profession",
            "companySize": "company_size",
            "intent": "intent",
            "intentTimeline": "intent_timeline",
            "registrationSource": "registration_source",
        }
        update_fields = []
        for camel, snake in allowed.items():
            if camel in body and body.get(camel) is not None:
                setattr(user, snake, body.get(camel))
                update_fields.append(snake)
        pw = body.get("password")
        if isinstance(pw, str) and pw:
            user.password = make_password(pw)
            update_fields.append("password")
        try:
            if update_fields:
                user.save(update_fields=update_fields)
        except IntegrityError:
            return _bad("Update failed — email may already be in use.")
        _log_activity(
            actor=admin.name,
            action="updated",
            module="User Management",
            target=id,
            description=f'Updated buyer "{user.name}".',
        )
        return _ok({"ok": True})

    # DELETE
    name_snapshot = user.name
    user.delete()
    _log_activity(
        actor=admin.name,
        action="deleted",
        module="User Management",
        target=id,
        description=f'Deleted buyer "{name_snapshot}".',
    )
    return _ok({"ok": True})


# ==========================================================================
# ADMINS
# ==========================================================================

@api_view(["GET", "POST"])
def admins_view(request):
    if request.method == "GET":
        admin = get_current_admin(request)
        if not admin:
            return _unauth("Admin sign in required.")
        qs = AdminUser.objects.all().order_by("-created_at")
        return _ok({"admins": [admin_dto(a) for a in qs]})

    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    body = _body(request)
    if body is None:
        return _bad("Invalid JSON body.")
    name = str(body.get("name") or "").trim()
    email = str(body.get("email") or "").strip().lower()
    if not name:
        return _bad("name is required.")
    if not email:
        return _bad("email is required.")
    if body.get("status") and body.get("status") not in ("active", "inactive", "suspended"):
        return _bad("Invalid status.")
    if body.get("roleId"):
        if not Role.objects.filter(id=body.get("roleId")).exists():
            return _bad("Role does not exist.")

    raw_pw = body.get("password")
    password = make_password(raw_pw if isinstance(raw_pw, str) and raw_pw else "demo1234")
    initials = _avatar_initials(name)

    try:
        admin_user = AdminUser.objects.create(
            name=name,
            email=email,
            password=password,
            phone=body.get("phone") or "",
            role_id=body.get("roleId") or "role-super-admin",
            title=body.get("title") or "",
            status=body.get("status") or "active",
            avatar_initials=initials,
        )
    except IntegrityError:
        return _bad("An admin account with this email already exists.")

    _notify(
        "admin_created",
        "Admin account created",
        f"{admin.name} created an admin account for {name}.",
    )
    _log_activity(
        actor=admin.name,
        action="created",
        module="Admin Management",
        target=admin_user.id,
        description=f"Created admin account for {name} ({email}).",
    )
    return _created({"ok": True, "admin": {"id": admin_user.id}})


@api_view(["PATCH", "DELETE"])
def admin_detail(request, id: str):
    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    try:
        admin_user = AdminUser.objects.get(id=id)
    except AdminUser.DoesNotExist:
        return _not_found("Admin not found.")

    if request.method == "PATCH":
        body = _body(request)
        if body is None:
            return _bad("Invalid JSON body.")
        if body.get("status") is not None and str(body.get("status")) not in ("active", "inactive", "suspended"):
            return _bad("Invalid status.")
        if body.get("roleId") is not None and str(body.get("roleId")) != admin_user.role_id:
            if not Role.objects.filter(id=str(body.get("roleId"))).exists():
                return _bad("Role does not exist.")
        allowed = {
            "name": "name",
            "email": "email",
            "phone": "phone",
            "roleId": "role_id",
            "title": "title",
            "status": "status",
        }
        update_fields = []
        for camel, snake in allowed.items():
            if camel in body and body.get(camel) is not None:
                setattr(admin_user, snake, body.get(camel))
                update_fields.append(snake)
        if isinstance(body.get("name"), str):
            admin_user.avatar_initials = _avatar_initials(body.get("name"))
            update_fields.append("avatar_initials")
        pw = body.get("password")
        if isinstance(pw, str) and pw:
            admin_user.password = make_password(pw)
            update_fields.append("password")
        try:
            if update_fields:
                admin_user.save(update_fields=update_fields)
        except IntegrityError:
            return _bad("Update failed — email may already be in use.")
        _log_activity(
            actor=admin.name,
            action="updated",
            module="Admin Management",
            target=id,
            description=f'Updated admin "{admin_user.name}".',
        )
        return _ok({"ok": True})

    # DELETE
    name_snapshot = admin_user.name
    admin_user.delete()
    _log_activity(
        actor=admin.name,
        action="deleted",
        module="Admin Management",
        target=id,
        description=f'Deleted admin "{name_snapshot}".',
    )
    return _ok({"ok": True})


# ==========================================================================
# ROLES
# ==========================================================================

@api_view(["GET", "POST"])
def roles_view(request):
    if request.method == "GET":
        admin = get_current_admin(request)
        if not admin:
            return _unauth("Admin sign in required.")
        qs = Role.objects.all().order_by("name")
        return _ok({"roles": [role_dto(r) for r in qs]})

    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    body = _body(request)
    if body is None:
        return _bad("Invalid JSON body.")
    name = str(body.get("name") or "").trim()
    if not name:
        return _bad("name is required.")
    slug_raw = str(body.get("slug") or "").trim()
    slug = slug_raw if slug_raw else slugify(name)
    if not slug:
        return _bad("Could not derive a slug from name.")
    try:
        role = Role.objects.create(
            name=name,
            slug=slug,
            description=body.get("description") or "",
            permissions=body.get("permissions") or {},
            is_system=bool(body.get("isSystem") or False),
        )
    except IntegrityError:
        return _bad("Slug already exists for a role.")
    _log_activity(
        actor=admin.name,
        action="created",
        module="Roles & Permissions",
        target=role.id,
        description=f'Created role "{name}" ({slug}).',
    )
    return _created({"ok": True, "role": {"id": role.id, "slug": role.slug}})


@api_view(["PATCH", "DELETE"])
def role_detail(request, id: str):
    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    try:
        role = Role.objects.get(id=id)
    except Role.DoesNotExist:
        return _not_found("Role not found.")

    if request.method == "PATCH":
        body = _body(request)
        if body is None:
            return _bad("Invalid JSON body.")
        allowed = {
            "name": "name",
            "slug": "slug",
            "description": "description",
            "permissions": "permissions",
            "isSystem": "is_system",
        }
        update_fields = []
        for camel, snake in allowed.items():
            if camel in body and body.get(camel) is not None:
                val = body.get(camel)
                if snake == "is_system":
                    val = bool(val)
                setattr(role, snake, val)
                update_fields.append(snake)
        try:
            if update_fields:
                role.save(update_fields=update_fields)
        except IntegrityError:
            return _bad("Update failed — slug may already be in use.")
        _log_activity(
            actor=admin.name,
            action="updated",
            module="Roles & Permissions",
            target=id,
            description=f'Updated role "{role.name}".',
        )
        return _ok({"ok": True})

    # DELETE
    if role.is_system:
        return _bad("System roles cannot be deleted.")
    admins_on_role = AdminUser.objects.filter(role_id=id).count()
    if admins_on_role > 0:
        return _bad("Cannot delete a role that is still assigned to admin accounts.")
    name_snapshot = role.name
    role.delete()
    _log_activity(
        actor=admin.name,
        action="deleted",
        module="Roles & Permissions",
        target=id,
        description=f'Deleted role "{name_snapshot}".',
    )
    return _ok({"ok": True})


# ==========================================================================
# NOTIFICATIONS
# ==========================================================================

@api_view(["GET"])
def notifications_view(request):
    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    qs = Notification.objects.all().order_by("-created_at")
    return _ok({"notifications": [notification_dto(n) for n in qs]})


@api_view(["PATCH", "DELETE"])
def notification_detail(request, id: str):
    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    try:
        notif = Notification.objects.get(id=id)
    except Notification.DoesNotExist:
        return _not_found("Notification not found.")

    if request.method == "PATCH":
        body = _body(request)
        if body is None:
            return _bad("Invalid JSON body.")
        if not isinstance(body.get("read"), bool):
            return _bad("read (boolean) is required.")
        notif.read = body.get("read")
        notif.save(update_fields=["read"])
        return _ok({"ok": True, "read": body.get("read")})

    notif.delete()
    return _ok({"ok": True})


@api_view(["POST"])
def notifications_read_all(request):
    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    Notification.objects.filter(read=False).update(read=True)
    return _ok({"ok": True})


# ==========================================================================
# ACTIVITY
# ==========================================================================

@api_view(["GET"])
def activity_view(request):
    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    raw = request.query_params.get("limit")
    limit = 300
    if raw is not None:
        try:
            n = int(raw)
            if n > 0:
                limit = min(n, 500)
        except (TypeError, ValueError):
            pass
    qs = ActivityLog.objects.all().order_by("-created_at")[:limit]
    return _ok({"activity": [activity_dto(a) for a in qs]})


# ==========================================================================
# SETTINGS
# ==========================================================================

def _get_setting(key: str):
    try:
        s = Setting.objects.get(id=key)
        return s.value
    except Setting.DoesNotExist:
        return None


@api_view(["GET", "PATCH"])
def settings_view(request):
    if request.method == "GET":
        return _ok({
            "brand": _get_setting("brand"),
            "marketplace": _get_setting("marketplace"),
            "homepage": _get_setting("homepage"),
            "security": _get_setting("security"),
        })

    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")
    body = _body(request)
    if body is None:
        return _bad("Invalid JSON body.")
    keys = [k for k in ("brand", "marketplace", "homepage", "security") if k in body and body.get(k) is not None]
    if not keys:
        return _bad("No settings provided.")
    for key in keys:
        Setting.objects.update_or_create(id=key, defaults={"value": body.get(key)})
    _log_activity(
        actor=admin.name,
        action="updated",
        module="Settings",
        target="settings",
        description=f"Updated settings: {', '.join(keys)}.",
    )
    return _ok({"ok": True})


# ==========================================================================
# BOOTSTRAP (admin overview)
# ==========================================================================

_WEEKS = 12
_WEEK_MS = 7 * 24 * 60 * 60 * 1000


def _bucket_by_week(items) -> list[int]:
    """Bucket items with a ``created_at`` datetime into the last ``_WEEKS`` weeks.

    Index 0 = oldest (WEEKS-1 weeks ago), index WEEKS-1 = current week.
    """
    buckets = [0] * _WEEKS
    now_ms = int(time.time() * 1000)
    for item in items:
        created = getattr(item, "created_at", None)
        if created is None:
            continue
        if created.tzinfo is None:
            created = created.replace(tzinfo=dt_timezone.utc)
        created_ms = int(created.timestamp() * 1000)
        weeks_ago = (now_ms - created_ms) // _WEEK_MS
        if weeks_ago < 0 or weeks_ago >= _WEEKS:
            continue
        buckets[_WEEKS - 1 - weeks_ago] += 1
    return buckets


@api_view(["GET"])
def bootstrap_view(request):
    admin = get_current_admin(request)
    if not admin:
        return _unauth("Admin sign in required.")

    overview = {
        "totalServices": Service.objects.count(),
        "publishedServices": Service.objects.filter(status="published").count(),
        "draftServices": Service.objects.filter(status="draft").count(),
        "serviceRequests": MarketRequest.objects.count(),
        "admins": AdminUser.objects.count(),
        "users": User.objects.count(),
        "newInquiries": Inquiry.objects.filter(status="new").count(),
        "pendingInquiries": Inquiry.objects.filter(status="in_progress").count(),
    }

    all_inquiries = list(Inquiry.objects.all().order_by("-created_at"))
    recent_inquiries = all_inquiries[:5]
    recent_services = list(Service.objects.all().order_by("-created_at")[:5])
    all_requests = list(MarketRequest.objects.all())
    categories = list(Category.objects.all())
    recent_activity = list(ActivityLog.objects.all().order_by("-created_at")[:6])

    inquiry_buckets = _bucket_by_week(all_inquiries)
    request_buckets = _bucket_by_week(all_requests)
    chart_data = [
        {"week": f"W{i + 1}", "inquiries": inquiry_buckets[i], "requests": request_buckets[i]}
        for i in range(_WEEKS)
    ]

    category_name_by_id = {c.id: c.name for c in categories}
    all_services = list(Service.objects.all())
    counts: dict[str, int] = {}
    for s in all_services:
        counts[s.category_id] = counts.get(s.category_id, 0) + 1
    category_distribution = [
        {"name": category_name_by_id.get(cid, cid), "count": count}
        for cid, count in counts.items()
    ]

    return _ok({
        "overview": overview,
        "recentInquiries": [inquiry_dto(i) for i in recent_inquiries],
        "recentServices": [service_dto(s) for s in recent_services],
        "recentActivity": [activity_dto(a) for a in recent_activity],
        "chartData": chart_data,
        "categoryDistribution": category_distribution,
    })


# ==========================================================================
# PROFILE (buyer self-update)
# ==========================================================================

@api_view(["GET", "PATCH"])
def profile_view(request):
    buyer = get_current_buyer(request)
    if not buyer:
        return _unauth("Sign in required.")
    if request.method == "GET":
        return _ok({"user": user_dto(buyer)})
    body = _body(request)
    if body is None:
        return _bad("Invalid JSON body.")

    update_fields = []
    if isinstance(body.get("name"), str):
        name = body.get("name").strip()
        if not name:
            return _bad("Your name cannot be empty.")
        buyer.name = name
        update_fields.append("name")
    if isinstance(body.get("company"), str):
        buyer.company = body.get("company").strip()
        update_fields.append("company")
    if isinstance(body.get("phone"), str):
        buyer.phone = body.get("phone").strip()
        update_fields.append("phone")
    if isinstance(body.get("country"), str):
        buyer.country = body.get("country").strip()
        update_fields.append("country")

    if not update_fields:
        return _bad("Nothing to update.")

    buyer.save(update_fields=update_fields)
    _log_activity(
        actor=buyer.name,
        action="updated",
        module="Profile",
        target=buyer.id,
        description="Updated profile details.",
    )
    return _ok({"ok": True, "user": user_dto(buyer)})
