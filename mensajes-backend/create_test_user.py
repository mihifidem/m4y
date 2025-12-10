from django.contrib.auth.models import User

# Verificar si existe un usuario de prueba
email = 'admin@test.com'
user = User.objects.filter(email=email).first()

if user:
    print(f'✅ Usuario ya existe: {user.username} ({user.email})')
else:
    # Crear usuario de prueba
    user = User.objects.create_user(
        username=email,
        email=email,
        password='admin123',
        first_name='Admin'
    )
    print(f'✅ Usuario creado: {user.username} ({user.email})')
    print('   Contraseña: admin123')

# Listar todos los usuarios
print('\n📋 Usuarios en la base de datos:')
for u in User.objects.all():
    print(f'   - {u.username} ({u.email})')
