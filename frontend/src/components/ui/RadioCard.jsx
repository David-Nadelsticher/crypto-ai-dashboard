export default function RadioCard({
  name,
  value,
  checked,
  label,
  onChange,
  disabled = false,
  id,
}) {
  return (
    <label
      htmlFor={id}
      className={`motion-interactive flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-all duration-normal ease-snappy motion-safe:hover:scale-[1.01] motion-reduce:scale-100 ${
        checked
          ? "border-piggy-pink bg-piggy-pink/10 ring-1 ring-piggy-pink scale-[1.01]"
          : "border-piggy-border hover:border-piggy-peach"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 border-piggy-border text-piggy-pink focus:ring-piggy-pink"
      />
      <span className="text-sm font-medium text-piggy-charcoal">{label}</span>
    </label>
  );
}
