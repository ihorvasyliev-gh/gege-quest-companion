import { useCharacterStore } from '../store/useCharacterStore';

export function ToastContainer() {
  const toasts = useCharacterStore((state) => state.toasts);
  const dismissToast = useCharacterStore((state) => state.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-notification ${toast.type}`}
          onClick={() => dismissToast(toast.id)}
        >
          <div className="toast-content">{toast.message}</div>
          <button
            className="toast-close"
            onClick={(e) => {
              e.stopPropagation();
              dismissToast(toast.id);
            }}
          >
            &#x2715;
          </button>
        </div>
      ))}
    </div>
  );
}
