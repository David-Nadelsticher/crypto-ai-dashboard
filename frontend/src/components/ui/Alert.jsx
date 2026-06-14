import { STATUS_SURFACE_STYLES } from "../../utils/statusVariants";

export default function Alert({ variant = "error", children }) {
  const styles = STATUS_SURFACE_STYLES[variant] || STATUS_SURFACE_STYLES.error;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`motion-fade-in rounded-lg border px-4 py-3 text-sm ${styles}`}
    >
      {children}
    </div>
  );
}
