"""
URL configuration for the ``api`` app — every endpoint lives under ``/api/``.

Path ordering matters: more specific static segments (``read-all``,
``convert``, ``messages``, ``status``, ``featured``, ``duplicate``) are
declared BEFORE the generic ``<str:id>`` routes so Django's URL resolver
matches them first.
"""
from django.urls import path

from api import views

urlpatterns = [
    # ---------- AUTH ----------
    path("auth/signup", views.auth_signup),
    path("auth/login", views.auth_login),
    path("auth/logout", views.auth_logout),
    path("auth/me", views.auth_me),

    # ---------- INQUIRIES ----------
    path("inquiries", views.inquiries_view),
    path("inquiries/<str:id>", views.inquiry_detail),

    # ---------- REQUESTS ----------
    # convert must come before the generic <str:id> route.
    path("requests", views.requests_view),
    path("requests/<str:id>/convert", views.request_convert),
    path("requests/<str:id>", views.request_detail),

    # ---------- ORDERS ----------
    path("orders", views.orders_view),
    path("orders/<str:id>", views.order_detail),

    # ---------- WISHLIST ----------
    path("wishlist", views.wishlist_view),

    # ---------- THREADS ----------
    path("threads", views.threads_view),
    path("threads/<str:id>/messages", views.thread_messages),

    # ---------- SERVICES ----------
    # Sub-paths (status / featured / duplicate) must come before <str:id>.
    path("services", views.services_view),
    path("services/<str:id>/status", views.service_status),
    path("services/<str:id>/featured", views.service_featured),
    path("services/<str:id>/duplicate", views.service_duplicate),
    path("services/<str:id>", views.service_detail),

    # ---------- CATEGORIES ----------
    path("categories", views.categories_view),
    path("categories/<str:id>", views.category_detail),

    # ---------- SUBCATEGORIES ----------
    path("subcategories", views.subcategories_view),
    path("subcategories/<str:id>", views.subcategory_detail),

    # ---------- USERS (buyers) ----------
    path("users", views.users_view),
    path("users/<str:id>", views.user_detail),

    # ---------- ADMINS ----------
    path("admins", views.admins_view),
    path("admins/<str:id>", views.admin_detail),

    # ---------- ROLES ----------
    path("roles", views.roles_view),
    path("roles/<str:id>", views.role_detail),

    # ---------- NOTIFICATIONS ----------
    # read-all must come before the generic <str:id> route.
    path("notifications", views.notifications_view),
    path("notifications/read-all", views.notifications_read_all),
    path("notifications/<str:id>", views.notification_detail),

    # ---------- ACTIVITY / SETTINGS / BOOTSTRAP / PROFILE ----------
    path("activity", views.activity_view),
    path("settings", views.settings_view),
    path("bootstrap", views.bootstrap_view),
    path("profile", views.profile_view),
]
