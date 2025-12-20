from rest_framework.routers import DefaultRouter

router = DefaultRouter()
from .views import CodeAdminViewSet
router.register(r'codes', CodeAdminViewSet, basename='code-admin')
from django.urls import path
from .views import (
    check_code,
    ActivateView,
    MessageDetailView,
    MessagePeekView,
    ReplyCreateView,
    MarkAsReadView,
    messages_by_email,
    messages_by_user,
    UpdateMessageView,
    DeleteMessageView,
    codes_by_user,  # <--- Asegura que esté importado aquí
)
from .views_auth import register_user, CustomTokenObtainPairView
from .views_ai import ai_suggest
from .views import proveedor_by_prefix
from .views_proveedor import get_user_proveedor


urlpatterns = [
    path("check_code/", check_code, name="check_code"),
    path("activate/", ActivateView.as_view(), name="activate"),
    path("message/<str:code>/", MessageDetailView.as_view(), name="message_detail"),
    path("message/<str:code>/peek/", MessagePeekView.as_view(), name="message_peek"),
    path("message/<str:code>/update/", UpdateMessageView.as_view(), name="update_message"),
    path("message/<str:code>/delete/", DeleteMessageView.as_view(), name="delete_message"),
    path("message/<str:code>/reply/", ReplyCreateView.as_view(), name="create_reply"),
    path("message/<str:code>/viewed/", MarkAsReadView.as_view(), name="mark_as_read"),
    path("messages/by-email/", messages_by_email, name="messages_by_email"),
    path("register/", register_user, name="register_user"),  
    path("messages/by-user/", messages_by_user, name="messages_by_user"),
    path("ai/suggest/", ai_suggest, name="ai_suggest"),
    path("proveedor/<str:prefix>/", proveedor_by_prefix, name="proveedor_by_prefix"),
    path("user/proveedor/", get_user_proveedor, name="get_user_proveedor"),
    path("codes/by-user/", codes_by_user, name="codes_by_user"),
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
]

# Agregar rutas del router (codes CRUD admin)
urlpatterns += router.urls
