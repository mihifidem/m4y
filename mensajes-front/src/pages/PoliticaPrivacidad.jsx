export default function PoliticaPrivacidad() {
  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10 animate-fade-in-up">
      <div className="bg-gradient-to-br from-gray-50 to-gray-200 rounded-3xl shadow-xl p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-700 mb-6 flex items-center justify-center gap-3">
          <span className="text-4xl">🔒</span>
          Política de Privacidad
        </h1>
        <div className="space-y-6 text-gray-700 text-base">
          <p><strong>1. Responsable del tratamiento:</strong> WeMe - Mensajes con emoción. Contacto: soporte@weme.com</p>
          <p><strong>2. Datos recogidos:</strong> Recopilamos únicamente los datos necesarios para la prestación del servicio: nombre, correo electrónico y contenido de los mensajes. También se pueden recoger datos técnicos (IP, navegador, dispositivo) para fines de seguridad y funcionamiento.</p>
          <p><strong>3. Finalidad:</strong> Los datos se utilizan exclusivamente para gestionar los mensajes personalizados y la experiencia del usuario. No se ceden a terceros salvo obligación legal.</p>
          <p><strong>4. Conservación:</strong> Los mensajes y datos asociados se eliminan automáticamente tras ser visualizados por el destinatario, salvo que la ley exija su conservación por más tiempo.</p>
          <p><strong>5. Derechos del usuario:</strong> Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad enviando un correo a soporte@weme.com. Tienes derecho a reclamar ante la autoridad de control si consideras que tus derechos no han sido respetados.</p>
          <p><strong>6. Seguridad:</strong> Aplicamos medidas técnicas y organizativas apropiadas para proteger tus datos frente a accesos no autorizados, pérdida o alteración.</p>
          <p><strong>7. Cookies:</strong> Este sitio puede utilizar cookies técnicas para el funcionamiento básico y cookies analíticas anónimas para mejorar la experiencia. Puedes configurar tu navegador para bloquearlas si lo deseas.</p>
          <p><strong>8. Menores de edad:</strong> El servicio no está dirigido a menores de 14 años. Si eres menor, no envíes datos personales sin consentimiento de tus padres o tutores.</p>
          <p><strong>9. Cambios en la política:</strong> Nos reservamos el derecho de modificar esta política. Los cambios se comunicarán en la web y serán efectivos desde su publicación.</p>
          <p><strong>10. Jurisdicción:</strong> Esta política se rige por la legislación española y cualquier controversia se someterá a los juzgados de Barcelona, salvo que la ley disponga otra cosa.</p>
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
