from rest_framework import viewsets, permissions
from .models import Code, Message, Reply, Proveedor
from .serializers import CodeSerializer, MessageSerializer, ReplySerializer, ProveedorSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated

# Permiso solo para admin
class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

# ViewSet CRUD para Code
class CodeAdminViewSet(viewsets.ModelViewSet):
    serializer_class = CodeSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        queryset = Code.objects.all().order_by('-created_at')
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(code__icontains=search) |
                models.Q(message__buyer_email__icontains=search)
            )
        return queryset
from datetime import timedelta
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import Code, Message, Reply, Proveedor
from .serializers import CodeSerializer, MessageSerializer, ReplySerializer, ProveedorSerializer
from .utils.notification import notify_message_read
from collections import Counter
from django.db.models import Q
from datetime import datetime


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

        # 🔒 Verificar si ya existe una respuesta
        existing_reply = Reply.objects.filter(message=message).first()
        if existing_reply:
            return Response({
                "error": "Ya existe una respuesta para este mensaje. No se permiten múltiples respuestas."
            }, status=status.HTTP_400_BAD_REQUEST)

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
            # Construir link al mensaje y respuesta
            frontend_url = "https://www.mensajeparati.com/view/"  # Cambia esto por tu dominio real
            link = f"{frontend_url}{message.code.code}"
            email_body = (
                f"El destinatario ha respondido al mensaje con código {message.code.code}.\n\n"
                f"Puedes ver la respuesta aquí: {link}\n\n"
                f"Texto de la respuesta:\n{reply.text}"
            )
            send_mail(
                subject="📩 Has recibido una respuesta a tu mensaje",
                message=email_body,
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
# 🔹 Peek de mensaje (sin incrementar vistas)
# ============================================================
class MessagePeekView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, code):
        try:
            message = Message.objects.filter(code__code=code).first()
            if not message:
                return Response({
                    "exists": False,
                    "expired": False
                }, status=404)

            expired = message.has_expired()
            data = MessageSerializer(message).data
            data["expired"] = expired
            data["exists"] = True
            # 👆 No se incrementa views_count ni se notifica
            return Response(data, status=200)
        except Exception as e:
            print("❌ ERROR MessagePeek:", e)
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


# ============================================================
# 🔹 Obtener diseño del proveedor por prefijo
# ============================================================
@api_view(["GET"])
@permission_classes([AllowAny])
def proveedor_by_prefix(request, prefix):
    prefix = (prefix or "").upper()
    prov = Proveedor.objects.filter(prefix=prefix).first()
    if not prov:
        # Responder con estilo neutro por defecto
        return Response({
            "prefix": prefix,
            "name": "Genérico",
            "background_class": "bg-gray-50",
            "background_image": None,
            "primary_text_class": "text-gray-800",
            "accent_class": "bg-gray-600",
            "card_class": "bg-white",
            "comercial_name": None,
            "address": None,
            "phone": None,
            "email": None,
            "bio": None,
            "website": None,
            "facebook": None,
            "instagram": None,
            "twitter": None,
            "linkedin": None,
            "tiktok": None,
        }, status=200)

    return Response(ProveedorSerializer(prov).data, status=200)


# ============================================================
# 🔹 Actualizar mensaje existente
# ============================================================
class UpdateMessageView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request, code):
        try:
            message = Message.objects.get(code__code=code)
            
            # Verificar que no hayan pasado más de 7 días
            days_since_creation = (timezone.now() - message.created_at).days
            if days_since_creation > 7:
                return Response({
                    "error": "No se puede editar un mensaje después de 7 días de su creación."
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Actualizar campos
            message.text = request.data.get("text", message.text)
            message.buyer_email = request.data.get("buyer_email", message.buyer_email)
            
            # Actualizar video si se proporciona uno nuevo
            if "video" in request.FILES:
                message.video = request.FILES["video"]
            
            # Actualizar audio si se proporciona uno nuevo
            if "audio" in request.FILES:
                message.audio = request.FILES["audio"]
            
            message.save()
            
            return Response({
                "status": "success",
                "message": "Mensaje actualizado correctamente"
            }, status=status.HTTP_200_OK)
            
        except Message.DoesNotExist:
            return Response({
                "error": "Mensaje no encontrado"
            }, status=status.HTTP_404_NOT_FOUND)


# ============================================================
# 🔹 Borrar mensaje existente
# ============================================================
class DeleteMessageView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, code):
        try:
            message = Message.objects.get(code__code=code)
            
            # Verificar que no hayan pasado más de 7 días
            days_since_creation = (timezone.now() - message.created_at).days
            if days_since_creation > 7:
                return Response({
                    "error": "No se puede borrar un mensaje después de 7 días de su creación."
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Eliminar archivos multimedia si existen
            if message.video:
                message.video.delete(save=False)
            if message.audio:
                message.audio.delete(save=False)
            
            # Eliminar el mensaje
            message.delete()

            # Reactivar el código asociado para permitir crear un nuevo mensaje
            try:
                code_obj = Code.objects.get(code=code)
                code_obj.is_active = True
                code_obj.save(update_fields=["is_active"])
            except Code.DoesNotExist:
                pass
            
            return Response({
                "status": "success",
                "message": "Mensaje borrado correctamente y código reactivado"
            }, status=status.HTTP_200_OK)
            
        except Message.DoesNotExist:
            return Response({
                "error": "Mensaje no encontrado"
            }, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def codes_by_user(request):
    """
    Devuelve todos los códigos del proveedor asociado al usuario autenticado,
    indicando si están activados (usados) o no, y estadísticas por mes.
    """
    user = request.user
    # Buscar proveedor asociado
    try:
        proveedor = Proveedor.objects.get(user=user)
    except Proveedor.DoesNotExist:
        return Response({"error": "No tienes proveedor asociado."}, status=403)

    # Filtrar códigos por prefijo del proveedor
    prefix = proveedor.prefix
    codes = Code.objects.filter(code__startswith=prefix).order_by("-created_at")

    # Preparar listas
    codes_data = []
    stats_activated = Counter()
    stats_inactive = Counter()

    for code in codes:
        # Buscar mensaje asociado
        try:
            message = Message.objects.get(code=code)
            activated = True
            created_at = message.created_at
        except Message.DoesNotExist:
            message = None
            activated = False
            created_at = code.created_at

        codes_data.append({
            "code": code.code,
            "is_active": code.is_active,
            "activated": activated,
            "created_at": code.created_at,
            "message_created_at": message.created_at if message else None,
            "message_id": message.id if message else None,
            "title": message.title if message else None,
        })

        # Stats por mes
        month_key = created_at.strftime("%Y-%m")
        if activated:
            stats_activated[month_key] += 1
        else:
            stats_inactive[month_key] += 1

    # Responder
    return Response({
        "codes": codes_data,
        "stats": {
            "activated": stats_activated,
            "inactive": stats_inactive,
        }
    })
