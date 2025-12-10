import { Link, useLocation } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

export default function ErrorPage() {
  const location = useLocation();
  const audioRef = useRef(null);
  const [play, setPlay] = useState(true);

  // El mensaje puede venir desde navigate('/error', { state: { msg: "..." } })
  const msg = location.state?.msg || "Ha ocurrido un error inesperado.";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-rose-50 overflow-hidden">

      {/* Fondo floral */}
      <div className="absolute inset-0 bg-[url('/f1.jpg')] opacity-20 bg-cover"></div>

      <div className="relative bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center animate-fadeIn">

        {/* Ilustración */}
        <img
          src="/f3.png"
          alt="Error floral"
          className="mx-auto mb-6 w-40 drop-shadow-lg animate-bounce-slow"
        />

        <h1 className="text-3xl font-bold text-rose-600 mb-4">🌸 Oops…</h1>

        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
          {msg}
        </p>

        {/* BOTONES */}
        <div className="flex flex-col gap-3">

          <Link
            to="/"
            className="w-full bg-rose-600 text-white p-3 rounded-xl font-semibold shadow hover:bg-rose-700"
          >
            ⬅ Volver a inicio
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-semibold shadow hover:bg-gray-300"
          >
            🔙 Página anterior
          </button>

          <button
            onClick={() => {
              setPlay(!play);
              if (play) audioRef.current.pause();
              else audioRef.current.play();
            }}
            className="mt-2 bg-purple-500 text-white p-2 rounded-xl shadow hover:bg-purple-600"
          >
            {play ? "🔇 Detener música" : "🎶 Reproducir música"}
          </button>
        </div>

        {/* Música ambiente */}
        <audio
          ref={audioRef}
          src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_c3bbdec390.mp3?filename=romantic-melody-11229.mp3"
        />

      </div>

      {/* Animaciones */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .animate-bounce-slow {
            animation: bounceSlow 3s infinite ease-in-out;
          }

          @keyframes bounceSlow {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-10px); }
          }
        `}
      </style>
    </div>
  );
}
