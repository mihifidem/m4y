import React from "react";

export default function HomeInfo() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 border border-rose-200 animate-fade-in">
        <h1 className="text-4xl font-bold text-rose-600 mb-6 text-center">Bienvenido a NotodoSonFlores</h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Este sistema te permite crear mensajes personalizados para acompañar tus ramos de flores, grabar videos o audios, y compartirlos fácilmente con tus destinatarios.
        </p>
        <ul className="list-disc pl-6 mb-8 text-gray-700 text-base space-y-2">
          <li><b>CREAR:</b> Ingresa el código de tu ramo y crea un mensaje especial, con texto, video o audio.</li>
          <li><b>VER:</b> El destinatario puede ver el mensaje usando el mismo código, desde cualquier dispositivo.</li>
          <li><b>Privacidad:</b> Los mensajes tienen límite de vistas y expiración automática para mayor seguridad.</li>
        </ul>
        <div className="mb-8 flex justify-center">
          <div className="aspect-w-16 aspect-h-9 w-full max-w-xl">
            <iframe
              className="rounded-xl shadow-lg"
              width="560"
              height="315"
              src="https://www.youtube.com/embed/2Vv-BfVoq4g" // Cambia por tu video real
              title="Video explicativo NotodoSonFlores"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm">
          ¿Tienes dudas? Consulta las instrucciones o contacta a soporte.
        </div>
      </div>
    </div>
  );
}
