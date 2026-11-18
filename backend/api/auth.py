"""
Auth helpers — session creation/lookup via the Session table + an
HTTP-only `stioos-session` cookie. Passwords are hashed with Django's
auth hashers (make_password / check_password), seeded with bcrypt.
"""
from __future__ import annotations

import secrets
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
from django.http import JsonResponse
from django.utils import timezone

from api.models import Session, User, AdminUser
from api.dto import user_dto, admin_dto

SESSION_COOKIE = settings.SESSION_COOKIE_NAME
SESSION_TTL = timedelta(days=14)


def _gen_token() -> str:
    return secrets.token_hex(32)


def create_session(response: JsonResponse, kind: str, user_id: str, user_agent: str = "") -> str:
    token = _gen_token()
    expires_at = timezone.now() + SESSION_TTL
    Session.objects.create(
        token=token,
        kind=kind,
        user_id=user_id,
        expires_at=expires_at,
        user_agent=user_agent[:500],
    )
    response.set_cookie(
        SESSION_COOKIE,
        token,
        max_age=int(SESSION_TTL.total_seconds()),
        httponly=True,
        samesite="Lax",
        secure=False,
        path="/",
    )
    return token


def clear_session(response: JsonResponse, token: str | None) -> None:
    if token:
        Session.objects.filter(token=token).delete()
    response.delete_cookie(SESSION_COOKIE, path="/")


def get_session(request):
    """Return (kind, principal) for the request's session cookie, or (None, None)."""
    token = request.COOKIES.get(SESSION_COOKIE)
    if not token:
        return None, None
    try:
        sess = Session.objects.get(token=token)
    except Session.DoesNotExist:
        return None, None
    if sess.expires_at < timezone.now():
        sess.delete()
        return None, None
    if sess.kind == "admin":
        try:
            admin = AdminUser.objects.get(id=sess.user_id)
        except AdminUser.DoesNotExist:
            return None, None
        return "admin", admin
    try:
        user = User.objects.get(id=sess.user_id)
    except User.DoesNotExist:
        return None, None
    return "buyer", user


def get_current_admin(request):
    kind, principal = get_session(request)
    return principal if kind == "admin" else None


def get_current_buyer(request):
    kind, principal = get_session(request)
    return principal if kind == "buyer" else None


def json_error(message: str, status: int = 400):
    return JsonResponse({"error": message}, status=status)


# ---------- sign in / sign up ----------

def sign_in_buyer(email: str, password: str, response: JsonResponse, user_agent: str = ""):
    try:
        user = User.objects.get(email=email.strip().lower())
    except User.DoesNotExist:
        return None, "No account found with this email."
    if not check_password(password, user.password):
        return None, "Incorrect password."
    if user.status != "active":
        return None, "This account is inactive."
    create_session(response, "buyer", user.id, user_agent)
    user.last_active = timezone.now()
    user.save(update_fields=["last_active"])
    return user, None


def sign_in_admin(email: str, password: str, response: JsonResponse, user_agent: str = ""):
    try:
        admin = AdminUser.objects.get(email=email.strip().lower())
    except AdminUser.DoesNotExist:
        return None, "No admin account found with this email."
    if not check_password(password, admin.password):
        return None, "Incorrect password."
    if admin.status != "active":
        return None, "This account is inactive."
    create_session(response, "admin", admin.id, user_agent)
    admin.last_active = timezone.now()
    admin.save(update_fields=["last_active"])
    return admin, None


def sign_up_buyer(payload: dict, response: JsonResponse, user_agent: str = ""):
    email = (payload.get("email") or "").strip().lower()
    name = (payload.get("name") or "").strip()
    password = payload.get("password") or ""
    if not email or not name or not password:
        return None, "Name, email and password are required."
    if len(password) < 8:
        return None, "Password must be at least 8 characters."
    if User.objects.filter(email=email).exists():
        return None, "An account with this email already exists."
    user = User.objects.create(
        name=name,
        email=email,
        password=make_password(password),
        company=payload.get("company") or "",
        country=payload.get("country") or "",
        phone=payload.get("phone") or "",
        phone_country=payload.get("phoneCountry"),
        registration_type=payload.get("registrationType"),
        account_type=payload.get("accountType"),
        profession=payload.get("profession"),
        company_size=payload.get("companySize"),
        intent=payload.get("intent"),
        intent_timeline=payload.get("intentTimeline"),
        registration_source=payload.get("registrationSource"),
        role="buyer",
        status="active",
    )
    create_session(response, "buyer", user.id, user_agent)
    return user, None
