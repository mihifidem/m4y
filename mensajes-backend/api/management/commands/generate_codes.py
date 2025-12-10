from django.core.management.base import BaseCommand
from api.models import Code

class Command(BaseCommand):
    help = "Genera códigos NTSF automáticamente"

    def add_arguments(self, parser):
        parser.add_argument("cantidad", type=int, help="Número de códigos a generar")

    def handle(self, *args, **options):
        cantidad = options["cantidad"]

        for _ in range(cantidad):
            nuevo = Code.objects.create()
            self.stdout.write(self.style.SUCCESS(f"Generado: {nuevo.code}"))
