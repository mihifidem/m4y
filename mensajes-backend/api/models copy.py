import uuid
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError


class Code(models.Model):
    """Código único asignado a cada ramo"""
    code = models.CharField(max_length=64, unique=True, default=uuid.uuid4)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code


from django.db import models
from django.utils import timezone
from datetime import timedelta

class Message(models.Model):
    code = models.OneToOneField("Code", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    # ------------------------------
    # CAMPOS NUEVOS PEDIDOS
    # ------------------------------
    buyer_name = models.CharField(max_length=100, blank=True)
    recipient_name = models.CharField(max_length=100, blank=True)
    recipient_gender = models.CharField(
        max_length=20,
        choices=[
            ("hombre", "Hombre"),
            ("mujer", "Mujer"),
            ("sin genero", "Prefiero no decirlo")
        ],
        blank=True
    )
    gift_type = models.CharField(max_length=100, blank=True)

    event_type = models.CharField(
        max_length=100,
        choices=[
            ("cumpleaños", "Cumpleaños"),
            ("aniversario", "Aniversario"),
            ("santo", "Santo"),
            ("graduación", "Graduación"),
            ("boda", "Boda"),
            ("compromiso", "Compromiso"),
            ("bautizo", "Bautizo"),
            ("primera_comunion", "Primera Comunión"),
            ("jubilación", "Jubilación"),
        ],
        blank=True
    )
    
    message_style = models.CharField(
    max_length=50,
    choices=[
        ("romantico", "Romántico"),
        ("divertido", "Divertido"),
        ("sexy", "Sexy"),
        ("elegante", "Elegante"),
        ("neutral", "Neutral"),
    ],
    blank=True
)


    activation_datetime = models.DateTimeField(null=True, blank=True)
    decorations = models.BooleanField(default=False)

    # ------------------------------
    # CAMPOS EXISTENTES
    # ------------------------------
    text = models.TextField(blank=True)
    video = models.FileField(upload_to="videos/", blank=True, null=True)
    audio = models.FileField(upload_to="audios/", blank=True, null=True)

    buyer_email = models.EmailField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(blank=True, null=True)

    max_views = models.IntegerField(default=50)
    views_count = models.IntegerField(default=0)

    notify_on_read = models.BooleanField(default=False)

    # ------------------------------
    # MÉTODO DE EXPIRACIÓN
    # ------------------------------
    def has_expired(self):
        if self.expires_at and timezone.now() >= self.expires_at:
            return True
        if self.max_views and self.views_count >= self.max_views:
            return True
        return False

    # ------------------------------
    # VALIDACIÓN: ACTIVACIÓN ≤ 1 AÑO
    # ------------------------------
    def clean(self):
        super().clean()

        if self.activation_datetime:
            max_date = timezone.now() + timedelta(days=365)
            if self.activation_datetime > max_date:
                raise ValidationError(
                    {"activation_datetime": "La fecha de activación no puede superar un año desde hoy."}
                )

    def __str__(self):
        return f"Mensaje {self.code.code}"




class Reply(models.Model):
    message = models.ForeignKey("Message", on_delete=models.CASCADE, related_name="replies")
    text = models.TextField(blank=True)
    video = models.FileField(upload_to="replies/videos/", null=True, blank=True)
    audio = models.FileField(upload_to="replies/audios/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Respuesta a {self.message.code.code} ({self.created_at.date()})"
