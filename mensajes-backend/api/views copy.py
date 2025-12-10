from datetime import timedelta
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes

from .models import Code, Message, Reply
from .serializers import CodeSerializer, MessageSerializer, ReplySerializer
from .utils.notification import notify_message_read
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def messages_by_user(request):
    """
    Devuelve los mensajes creados por el usuario autenticado.
    """
    messages = Message.objects.filter(user=request.user).order_by("-created_at")
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def messages_by_user(request):
    """
    Devuelve los mensajes creados por el usuario autenticado.
    """
    if not request.user.is_authenticated:
        return Response({"error": "No autenticado."}, status=401)

    messages = Message.objects.filter(user=request.user).order_by("-created_at")
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)


# ============================================================
# 🔹 Verificar si un código está activo
# ============================================================
@api_view(['POST'])
def check_code(request):
    code = request.data.get("code")
    if not code:
        return Response({"valid": False, "error": "Código no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        code_obj = Code.objects.get(code=code, is_active=True)
        return Response({"valid": True})
    except Code.DoesNotExist:
        return Response({"valid": False})


# ============================================================
# 🔹 Activar código y crear mensaje
# ============================================================
class ActivateView(APIView):
    """
    Activa un código y crea un mensaje asociado.
    Si el usuario está logueado, lo asocia.
    Si no, permite enviarlo igualmente.
    """
    permission_classes = [AllowAny]  # 👈 ahora es público

    def post(self, request):
        try:
            code = request.data.get("code")
            text = request.data.get("text", "")
            buyer_email = request.data.get("buyer_email", "")
            
            # Convertir string a booleano real
            raw_notify = request.data.get("notify_on_read", "false")
            notify_on_read = True if str(raw_notify).lower() == "true" else False



            duration_days = int(request.data.get("duration_days", 30))
            max_views = int(request.data.get("max_views", 5))
            video = request.FILES.get("video")
            audio = request.FILES.get("audio")

            if not code or not buyer_email:
                return Response({"error": "Código y email son obligatorios."}, status=400)

            # Buscar el código válido
            try:
                code_obj = Code.objects.get(code=code, is_active=True)
            except Code.DoesNotExist:
                return Response({"error": "Código inválido o ya usado."}, status=400)

            expires_at = timezone.now() + timedelta(days=duration_days)

            # Asociar usuario si está autenticado
            user = None
            if request.user and request.user.is_authenticated:
                user = request.user
                print(f"✅ Mensaje asociado al usuario autenticado: {user.email}")

            # Crear mensaje
            message = Message.objects.create(
                code=code_obj,
                text=text,
                buyer_email=buyer_email,
                notify_on_read=notify_on_read,
                expires_at=expires_at,
                max_views=max_views,
                video=video,
                audio=audio,
                user=user,  # 👈 guarda el user si lo hay
            )

            # Marcar el código como usado
            code_obj.is_active = False
            code_obj.save()

            print(f"🟢 Mensaje creado para {buyer_email}")
            return Response({"success": True, "message_id": message.id}, status=201)

        except Exception as e:
            print(f"❌ ERROR en ActivateView: {e}")
            return Response({"error": str(e)}, status=500)

# ============================================================
# 🔹 Crear respuesta del destinatario
# ============================================================
class ReplyCreateView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, code):
        message = get_object_or_404(Message, code__code=code)

        text = request.data.get("text", "")
        video = request.FILES.get("video")
        audio = request.FILES.get("audio")

        reply = Reply.objects.create(
            message=message,
            text=text,
            video=video,
            audio=audio,
        )

        # ✅ Notificar al comprador (si tiene email)
        if message.buyer_email:
            from django.core.mail import send_mail
            send_mail(
                subject="📩 Has recibido una respuesta a tu mensaje",
                message=f"El destinatario ha respondido al mensaje con código {message.code.code}.",
                from_email="no-reply@notodosonflores.com",
                recipient_list=[message.buyer_email],
                fail_silently=True,
            )

        return Response(ReplySerializer(reply).data, status=201)



# ============================================================
# 🔹 Obtener mensaje por destinatario (al abrir el QR)
# ============================================================
class MessageDetailView(APIView):
    def get(self, request, code):
        try:
            # Buscar mensaje asociado
            message = Message.objects.filter(code__code=code).first()

            # Si no hay mensaje creado aún → NO ES ERROR 500, es un 404 elegante
            if not message:
                return Response({
                    "error": "Aún no hay ningún mensaje asociado a este código.",
                    "exists": False,
                    "expired": False
                }, status=404)

            expired = message.has_expired()

            # Evitar sumar más de 1 vez por sesión
            session_key = f"viewed_{message.id}"

            if not expired and not request.session.get(session_key):
                message.views_count += 1
                message.save(update_fields=["views_count"])
                request.session[session_key] = True

                if message.notify_on_read:
                    notify_message_read(message)

            data = MessageSerializer(message).data
            data["expired"] = expired
            data["exists"] = True

            return Response(data, status=200)

        except Exception as e:
            print("❌ ERROR MessageDetail:", e)
            return Response({"error": str(e)}, status=500)


# ============================================================
# 🔹 Marcar mensaje como leído manualmente
# ============================================================
# ============================================================
# 🔹 Marcar mensaje como leído manualmente
# ============================================================
class MarkAsReadView(APIView):
    def post(self, request, code):
        message = get_object_or_404(Message, code__code=code)

        # Si el mensaje tiene un límite de vistas, respétalo
        if message.max_views and message.views_count >= message.max_views:
            return Response({"error": "Se ha alcanzado el máximo de vistas."}, status=403)

        message.views_count += 1
        message.is_read = True  # 👈 marca como leído (si el modelo lo tiene)
        message.save(update_fields=["views_count", "is_read"])

        # Notificación opcional al comprador
        if message.notify_on_read:
            notify_message_read(message)

        return Response({
            "status": "ok",
            "views": message.views_count,
            "is_read": True
        }, status=200)


@api_view(["GET"])
def messages_by_email(request):
    email = request.GET.get("email")
    if not email:
        return Response({"error": "Debe proporcionar un email."}, status=400)

    messages = Message.objects.filter(buyer_email=email).order_by("-created_at")

    data = [
        {
            "id": msg.id,
            "title": msg.title or msg.text[:50],
            "code": msg.code.code if msg.code else None,
            "created_at": msg.created_at,
            "is_read": msg.views_count > 0,
            "expired": msg.has_expired(),
        }
        for msg in messages
    ]

    return Response(data, status=200)
