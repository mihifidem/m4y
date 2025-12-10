import { useEffect } from "react";

export default function Toast({ 
  isOpen, 
  onClose, 
  message = "", 
  type = "success", // "success", "error", "info"
  duration = 3000 
}) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const typeStyles = {
    success: {
      gradient: "from-green-500 to-emerald-600",
      icon: "✓",
      border: "border-green-400"
    },
    error: {
      gradient: "from-red-500 to-rose-600",
      icon: "✕",
      border: "border-red-400"
    },
    info: {
      gradient: "from-blue-500 to-indigo-600",
      icon: "ℹ",
      border: "border-blue-400"
    }
  };

  const style = typeStyles[type] || typeStyles.success;

  return (
    <div className="fixed top-6 right-6 z-[100] animate-slide-in-right">
      <div className={`bg-white rounded-2xl shadow-2xl border-2 ${style.border} p-4 pr-6 min-w-[300px] max-w-md flex items-center gap-3`}>
        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${style.gradient} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
          {style.icon}
        </div>
        <p className="text-gray-800 font-medium flex-1 whitespace-pre-line">
          {message}
        </p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors ml-2 text-xl font-bold"
        >
          ×
        </button>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
