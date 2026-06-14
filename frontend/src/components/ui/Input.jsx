const INPUT_CLASSES =
  "focus-ring w-full rounded-lg border border-piggy-border bg-piggy-cream px-4 py-2.5 text-piggy-charcoal placeholder:text-piggy-gray/60 focus:border-piggy-pink disabled:cursor-not-allowed disabled:opacity-50";

export default function Input({ className = "", ...props }) {
  return <input className={`${INPUT_CLASSES} ${className}`.trim()} {...props} />;
}
