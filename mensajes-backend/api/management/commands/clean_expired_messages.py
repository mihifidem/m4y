from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import models    # ✅ import necesario
from api.models import Message

class Command(BaseCommand):
    help = "Elimina o marca los mensajes expirados por tiempo o número de vistas"

    def handle(self, *args, **options):
        now = timezone.now()
        expired_messages = Message.objects.filter(
            models.Q(expires_at__lt=now) | models.Q(views_count__gte=models.F('max_views'))
        )

        total = expired_messages.count()
        for msg in expired_messages:
            msg.delete()
        self.stdout.write(self.style.SUCCESS(f"🧹 {total} mensajes expirados eliminados"))
