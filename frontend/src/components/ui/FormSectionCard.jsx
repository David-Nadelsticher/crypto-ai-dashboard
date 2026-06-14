import Kicker from "./Kicker";

export default function FormSectionCard({
  id,
  title,
  description,
  kicker,
  required = false,
  blockedMessage,
  variant = "flat",
  children,
}) {
  const cardClassName =
    variant === "stepped"
      ? "scroll-mt-8 rounded-xl border border-piggy-border bg-piggy-card p-6 shadow-card"
      : "scroll-mt-8 rounded-card border border-piggy-border bg-piggy-card p-6 shadow-card";

  return (
    <section id={id} className={cardClassName}>
      {kicker && <Kicker>{kicker}</Kicker>}
      <h2
        className={`font-heading text-lg font-semibold text-piggy-charcoal ${kicker ? "mt-1" : ""}`}
      >
        {title}
        {required && (
          <>
            <span className="text-piggy-pink" aria-hidden="true">
              {" "}
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </h2>
      {description && <p className="mt-1 text-sm text-piggy-gray">{description}</p>}
      {blockedMessage && <p className="mt-2 text-sm text-piggy-gray">{blockedMessage}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
