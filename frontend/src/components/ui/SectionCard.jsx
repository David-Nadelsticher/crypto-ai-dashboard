import { useId, useState } from "react";
import FeedbackControls from "./FeedbackControls";
import ContentSkeleton from "./ContentSkeleton";
import StateMessage from "./StateMessage";

const VARIANT_STYLES = {
  hero: {
    card: "border-2 border-piggy-pink/35 bg-gradient-to-br from-piggy-card via-piggy-card to-piggy-peach/25 p-8 shadow-card hover:shadow-lg",
    title: "text-xl md:text-2xl",
    defaultExpanded: false,
    collapsible: true,
  },
  default: {
    card: "p-6 shadow-card hover:shadow-lg",
    title: "text-lg",
    defaultExpanded: false,
    collapsible: true,
  },
  compact: {
    card: "p-5 shadow-card hover:shadow-md",
    title: "text-base",
    defaultExpanded: false,
    collapsible: true,
  },
};

function SectionHeader({
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
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
          }}
          aria-expanded={expanded}
          aria-controls={contentId}
          aria-label={expanded ? "Collapse section" : expandLabel}
          className="section-card-toggle"
        >
          <svg
            className={`h-5 w-5 transition-transform duration-slow ease-product motion-reduce:transition-none ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}

function SectionMetaDetails({ sourceLabel, relatedCoins = [] }) {
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
              <span
                key={coin}
                className="rounded-full bg-piggy-peach/40 px-2.5 py-0.5 text-xs font-medium capitalize text-piggy-charcoal"
              >
                {coin}
              </span>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}

export default function SectionCard({
  title,
  icon,
  preview,
  collapsedPreview,
  expandLabel,
  sectionName,
  itemReference,
  contentSnapshot = null,
  expandedContent,
  sourceLabel,
  relatedCoins = [],
  status = "success",
  error,
  skeletonLayout = "text",
  variant = "default",
  defaultExpanded,
  expanded: expandedProp,
  onExpandedChange,
  id,
  onRetry,
  staggerIndex = 0,
}) {
  const contentId = useId();
  const variantConfig = VARIANT_STYLES[variant] || VARIANT_STYLES.default;
  const isInitialLoading = status === "loading";
  const isRefreshing = status === "refreshing";
  const isLoading = isInitialLoading || isRefreshing;
  const [internalExpanded, setInternalExpanded] = useState(
    defaultExpanded ?? variantConfig.defaultExpanded,
  );
  const isControlled = expandedProp !== undefined;
  const expanded = isControlled ? expandedProp : internalExpanded;

  const showCollapsible = variantConfig.collapsible && !isInitialLoading;
  const previewContent = collapsedPreview ?? (
    <p className="line-clamp-2 text-sm leading-relaxed text-piggy-gray">{preview}</p>
  );

  function toggleExpanded() {
    if (!showCollapsible) return;

    const nextExpanded = !expanded;
    if (isControlled) {
      onExpandedChange?.(nextExpanded);
      return;
    }
    setInternalExpanded(nextExpanded);
  }

  return (
    <article
      id={id}
      data-expanded={expanded ? "true" : "false"}
      style={{ "--motion-delay": `${staggerIndex * 60}ms` }}
      className={`motion-stagger-item section-card-interactive focus-within:ring-piggy-pink/20 group relative flex h-full scroll-mt-24 flex-col rounded-card border border-piggy-border bg-piggy-card ${variantConfig.card}`}
    >
      {isRefreshing && (
        <div
          className="motion-fade-in absolute inset-0 z-10 flex items-center justify-center rounded-card bg-piggy-card/60 backdrop-blur-[1px]"
          role="status"
          aria-live="polite"
        >
          <span className="sr-only">Piggy is reading the market…</span>
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-piggy-pink border-t-transparent" aria-hidden="true" />
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <div className="mb-4">
          <SectionHeader
            title={title}
            icon={icon}
            titleClassName={variantConfig.title}
            expanded={expanded}
            showCollapsible={showCollapsible}
            contentId={contentId}
            expandLabel={expandLabel}
            onToggle={toggleExpanded}
          />
        </div>

        {error && !isInitialLoading && (
          <div className="mb-4">
            <StateMessage variant="error" message={error} onRetry={onRetry} />
          </div>
        )}

        {isInitialLoading ? (
          <div>
            <ContentSkeleton layout={skeletonLayout} />
            <p className="mt-3 text-center text-sm text-piggy-gray" role="status" aria-live="polite">
              Piggy is preparing today&apos;s brief…
            </p>
          </div>
        ) : (
          <div
            className={`grid transition-[grid-template-rows] duration-slow ease-product motion-reduce:transition-none ${
              expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
            id={contentId}
            aria-hidden={!expanded}
          >
            <div className="overflow-hidden">
              <div className="scroll-mt-24 flex flex-col pb-1" data-section-content-start>
                <div className="flex-1">{expandedContent}</div>

                <SectionMetaDetails sourceLabel={sourceLabel} relatedCoins={relatedCoins} />

                <div className="mt-6 border-t border-piggy-border pt-4">
                  <FeedbackControls
                    sectionName={sectionName}
                    itemReference={isLoading ? "" : itemReference}
                    contentSnapshot={isLoading ? null : contentSnapshot}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {!isInitialLoading && !expanded && !error && (
          <div className="flex-1 transition-opacity duration-normal ease-product">{previewContent}</div>
        )}
      </div>
    </article>
  );
}
