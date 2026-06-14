const VARIANT_STYLES = {
  error: "border-piggy-negative/30 bg-piggy-negative/5 text-piggy-negative",
  success: "border-piggy-positive/30 bg-piggy-positive/5 text-piggy-positive",
  info: "border-piggy-border bg-piggy-cream/50 text-piggy-gray",
};

export default function Alert({ variant = "error", children }) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.error;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`motion-fade-in rounded-lg border px-4 py-3 text-sm ${styles}`}
    >
      {children}
    </div>
  );
}
