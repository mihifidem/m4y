# 🌹 we_mensajes - Sistema de Mensajes con Temas Dinámicos

Sistema completo de mensajes multimedia con temas personalizables por proveedor.

## 🚀 Quick Start

### Backend
```powershell
cd mensajes-backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_proveedores
python manage.py runserver 8000
```

### Frontend
```powershell
cd mensajes-front
npm install
npm run dev
```

## ✨ Nuevas Características

### 🎨 Temas Dinámicos por Proveedor
- Código en formato: `NTSF-001-001-ABC`
- 4 inputs separados con validación inteligente
- Al escribir el prefijo (NTSF), consulta `/api/proveedor/NTSF/` y aplica tema automáticamente
- Paste inteligente: pega código completo y lo distribuye
- Autofocus: avanza al completar cada campo

### 🧭 Navegación Mejorada
- **Navbar global**: Home / Crear Mensaje / Ver Mensaje + Enlaces a instrucciones
- **Footer global**: Copyright dinámico
- **Páginas de instrucciones**: `/instrucciones/crear` y `/instrucciones/ver`

### 🎯 UX Optimizada
- Validación en tiempo real (solo letras/números según campo)
- Restricciones por tipo: letras mayúsculas en prefijo/sufijo, números en códigos
- Tema neutro por defecto + cambio dinámico al escribir prefijo
- Links contextuales a instrucciones desde cada página

## 📊 Modelo Proveedor

```python
class Proveedor(models.Model):
    prefix = CharField(max_length=4, unique=True)  # NTSF
    name = CharField(max_length=100)
    background_class = CharField(max_length=100)   # bg-rose-50
    primary_text_class = CharField(max_length=100) # text-rose-800
    accent_class = CharField(max_length=100)       # bg-rose-600
    card_class = CharField(max_length=100)         # bg-white
```

## 🔌 API Endpoints

- `GET /api/proveedor/{prefix}/` - Obtiene tema del proveedor
- `POST /api/check_code/` - Valida código disponible
- `POST /api/activate/` - Crea mensaje y activa código
- `GET /api/message/{code}/` - Obtiene mensaje
- Ver más en `/mensajes-backend/api/urls.py`

## 📝 Crear Proveedores

### Admin Django
```
http://localhost:8000/admin/api/proveedor/add/
```

### Shell Django
```python
from api.models import Proveedor
Proveedor.objects.create(
    prefix="ABCD",
    name="Mi Floristería",
    background_class="bg-blue-50",
    primary_text_class="text-blue-900",
    accent_class="bg-blue-600",
    card_class="bg-white"
)
```

### Comando Seed
```powershell
python manage.py seed_proveedores
```

Ya incluye ejemplos: `NTSF` (rosa) y `ABCD` (azul)

## 📁 Estructura

```
we_mensajes/
├── mensajes-backend/          # Django REST API
│   ├── api/
│   │   ├── models.py          # Proveedor, Code, Message, Reply
│   │   ├── views.py           # Endpoints
│   │   ├── serializers.py     # Serializers
│   │   ├── management/
│   │   │   └── commands/
│   │   │       └── seed_proveedores.py
│   │   └── migrations/
│   └── manage.py
└── mensajes-front/            # React + Vite + Tailwind
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx     # ✨ NUEVO
    │   │   └── Footer.jsx     # ✨ NUEVO
    │   ├── pages/
    │   │   ├── Landing.jsx    # ✨ 4 inputs + tema dinámico
    │   │   ├── CreateMessage.jsx  # ✨ 4 inputs + tema
    │   │   ├── ViewMessage.jsx    # ✨ Link instrucciones
    │   │   ├── InstructionsCreate.jsx  # ✨ NUEVO
    │   │   └── InstructionsView.jsx    # ✨ NUEVO
    │   └── App.jsx            # ✨ Layout global
    └── package.json
```

## 🎯 Flujo Completo

1. **Landing** → Usuario introduce `NTSF` en primer input
2. **Frontend** consulta `GET /api/proveedor/NTSF/`
3. **Backend** devuelve clases Tailwind del proveedor
4. **Frontend** aplica tema (colores rosa para NTSF)
5. Usuario completa: `NTSF-001-001-ABC`
6. Click "Crear mensaje" → Validación + Navegación
7. Formulario con mismo tema aplicado
8. Graba mensaje/video/audio → Activa código
9. Destinatario accede con código → Ve mensaje

## 🔧 Tecnologías

- **Backend**: Django 5.2, Django REST Framework, SQLite
- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Validación**: Regex + restricciones por tipo
- **Estilo**: Clases Tailwind dinámicas

## 📖 Documentación Completa

Ver `INSTRUCCIONES.md` para detalles técnicos completos.

## ✅ Estado del Proyecto

- ✅ Navbar y Footer globales
- ✅ 4 inputs con autofocus y paste inteligente
- ✅ Modelo Proveedor y endpoint
- ✅ Tema dinámico en Landing y CreateMessage
- ✅ Páginas de instrucciones
- ✅ Comando seed con ejemplos
- ✅ Admin Django configurado
- ✅ Migraciones aplicadas
