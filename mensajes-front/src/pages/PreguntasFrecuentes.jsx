import { useState } from "react";

const faqs = [
  {
    pregunta: "¿Qué es este servicio de mensajes para regalos?",
    respuesta: "Es una plataforma que permite añadir mensajes personalizados (texto, audio o video) a regalos físicos mediante códigos QR o etiquetas NFC.",
  },
  {
    pregunta: "¿Cómo accede el destinatario al mensaje?",
    respuesta: "Solo debe escanear el código QR o acercar su móvil a la etiqueta NFC del regalo para ver el mensaje, sin apps ni registros.",
  },
  {
    pregunta: "¿Puedo grabar un mensaje de audio o video?",
    respuesta: "Sí, puedes grabar mensajes de texto, audio o video desde la plataforma al crear tu mensaje para el regalo.",
  },
  {
    pregunta: "¿El mensaje es privado?",
    respuesta: "Sí, solo la persona que recibe el regalo puede acceder al mensaje, y este se elimina automáticamente tras ser visto.",
  },
  {
    pregunta: "¿Cuánto tiempo está disponible el mensaje?",
    respuesta: "El mensaje está disponible hasta que el destinatario lo visualiza por primera vez. Después, se elimina por seguridad y privacidad.",
  },
  {
    pregunta: "¿Necesito instalar alguna app?",
    respuesta: "No, todo funciona desde el navegador del móvil o PC, sin necesidad de instalar aplicaciones ni crear cuentas adicionales.",
  },
  {
    pregunta: "¿Qué pasa si pierdo el código del regalo?",
    respuesta: "Por seguridad, solo quien tiene el código puede acceder al mensaje. Si se pierde, el mensaje no podrá recuperarse.",
  },
  {
    pregunta: "¿Puedo reutilizar la tarjeta QR o etiqueta NFC?",
    respuesta: "Sí, puedes reutilizarlas para nuevos mensajes una vez que el anterior haya sido visualizado y eliminado.",
  },
  {
    pregunta: "¿Qué tipos de regalos son compatibles?",
    respuesta: "Cualquier regalo físico al que puedas añadir una tarjeta QR o etiqueta NFC: flores, cajas, peluches, botellas, etc.",
  },
  {
    pregunta: "¿Cómo contacto con soporte si tengo problemas?",
    respuesta: "Puedes usar el formulario de soporte en el footer o escribir a soporte@weme.com para recibir ayuda personalizada.",
  },
];

export default function PreguntasFrecuentes() {
  const [faqActiva, setFaqActiva] = useState(null);

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10 animate-fade-in-up">
      <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-3xl shadow-xl p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-yellow-700 mb-6 flex items-center justify-center gap-3">
          <span className="text-4xl">❓</span>
          Preguntas frecuentes
        </h1>
        <ul className="divide-y divide-yellow-200">
          {faqs.map((faq, idx) => (
            <li key={idx} className="py-4">
              <button
                className="w-full text-left font-semibold text-yellow-800 flex justify-between items-center focus:outline-none"
                onClick={() => setFaqActiva(faqActiva === idx ? null : idx)}
              >
                {faq.pregunta}
                <span className="ml-2">{faqActiva === idx ? "−" : "+"}</span>
              </button>
              {faqActiva === idx && (
                <div className="mt-2 text-yellow-700 text-base animate-fade-in-up">{faq.respuesta}</div>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center text-gray-500 text-sm">
          ¿No encuentras tu respuesta? <a href="/contacto-soporte" className="text-yellow-600 underline hover:text-yellow-800">Contacta soporte</a>.
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.7s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
}
