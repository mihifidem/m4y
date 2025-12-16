from django.core.mail import send_mail

def notify_message_read(message):
    """Envía notificación solo la primera vez que el mensaje se lee."""
    if message.views_count > 1:
        # 👀 Ya se leyó antes, no notificar de nuevo
        return

    # Obtener email del creador del mensaje
    creator_email = None
    if message.user and message.user.email:
        creator_email = message.user.email
    if not creator_email:
        print("❌ No se pudo notificar: el mensaje no tiene creador con email.")
        return

    from django.utils import timezone
    now = timezone.now().strftime('%Y-%m-%d %H:%M:%S')

    subject = f"Tu mensaje ha sido visto 🎉"
    body = f"""
Hola 👋

El mensaje asociado al código {message.code.code} ha sido visto por el destinatario.

Fecha y hora de la primera visualización: {now}

Texto del mensaje: {message.text or '(sin texto)'}

Gracias por usar Notodosonflores 💐
"""
    send_mail(subject, body, "no-reply@notodosonflores.com", [creator_email])
    print(f"✅ Notificación enviada a {creator_email}")
