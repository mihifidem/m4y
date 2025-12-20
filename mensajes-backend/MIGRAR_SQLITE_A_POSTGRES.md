# Pasos para migrar de SQLite a PostgreSQL en producción y mantener los datos

1. **Desarrolla normalmente con SQLite**
   - Usa SQLite en settings.py durante el desarrollo.

2. **Antes de subir a producción:**
   - Exporta todos los datos de tu base de datos SQLite:
     
     ```bash
     python manage.py dumpdata > datos.json
     ```

3. **En el entorno de producción:**
   - Instala y configura PostgreSQL.
   - Cambia la configuración de la base de datos en `settings.py`:
     ```python
     DATABASES = {
         'default': {
             'ENGINE': 'django.db.backends.postgresql',
             'NAME': 'nombre_db',
             'USER': 'usuario',
             'PASSWORD': 'contraseña',
             'HOST': 'localhost',
             'PORT': '5432',
         }
     }
     ```
   - Instala el driver de PostgreSQL:
     ```bash
     pip install psycopg2-binary
     ```
   - Ejecuta las migraciones en la nueva base de datos:
     ```bash
     python manage.py migrate
     ```
   - Carga los datos exportados:
     ```bash
     python manage.py loaddata datos.json
     ```

**Notas:**
- Asegúrate de que los modelos no hayan cambiado entre el dump y el load.
- Si tienes archivos en media/ (como imágenes o audios), copia también esa carpeta al servidor.
- Haz pruebas tras la importación para verificar que todo funciona correctamente.
