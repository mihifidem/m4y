#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
from dotenv import load_dotenv
import sys


def main():
    """Run administrative tasks."""
    # Cargar variables de entorno desde .env siempre
    base_dir = os.path.dirname(os.path.abspath(__file__))
    load_dotenv(os.path.join(base_dir, '.env'))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mensajes.settings')
    # Solo ejecutar el bloque automático si se usa SQLite
    db_engine = os.environ.get('DJANGO_DB_ENGINE', 'sqlite')
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'db.sqlite3')
    if db_engine == 'sqlite' and not os.path.exists(db_path):
        try:
            import subprocess
            print('No existe la base de datos. Ejecutando makemigrations y migrate...')
            subprocess.run([sys.executable, 'manage.py', 'makemigrations'], check=True)
            subprocess.run([sys.executable, 'manage.py', 'migrate'], check=True)
            print('Creando usuario "mihi" automáticamente...')
            subprocess.run([
                sys.executable, 'manage.py', 'createsuperuser',
                '--noinput',
                '--username', 'mihi',
                '--email', 'mihifidem@gmail.com'
            ], check=True, env={**os.environ, 'DJANGO_SUPERUSER_PASSWORD': '1234'})
        except Exception as e:
            print(f'Error ejecutando migraciones automáticas o creando usuario: {e}')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
