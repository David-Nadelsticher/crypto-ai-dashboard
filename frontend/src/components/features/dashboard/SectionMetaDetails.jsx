import Badge from "../../ui/Badge";

export default function SectionMetaDetails({ sourceLabel, relatedCoins = [] }) {
  if (!sourceLabel && relatedCoins.length === 0) return null;

  return (
    <details className="section-meta-details">
      <summary className="section-meta-details-summary">
        <svg
          className="section-meta-details-chevron h-3.5 w-3.5 shrink-0 text-piggy-pink motion-reduce:transition-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        Source details
      </summary>
      <div className="section-meta-details-body">
        {sourceLabel && (
          <p className="text-xs text-piggy-gray">
            Source:{" "}
            <span className="font-medium text-piggy-charcoal">{sourceLabel}</span>
          </p>
        )}
        {relatedCoins.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-piggy-gray">Related coins:</span>
            {relatedCoins.map((coin) => (
              <Badge key={coin} variant="peach" size="sm" className="capitalize">
                {coin}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}
