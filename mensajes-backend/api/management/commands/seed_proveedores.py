from django.core.management.base import BaseCommand
from api.models import Proveedor


class Command(BaseCommand):
    help = "Crea proveedores de ejemplo para temas de frontend"

    def handle(self, *args, **options):
        samples = [
            {
                "prefix": "NTSF",
                "name": "NotodoSonFlores",
                "background_class": "bg-rose-50",
                "background_image": "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80",
                "primary_text_class": "text-rose-800",
                "secondary_text_class": "text-rose-600",
                "accent_class": "bg-rose-600",
                "card_class": "bg-white",
                "comercial_name": "No Todo Son Flores",
                "address": "Calle de las Rosas 123, Madrid 28001",
                "phone": "+34 912 345 678",
                "email": "info@notodosonflores.com",
                "bio": "Floristería especializada en arreglos personalizados y mensajes únicos. Entregamos emociones.",
                "website": "https://notodosonflores.com",
                "facebook": "https://facebook.com/notodosonflores",
                "instagram": "https://instagram.com/notodosonflores",
                "twitter": "https://twitter.com/notodosonflores",
            },
            {
                "prefix": "ABCD",
                "name": "Proveedor ABCD",
                "background_class": "bg-blue-50",
                "background_image": "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80",
                "primary_text_class": "text-blue-900",
                "secondary_text_class": "text-blue-700",
                "accent_class": "bg-blue-600",
                "card_class": "bg-white",
                "comercial_name": "ABCD Regalos Especiales",
                "address": "Av. Principal 456, Barcelona 08001",
                "phone": "+34 933 456 789",
                "email": "contacto@abcdregalos.com",
                "bio": "Experiencia única en regalos corporativos y personales con mensajes multimedia.",
                "website": "https://abcdregalos.com",
                "instagram": "https://instagram.com/abcdregalos",
                "linkedin": "https://linkedin.com/company/abcdregalos",
            },
        ]

        created = 0
        for s in samples:
            obj, was_created = Proveedor.objects.update_or_create(
                prefix=s["prefix"],
                defaults=s,
            )
            if was_created:
                created += 1

        self.stdout.write(self.style.SUCCESS(f"Seed completado. Nuevos: {created}"))