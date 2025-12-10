import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="w-full bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 backdrop-blur-lg border-b-2 border-rose-200 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex items-center justify-between">
        {/* Logo con animación */}
        <Link 
          to="/" 
          className="group flex items-center gap-2 sm:gap-3 font-bold text-lg sm:text-xl md:text-2xl hover:scale-110 transition-all duration-300"
        >
          <span className="text-2xl sm:text-3xl group-hover:rotate-12 transition-transform duration-300">🎁</span>
          <span className="hidden sm:inline relative">
            {/* Badge de notificación - número que se transforma */}
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg group-hover:hidden z-10 animate-pulse">
              1
            </span>
            
            {/* Corazón sorpresa que aparece al hover */}
            <span className="absolute -top-3 -right-3 w-8 h-8 hidden group-hover:flex items-center justify-center z-20 animate-heartBurst">
              <svg className="w-full h-full" viewBox="0 0 30 30" fill="none">
                <defs>
                  <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#ff0080', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: '#ff4444', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#ffaa00', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <path 
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                  fill="url(#heartGradient)"
                  className="animate-heartPulse"
                />
              </svg>
            </span>
            
            {/* Partículas de estrellas y corazones que explotan */}
            
            
            <span className="bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient group-hover:opacity-0 transition-opacity duration-300">Mensaje</span>
            <span className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">para Ti</span>
          </span>
        </Link>

        {/* Enlaces principales */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link 
            to="/" 
            onClick={() => window.location.href = '/'}
            className={`px-2 sm:px-3 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              isActive("/") && location.pathname === "/"
                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md"
                : "text-gray-700 hover:bg-white hover:text-rose-600"
            }`}
          >
            Home
          </Link>
          <Link 
            to="/" 
            className={`px-2 sm:px-3 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              isActive("/create-message")
                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md"
                : "text-gray-700 hover:bg-white hover:text-rose-600"
            }`}
          >
            Crear
          </Link>
          <Link 
            to="/view-message" 
            className={`px-2 sm:px-3 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              isActive("/view-message") || isActive("/view/")
                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md"
                : "text-gray-700 hover:bg-white hover:text-rose-600"
            }`}
          >
            Ver
          </Link>
        </div>

        {/* Botón de acceso para comercios / Usuario logueado */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Usuario logueado */}
              <Link 
                to="/account" 
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs sm:text-sm hidden sm:inline">{user.email?.split('@')[0]}</span>
              </Link>
              
              {/* Botón Logout */}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-xs sm:text-sm hidden sm:inline">Salir</span>
              </button>
            </>
          ) : (
            /* Botón de login cuando no está autenticado */
            <Link 
              to="/login" 
              className="flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs sm:text-sm md:text-base">Comercios</span>
            </Link>
          )}
        </div>
      </div>
      {/* Botón flotante FAQs en la esquina inferior izquierda */}
      {/* Botón FAQs eliminado del Navbar */}
      
      {/* Animaciones sorprendentes */}
      <style>{`
        @keyframes heartBurst {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.3) rotate(180deg); opacity: 1; }
          100% { transform: scale(1) rotate(360deg); opacity: 1; }
        }
        
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.2); }
          50% { transform: scale(1.1); }
          75% { transform: scale(1.15); }
        }
        
        @keyframes particle1 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(-35px, -40px) scale(1.5) rotate(360deg); opacity: 0; }
        }
        @keyframes particle2 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(40px, -35px) scale(1.5) rotate(-360deg); opacity: 0; }
        }
        @keyframes particle3 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(-45px, 10px) scale(1.5) rotate(540deg); opacity: 0; }
        }
        @keyframes particle4 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(45px, 15px) scale(1.5) rotate(-540deg); opacity: 0; }
        }
        @keyframes particle5 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(-25px, 45px) scale(1.5) rotate(720deg); opacity: 0; }
        }
        @keyframes particle6 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(30px, 40px) scale(1.5) rotate(-720deg); opacity: 0; }
        }
        @keyframes particle7 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(-15px, -50px) scale(1.5) rotate(180deg); opacity: 0; }
        }
        @keyframes particle8 {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(20px, -45px) scale(1.5) rotate(-180deg); opacity: 0; }
        }
        
        .animate-heartBurst { animation: heartBurst 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
        .animate-heartPulse { animation: heartPulse 1s ease-in-out infinite; }
        .animate-particle1 { animation: particle1 1s ease-out forwards; }
        .animate-particle2 { animation: particle2 1s ease-out forwards; }
        .animate-particle3 { animation: particle3 1s ease-out forwards; }
        .animate-particle4 { animation: particle4 1s ease-out forwards; }
        .animate-particle5 { animation: particle5 1s ease-out forwards; }
        .animate-particle6 { animation: particle6 1s ease-out forwards; }
        .animate-particle7 { animation: particle7 1s ease-out forwards; }
        .animate-particle8 { animation: particle8 1s ease-out forwards; }
      `}</style>
    </nav>
  );
}