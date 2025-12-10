from django.contrib.auth.models import User

# Resetear contraseña del usuario admin@test.com
email = 'admin@test.com'
password = 'admin123'

try:
    user = User.objects.get(email=email)
    user.set_password(password)
    user.save()
    print(f'✅ Contraseña actualizada para: {user.username}')
    print(f'   Email: {email}')
    print(f'   Password: {password}')
except User.DoesNotExist:
    print(f'❌ Usuario con email {email} no existe')
