export default function QueOfrecemos() {
  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10 animate-fade-in-up">
      <div className="bg-gradient-to-br from-purple-50 to-blue-100 rounded-3xl shadow-xl p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-purple-700 mb-6 flex items-center justify-center gap-3">
          <span className="text-4xl">🎁</span>
          ¿Qué ofrecemos?
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Nuestro sistema permite añadir mensajes personalizados y multimedia a tus regalos físicos, creando una experiencia única y memorable para quien los recibe.
        </p>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <span className="text-2xl">💌</span>
            <div>
              <h2 className="font-bold text-purple-600">Mensajes personalizados</h2>
              <p className="text-gray-700">Cada regalo puede incluir un mensaje de texto, audio o video, grabado por el remitente y accesible solo por el destinatario.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-2xl">🔗</span>
            <div>
              <h2 className="font-bold text-purple-600">Acceso mediante QR o NFC</h2>
              <p className="text-gray-700">El destinatario escanea un código QR o acerca su móvil a una etiqueta NFC para ver su mensaje especial, sin apps ni registros.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-2xl">🔒</span>
            <div>
              <h2 className="font-bold text-purple-600">Privacidad y seguridad</h2>
              <p className="text-gray-700">Solo quien tiene el regalo puede acceder al mensaje. Los datos están protegidos y se eliminan automáticamente tras su visualización.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-2xl">✨</span>
            <div>
              <h2 className="font-bold text-purple-600">Emoción y sorpresa</h2>
              <p className="text-gray-700">Transforma un regalo tradicional en una experiencia digital emotiva, perfecta para cualquier ocasión especial.</p>
            </div>
          </div>
        </div>
        <div className="mt-10 text-center text-gray-500 text-sm">
          ¿Tienes dudas? Consulta nuestras <a href="/instrucciones/ver" className="text-purple-600 underline hover:text-purple-800">instrucciones</a> o <a href="/contacto-comercial" className="text-purple-600 underline hover:text-purple-800">contáctanos</a>.
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
