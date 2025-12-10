import { Link, useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

export default function ExpiredMessage() {
  const { code } = useParams();
  const audioRef = useRef(null);
  const [play, setPlay] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">

      {/* Fondo de flores marchitas */}
      <div className="absolute inset-0 bg-[url('/f1.jpg')] opacity-30 bg-cover blur-sm"></div>

      {/* Contenedor */}
      <div className="relative bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl max-w-lg w-full animate-fadeIn text-center border border-gray-200">

        {/* Imagen de flores marchitas */}
        <img
          src="/f2.png"
          alt="Flores marchitas"
          className="mx-auto w-40 mb-6 opacity-90 animate-sadBounce"
        />

        <h1 className="text-3xl font-bold text-gray-700 mb-4 drop-shadow">
          🌙 El mensaje ha expirado
        </h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          Este mensaje ya no está disponible.  
          Puede que haya alcanzado su límite de vistas o haya pasado su fecha de expiración.
        </p>

        <div className="flex flex-col gap-3">

          <Link
            to="/"
            className="bg-rose-600 text-white p-3 rounded-xl shadow hover:bg-rose-700 font-semibold"
          >
            ⬅ Volver al inicio
          </Link>

          <Link
            to={`/error`}
            state={{ msg: "Lo sentimos pero puede ser que su mensaje se haya caducado. De todas formas puede contactar con nosotros y verificaremos su mensaje." }}
            className="bg-gray-200 text-gray-700 p-3 rounded-xl shadow hover:bg-gray-300 font-semibold"
          >
            💬 ¿Qué puedo hacer?
          </Link>

          <button
            onClick={() => {
              setPlay(!play);
              if (play) audioRef.current.pause();
              else audioRef.current.play();
            }}
            className="mt-3 bg-purple-500 text-white px-4 py-2 rounded-xl shadow hover:bg-purple-600"
          >
            {play ? "🔇 Detener música" : "🎶 Reproducir música"}
          </button>
        </div>

        {/* Música suave triste */}
        <audio
          ref={audioRef}
          src="https://cdn.pixabay.com/download/audio/2022/10/22/audio_d1db564832.mp3?filename=sad-romantic-piano-122194.mp3"
        />
      </div>

      {/* Animaciones */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.9s ease-out forwards;
        }
        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(20px);}
          to {opacity: 1; transform: translateY(0);}
        }

        .animate-sadBounce {
          animation: sadBounce 4s infinite ease-in-out;
        }
        @keyframes sadBounce {
          0%, 100% { transform: translateY(0); opacity: 0.9; }
          50%      { transform: translateY(-8px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
