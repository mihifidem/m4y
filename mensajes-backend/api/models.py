import uuid
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Proveedor(models.Model):
    """Proveedor/diseño identificado por prefijo de 4 letras del código"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='proveedor', null=True, blank=True, unique=True)
    prefix = models.CharField(max_length=4, unique=True)
    name = models.CharField(max_length=100)
    background_class = models.CharField(max_length=100, default="bg-gray-50")
    background_image = models.URLField(max_length=500, blank=True, null=True)
    primary_text_class = models.CharField(max_length=100, default="text-gray-800")
    secondary_text_class = models.CharField(max_length=100, default="text-gray-600")
    accent_class = models.CharField(max_length=100, default="bg-gray-600")
    card_class = models.CharField(max_length=100, default="bg-white")
    
    # Información del negocio
    comercial_name = models.CharField(max_length=200, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    website = models.URLField(max_length=500, blank=True, null=True)
    
    # Redes sociales
    facebook = models.URLField(max_length=500, blank=True, null=True)
    instagram = models.URLField(max_length=500, blank=True, null=True)
    twitter = models.URLField(max_length=500, blank=True, null=True)
    linkedin = models.URLField(max_length=500, blank=True, null=True)
    tiktok = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"{self.prefix} - {self.name}"
    
    def clean(self):
        """Validación personalizada para asegurar relación 1 a 1"""
        from django.core.exceptions import ValidationError
        super().clean()
        
        # Verificar que no exista otro proveedor con el mismo usuario
        if self.user:
            existing = Proveedor.objects.filter(user=self.user).exclude(pk=self.pk).first()
            if existing:
                raise ValidationError({
                    'user': f'Este usuario ya está asignado al proveedor {existing.prefix} - {existing.name}'
                })
    
    def save(self, *args, **kwargs):
        """Override save para ejecutar validación"""
        self.full_clean()
        super().save(*args, **kwargs)


class Code(models.Model):
    """Código único asignado a cada ramo"""
    code = models.CharField(max_length=64, unique=True, default=uuid.uuid4)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code


class Message(models.Model):
    """Mensaje grabado por el comprador"""
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    code = models.OneToOneField(Code, on_delete=models.CASCADE, related_name='message')
    title = models.CharField(max_length=200, blank=True, null=True)
    text = models.TextField(blank=True)
    video = models.FileField(upload_to='videos/', blank=True, null=True)
    audio = models.FileField(upload_to='audios/', blank=True, null=True)
    buyer_email = models.EmailField(blank=True, null=True)  # 🔹 nuevo campo
    notify_on_read = models.BooleanField(default=False)
    max_views = models.PositiveIntegerField(default=5)
    views_count = models.PositiveIntegerField(default=0)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_read = models.BooleanField(default=False)


    def has_expired(self):
        from django.utils import timezone

        # 1) Expirado por límite de vistas
        if self.max_views and self.views_count >= self.max_views:
            return True

        # 2) Expirado por fecha real
        if self.expires_at and timezone.now() > self.expires_at:
            return True

        # CASO OK
        return False

        def __str__(self):
            return f"Mensaje para código {self.code}"



class Reply(models.Model):
    message = models.ForeignKey("Message", on_delete=models.CASCADE, related_name="replies")
    text = models.TextField(blank=True)
    video = models.FileField(upload_to="replies/videos/", null=True, blank=True)
    audio = models.FileField(upload_to="replies/audios/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Respuesta a {self.message.code.code} ({self.created_at.date()})"
