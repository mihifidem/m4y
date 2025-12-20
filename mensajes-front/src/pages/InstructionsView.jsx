export default function InstructionsView() {
  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-10 animate-fade-in-up">
      <div className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-3xl shadow-xl p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-purple-700 mb-6 flex items-center justify-center gap-3">
          <span className="text-4xl">📬</span>
          Cómo ver tu mensaje especial
        </h1>
        <ol className="space-y-8">
          <li className="flex items-start gap-4">
            <span className="text-3xl bg-white rounded-full shadow-lg p-3 border-2 border-blue-200">1</span>
            <div>
              <h2 className="font-bold text-lg text-blue-700 mb-1 flex items-center gap-2"><span>Introduce tu código</span> <span className="text-xl">🔑</span></h2>
              <p className="text-gray-700">Ingresa el código único que recibiste para acceder al mensaje. Puedes copiarlo y pegarlo en el campo correspondiente.</p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-3xl bg-white rounded-full shadow-lg p-3 border-2 border-purple-200">2</span>
            <div>
              <h2 className="font-bold text-lg text-purple-700 mb-1 flex items-center gap-2"><span>Disfruta tu mensaje</span> <span className="text-xl">💌</span></h2>
              <p className="text-gray-700">Verás el mensaje personalizado, que puede incluir texto, audio o video. ¡Tómate tu tiempo para disfrutarlo!</p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-3xl bg-white rounded-full shadow-lg p-3 border-2 border-pink-200">3</span>
            <div>
              <h2 className="font-bold text-lg text-pink-700 mb-1 flex items-center gap-2"><span>Recuerda los límites</span> <span className="text-xl">⏳</span></h2>
              <p className="text-gray-700">El mensaje puede tener un límite de vistas o de tiempo. Si expira, verás una notificación y ya no estará disponible.</p>
            </div>
          </li>
        </ol>
        <div className="mt-10 text-center">
          <span className="inline-block animate-bounce text-4xl">👇</span>
          <p className="mt-2 text-lg text-gray-600">¡Introduce tu código y vive la experiencia!</p>
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