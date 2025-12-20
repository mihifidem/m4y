from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import transaction

class Command(BaseCommand):
    help = 'Crea el usuario "mihi" con password "1234" y is_staff=True, role="admin" si no existe ningún usuario.'

    def handle(self, *args, **options):
        if User.objects.exists():
            self.stdout.write(self.style.WARNING('Ya existen usuarios, no se crea el usuario "mihi".'))
            return
        with transaction.atomic():
            user = User.objects.create_user(
                username='mihi',
                password='1234',
                is_staff=True,
                is_superuser=True,
                email='mihifidem@gmail.com',
            )
            user.save()
            # Si tienes un campo 'role' personalizado, deberías tener un modelo User extendido
            # Aquí solo se muestra cómo hacerlo si existe ese campo
            if hasattr(user, 'role'):
                user.role = 'admin'
                user.save()
            self.stdout.write(self.style.SUCCESS('Usuario "mihi" creado con password "1234", is_staff=True, is_superuser=True, email="mihifidem@gmail.com", role="admin".'))
