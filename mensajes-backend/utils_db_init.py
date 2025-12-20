import os
import sys
from django.core.management import call_command
from django.conf import settings
from pathlib import Path

def ensure_db():
    db_path = Path(settings.BASE_DIR) / 'db.sqlite3'
    if not db_path.exists():
        print('Base de datos no encontrada. Ejecutando makemigrations y migrate...')
        call_command('makemigrations')
        call_command('migrate')

# Para usarlo, importa y llama a ensure_db() al inicio de tu app principal (por ejemplo, en wsgi.py o asgi.py)
