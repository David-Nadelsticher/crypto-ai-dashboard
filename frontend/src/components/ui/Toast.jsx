import { useEffect } from "react";
import { TOAST_SURFACE_STYLES } from "../../utils/statusVariants";

export default function Toast({ variant = "info", message, onDismiss, duration = 3000 }) {
  useEffect(() => {
    if (!message || !onDismiss) return undefined;

    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [message, onDismiss, duration]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`motion-slide-up fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg border px-4 py-3 text-sm md:left-auto md:right-6 md:translate-x-0 ${TOAST_SURFACE_STYLES[variant] || TOAST_SURFACE_STYLES.info}`}
    >
      {message}
    </div>
  );
}
