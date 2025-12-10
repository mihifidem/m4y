from django.contrib.auth.models import User
from api.models import Proveedor

# Listar todos los proveedores
print('📋 Proveedores disponibles:')
proveedores = Proveedor.objects.all()
for p in proveedores:
    usuario = p.user.email if p.user else 'Sin asignar'
    print(f'   {p.prefix}: {p.name} - Usuario: {usuario}')

print('\n📋 Usuarios disponibles:')
usuarios = User.objects.all()
for u in usuarios:
    tiene_proveedor = hasattr(u, 'proveedor') and u.proveedor
    proveedor_info = f'Proveedor: {u.proveedor.prefix}' if tiene_proveedor else 'Sin proveedor'
    print(f'   {u.email} - {proveedor_info}')

# Asignar el usuario admin@test.com al primer proveedor si existe
print('\n🔗 Asignando relación...')
try:
    user = User.objects.get(email='admin@test.com')
    proveedor = Proveedor.objects.first()
    
    if proveedor:
        proveedor.user = user
        proveedor.save()
        print(f'✅ Usuario {user.email} asignado al proveedor {proveedor.prefix} - {proveedor.name}')
    else:
        print('❌ No hay proveedores disponibles')
except User.DoesNotExist:
    print('❌ Usuario admin@test.com no existe')
