export default function ComoFunciona() {
  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10 animate-fade-in-up">
      <div className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-3xl shadow-xl p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-700 mb-6 flex items-center justify-center gap-3">
          <span className="text-4xl">🔗</span>
          ¿Cómo funciona?
        </h1>
        <ol className="list-decimal list-inside text-lg text-gray-700 mb-6 space-y-4">
          <li>
            <span className="font-bold text-blue-600">Elige tu regalo físico</span> y añade una tarjeta con QR o etiqueta NFC proporcionada por el establecimiento.
          </li>
          <li>
            <span className="font-bold text-blue-600">Crea tu mensaje personalizado</span> (texto, audio o video) en nuestra plataforma, usando el código único de la tarjeta.
          </li>
          <li>
            <span className="font-bold text-blue-600">Entrega el regalo</span> a la persona especial. El mensaje queda protegido y solo podrá verse una vez.
          </li>
          <li>
            <span className="font-bold text-blue-600">El destinatario escanea el QR o acerca su móvil</span> a la etiqueta NFC y accede al mensaje multimedia, sin apps ni registros.
          </li>
          <li>
            <span className="font-bold text-blue-600">¡Emoción garantizada!</span> El mensaje se autodestruye tras ser visto, asegurando privacidad y sorpresa.
          </li>
        </ol>
        <div className="flex flex-col sm:flex-row gap-6 mt-8 justify-center">
          <div className="flex-1 bg-white/70 rounded-xl p-4 shadow text-center">
            <span className="text-2xl">📱</span>
            <div className="font-semibold mt-2">Sin apps ni registros</div>
            <div className="text-gray-600 text-sm">Solo necesitas tu móvil y el código del regalo.</div>
          </div>
          <div className="flex-1 bg-white/70 rounded-xl p-4 shadow text-center">
            <span className="text-2xl">🔒</span>
            <div className="font-semibold mt-2">Privacidad total</div>
            <div className="text-gray-600 text-sm">El mensaje solo lo ve el destinatario y se elimina tras abrirlo.</div>
          </div>
        </div>
        <div className="mt-10 text-center text-gray-500 text-sm">
          ¿Tienes dudas? Consulta nuestras <a href="/instrucciones/ver" className="text-blue-600 underline hover:text-blue-800">instrucciones</a> o <a href="/contacto-soporte" className="text-blue-600 underline hover:text-blue-800">contacta soporte</a>.
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
