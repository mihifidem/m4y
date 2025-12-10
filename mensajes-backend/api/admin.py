from django.contrib import admin
from .models import Code, Message, Reply, Proveedor
from django.utils.html import format_html
from django.utils import timezone


@admin.register(Code)
class CodeAdmin(admin.ModelAdmin):
    list_display = ("code", "is_active", "created_at", "message_link")
    list_filter = ("is_active",)
    search_fields = ("code",)

    def message_link(self, obj):
        if hasattr(obj, "message"):
            return format_html(f"<a href='/admin/api/message/{obj.message.id}/change/'>Ver mensaje</a>")
        return "-"
    message_link.short_description = "Mensaje asociado"


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "code",
        "buyer_email",       # ✅ nuevo campo visible en la lista
        "notify_on_read",
        "views_count",
        "max_views",
        "expires_at",
        "is_expired",
        "created_at",
    )
    list_filter = ("notify_on_read", "expires_at")
    search_fields = ("code__code", "text", "buyer_email")  # ✅ puedes buscar por email

    def is_expired(self, obj):
        return obj.has_expired()
    is_expired.boolean = True
    is_expired.short_description = "Expirado"

    readonly_fields = ("views_count", "created_at", "updated_at")

    fieldsets = (
        ("Identificación", {"fields": ("code", "buyer_email")}),  # ✅ añadido aquí también
        ("Contenido del mensaje", {"fields": ("text", "video", "audio")}),
        ("Configuración", {
            "fields": ("notify_on_read", "max_views", "expires_at"),
        }),
        ("Estado", {"fields": ("views_count", "created_at", "updated_at")}),
    )



@admin.register(Reply)
class ReplyAdmin(admin.ModelAdmin):
    list_display = ("message", "short_text", "created_at")
    search_fields = ("message__code__code", "text")
    list_filter = ("created_at",)

    def short_text(self, obj):
        return (obj.text[:40] + "...") if obj.text and len(obj.text) > 40 else obj.text
    short_text.short_description = "Texto de respuesta"


@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ("prefix", "name", "user_email", "comercial_name", "phone", "email")
    search_fields = ("prefix", "name", "comercial_name", "user__email")
    list_filter = ("prefix",)
    raw_id_fields = ("user",)
    
    def user_email(self, obj):
        return obj.user.email if obj.user else "-"
    user_email.short_description = "Usuario asignado"
    user_email.admin_order_field = "user__email"
    
    fieldsets = (
        ("Identificación", {"fields": ("prefix", "name", "user")}),
        ("Diseño", {"fields": ("background_class", "background_image", "primary_text_class", "secondary_text_class", "accent_class", "card_class")}),
        ("Información del negocio", {"fields": ("comercial_name", "address", "phone", "email", "bio", "website")}),
        ("Redes sociales", {"fields": ("facebook", "instagram", "twitter", "linkedin", "tiktok")}),
    )
