import { useEffect } from "react";



const VARIANT_CLASSES = {

  success: "border-piggy-positive/30 bg-piggy-positive/5 text-piggy-positive",

  error: "border-piggy-negative/30 bg-piggy-negative/5 text-piggy-negative",

  info: "border-piggy-border bg-piggy-card text-piggy-charcoal shadow-card",

};



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

      className={`motion-slide-up fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg border px-4 py-3 text-sm md:left-auto md:right-6 md:translate-x-0 ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.info}`}

    >

      {message}

    </div>

  );

}

