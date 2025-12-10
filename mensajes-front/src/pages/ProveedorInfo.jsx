import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ProveedorInfo() {
  const navigate = useNavigate();
  const [proveedor, setProveedor] = useState(null);
  const [prefix, setPrefix] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    
    const prefixUpper = prefix.toUpperCase().slice(0, 4);
    if (prefixUpper.length !== 4) {
      setError("El prefijo debe tener 4 letras");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await api.get(`/proveedor/${prefixUpper}/`);
      setProveedor(res.data);
    } catch (err) {
      setError("No se pudo cargar la información del proveedor");
      setProveedor(null);
    }

    setLoading(false);
  };

  const backgroundStyle = proveedor?.background_image 
    ? {
        backgroundImage: `url(${proveedor.background_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {};

  const bgClass = proveedor?.background_image ? '' : (proveedor?.background_class || 'bg-gray-50');

  return (
    <div className={`min-h-screen ${bgClass} relative overflow-hidden`} style={backgroundStyle}>
      {/* Overlay si hay imagen de fondo */}
      {proveedor?.background_image && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      )}

      {/* Burbujas animadas */}
      {!proveedor?.background_image && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-64 h-64 bg-gradient-to-br from-rose-300 to-pink-400 rounded-full opacity-20 blur-3xl animate-float-slow -top-20 -left-20"></div>
          <div className="absolute w-96 h-96 bg-gradient-to-br from-purple-300 to-blue-400 rounded-full opacity-15 blur-3xl animate-float-medium top-1/3 -right-32"></div>
          <div className="absolute w-80 h-80 bg-gradient-to-br from-rose-400 to-orange-300 rounded-full opacity-10 blur-3xl animate-float-fast bottom-0 left-1/4"></div>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Buscador de proveedor */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gray-200">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-6 text-center animate-gradient">
              🏪 Información del Proveedor
            </h1>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Prefijo del código (4 letras)
                </label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4))}
                  maxLength={4}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl text-center uppercase font-bold text-2xl shadow-md focus:border-rose-500 focus:ring-4 focus:ring-rose-200 transition-all duration-300"
                  placeholder="NTSF"
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center animate-shake">⚠️ {error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                {loading ? "🔄 Buscando..." : "🔍 Buscar Proveedor"}
              </button>
            </form>
          </div>
        </div>

        {/* Información del proveedor */}
        {proveedor && (
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-gray-200">
              {/* Header */}
              <div className="text-center mb-8 pb-6 border-b border-gray-200">
                <h2 className="text-4xl font-bold text-gray-800 mb-2">
                  {proveedor.comercial_name || proveedor.name}
                </h2>
                <p className="text-lg text-gray-600">Código: {proveedor.prefix}</p>
              </div>

              {/* Bio */}
              {proveedor.bio && (
                <div className="mb-8 p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl">
                  <p className="text-gray-700 text-lg leading-relaxed">{proveedor.bio}</p>
                </div>
              )}

              {/* Información de contacto */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {proveedor.address && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <span className="text-2xl">📍</span>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Dirección</h3>
                      <p className="text-gray-600">{proveedor.address}</p>
                    </div>
                  </div>
                )}

                {proveedor.phone && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <span className="text-2xl">📞</span>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Teléfono</h3>
                      <a href={`tel:${proveedor.phone}`} className="text-rose-600 hover:text-rose-700 font-medium">
                        {proveedor.phone}
                      </a>
                    </div>
                  </div>
                )}

                {proveedor.email && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <span className="text-2xl">📧</span>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                      <a href={`mailto:${proveedor.email}`} className="text-rose-600 hover:text-rose-700 font-medium">
                        {proveedor.email}
                      </a>
                    </div>
                  </div>
                )}

                {proveedor.website && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <span className="text-2xl">🌐</span>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Sitio Web</h3>
                      <a href={proveedor.website} target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:text-rose-700 font-medium">
                        Visitar sitio
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Redes sociales */}
              {(proveedor.facebook || proveedor.instagram || proveedor.twitter || proveedor.linkedin || proveedor.tiktok) && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Síguenos en redes sociales</h3>
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    {proveedor.facebook && (
                      <a href={proveedor.facebook} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                        <span className="text-2xl">📘</span>
                      </a>
                    )}
                    {proveedor.instagram && (
                      <a href={proveedor.instagram} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                        <span className="text-2xl">📷</span>
                      </a>
                    )}
                    {proveedor.twitter && (
                      <a href={proveedor.twitter} target="_blank" rel="noopener noreferrer" className="bg-sky-500 hover:bg-sky-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                        <span className="text-2xl">🐦</span>
                      </a>
                    )}
                    {proveedor.linkedin && (
                      <a href={proveedor.linkedin} target="_blank" rel="noopener noreferrer" className="bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                        <span className="text-2xl">💼</span>
                      </a>
                    )}
                    {proveedor.tiktok && (
                      <a href={proveedor.tiktok} target="_blank" rel="noopener noreferrer" className="bg-black hover:bg-gray-900 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                        <span className="text-2xl">🎵</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Botón volver */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate("/")}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  ← Volver al inicio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animaciones CSS */}
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
