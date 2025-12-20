"""
WSGI config for mensajes project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mensajes.settings')
 

# --- Auto DB init ---
try:
	from utils_db_init import ensure_db
	ensure_db()
except Exception as e:
	print(f"[DB INIT] Error al verificar/crear la base de datos: {e}")
	import sys
	sys.exit(1)
# ---

application = get_wsgi_application()
