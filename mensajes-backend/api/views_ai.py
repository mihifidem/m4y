from openai import OpenAI
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import os

# Puedes usar settings.OPENAI_API_KEY o variable de entorno
client = OpenAI(api_key=settings.OPENAI_API_KEY)

@api_view(["POST"])
def ai_suggest(request):
    prompt = request.data.get("prompt", "")

    if not prompt:
        return Response({"error": "Prompt requerido."}, status=400)

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Eres experto en escribir mensajes románticos."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=150
        )

        text = completion.choices[0].message.content
        return Response({"text": text})

    except Exception as e:
        return Response({"error": str(e)}, status=500)
