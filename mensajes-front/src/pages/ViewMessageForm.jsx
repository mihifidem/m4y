import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function ViewMessageForm() {
  const navigate = useNavigate();

  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  const [p4, setP4] = useState("");
  const composed = `${p1}-${p2}-${p3}-${p4}`;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState({
    background: "bg-gray-50",
    backgroundImage: null,
    primaryText: "text-gray-800",
    accent: "bg-gray-600",
    card: "bg-white",
  });

  useEffect(() => {
    const prefix = (p1 || "").toUpperCase();
    if (prefix.length === 4) {
      api.get(`/proveedor/${prefix}/`).then(res => {
        const d = res.data || {};
        setTheme({
          background: d.background_class || "bg-gray-50",
          backgroundImage: d.background_image || null,
          primaryText: d.primary_text_class || "text-gray-800",
          accent: d.accent_class || "bg-gray-600",
          card: d.card_class || "bg-white",
        });
      }).catch(() => {
        setTheme({
          background: "bg-gray-50",
          backgroundImage: null,
          primaryText: "text-gray-800",
          accent: "bg-gray-600",
          card: "bg-white",
        });
      });
    }
  }, [p1]);

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().toUpperCase();
    const parts = pasted.split("-");
    if (parts.length === 4) {
      setP1(parts[0].slice(0, 4));
      setP2(parts[1].slice(0, 3));
      setP3(parts[2].slice(0, 3));
      setP4(parts[3].slice(0, 3));
    }
  };

  const handleP1Change = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
    setP1(val);
    if (val.length === 4) document.getElementById("vp2")?.focus();
  };

  const handleP2Change = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
    setP2(val);
    if (val.length === 3) document.getElementById("vp3")?.focus();
  };

  const handleP3Change = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
    setP3(val);
    if (val.length === 3) document.getElementById("vp4")?.focus();
  };

  const handleP4Change = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
    setP4(val);
  };

  const handleView = (e) => {
    e.preventDefault();

    const regex = /^[A-Z]{4}-[0-9]{3}-[0-9]{3}-[A-Z]{3}$/;
    const finalCode = composed.toUpperCase();

    if (!regex.test(finalCode)) {
      setError("Formato inválido. Debe ser: ABCD-001-001-ABC");
      return;
    }

    setError("");
    setLoading(true);
    navigate(`/view/${finalCode}`);
  };

  const backgroundStyle = theme.backgroundImage 
    ? {
        backgroundImage: `url(${theme.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {};

  const bgClass = theme.backgroundImage ? '' : theme.background;

  return (
    <div className={`min-h-screen ${bgClass} p-6 flex justify-center items-center relative overflow-hidden`} style={backgroundStyle}>
      {/* Overlay si hay imagen de fondo */}
      {theme.backgroundImage && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      )}

      {/* Fondo animado con burbujas - solo si no hay imagen */}
      {!theme.backgroundImage && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-64 h-64 bg-gradient-to-br from-rose-300 to-pink-400 rounded-full opacity-20 blur-3xl animate-float-slow -top-20 -left-20"></div>
          <div className="absolute w-96 h-96 bg-gradient-to-br from-purple-300 to-blue-400 rounded-full opacity-15 blur-3xl animate-float-medium top-1/3 -right-32"></div>
          <div className="absolute w-80 h-80 bg-gradient-to-br from-rose-400 to-orange-300 rounded-full opacity-10 blur-3xl animate-float-fast bottom-0 left-1/4"></div>
        </div>
      )}

      <div className={`${theme.card} shadow-2xl rounded-3xl w-full max-w-2xl p-10 relative z-10 animate-fade-in-up border border-gray-100 mx-2 sm:mx-0`}>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
            🔍 Ver Mensaje
          </h1>
          <Link to="/instrucciones/ver" className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-300 text-sm font-medium">📖 Ver instrucciones</Link>
        </div>

        <p className="text-gray-600 mb-8 text-center text-lg">
          Introduce tu código para ver el mensaje especial que has recibido.
        </p>

        <form onSubmit={handleView} className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-inner">
            <label className="font-semibold text-gray-700 flex items-center gap-2 mb-4 text-lg">
              <span className="text-2xl">🎫</span>
              Código del mensaje
            </label>
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 justify-center">
              <input id="vp1" value={p1} onChange={handleP1Change} onPaste={handlePaste} maxLength={4} className="w-16 sm:w-20 md:w-24 lg:w-28 p-3 sm:p-4 border-2 border-gray-300 rounded-xl text-center uppercase font-bold text-lg sm:text-xl shadow-md focus:border-rose-500 focus:ring-4 focus:ring-rose-200 transition-all duration-300 hover:scale-105" placeholder="ABCD" />
              <span className="text-gray-400 text-xl sm:text-2xl font-bold">-</span>
              <input id="vp2" value={p2} onChange={handleP2Change} maxLength={3} className="w-14 sm:w-16 md:w-20 lg:w-24 p-3 sm:p-4 border-2 border-gray-300 rounded-xl text-center font-bold text-lg sm:text-xl shadow-md focus:border-rose-500 focus:ring-4 focus:ring-rose-200 transition-all duration-300 hover:scale-105" placeholder="001" />
              <span className="text-gray-400 text-xl sm:text-2xl font-bold">-</span>
              <input id="vp3" value={p3} onChange={handleP3Change} maxLength={3} className="w-14 sm:w-16 md:w-20 lg:w-24 p-3 sm:p-4 border-2 border-gray-300 rounded-xl text-center font-bold text-lg sm:text-xl shadow-md focus:border-rose-500 focus:ring-4 focus:ring-rose-200 transition-all duration-300 hover:scale-105" placeholder="001" />
              <span className="text-gray-400 text-xl sm:text-2xl font-bold">-</span>
              <input id="vp4" value={p4} onChange={handleP4Change} maxLength={3} className="w-16 sm:w-20 md:w-24 lg:w-28 p-3 sm:p-4 border-2 border-gray-300 rounded-xl text-center uppercase font-bold text-lg sm:text-xl shadow-md focus:border-rose-500 focus:ring-4 focus:ring-rose-200 transition-all duration-300 hover:scale-105" placeholder="ABC" />
            </div>
            <p className="mt-4 text-sm text-gray-500 text-center">📝 Formato: ABCD-001-001-ABC (puedes pegar el código completo)</p>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center animate-shake">⚠️ {error}</p>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 py-4 rounded-xl text-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            >
              ← Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              {loading ? "🔄 Cargando..." : "✨ Ver Mensaje →"}
            </button>
          </div>
        </form>
      </div>

      {/* ANIMACIONES CSS */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, -40px) scale(1.1); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-float-slow { animation: float-slow 20s infinite ease-in-out; }
        .animate-float-medium { animation: float-medium 15s infinite ease-in-out; }
        .animate-float-fast { animation: float-fast 10s infinite ease-in-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}
