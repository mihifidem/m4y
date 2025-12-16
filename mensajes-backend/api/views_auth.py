from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


# ============================================================
# 🔹 Registro de usuario
# ============================================================
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["POST"])
def register_user(request):
    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")

    if not all([name, email, password]):
        return Response({"error": "Todos los campos son obligatorios."}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Ya existe un usuario con ese email."}, status=400)

    user = User.objects.create_user(
        username=email, email=email, password=password, first_name=name
    )
    return Response({"success": True, "message": "Usuario creado correctamente."}, status=201)




# ============================================================
# 🔹 Login personalizado (acepta email o username)
# ============================================================
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Permite login tanto por email como por username.
    """

    # 🔸 interceptar aquí, antes de validar los datos
    def to_internal_value(self, data):
        # Aquí ya recibimos los datos crudos del JSON (antes del validate)
        print("📩 Datos RAW recibidos:", data)

        # Si el frontend envía "email", lo renombramos a "username"
        if "email" in data and "username" not in data:
            try:
                user_obj = User.objects.get(email=data["email"])
                data["username"] = user_obj.username
                print(f"✅ Usuario encontrado por email: {user_obj.username}")
            except User.DoesNotExist:
                # Si el email no existe, intentar usarlo como username
                data["username"] = data["email"]
                print("⚠️ Email no encontrado, usando el valor como username")

        # Eliminar el campo email, ya que SimpleJWT no lo acepta
        if "email" in data:
            del data["email"]

        print("📦 Datos enviados al validador interno:", data)
        return super().to_internal_value(data)

    def validate(self, attrs):
        # Ya estamos seguros de que existe username aquí
        print("📥 Atributos que llegan a validate:", attrs)

        username = attrs.get("username")
        password = attrs.get("password")

        user = authenticate(username=username, password=password)
        if not user:
            print("❌ Autenticación fallida")
            raise serializers.ValidationError({"detail": "Credenciales inválidas o usuario inactivo."})

        # Validar con el serializer base
        data = super().validate(attrs)

        # Agregar información adicional del usuario
        data.update({
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        })

        print(f"🟢 Login correcto para {user.username}")
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["email"] = user.email
        token["first_name"] = user.first_name
        token["is_staff"] = user.is_staff
        token["is_superuser"] = user.is_superuser
        return token


from rest_framework.permissions import AllowAny


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer
