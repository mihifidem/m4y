from django.core.mail import send_mail

def notify_message_read(message):
    """Envía notificación solo la primera vez que el mensaje se lee."""
    if message.views_count > 1:
        # 👀 Ya se leyó antes, no notificar de nuevo
        return

    subject = f"Tu mensaje ha sido leído 🎉"
    body = f"""
Hola 👋

El mensaje asociado al código {message.code.code} ha sido leído por el destinatario.

Texto del mensaje: {message.text or '(sin texto)'}

Gracias por usar Notodosonflores 💐
"""
    send_mail(subject, body, "no-reply@notodosonflores.com", [message.buyer_email])
    print(f"✅ Notificación enviada a {message.buyer_email}")
