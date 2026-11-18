"""
STIOOS GLOBAL — Django models.
Mirrors the data layer used by the marketplace + admin/buyer dashboards.
All primary keys are stable string IDs (cuids) so seed relationships and
deep-links stay intact. JSON fields use Django's JSONField (TEXT on SQLite).
"""
from __future__ import annotations

import hashlib
import secrets
from datetime import timedelta

from django.db import models
from django.utils import timezone


def _gen_id(prefix: str = "") -> str:
    """Generate a unique-ish string id (cuid-like)."""
    raw = secrets.token_hex(12)
    return f"{prefix}{raw}" if prefix else raw


def _default_permissions() -> dict:
    return {}


# ---------- Sessions (cookie auth) ----------

class Session(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    token = models.CharField(max_length=128, unique=True, db_index=True)
    kind = models.CharField(max_length=16)  # buyer | admin
    user_id = models.CharField(max_length=64, db_index=True)
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()
    user_agent = models.TextField(blank=True, default="")

    class Meta:
        db_table = "api_session"


# ---------- People: buyers ----------

class User(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    name = models.CharField(max_length=200)
    email = models.CharField(max_length=254, unique=True)
    password = models.TextField()  # bcrypt hash
    company = models.CharField(max_length=200, blank=True, default="")
    phone = models.CharField(max_length=60, blank=True, default="")
    country = models.CharField(max_length=120, blank=True, default="")
    status = models.CharField(max_length=24, default="active")
    role = models.CharField(max_length=16, default="buyer")
    inquiries_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    last_active = models.DateTimeField(null=True, blank=True)

    # buyer registration capture
    registration_type = models.CharField(max_length=24, null=True, blank=True)
    account_type = models.CharField(max_length=80, null=True, blank=True)
    profession = models.CharField(max_length=120, null=True, blank=True)
    company_size = models.CharField(max_length=60, null=True, blank=True)
    phone_country = models.CharField(max_length=16, null=True, blank=True)
    intent = models.CharField(max_length=120, null=True, blank=True)
    intent_timeline = models.CharField(max_length=120, null=True, blank=True)
    registration_source = models.CharField(max_length=80, null=True, blank=True)

    class Meta:
        db_table = "api_user"


# ---------- People: admins ----------

class AdminUser(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    name = models.CharField(max_length=200)
    email = models.CharField(max_length=254, unique=True)
    password = models.TextField()  # bcrypt hash
    phone = models.CharField(max_length=60, blank=True, default="")
    role_id = models.CharField(max_length=64, default="role-super-admin")
    status = models.CharField(max_length=24, default="active")
    title = models.CharField(max_length=200, blank=True, default="")
    last_active = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    avatar_initials = models.CharField(max_length=8, null=True, blank=True)

    class Meta:
        db_table = "api_adminuser"


class Role(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    name = models.CharField(max_length=120)
    slug = models.CharField(max_length=120, unique=True)
    description = models.TextField(blank=True, default="")
    permissions = models.JSONField(default=_default_permissions)
    is_system = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "api_role"


# ---------- Catalog ----------

class Category(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    name = models.CharField(max_length=200)
    slug = models.CharField(max_length=200, unique=True)
    icon = models.CharField(max_length=60, blank=True, default="")
    tagline = models.CharField(max_length=300, blank=True, default="")
    description = models.TextField(blank=True, default="")
    status = models.CharField(max_length=16, default="active")
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "api_category"


class Subcategory(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    name = models.CharField(max_length=200)
    slug = models.CharField(max_length=200)
    category_id = models.CharField(max_length=64, db_index=True)
    description = models.TextField(blank=True, default="")
    status = models.CharField(max_length=16, default="active")
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "api_subcategory"
        unique_together = (("slug", "category_id"),)


class Service(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    name = models.CharField(max_length=300)
    slug = models.CharField(max_length=300, unique=True)
    category_id = models.CharField(max_length=64, db_index=True)
    subcategory_id = models.CharField(max_length=64, db_index=True)
    short_description = models.TextField(blank=True, default="")
    full_description = models.TextField(blank=True, default="")
    tags = models.JSONField(default=list)
    industries = models.JSONField(default=list)
    delivery_type = models.CharField(max_length=32, default="project")
    timeline = models.CharField(max_length=120, blank=True, default="")
    rating = models.FloatField(default=0)
    reviews = models.IntegerField(default=0)
    popularity = models.IntegerField(default=0)
    featured = models.BooleanField(default=False)
    status = models.CharField(max_length=16, default="published", db_index=True)
    accent = models.CharField(max_length=120, blank=True, default="")
    icon = models.CharField(max_length=60, blank=True, default="")
    problems_solved = models.JSONField(default=list)
    capabilities = models.JSONField(default=list)
    deliverables = models.JSONField(default=list)
    process = models.JSONField(default=list)
    technologies = models.JSONField(default=list)
    faqs = models.JSONField(default=list)
    meta_title = models.CharField(max_length=300, null=True, blank=True)
    meta_description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.CharField(max_length=120, default="system")

    class Meta:
        db_table = "api_service"


class Industry(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    name = models.CharField(max_length=200)
    slug = models.CharField(max_length=200, unique=True)
    icon = models.CharField(max_length=60, blank=True, default="")
    description = models.TextField(blank=True, default="")
    services_count = models.IntegerField(default=0)
    status = models.CharField(max_length=16, default="active")

    class Meta:
        db_table = "api_industry"


class Insight(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    title = models.CharField(max_length=300)
    slug = models.CharField(max_length=300, unique=True)
    category = models.CharField(max_length=120, blank=True, default="")
    excerpt = models.TextField(blank=True, default="")
    content = models.TextField(blank=True, default="")
    author = models.CharField(max_length=120, blank=True, default="")
    read_time = models.CharField(max_length=32, blank=True, default="")
    published_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=16, default="published")
    accent = models.CharField(max_length=120, blank=True, default="")

    class Meta:
        db_table = "api_insight"


class Resource(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    title = models.CharField(max_length=300)
    slug = models.CharField(max_length=300, unique=True)
    type = models.CharField(max_length=32, default="guide")
    description = models.TextField(blank=True, default="")
    file_format = models.CharField(max_length=16, blank=True, default="")
    size = models.CharField(max_length=32, blank=True, default="")
    downloads = models.IntegerField(default=0)
    published_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=16, default="published")
    accent = models.CharField(max_length=120, blank=True, default="")

    class Meta:
        db_table = "api_resource"


class FaqItem(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    question = models.CharField(max_length=400)
    answer = models.TextField(blank=True, default="")
    category = models.CharField(max_length=120, blank=True, default="")
    status = models.CharField(max_length=16, default="published")
    order = models.IntegerField(default=0)

    class Meta:
        db_table = "api_faqitem"


# ---------- Engagement / lead capture ----------

class Inquiry(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    name = models.CharField(max_length=200)
    email = models.CharField(max_length=254)
    company = models.CharField(max_length=200, blank=True, default="")
    phone = models.CharField(max_length=60, blank=True, default="")
    type = models.CharField(max_length=24)  # quote|service_request|contact|consultation
    service_id = models.CharField(max_length=64, null=True, blank=True)
    service_name = models.CharField(max_length=300, null=True, blank=True)
    requirements = models.TextField(blank=True, default="")
    budget_range = models.CharField(max_length=80, blank=True, default="")
    timeline = models.CharField(max_length=80, blank=True, default="")
    status = models.CharField(max_length=24, default="new", db_index=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    buyer_id = models.CharField(max_length=64, null=True, blank=True, db_index=True)

    class Meta:
        db_table = "api_inquiry"


# ---------- Marketplace transactions ----------

class MarketRequest(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    buyer_id = models.CharField(max_length=64, db_index=True)
    buyer_name = models.CharField(max_length=200)
    buyer_company = models.CharField(max_length=200, blank=True, default="")
    category_id = models.CharField(max_length=64)
    category_name = models.CharField(max_length=200)
    title = models.CharField(max_length=300)
    details = models.TextField(blank=True, default="")
    budget_range = models.CharField(max_length=80, blank=True, default="")
    timeline = models.CharField(max_length=80, blank=True, default="")
    status = models.CharField(max_length=24, default="open", db_index=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    kind = models.CharField(max_length=32, default="service")
    reference = models.CharField(max_length=32, unique=True)
    meta = models.JSONField(default=dict)
    status_history = models.JSONField(default=list)
    quoted_amount = models.FloatField(null=True, blank=True)
    order_id = models.CharField(max_length=64, null=True, blank=True, unique=True)

    class Meta:
        db_table = "api_marketrequest"


class MarketOrder(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    service_id = models.CharField(max_length=64)
    service_slug = models.CharField(max_length=300)
    service_name = models.CharField(max_length=300)
    service_icon = models.CharField(max_length=60, blank=True, default="")
    buyer_id = models.CharField(max_length=64, db_index=True)
    buyer_name = models.CharField(max_length=200)
    buyer_company = models.CharField(max_length=200, blank=True, default="")
    amount = models.FloatField(default=0)
    status = models.CharField(max_length=24, default="pending", db_index=True)
    delivery_type = models.CharField(max_length=32, default="project")
    placed_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    requirements = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "api_marketorder"


class MarketThread(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    service_id = models.CharField(max_length=64)
    service_slug = models.CharField(max_length=300)
    service_name = models.CharField(max_length=300)
    service_icon = models.CharField(max_length=60, blank=True, default="")
    buyer_id = models.CharField(max_length=64, db_index=True)
    buyer_name = models.CharField(max_length=200)
    team_id = models.CharField(max_length=64, default="team-stioos")
    team_name = models.CharField(max_length=200, default="STIOOS Delivery Team")
    created_at = models.DateTimeField(default=timezone.now)
    last_message_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "api_marketthread"


class MarketMessage(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    thread_id = models.CharField(max_length=64, db_index=True)
    sender_id = models.CharField(max_length=64)
    sender_name = models.CharField(max_length=200)
    sender_role = models.CharField(max_length=16)  # buyer|team
    body = models.TextField()
    sent_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "api_marketmessage"


class Wishlist(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    user_id = models.CharField(max_length=64, db_index=True)
    service_slug = models.CharField(max_length=300)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "api_wishlist"
        unique_together = (("user_id", "service_slug"),)


# ---------- System ----------

class Notification(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    type = models.CharField(max_length=32)
    title = models.CharField(max_length=200)
    message = models.TextField(blank=True, default="")
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "api_notification"


class ActivityLog(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=_gen_id)
    actor = models.CharField(max_length=200)
    action = models.CharField(max_length=60)
    module = models.CharField(max_length=120)
    target = models.CharField(max_length=200, blank=True, default="")
    description = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "api_activitylog"


class Setting(models.Model):
    id = models.CharField(primary_key=True, max_length=64)
    value = models.JSONField()

    class Meta:
        db_table = "api_setting"
