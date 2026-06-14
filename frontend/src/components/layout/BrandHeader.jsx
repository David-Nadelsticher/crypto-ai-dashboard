import PiggyAvatar from "../brand/PiggyAvatar";

export default function BrandHeader({
  title,
  subtitle,
  overline,
  intro,
  align = "center",
  titleClassName = "font-heading text-3xl font-bold text-piggy-charcoal",
}) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`mb-8 ${alignClass}`}>
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center ${
          align === "center" ? "mx-auto" : ""
        }`}
      >
        <PiggyAvatar size="md" />
      </div>
      {overline && (
        <p className="text-sm font-medium uppercase tracking-wider text-piggy-pink">{overline}</p>
      )}
      <h1 className={`mt-2 ${titleClassName}`}>{title}</h1>
      {intro && <p className="mt-3 text-base font-medium text-piggy-charcoal">{intro}</p>}
      {subtitle && <p className="mt-2 text-piggy-gray">{subtitle}</p>}
    </div>
  );
}
