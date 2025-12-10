import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import.meta.env


export default function ViewMessage() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [playMusic, setPlayMusic] = useState(false);
 const API_URL = import.meta.env.VITE_API_URL;

  const audioAmbientRef = useRef(null);

  // ======================================================
  // NFC READER
  // ======================================================
  useEffect(() => {
    if ("NDEFReader" in window) {
      console.log("NFC soportado.");
      readNFC();
    } else {
      console.warn("NFC no soportado.");
    }
  }, []);

  const readNFC = async () => {
    try {
      const reader = new window.NDEFReader();
      await reader.scan();

      reader.onreading = (event) => {
        const textDecoder = new TextDecoder();
        for (const record of event.message.records) {
          const decoded = textDecoder.decode(record.data);
          console.log("NFC detectado:", decoded);
        }
      };
    } catch (err) {
      console.error("Error leyendo NFC:", err);
    }
  };

  // ======================================================
  // CARGAR MENSAJE
  // ======================================================
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await api.get(`/message/${code}/`);
        setMessage(res.data);
        setExpired(res.data.expired);

        if (res.data.expired) {
          navigate(`/expired/${code}`);
          return;
        }
      } catch (err) {
        console.error(err);
        setError("No se encontró el mensaje o hubo un error.");
      }

      setLoading(false);
    };

    fetchMessage();
  }, [code, navigate]);

  // ======================================================
  // MÚSICA AMBIENTAL
  // ======================================================
  useEffect(() => {
    if (playMusic && audioAmbientRef.current) {
      audioAmbientRef.current.volume = 0.3;
      audioAmbientRef.current.play().catch(() => { });
    } else if (audioAmbientRef.current) {
      audioAmbientRef.current.pause();
    }
  }, [playMusic]);

  // ======================================================
  // RENDER
  // ======================================================
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-rose-600 text-xl">
        Cargando mensaje...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-3 sm:p-4 md:p-6 flex justify-center bg-rose-50 overflow-hidden">

      {/* 🌸 Fondo floral animado */}
      <div
        className="absolute inset-0 opacity-20 bg-cover animate-pulse"
        style={{ backgroundImage: "url('/fd01jpg')" }}
      ></div>

      <div className="relative bg-white shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-3xl w-full animate-fadeIn">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 pb-4 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-rose-600">💌 Mensaje para ti</h1>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Link to="/instrucciones/ver" className="text-blue-600 hover:underline text-xs sm:text-sm whitespace-nowrap">Ver instrucciones</Link>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
            >
              ← Cancelar
            </button>
          </div>
        </div>

        {expired ? (
          <>
            {/* Fondo cuando expira */}
            <div
              className="absolute inset-0 opacity-30 bg-cover"
              style={{ backgroundImage: "url('/fd01.jpg')" }}
            ></div>

            <div className="relative text-center text-red-600 text-xl font-semibold p-10">
              ❌ Este mensaje ha expirado o alcanzó el número máximo de vistas.
            </div>
          </>
        ) : (
          <>
            {/* TEXTO */}
            {message.text && (
              <div className="bg-rose-100 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl mb-4 sm:mb-6 shadow">
                <p className="text-gray-800 whitespace-pre-line leading-relaxed text-sm sm:text-base md:text-lg">
                  {message.text}
                </p>
              </div>
            )}

            {/* VIDEO */}
            {message.video && (
              <video
                src={`${import.meta.env.VITE_API_URL}${message.video}`}

                controls
                className="w-full rounded-lg sm:rounded-xl shadow-lg mb-4 sm:mb-6"
              />
            )}

            {/* AUDIO */}
            {message.audio && (
              <div className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl shadow-md">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🎤</span>
                  Audio mensaje
                </h3>
                <audio
                  src={`${import.meta.env.VITE_API_URL}${message.audio}`}
                  controls
                  className="w-full rounded-lg sm:rounded-xl"
                ></audio>
              </div>
            )}

            {/* INFO */}
            <div className="bg-gray-100 p-3 sm:p-4 rounded-lg sm:rounded-xl mb-4 sm:mb-6 text-xs sm:text-sm">
              <p className="mb-1"><strong>Creado:</strong> {new Date(message.created_at).toLocaleString()}</p>
              <p className="mb-1"><strong>Expira:</strong> {message.expires_at ? new Date(message.expires_at).toLocaleString() : "Sin expiración"}</p>
              <p><strong>Vistas:</strong> {message.views_count}/{message.max_views}</p>
            </div>

            {/* RESPUESTAS */}
            <button
              onClick={() => navigate(`/reply/${code}`)}
              className="bg-rose-600 text-white w-full p-2.5 sm:p-3 md:p-3.5 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg font-semibold shadow hover:bg-rose-700 transition-all"
            >
              💬 Responder mensaje
            </button>

            {/* MÚSICA */}
            <button
              onClick={() => setPlayMusic(!playMusic)}
              className="mt-3 sm:mt-4 bg-purple-500 text-white w-full p-2.5 sm:p-3 md:p-3.5 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg shadow hover:bg-purple-600 transition-all"
            >
              {playMusic ? "🔇 Detener música" : "🎶 Música suave"}
            </button>

            {/* CANCELAR */}
            <button
              onClick={() => navigate("/")}
              className="mt-3 sm:mt-4 bg-gray-500 text-white w-full p-2.5 sm:p-3 md:p-3.5 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg shadow hover:bg-gray-600 transition-all"
            >
              ← Cancelar
            </button>

            <audio
              ref={audioAmbientRef}
              src="https://cdn.pixabay.com/download/audio/2021/09/14/audio_24a65e497986.mp3?filename=romantic-music-110695.mp3"
            />
          </>
        )}
      </div>

      {/* ANIMACIÓN */}
      <style>
        {`
      .animate-fadeIn {
        animation: fadeIn 0.8s ease-out forwards;
      }
      @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      `}
      </style>
    </div>
  );
}
