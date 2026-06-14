import IconButton from "../../ui/IconButton";

function ChevronDownIcon({ className, expanded }) {
  return (
    <svg
      className={`h-5 w-5 transition-transform duration-slow ease-product motion-reduce:transition-none ${
        expanded ? "rotate-180" : ""
      } ${className || ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function SectionCardHeader({
  title,
  icon,
  titleClassName,
  expanded,
  showCollapsible,
  contentId,
  expandLabel,
  onToggle,
}) {
  function handleHeaderKeyDown(event) {
    if (!showCollapsible) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  }

  return (
    <div
      className={`flex items-center gap-3 ${showCollapsible ? "section-card-header-trigger cursor-pointer" : ""}`}
      onClick={showCollapsible ? onToggle : undefined}
      onKeyDown={showCollapsible ? handleHeaderKeyDown : undefined}
      role={showCollapsible ? "button" : undefined}
      tabIndex={showCollapsible ? 0 : undefined}
      aria-expanded={showCollapsible ? expanded : undefined}
      aria-controls={showCollapsible ? contentId : undefined}
    >
      {icon && (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center text-piggy-pink" aria-hidden="true">
          {icon}
        </span>
      )}
      <h2 className={`min-w-0 flex-1 font-heading font-semibold text-piggy-charcoal ${titleClassName}`}>
        {title}
      </h2>
      {showCollapsible && (
        <IconButton
          icon={<ChevronDownIcon expanded={expanded} />}
          ariaLabel={expanded ? "Collapse section" : expandLabel}
          variant="ghost"
          size="sm"
          className="section-card-toggle"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
          }}
        />
      )}
    </div>
  );
}
