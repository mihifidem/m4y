export default function TerminosServicio() {
  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10 animate-fade-in-up">
      <div className="bg-gradient-to-br from-gray-50 to-gray-200 rounded-3xl shadow-xl p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-700 mb-6 flex items-center justify-center gap-3">
          <span className="text-4xl">📋</span>
          Términos de Servicio
        </h1>
        <div className="space-y-6 text-gray-700 text-base">
          <p><strong>1. Objeto:</strong> El servicio permite añadir mensajes personalizados a regalos físicos mediante QR o NFC, facilitando la comunicación entre remitente y destinatario.</p>
          <p><strong>2. Condiciones de uso:</strong> El usuario se compromete a utilizar el servicio conforme a la ley, la moral y el orden público. Está prohibido enviar contenido ilegal, ofensivo, difamatorio, violento o que vulnere derechos de terceros.</p>
          <p><strong>3. Eliminación de mensajes:</strong> Los mensajes y datos asociados se eliminan automáticamente tras ser visualizados por el destinatario, salvo obligación legal de conservación.</p>
          <p><strong>4. Propiedad intelectual:</strong> El usuario garantiza que posee los derechos necesarios sobre los contenidos enviados y autoriza a WeMe el uso estrictamente necesario para prestar el servicio.</p>
          <p><strong>5. Limitación de responsabilidad:</strong> WeMe no se responsabiliza del uso indebido del servicio, ni de los daños derivados de la imposibilidad de acceso, errores en los datos o problemas técnicos ajenos a su control.</p>
          <p><strong>6. Modificaciones:</strong> WeMe se reserva el derecho de modificar estos términos en cualquier momento. Los cambios se comunicarán en la web y serán efectivos desde su publicación.</p>
          <p><strong>7. Suspensión del servicio:</strong> WeMe podrá suspender temporal o definitivamente el servicio por motivos técnicos, legales o de seguridad, informando a los usuarios en la medida de lo posible.</p>
          <p><strong>8. Jurisdicción:</strong> Estos términos se rigen por la legislación española y cualquier controversia se someterá a los juzgados de Barcelona, salvo que la ley disponga otra cosa.</p>
          <p><strong>9. Contacto:</strong> Para cualquier duda, escribe a soporte@weme.com.</p>
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
