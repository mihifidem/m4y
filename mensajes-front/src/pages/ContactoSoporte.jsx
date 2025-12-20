import { useState } from "react";

const faqs = [
  {
    pregunta: "¿Cómo recupero mi contraseña?",
    respuesta: "Haz clic en 'Acceder a mi cuenta', luego en '¿Olvidaste tu contraseña?' y sigue las instrucciones para restablecerla.",
  },
  {
    pregunta: "¿Por qué no recibo los mensajes?",
    respuesta: "Verifica tu conexión a internet y revisa la carpeta de spam en tu correo. Si el problema persiste, contacta soporte.",
  },
  {
    pregunta: "¿Cómo cambio mi correo electrónico?",
    respuesta: "Accede a tu cuenta, ve a 'Mi perfil' y actualiza tu correo electrónico desde allí.",
  },
  {
    pregunta: "¿Puedo eliminar mi cuenta?",
    respuesta: "Sí, solicita la eliminación de tu cuenta escribiendo a soporte@weme.com desde el correo registrado.",
  },
];

export default function ContactoSoporte() {
  const [faqActiva, setFaqActiva] = useState(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleFaqClick = idx => setFaqActiva(faqActiva === idx ? null : idx);

  const handleSubmit = e => {
    e.preventDefault();
    if (!nombre || !email || !mensaje) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }
    setEnviado(true);
    setError("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-10 animate-fade-in-up">
      <div className="bg-gradient-to-br from-gray-50 to-gray-200 rounded-3xl shadow-xl p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-700 mb-6 flex items-center justify-center gap-3">
          <span className="text-4xl">💬</span>
          Contacto soporte
        </h1>
        <h2 className="text-xl font-bold text-gray-600 mb-4">Preguntas frecuentes</h2>
        <ul className="divide-y divide-gray-300 mb-8">
          {faqs.map((faq, idx) => (
            <li key={idx} className="py-3">
              <button
                className="w-full text-left font-medium text-purple-700 hover:text-purple-900 flex justify-between items-center"
                onClick={() => handleFaqClick(idx)}
              >
                {faq.pregunta}
                <span>{faqActiva === idx ? "−" : "+"}</span>
              </button>
              {faqActiva === idx && (
                <div className="mt-2 text-gray-700 text-sm animate-fade-in-up">{faq.respuesta}</div>
              )}
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-300 pt-4 mt-4">
          <h4 className="text-lg font-bold text-purple-700 mb-2 flex items-center gap-2">
            <span>📧</span> Formulario de contacto
          </h4>
          {enviado ? (
            <div className="text-green-600 font-semibold py-4">¡Mensaje enviado! Te responderemos pronto.</div>
          ) : (
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold mb-1">Nombre *</label>
                <input type="text" className="w-full p-2 rounded bg-gray-100 border border-gray-300" value={nombre} onChange={e => setNombre(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email *</label>
                <input type="email" className="w-full p-2 rounded bg-gray-100 border border-gray-300" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Mensaje *</label>
                <textarea className="w-full p-2 rounded bg-gray-100 border border-gray-300 min-h-24" value={mensaje} onChange={e => setMensaje(e.target.value)} required />
              </div>
              {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
              <button type="submit" className="w-full py-2 rounded bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all">Enviar a soporte</button>
            </form>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
}
