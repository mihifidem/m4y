from django.apps import AppConfig
from django.core.management import call_command


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # Ejecutar el comando para crear el usuario admin automáticamente
        try:
            call_command('createadminuser')
        except Exception as e:
            # Evitar que errores de creación de usuario detengan el arranque
            print(f"[INFO] createadminuser: {e}")
