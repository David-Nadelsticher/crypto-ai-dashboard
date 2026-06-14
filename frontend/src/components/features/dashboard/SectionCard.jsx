import { useId, useState } from "react";
import StateMessage from "../../ui/StateMessage";
import SectionCardCollapsedPreview from "./SectionCardCollapsedPreview";
import SectionCardExpandableContent from "./SectionCardExpandableContent";
import SectionCardHeader from "./SectionCardHeader";
import SectionCardLoadingState from "./SectionCardLoadingState";
import SectionCardRefreshOverlay from "./SectionCardRefreshOverlay";
import { SECTION_CARD_VARIANTS } from "./sectionCardVariants";

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
  const variantConfig = SECTION_CARD_VARIANTS[variant] || SECTION_CARD_VARIANTS.default;
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
      <SectionCardRefreshOverlay isRefreshing={isRefreshing} />

      <div className="flex flex-1 flex-col">
        <div className="mb-4">
          <SectionCardHeader
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
          <SectionCardLoadingState skeletonLayout={skeletonLayout} />
        ) : (
          <SectionCardExpandableContent
            expanded={expanded}
            contentId={contentId}
            expandedContent={expandedContent}
            sourceLabel={sourceLabel}
            relatedCoins={relatedCoins}
            sectionName={sectionName}
            itemReference={itemReference}
            contentSnapshot={contentSnapshot}
            isLoading={isLoading}
          />
        )}

        <SectionCardCollapsedPreview
          expanded={expanded}
          error={error}
          isInitialLoading={isInitialLoading}
          previewContent={previewContent}
        />
      </div>
    </article>
  );
}
