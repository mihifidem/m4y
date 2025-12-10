## we_mensajes - Instrucciones de Implementación

## 🎯 Resumen de Cambios

Se han implementado las siguientes mejoras en el proyecto:

### Frontend (`mensajes-front`)

1. **Navbar Global** (`src/components/Navbar.jsx`)
   - Enlaces a: Home, Crear Mensaje, Ver Mensaje
   - Enlaces a instrucciones para crear y ver mensajes

2. **Footer Global** (`src/components/Footer.jsx`)
   - Copyright con año dinámico

3. **Layout Global** (`src/App.jsx`)
   - Navbar y Footer en todas las páginas
   - Nuevas rutas:
     - `/instrucciones/crear` - Instrucciones para crear mensaje
     - `/instrucciones/ver` - Instrucciones para ver mensaje

4. **Landing Page** (`src/pages/Landing.jsx`)
   - **4 inputs separados** para código: `NTSF-001-001-ABC`
   - **Estilo neutro** por defecto
   - **Tema dinámico**: Al escribir el prefijo (4 primeras letras), consulta `GET /api/proveedor/{prefix}/` y aplica colores del proveedor
   - **Paste inteligente**: Pega código completo y lo distribuye automáticamente
   - **Autofocus**: Avanza al siguiente campo al completar
   - **Validación**: Solo letras en prefijo y sufijo, solo números en códigos

5. **CreateMessage** (`src/pages/CreateMessage.jsx`)
   - **4 inputs separados** con mismas funcionalidades que Landing
   - **Tema dinámico** según prefijo del proveedor
   - Link a instrucciones en la cabecera
   - Código compuesto enviado al backend

6. **ViewMessage** (`src/pages/ViewMessage.jsx`)
   - Link a instrucciones en la cabecera

7. **Páginas de Instrucciones**
   - `src/pages/InstructionsCreate.jsx`
   - `src/pages/InstructionsView.jsx`

### Backend (`mensajes-backend`)

1. **Modelo Proveedor** (`api/models.py`)
   - `prefix`: Prefijo de 4 letras (ej: NTSF)
   - `name`: Nombre del proveedor
   - `background_class`: Clase Tailwind para fondo
   - `primary_text_class`: Clase Tailwind para texto principal
   - `accent_class`: Clase Tailwind para acentos
   - `card_class`: Clase Tailwind para tarjetas

2. **Endpoint API** (`api/views.py` + `api/urls.py`)
   - `GET /api/proveedor/{prefix}/` - Devuelve diseño del proveedor
   - Si no existe, devuelve tema neutro por defecto

3. **Comando Seed** (`api/management/commands/seed_proveedores.py`)
   - Crea proveedores de ejemplo:
     - `NTSF` - NotodoSonFlores (tema rosa)
     - `ABCD` - Proveedor ABCD (tema azul)

4. **Admin Django** (`api/admin.py`)
   - Registro del modelo Proveedor en admin

## 🚀 Configuración y Ejecución

### Backend

```powershell
# Navegar al backend
cd "c:\Users\mihif\OneDrive\Desktop\we_mensajes\mensajes-backend"

# Crear/activar entorno virtual (si no existe)
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Instalar dependencias
pip install -r requirements.txt

# Crear migraciones (ya ejecutado)
python manage.py makemigrations api

# Aplicar migraciones (ya ejecutado)
python manage.py migrate

# Crear proveedores de ejemplo (ya ejecutado)
python manage.py seed_proveedores

# Iniciar servidor
python manage.py runserver 8000
```

### Frontend

```powershell
# Navegar al frontend
cd "c:\Users\mihif\OneDrive\Desktop\we_mensajes\mensajes-front"

# Instalar dependencias (si no está hecho)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🎨 Cómo Funciona el Tema Dinámico

1. Usuario escribe las **primeras 4 letras** del código (ej: `NTSF`)
2. Frontend consulta: `GET http://localhost:8000/api/proveedor/NTSF/`
3. Backend devuelve:
```json
{
  "prefix": "NTSF",
  "name": "NotodoSonFlores",
  "background_class": "bg-rose-50",
  "primary_text_class": "text-rose-800",
  "accent_class": "bg-rose-600",
  "card_class": "bg-white"
}
```
4. Frontend aplica las clases Tailwind recibidas
5. Si no existe el proveedor, usa tema neutro (gris)

