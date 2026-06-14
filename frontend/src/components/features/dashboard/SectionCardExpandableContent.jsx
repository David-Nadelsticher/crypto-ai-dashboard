import FeedbackControls from "../feedback/FeedbackControls";
import SectionMetaDetails from "./SectionMetaDetails";

export default function SectionCardExpandableContent({
  expanded,
  contentId,
  expandedContent,
  sourceLabel,
  relatedCoins = [],
  sectionName,
  itemReference,
  contentSnapshot,
  isLoading,
}) {
  return (
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
  );
}
