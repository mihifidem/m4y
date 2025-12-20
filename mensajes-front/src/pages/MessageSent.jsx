import { useParams, Link } from "react-router-dom";
import { useState } from "react";

export default function MessageSent() {
  const { code } = useParams();
  const [copied, setCopied] = useState(false);

  const url = `${window.location.origin}/view/${code}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-rose-50 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div
        className="absolute inset-0 opacity-30 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/fd01.jpg')" }}
      ></div>
      {/* Contenido */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-rose-200 animate-fade-in">

        <h1 className="text-3xl font-bold text-rose-600 mb-4">
          🎉 ¡Mensaje creado!
        </h1>

        <p className="text-gray-700 mb-4">
          Tu mensaje ha sido guardado correctamente.
        </p>

        <p className="text-gray-500 text-sm mb-6">
          Código asociado:
        </p>

        <p className="text-xl font-mono bg-gray-100 p-3 rounded-lg border">
          {code}
        </p>

        <div className="mt-6 space-y-4">

          {/* Ver mensaje */}
          <Link
            to={`/view/${code}`}
            state={{ justCreated: true }}
            className="block w-full bg-rose-500 text-white py-3 rounded-xl shadow hover:bg-rose-600 transition"
          >
            🌸 Ver mensaje
          </Link>

          {/* Copiar enlace */}
          <button
            onClick={copyToClipboard}
            className="block w-full bg-gray-100 py-3 rounded-xl shadow hover:bg-gray-200 transition"
          >
            {copied ? "✓ Enlace copiado" : "📋 Copiar enlace"}
          </button>
        </div>
        </div>
      </div>

      {/* Animación */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.7s forwards; }
      `}</style>
    </div>
  );
}
