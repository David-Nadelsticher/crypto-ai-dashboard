export default function Kicker({ children, accent, as: Tag = "p", className = "" }) {
  return (
    <Tag className={`section-preview-kicker ${className}`}>
      {children}
      {accent != null && accent !== false && (
        <>
          {" "}
          <span className="section-preview-kicker-accent">{accent}</span>
        </>
      )}
    </Tag>
  );
}

export function SectionCountKicker({ verb, count, noun, pluralNoun, className = "mb-3" }) {
  const label = count === 1 ? noun : pluralNoun || `${noun}s`;

  return (
    <Kicker as="p" className={className}>
      {verb}{" "}
      <span className="section-preview-kicker-accent">{count}</span>{" "}
      {label} today.
    </Kicker>
  );
}
