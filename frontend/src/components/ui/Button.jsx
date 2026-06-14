const VARIANT_CLASSES = {
  primary:
    "bg-piggy-pink text-piggy-charcoal hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
  ghost:
    "border border-piggy-border bg-transparent text-piggy-gray hover:border-piggy-pink hover:text-piggy-charcoal disabled:cursor-not-allowed disabled:opacity-50",
  danger:
    "bg-piggy-negative/15 text-piggy-negative ring-1 ring-piggy-negative/40 hover:bg-piggy-negative/20 disabled:cursor-not-allowed disabled:opacity-50",
};

const SIZE_CLASSES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm font-semibold",
  lg: "px-4 py-3 text-base font-semibold",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  children,
  ...props
}) {
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <button
      type={type}
      className={`focus-ring motion-interactive motion-press rounded-lg ${variantClass} ${sizeClass} ${
        fullWidth ? "w-full" : ""
      } ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
