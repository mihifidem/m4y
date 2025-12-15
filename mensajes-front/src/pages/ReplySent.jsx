import { useParams, Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

export default function ReplySent() {
  const { code } = useParams();
  const audioRef = useRef(null);
  const [play, setPlay] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-rose-50 overflow-hidden">

      {/* Fondo floral */}
      <div className="absolute inset-0 opacity-30 bg-cover bg-center z-0" style={{ backgroundImage: "url('/f1.jpg')" }}></div>

      {/* Contenido */}
      <div className="relative bg-white shadow-2xl rounded-3xl p-10 max-w-lg text-center animate-fadeIn">

        <h1 className="text-3xl font-bold text-rose-600 mb-4">
          💌 Respuesta enviada
        </h1>

        <p className="text-gray-700 text-lg mb-6">
          Tu respuesta ha sido enviada con éxito.<br />
          El remitente será notificado. 🌸
        </p>

        {/* Botón volver */}
        <Link
          to={`/view/${code}`}
          className="block bg-rose-600 text-white p-3 rounded-xl text-lg font-semibold shadow hover:bg-rose-700"
        >
          ⬅ Volver al mensaje
        </Link>

        {/* Música ambiental */}
        <button
          onClick={() => {
            setPlay(!play);
            if (play) audioRef.current.pause();
            else audioRef.current.play();
          }}
          className="mt-4 bg-purple-500 text-white w-full p-2 rounded-xl shadow hover:bg-purple-600"
        >
          {play ? "🔇 Detener música" : "🎶 Reproducir música"}
        </button>

        <audio
          ref={audioRef}
          src="https://cdn.pixabay.com/download/audio/2021/09/14/audio_24a65e497986.mp3?filename=romantic-music-110695.mp3"
        />
      </div>

      {/* Animación */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
