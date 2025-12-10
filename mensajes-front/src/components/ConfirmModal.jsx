export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "¿Estás seguro?", 
  message = "Esta acción no se puede deshacer.", 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  type = "danger" // "danger", "info", "success"
}) {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      gradient: "from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700",
      icon: "⚠️"
    },
    info: {
      gradient: "from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
      icon: "ℹ️"
    },
    success: {
      gradient: "from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
      icon: "✓"
    }
  };

  const style = typeStyles[type] || typeStyles.danger;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl text-center relative animate-scale-in border-2 border-gray-200">
        <div className="text-6xl mb-4 animate-bounce">{style.icon}</div>
        
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
          {title}
        </h2>
        
        <p className="text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
          {message}
        </p>
        
        <div className="flex gap-3 justify-center">
          {cancelText && (
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`bg-gradient-to-r ${style.gradient} text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
