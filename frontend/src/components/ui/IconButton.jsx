const VARIANT_CLASSES = {
  ghost: "rounded-lg text-piggy-charcoal hover:bg-piggy-peach/30",
  nav: "nav-item",
};

const SIZE_CLASSES = {
  sm: "p-1",
  md: "p-2",
};

export default function IconButton({
  icon,
  ariaLabel,
  variant = "ghost",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={`focus-ring motion-interactive inline-flex shrink-0 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.ghost} ${SIZE_CLASSES[size] || SIZE_CLASSES.md} ${className}`}
      {...rest}
    >
      {icon}
    </button>
  );
}
