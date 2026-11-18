"""
DTO mappers — convert Django model instances to the camelCase shapes the
Next.js frontend expects (matching src/types/index.ts). Dates become ISO
strings; JSON fields pass through as-is.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone


def _iso(dt) -> str | None:
    if dt is None:
        return None
    if isinstance(dt, str):
        return dt
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()


def user_dto(u) -> dict:
    return {
        "id": u.id,
        "name": u.name,
        "email": u.email,
        "company": u.company,
        "phone": u.phone,
        "country": u.country,
        "status": u.status,
        "role": u.role if u.role in ("buyer", "member") else "buyer",
        "inquiriesCount": u.inquiries_count,
        "createdAt": _iso(u.created_at),
        "lastActive": _iso(u.last_active) if u.last_active else None,
        "registrationType": u.registration_type,
        "accountType": u.account_type,
        "profession": u.profession,
        "companySize": u.company_size,
        "phoneCountry": u.phone_country,
        "intent": u.intent,
        "intentTimeline": u.intent_timeline,
        "registrationSource": u.registration_source,
    }


def admin_dto(a) -> dict:
    return {
        "id": a.id,
        "name": a.name,
        "email": a.email,
        "phone": a.phone,
        "roleId": a.role_id,
        "status": a.status,
        "title": a.title,
        "lastActive": _iso(a.last_active) if a.last_active else None,
        "createdAt": _iso(a.created_at),
        "avatarInitials": a.avatar_initials,
    }


def role_dto(r) -> dict:
    return {
        "id": r.id,
        "name": r.name,
        "slug": r.slug,
        "description": r.description,
        "permissions": r.permissions or {},
        "isSystem": r.is_system,
        "createdAt": _iso(r.created_at),
    }


def category_dto(c) -> dict:
    return {
        "id": c.id,
        "name": c.name,
        "slug": c.slug,
        "icon": c.icon,
        "tagline": c.tagline,
        "description": c.description,
        "status": c.status,
        "featured": c.featured,
        "createdAt": _iso(c.created_at),
    }


def subcategory_dto(s) -> dict:
    return {
        "id": s.id,
        "name": s.name,
        "slug": s.slug,
        "categoryId": s.category_id,
        "description": s.description,
        "status": s.status,
        "createdAt": _iso(s.created_at),
    }


def service_dto(s) -> dict:
    return {
        "id": s.id,
        "name": s.name,
        "slug": s.slug,
        "categoryId": s.category_id,
        "subcategoryId": s.subcategory_id,
        "shortDescription": s.short_description,
        "fullDescription": s.full_description,
        "tags": s.tags or [],
        "industries": s.industries or [],
        "deliveryType": s.delivery_type,
        "timeline": s.timeline,
        "rating": s.rating,
        "reviews": s.reviews,
        "popularity": s.popularity,
        "featured": s.featured,
        "status": s.status,
        "accent": s.accent,
        "icon": s.icon,
        "problemsSolved": s.problems_solved or [],
        "capabilities": s.capabilities or [],
        "deliverables": s.deliverables or [],
        "process": s.process or [],
        "technologies": s.technologies or [],
        "faqs": s.faqs or [],
        "metaTitle": s.meta_title if s.meta_title else None,
        "metaDescription": s.meta_description if s.meta_description else None,
        "createdAt": _iso(s.created_at),
        "updatedAt": _iso(s.updated_at),
        "createdBy": s.created_by,
    }


def inquiry_dto(i) -> dict:
    return {
        "id": i.id,
        "name": i.name,
        "email": i.email,
        "company": i.company,
        "phone": i.phone,
        "type": i.type,
        "serviceId": i.service_id if i.service_id else None,
        "serviceName": i.service_name if i.service_name else None,
        "requirements": i.requirements,
        "budgetRange": i.budget_range,
        "timeline": i.timeline,
        "status": i.status,
        "createdAt": _iso(i.created_at),
    }


def request_dto(r) -> dict:
    return {
        "id": r.id,
        "buyerId": r.buyer_id,
        "buyerName": r.buyer_name,
        "buyerCompany": r.buyer_company,
        "categoryId": r.category_id,
        "categoryName": r.category_name,
        "title": r.title,
        "details": r.details,
        "budgetRange": r.budget_range,
        "timeline": r.timeline,
        "status": r.status,
        "createdAt": _iso(r.created_at),
        "kind": r.kind,
        "reference": r.reference,
        "meta": r.meta or {},
        "statusHistory": r.status_history or [],
        "quotedAmount": r.quoted_amount if r.quoted_amount is not None else None,
        "orderId": r.order_id,
    }


def order_dto(o) -> dict:
    return {
        "id": o.id,
        "serviceId": o.service_id,
        "serviceSlug": o.service_slug,
        "serviceName": o.service_name,
        "serviceIcon": o.service_icon,
        "buyerId": o.buyer_id,
        "buyerName": o.buyer_name,
        "buyerCompany": o.buyer_company,
        "amount": o.amount,
        "status": o.status,
        "deliveryType": o.delivery_type,
        "placedAt": _iso(o.placed_at),
        "updatedAt": _iso(o.updated_at),
        "requirements": o.requirements if o.requirements else None,
    }


def message_dto(m) -> dict:
    return {
        "id": m.id,
        "threadId": m.thread_id,
        "senderId": m.sender_id,
        "senderName": m.sender_name,
        "senderRole": m.sender_role,
        "body": m.body,
        "sentAt": _iso(m.sent_at),
    }


def thread_dto(t, messages=None) -> dict:
    return {
        "id": t.id,
        "serviceId": t.service_id,
        "serviceSlug": t.service_slug,
        "serviceName": t.service_name,
        "serviceIcon": t.service_icon,
        "buyerId": t.buyer_id,
        "buyerName": t.buyer_name,
        "teamId": t.team_id,
        "teamName": t.team_name,
        "createdAt": _iso(t.created_at),
        "lastMessageAt": _iso(t.last_message_at),
        "messages": [message_dto(m) for m in (messages or [])],
    }


def notification_dto(n) -> dict:
    return {
        "id": n.id,
        "type": n.type,
        "title": n.title,
        "message": n.message,
        "read": n.read,
        "createdAt": _iso(n.created_at),
    }


def activity_dto(a) -> dict:
    return {
        "id": a.id,
        "actor": a.actor,
        "action": a.action,
        "module": a.module,
        "target": a.target,
        "description": a.description,
        "createdAt": _iso(a.created_at),
    }


def industry_dto(i) -> dict:
    return {
        "id": i.id,
        "name": i.name,
        "slug": i.slug,
        "icon": i.icon,
        "description": i.description,
        "servicesCount": i.services_count,
        "status": i.status,
    }


def insight_dto(i) -> dict:
    return {
        "id": i.id,
        "title": i.title,
        "slug": i.slug,
        "category": i.category,
        "excerpt": i.excerpt,
        "content": i.content,
        "author": i.author,
        "readTime": i.read_time,
        "publishedAt": _iso(i.published_at),
        "status": i.status,
        "accent": i.accent,
    }


def resource_dto(r) -> dict:
    return {
        "id": r.id,
        "title": r.title,
        "slug": r.slug,
        "type": r.type,
        "description": r.description,
        "fileFormat": r.file_format,
        "size": r.size,
        "downloads": r.downloads,
        "publishedAt": _iso(r.published_at),
        "status": r.status,
        "accent": r.accent,
    }


def faq_dto(f) -> dict:
    return {
        "id": f.id,
        "question": f.question,
        "answer": f.answer,
        "category": f.category,
        "status": f.status,
        "order": f.order,
    }
