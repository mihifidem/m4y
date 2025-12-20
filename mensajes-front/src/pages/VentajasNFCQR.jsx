export default function VentajasNFCQR() {
  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10 animate-fade-in-up">
      <div className="bg-gradient-to-br from-green-50 to-blue-100 rounded-3xl shadow-xl p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-green-700 mb-6 flex items-center justify-center gap-3">
          <span className="text-4xl">📲</span>
          Ventajas de NFC y QR
        </h1>
        <ul className="list-disc list-inside text-lg text-gray-700 mb-6 space-y-4">
          <li>
            <span className="font-bold text-green-600">Acceso instantáneo:</span> El destinatario puede ver el mensaje al instante, solo escaneando el QR o acercando el móvil a la etiqueta NFC.
          </li>
          <li>
            <span className="font-bold text-green-600">Sin apps ni registros:</span> No es necesario instalar nada ni crear cuentas. Todo funciona desde el navegador.
          </li>
          <li>
            <span className="font-bold text-green-600">Compatibilidad universal:</span> Funciona en la mayoría de smartphones modernos, tanto Android como iPhone.
          </li>
          <li>
            <span className="font-bold text-green-600">Privacidad y seguridad:</span> Solo quien tiene el regalo accede al mensaje, que se elimina tras ser visto.
          </li>
          <li>
            <span className="font-bold text-green-600">Experiencia innovadora:</span> Sorprende y emociona con tecnología moderna integrada en un regalo tradicional.
          </li>
          <li>
            <span className="font-bold text-green-600">Ecológico y reutilizable:</span> Las etiquetas NFC y tarjetas QR pueden reutilizarse o reciclarse, reduciendo residuos.
          </li>
        </ul>
        <div className="flex flex-col sm:flex-row gap-6 mt-8 justify-center">
          {/* Ejemplo visual QR */}
          <div className="flex-1 bg-white/70 rounded-xl p-4 shadow text-center flex flex-col items-center">
            <svg width="64" height="64" viewBox="0 0 64 64" className="mb-2"><rect width="64" height="64" rx="12" fill="#e0e7ff"/><rect x="10" y="10" width="16" height="16" rx="3" fill="#10b981"/><rect x="38" y="10" width="16" height="16" rx="3" fill="#10b981"/><rect x="10" y="38" width="16" height="16" rx="3" fill="#10b981"/><rect x="38" y="38" width="6" height="6" rx="1" fill="#10b981"/><rect x="48" y="48" width="6" height="6" rx="1" fill="#10b981"/><rect x="38" y="48" width="6" height="6" rx="1" fill="#6366f1"/><rect x="48" y="38" width="6" height="6" rx="1" fill="#6366f1"/></svg>
            <div className="font-semibold mt-2">Escaneo QR</div>
            <div className="text-gray-600 text-sm">Escanea el código QR con la cámara del móvil para acceder al mensaje.</div>
          </div>
          {/* Ejemplo visual NFC */}
          <div className="flex-1 bg-white/70 rounded-xl p-4 shadow text-center flex flex-col items-center">
            <svg width="64" height="64" viewBox="0 0 64 64" className="mb-2"><rect width="64" height="64" rx="12" fill="#d1fae5"/><circle cx="32" cy="32" r="18" fill="#10b981" opacity="0.2"/><circle cx="32" cy="32" r="12" fill="#10b981" opacity="0.4"/><circle cx="32" cy="32" r="6" fill="#10b981"/><rect x="28" y="20" width="8" height="24" rx="4" fill="#6366f1"/></svg>
            <div className="font-semibold mt-2">Etiqueta NFC</div>
            <div className="text-gray-600 text-sm">Acerca el móvil a la etiqueta NFC para abrir el mensaje automáticamente.</div>
          </div>
        </div>
        <div className="mt-10 text-center text-gray-500 text-sm">
          ¿Tienes dudas? Consulta nuestras <a href="/instrucciones/ver" className="text-green-600 underline hover:text-green-800">instrucciones</a> o <a href="/contacto-soporte" className="text-green-600 underline hover:text-green-800">contacta soporte</a>.
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
