const VARIANT_CLASSES = {
  peach: "bg-piggy-peach/40 text-piggy-charcoal",
  cream: "bg-piggy-cream/50 text-piggy-charcoal",
  hero: "border border-piggy-pink/25 bg-gradient-to-r from-piggy-peach/30 to-piggy-cream/40 text-piggy-charcoal",
};

const SIZE_CLASSES = {
  sm: "px-2.5 py-0.5 text-xs font-medium",
  md: "px-3 py-1 text-sm font-medium",
};

export default function Badge({
  variant = "peach",
  size = "sm",
  icon,
  className = "",
  children,
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.peach} ${SIZE_CLASSES[size] || SIZE_CLASSES.sm} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