## 📝 Crear Nuevos Proveedores

### Opción 1: Admin Django
1. Ir a `http://localhost:8000/admin/`
2. Login como superusuario
3. Sección "Proveedors" → Añadir
4. Completar campos con clases Tailwind

### Opción 2: Shell Django
```python
python manage.py shell

from api.models import Proveedor
Proveedor.objects.create(
    prefix="WXYZ",
    name="Mi Proveedor",
    background_class="bg-purple-50",
    primary_text_class="text-purple-900",
    accent_class="bg-purple-600",
    card_class="bg-white"
)
```

### Opción 3: Añadir al comando seed
Editar `api/management/commands/seed_proveedores.py` y añadir nuevos proveedores al array `samples`.

## 🎯 Flujo de Usuario

### Crear Mensaje
1. Landing → Introducir código en 4 inputs: `NTSF-001-001-ABC`
2. Al escribir `NTSF`, el tema cambia automáticamente
3. Click "Crear mensaje" → Validación en backend
4. Si válido → Navega a `/create-message/NTSF-001-001-ABC`
5. Formulario con tema del proveedor aplicado
6. Completar email, mensaje, video/audio opcional
7. Guardar → Código activado

### Ver Mensaje
1. Navbar → "Ver Mensaje" o barra superior de Landing
2. Introducir código completo
3. Ver mensaje con límite de vistas y expiración

## 📦 Archivos Modificados/Creados

### Frontend
- ✅ `src/App.jsx` - Layout global
- ✅ `src/components/Navbar.jsx` - NUEVO
- ✅ `src/components/Footer.jsx` - NUEVO
- ✅ `src/pages/Landing.jsx` - 4 inputs + tema dinámico
- ✅ `src/pages/CreateMessage.jsx` - 4 inputs + tema dinámico
- ✅ `src/pages/ViewMessage.jsx` - Link instrucciones
- ✅ `src/pages/InstructionsCreate.jsx` - NUEVO
- ✅ `src/pages/InstructionsView.jsx` - NUEVO

### Backend
- ✅ `api/models.py` - Modelo Proveedor
- ✅ `api/serializers.py` - ProveedorSerializer
- ✅ `api/views.py` - Endpoint proveedor_by_prefix
- ✅ `api/urls.py` - Ruta /proveedor/<prefix>/
- ✅ `api/admin.py` - Admin Proveedor
- ✅ `api/management/commands/seed_proveedores.py` - NUEVO
- ✅ `api/migrations/0009_proveedor_*.py` - Migración

## ✨ Características de UX

- **Autofocus**: Avanza automáticamente al siguiente campo
- **Validación en tiempo real**: Solo acepta formato válido
- **Paste inteligente**: Pega `NTSF-001-001-ABC` y lo distribuye
- **Restricciones**: Letras mayúsculas en prefijo/sufijo, números en códigos
- **Tema en vivo**: Cambia colores al escribir prefijo
- **Links contextuales**: Acceso rápido a instrucciones desde cada página

## 🔧 Próximos Pasos Opcionales

1. **Agregar logos**: Incluir campo `logo_url` en modelo Proveedor
2. **Más estilos**: Añadir fuentes, bordes, sombras personalizadas
3. **Caché**: Cachear respuesta de proveedor en frontend (localStorage)
4. **Animaciones**: Transiciones suaves al cambiar tema
5. **Preview**: Mostrar vista previa del tema en admin

## 📞 Soporte

Si tienes dudas:
1. Revisar logs del servidor: `python manage.py runserver --verbosity 2`
2. Verificar proveedores: `python manage.py shell` → `Proveedor.objects.all()`
3. Comprobar migraciones: `python manage.py showmigrations api`
