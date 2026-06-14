export default function ExternalLink({ href, children, className = "" }) {
  const label = typeof children === "string" ? children : "External link";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1 ${className}`}
      aria-label={`${label} (opens in new tab)`}
    >
      {children}
      <span aria-hidden="true" className="text-piggy-gray">
        ↗
      </span>
    </a>
  );
}
