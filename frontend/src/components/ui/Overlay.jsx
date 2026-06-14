export default function Overlay({
  open,
  onClose,
  variant = "backdrop",
  ariaLabel,
  className = "",
  children,
}) {
  if (!open) return null;

  if (variant === "backdrop") {
    return (
      <button
        type="button"
        aria-label={ariaLabel || "Close"}
        className={`focus-ring fixed inset-0 z-40 bg-piggy-charcoal/30 motion-fade-in md:hidden ${className}`}
        onClick={onClose}
      />
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-piggy-card/95 px-6 motion-fade-in motion-reduce:animate-none ${className}`}
      role="status"
      aria-live="polite"
    >
      {children}
    </div>
  );
}
