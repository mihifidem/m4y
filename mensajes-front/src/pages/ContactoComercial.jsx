import { useState } from "react";

export default function ContactoComercial() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !email || !mensaje) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }
    // Aquí podrías enviar los datos a una API o servicio de correo
    setEnviado(true);
    setError("");
  };

  return (
    <div className="max-w-lg mx-auto p-6 sm:p-10 animate-fade-in-up">
      <div className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-3xl shadow-xl p-8 sm:p-12">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-purple-700 mb-6 flex items-center justify-center gap-3">
          <span className="text-3xl">📧</span>
          Contacto Comercial
        </h1>
        {enviado ? (
          <div className="text-center text-green-600 font-bold text-lg py-8">
            ¡Gracias por tu mensaje!<br />Nos pondremos en contacto contigo pronto.
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Nombre *</label>
              <input type="text" className="w-full p-3 border-2 rounded-xl" value={nombre} onChange={e => setNombre(e.target.value)} required />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Email *</label>
              <input type="email" className="w-full p-3 border-2 rounded-xl" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Empresa</label>
              <input type="text" className="w-full p-3 border-2 rounded-xl" value={empresa} onChange={e => setEmpresa(e.target.value)} />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Mensaje *</label>
              <textarea className="w-full p-3 border-2 rounded-xl min-h-32" value={mensaje} onChange={e => setMensaje(e.target.value)} required />
            </div>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <button type="submit" className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition-all">Enviar mensaje</button>
          </form>
        )}
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
