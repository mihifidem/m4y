import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

export default function Landing() {
  const [errorCreate, setErrorCreate] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" });
  const navigate = useNavigate();

  const regex = /^[A-Z]{4}-[0-9]{3}-[0-9]{3}-[A-Z]{3}$/;

  // 4 campos simplificados para el código
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  const [p4, setP4] = useState("");
  const finalCode = `${p1}-${p2}-${p3}-${p4}`.toUpperCase();
  const [theme, setTheme] = useState({
    background: "bg-gray-50",
    backgroundImage: null,
    primaryText: "text-gray-800",
    secondaryText: "text-gray-600",
    accent: "bg-gray-600",
    card: "bg-white",
  });

  const [proveedorInfo, setProveedorInfo] = useState(null);
  const [proveedorError, setProveedorError] = useState("");
  const [messageCheck, setMessageCheck] = useState({ exists: false, expired: false, created_at: null });
  const [faqOpen, setFaqOpen] = useState(null);
  const [faqSidebarOpen, setFaqSidebarOpen] = useState(false);

  // Toggle global del botón FAQs del Navbar (sin cambiar URL)
  useEffect(() => {
    const handler = () => setFaqSidebarOpen((v) => !v);
    window.addEventListener("wemsg:toggle-faqs", handler);
    return () => window.removeEventListener("wemsg:toggle-faqs", handler);
  }, []);

  useEffect(() => {
    const prefix = p1.toUpperCase();
    if (prefix.length === 4) {
      api.get(`/proveedor/${prefix}/`).then(res => {
        const d = res.data || {};
        setTheme({
          background: d.background_class || "bg-gray-50",
          backgroundImage: d.background_image || null,
          primaryText: d.primary_text_class || "text-gray-800",
          secondaryText: d.secondary_text_class || "text-gray-600",
          accent: d.accent_class || "bg-gray-600",
          card: d.card_class || "bg-white",
        });
        setProveedorInfo(d);
        setProveedorError("");
      }).catch(() => {
        setTheme({
          background: "bg-gray-50",
          backgroundImage: null,
          primaryText: "text-gray-800",
          secondaryText: "text-gray-600",
          accent: "bg-gray-600",
          card: "bg-white",
        });
        setProveedorInfo(null);
        setProveedorError(`El proveedor "${prefix}" no existe`);
      });
    } else {
      setProveedorInfo(null);
      setProveedorError("");
    }
  }, [p1]);

  // Chequear si ya existe mensaje para el código completo usando peek (no incrementa vistas)
  useEffect(() => {
    if (proveedorInfo && regex.test(finalCode)) {
      api.get(`/message/${finalCode}/peek/`).then(res => {
        const d = res.data || {};
        const exists = d.exists !== false && !!d.created_at;
        setMessageCheck({
          exists,
          expired: !!d.expired,
          created_at: d.created_at || null,
        });
        if (exists && d.created_at) {
          const createdDate = new Date(d.created_at);
          const now = new Date();
          const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);
          const expiryDate = new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          const timeLeft = expiryDate - now;
          const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

          let timeMessage = '';
          if (daysDiff > 7) {
            timeMessage = '⚠️ El período de modificación ha expirado (más de 7 días).';
          } else if (daysLeft > 0) {
            timeMessage = `⏰ Tiempo restante para editar: ${daysLeft} día${daysLeft !== 1 ? 's' : ''} y ${hoursLeft} hora${hoursLeft !== 1 ? 's' : ''}`;
          } else if (hoursLeft > 0) {
            timeMessage = `⚠️ ¡Último día! Solo quedan ${hoursLeft} hora${hoursLeft !== 1 ? 's' : ''}`;
          } else {
            timeMessage = '⚠️ Menos de 1 hora restante para editar';
          }

          const createdDateStr = createdDate.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          setErrorCreate(
            `ℹ️ Este código ya tiene un mensaje creado.\n\n` +
            `📅 Fecha de creación: ${createdDateStr}\n` +
            `${timeMessage}\n\n` +
            `Usa los botones para modificar o borrar el mensaje.`
          );
        } else {
          // limpiar info si no existe
          if (errorCreate.startsWith('ℹ️')) setErrorCreate('');
        }
      }).catch(err => {
        // Silenciar 404 (no existe mensaje todavía)
        if (err.response?.status !== 404) {
          console.warn('Error comprobando mensaje:', err);
        }
        setMessageCheck({ exists: false, expired: false, created_at: null });
      });
    } else {
      setMessageCheck({ exists: false, expired: false, created_at: null });
    }
  }, [finalCode, proveedorInfo]);

  const handleP1Change = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
    setP1(val);
    if (val.length === 4) document.getElementById("p2")?.focus();
  };

  const handleP2Change = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
    setP2(val);
    if (val.length === 3) document.getElementById("p3")?.focus();
    if (val.length === 0 && e.nativeEvent.inputType === 'deleteContentBackward') {
      document.getElementById("p1")?.focus();
    }
  };

  const handleP3Change = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
    setP3(val);
    if (val.length === 3) document.getElementById("p4")?.focus();
    if (val.length === 0 && e.nativeEvent.inputType === 'deleteContentBackward') {
      document.getElementById("p2")?.focus();
    }
  };

  const handleP4Change = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
    setP4(val);
    if (val.length === 0 && e.nativeEvent.inputType === 'deleteContentBackward') {
      document.getElementById("p3")?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
    const parts = pasted.split("-");
    if (parts.length >= 1) setP1(parts[0].slice(0, 4));
    if (parts.length >= 2) setP2(parts[1].slice(0, 3));
    if (parts.length >= 3) setP3(parts[2].slice(0, 3));
    if (parts.length >= 4) setP4(parts[3].slice(0, 3));
  };

  // ---------------------------------------------------
  // CREAR MENSAJE → Validar código en backend
  // ---------------------------------------------------
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!regex.test(finalCode)) {
      setErrorCreate("El formato debe ser ABCD-123-456-ABC");
      return;
    }

    setErrorCreate("");
    setLoading(true);

    try {
      const res = await api.post("/check_code/", {
        code: finalCode,
      });

      if (res.data.valid) {
        // Verificar si ya existe un mensaje para este código
        try {
          const msgRes = await api.get(`/message/${finalCode}/peek/`);
          
          if (msgRes.data && msgRes.data.exists !== false && msgRes.data.created_at) {
            // Calcular días desde creación
            const createdDate = new Date(msgRes.data.created_at);
            const now = new Date();
            const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);
            const expiryDate = new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            const timeLeft = expiryDate - now;
            const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            let timeMessage = '';
            if (daysDiff > 7) {
              timeMessage = '⚠️ El período de modificación ha expirado (más de 7 días).';
            } else if (daysLeft > 0) {
              timeMessage = `⏰ Tiempo restante para editar: ${daysLeft} día${daysLeft !== 1 ? 's' : ''} y ${hoursLeft} hora${hoursLeft !== 1 ? 's' : ''}`;
            } else if (hoursLeft > 0) {
              timeMessage = `⚠️ ¡Último día! Solo quedan ${hoursLeft} hora${hoursLeft !== 1 ? 's' : ''}`;
            } else {
              timeMessage = '⚠️ Menos de 1 hora restante para editar';
            }
            
            const createdDateStr = createdDate.toLocaleDateString('es-ES', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
            
            setErrorCreate(
              `ℹ️ Este código ya tiene un mensaje creado.\n\n` +
              `📅 Fecha de creación: ${createdDateStr}\n` +
              `${timeMessage}\n\n` +
              `Haz clic en "Crear mensaje" para ver las opciones de edición o borrado.`
            );
          }
        } catch (msgErr) {
          // Si no hay mensaje, continuar normalmente
          console.log("No hay mensaje previo");
        }
        
        navigate(`/create-message/${finalCode}`);
      } else {
        setErrorCreate("Este código NO existe o NO está activo.");
      }
    } catch (err) {
      setErrorCreate("Error al conectar con el servidor.");
    }

    setLoading(false);
  };

  const handleDeleteExisting = async () => {
    if (!regex.test(finalCode)) {
      setErrorCreate("El formato debe ser ABCD-123-456-ABC");
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/message/${finalCode}/delete/`);
      setMessageCheck({ exists: false, expired: false, created_at: null });
      setErrorCreate("");
      setToast({ isOpen: true, message: "✅ Mensaje borrado correctamente", type: "success" });
    } catch (err) {
      setToast({ isOpen: true, message: "No se pudo borrar el mensaje. El período de 7 días puede haber expirado.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Imagen de fondo: prioridad a la del proveedor, si no hay, usar imagen por defecto
  const defaultBgImage = '/2842.jpg';
  const finalBgImage = theme.backgroundImage || defaultBgImage;
  
  const backgroundStyle = {
    backgroundImage: `url(${finalBgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  const bgClass = '';

  return (
    <div className={`relative min-h-screen flex flex-col justify-center items-center overflow-hidden ${bgClass}`} style={backgroundStyle}>
      {/* Overlay sobre la imagen de fondo */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

{/* LOGO SUPERIOR IZQUIERDA */}
{/* <div className="absolute top-6 left-6 flex items-center gap-3 z-20 animate-fade-in">
  <img
    src="/ntsf_logo.png"
    alt="NTSF Logo"
    className="w-40 h-auto drop-shadow-lg"
  />
</div> */}

      {/* Contenedor principal con grid */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 pt-6 sm:pt-8 md:pt-12 relative z-10 w-full max-w-7xl">
        <div className={`grid ${proveedorInfo && proveedorInfo.comercial_name ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-4 sm:gap-6 md:gap-8 items-start ${!proveedorInfo || !proveedorInfo.comercial_name ? 'justify-items-center' : ''}`}>
          
          {/* Información izquierda - visible cuando hay proveedor */}
          {proveedorInfo && proveedorInfo.comercial_name && (
            <div className="animate-fade-in w-full">
              <div className={`${theme.card} backdrop-blur-md bg-white/90 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-200 flex flex-col justify-between min-h-[400px]`}>
                <div>
                  <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${theme.primaryText} mb-4 sm:mb-6`}>
                    {proveedorInfo.comercial_name || proveedorInfo.name}
                  </h3>
                  {proveedorInfo.bio && (
                    <p className={`${theme.secondaryText} mb-6 text-base sm:text-lg leading-relaxed`}>
                      {proveedorInfo.bio}
                    </p>
                  )}
                  {proveedorInfo.address && (
                    <div className={`flex items-start gap-3 mb-4 ${theme.secondaryText} text-base sm:text-lg`}>
                      <span className="text-xl">📍</span>
                      <span>{proveedorInfo.address}</span>
                    </div>
                  )}
                  {proveedorInfo.phone && (
                    <div className={`flex items-center gap-3 mb-4 ${theme.secondaryText} text-base sm:text-lg`}>
                      <span className="text-xl">📞</span>
                      <span>{proveedorInfo.phone}</span>
                    </div>
                  )}
                  {proveedorInfo.email && (
                    <div className={`flex items-center gap-3 ${theme.secondaryText} text-base sm:text-lg`}>
                      <span className="text-xl">✉️</span>
                      <span>{proveedorInfo.email}</span>
                    </div>
                  )}
                </div>

                {/* Iconos de redes sociales minimalistas abajo */}
                {(proveedorInfo.website || proveedorInfo.facebook || proveedorInfo.instagram || proveedorInfo.twitter || proveedorInfo.linkedin || proveedorInfo.tiktok) && (
                  <div className="flex items-center gap-3 sm:gap-4 mt-8 pt-6 border-t border-gray-200">
                    {proveedorInfo.website && (
                      <a href={proveedorInfo.website} target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-400 hover:border-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </a>
                    )}
                    {proveedorInfo.facebook && (
                      <a href={proveedorInfo.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-400 hover:border-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    )}
                    {proveedorInfo.instagram && (
                      <a href={proveedorInfo.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-400 hover:border-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-pink-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    )}
                    {proveedorInfo.twitter && (
                      <a href={proveedorInfo.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-400 hover:border-gray-800 flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-gray-800 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                    )}
                    {proveedorInfo.linkedin && (
                      <a href={proveedorInfo.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-400 hover:border-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-blue-700 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                    {proveedorInfo.tiktok && (
                      <a href={proveedorInfo.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-400 hover:border-gray-800 flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-gray-800 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tarjeta derecha PARA CREAR MENSAJE */}
          <div className={`${theme.card} shadow-2xl backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 w-full ${!proveedorInfo || !proveedorInfo.comercial_name ? 'max-w-lg' : 'lg:col-start-2'} border border-gray-200 animate-fade-in hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]`}>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4 animate-gradient text-left">
              Crear el mensaje
            </h1>
            
            <form onSubmit={handleCreate}>
              <div className="space-y-5">
                <label className="block text-left">
                  <span className="text-gray-700 font-bold text-xl sm:text-2xl mb-4 block">
                    🎫 Introduce tu código:
                  </span>
                </label>
                
                <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                  <input 
                    id="p1"
                    value={p1} 
                    onChange={handleP1Change} 
                    onPaste={handlePaste}
                    maxLength={4}
                    className={`w-24 sm:w-28 md:w-32 p-5 sm:p-6 md:p-7 border-4 rounded-2xl text-center uppercase font-bold text-lg sm:text-xl md:text-2xl shadow-xl focus:ring-4 transition-all duration-300 placeholder:text-sm sm:placeholder:text-base md:placeholder:text-lg ${proveedorError ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-rose-500 focus:ring-rose-200'}`}
                    placeholder="ABCD"
                    autoComplete="off"
                  />
                  <span className="text-gray-400 text-3xl sm:text-4xl font-bold">-</span>
                  <input 
                    id="p2"
                    value={p2} 
                    onChange={handleP2Change}
                    maxLength={3}
                    className="w-20 sm:w-24 md:w-28 p-5 sm:p-6 md:p-7 border-4 border-gray-300 rounded-2xl text-center font-bold text-lg sm:text-xl md:text-2xl shadow-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-200 transition-all duration-300 placeholder:text-sm sm:placeholder:text-base md:placeholder:text-lg"
                    placeholder="001"
                    autoComplete="off"
                  />
                  <span className="text-gray-400 text-3xl sm:text-4xl font-bold">-</span>
                  <input 
                    id="p3"
                    value={p3} 
                    onChange={handleP3Change}
                    maxLength={3}
                    className="w-20 sm:w-24 md:w-28 p-5 sm:p-6 md:p-7 border-4 border-gray-300 rounded-2xl text-center font-bold text-lg sm:text-xl md:text-2xl shadow-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-200 transition-all duration-300 placeholder:text-sm sm:placeholder:text-base md:placeholder:text-lg"
                    placeholder="001"
                    autoComplete="off"
                  />
                  <span className="text-gray-400 text-3xl sm:text-4xl font-bold">-</span>
                  <input 
                    id="p4"
                    value={p4} 
                    onChange={handleP4Change}
                    maxLength={3}
                    className="w-20 sm:w-24 md:w-28 p-5 sm:p-6 md:p-7 border-4 border-gray-300 rounded-2xl text-center uppercase font-bold text-lg sm:text-xl md:text-2xl shadow-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-200 transition-all duration-300 placeholder:text-sm sm:placeholder:text-base md:placeholder:text-lg"
                    placeholder="ABC"
                    autoComplete="off"
                  />
                </div>
                
                <p className="text-base sm:text-lg text-gray-600 text-left leading-relaxed mt-4">
              📝 Ejemplo: <span className="font-mono font-bold text-rose-600 text-xl">ABCD-001-001-ABC</span>
                </p>
                <p className="text-sm sm:text-base text-gray-500 text-left italic">
                  💡  Puedes pegar el código completo en cualquier campo
                </p>
              </div>

              {errorCreate && (
                <div
                  className={`border-2 rounded-xl p-4 mb-4 whitespace-pre-line ${
                    errorCreate.startsWith("ℹ️")
                      ? "bg-blue-50 border-blue-300 text-blue-800"
                      : "bg-red-50 border-red-300 text-red-700"
                  }`}
                >
                  {errorCreate}
                </div>
              )}

              {messageCheck.exists && !messageCheck.expired ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => navigate(`/create-message/${finalCode}?edit=1`)}
                    className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:via-orange-600 hover:to-pink-600 text-white font-bold py-5 sm:py-6 rounded-2xl text-lg sm:text-xl md:text-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ✏️ Modificar mensaje
                  </button>
                  <button
                    type="button"
                    disabled={loading || !proveedorInfo}
                    onClick={handleDeleteExisting}
                    className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-5 sm:py-6 rounded-2xl text-lg sm:text-xl md:text-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🗑️ Borrar mensaje
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !proveedorInfo}
                  className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold py-6 sm:py-7 rounded-2xl text-xl sm:text-2xl md:text-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "🔄 Validando..." : "✨ Crear mensaje"}
                </button>
              )}
            </form>

            {/* ¿Cómo funciona? */}
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 text-rose-600 hover:text-rose-800 font-bold text-lg sm:text-xl transition-all duration-300 hover:scale-110 flex items-center gap-2 underline"
            >
              💡 ¿Necesitas ayuda?
            </button>
          </div>



        </div>
      </div>

      {/* Pie de página */}
      <p className="mt-6 sm:mt-8 px-4 text-white text-sm sm:text-base md:text-lg animate-fade-in-delayed flex items-center gap-2 justify-center font-medium text-center">
        📱 Si tu móvil tiene NFC o lector QR, también puedes acercarlo a la tarjeta que acompaña el regalo.      </p>

      {/* Botón lateral para FAQs */}
      <button
        onClick={() => setFaqSidebarOpen(!faqSidebarOpen)}
        className="fixed right-3 sm:right-4 bottom-4 sm:bottom-6 z-40 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
      >
        {faqSidebarOpen ? "Cerrar FAQs" : "FAQs"}
      </button>

      {/* Sidebar FAQs colapsable */}
      <div className={`fixed top-0 right-0 h-full z-30 transition-transform duration-300 ${faqSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className={`${theme.card} h-full w-[92vw] sm:w-[420px] border-l border-gray-200 shadow-2xl backdrop-blur-sm`}> 
          <div className="p-6 overflow-y-auto h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-2xl font-bold ${theme.primaryText}`}>Preguntas frecuentes</h3>
              <button onClick={() => setFaqSidebarOpen(false)} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
            </div>

            {/* Item 1 */}
            <button
              className="w-full flex justify-between items-center py-3 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 transition-all"
              onClick={() => setFaqOpen(faqOpen === 1 ? null : 1)}
            >
              <span className="font-semibold text-gray-800">¿Qué es el código XXXX y cómo se forma?</span>
              <span className="text-xl">{faqOpen === 1 ? "−" : "+"}</span>
            </button>
            {faqOpen === 1 && (
              <div className="px-4 pb-4 text-gray-600">
                El código tiene 4 partes: 4 letras del proveedor, 3 dígitos de grupo, 3 dígitos de número y 3 letras finales. Ejemplo: XXXX-001-002-ABC.
              </div>
            )}

            {/* Item 2 */}
            <button
              className="w-full flex justify-between items-center py-3 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 transition-all mt-3"
              onClick={() => setFaqOpen(faqOpen === 2 ? null : 2)}
            >
              <span className="font-semibold text-gray-800">¿Cuánto tiempo puedo editar o borrar mi mensaje?</span>
              <span className="text-xl">{faqOpen === 2 ? "−" : "+"}</span>
            </button>
            {faqOpen === 2 && (
              <div className="px-4 pb-4 text-gray-600">
                Puedes editar o borrar durante los primeros 7 días desde la creación. Pasado ese periodo, el mensaje solo se podrá ver.
              </div>
            )}

            {/* Item 3 */}
            <button
              className="w-full flex justify-between items-center py-3 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 transition-all mt-3"
              onClick={() => setFaqOpen(faqOpen === 3 ? null : 3)}
            >
              <span className="font-semibold text-gray-800">¿Puedo grabar video con efectos y audio?</span>
              <span className="text-xl">{faqOpen === 3 ? "−" : "+"}</span>
            </button>
            {faqOpen === 3 && (
              <div className="px-4 pb-4 text-gray-600">
                Sí. En la creación puedes previsualizar decoraciones y grabar el video con efectos. El audio se captura y se puede reproducir al momento.
              </div>
            )}

            {/* Item 4 */}
            <button
              className="w-full flex justify-between items-center py-3 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 transition-all mt-3"
              onClick={() => setFaqOpen(faqOpen === 4 ? null : 4)}
            >
              <span className="font-semibold text-gray-800">¿Qué pasa si mi proveedor no aparece?</span>
              <span className="text-xl">{faqOpen === 4 ? "−" : "+"}</span>
            </button>
            {faqOpen === 4 && (
              <div className="px-4 pb-4 text-gray-600">
                Usaremos un estilo neutro por defecto. Verifica las 4 letras del proveedor y vuelve a intentarlo.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal ¿Cómo funciona? */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-20 animate-fade-in px-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 max-w-lg w-full shadow-2xl text-center relative animate-scale-in border-2 border-rose-200">

            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">💡 ¿Cómo funciona?</h2>

            <p className="text-gray-700 text-left leading-relaxed text-sm sm:text-base">
              <strong>🎥 Crear mensaje:</strong> Introduce tu código XXXX y podrás grabar video, audio o escribir un mensaje para tu destinatario.
              <br /><br />
              <strong>🌸 Ver mensaje:</strong> El destinatario introduce su código XXXX para ver el mensaje especial que ha recibido.
              <br /><br />
              <strong>📱 NFC:</strong> Si el móvil tiene NFC, basta con acercarlo al ramo.
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="mt-8 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
            >
              ✓ Entendido
            </button>
          </div>
        </div>
      )}

      {/* Animaciones */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(3deg); }
          66% { transform: translate(-20px, 20px) rotate(-3deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, -40px) scale(1.05); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(5deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-float-slow { animation: float-slow 20s infinite ease-in-out; }
        .animate-float-medium { animation: float-medium 15s infinite ease-in-out; }
        .animate-float-fast { animation: float-fast 10s infinite ease-in-out; }
        .animate-fade-in { animation: fadeIn 0.8s forwards; }
        .animate-fade-in-delayed { animation: fadeIn 1.5s forwards; }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      {/* Modal de confirmación para borrar */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="¿Borrar mensaje?"
        message={`¿Estás seguro de que deseas borrar el mensaje del código ${finalCode}?\n\nEsta acción no se puede deshacer.`}
        confirmText="Sí, borrar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Toast para notificaciones */}
      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}