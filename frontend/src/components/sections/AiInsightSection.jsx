import SectionCard from "../features/dashboard/SectionCard";
import SectionContent from "../features/dashboard/SectionContent";
import InsightIllustration from "../illustrations/InsightIllustration";
import PiggyTakeBlock from "./insight/PiggyTakeBlock";
import { InsightIcon } from "../icons/SectionIcons";
import {
  buildSourceLabel,
  EMPTY_INSIGHT_MESSAGE,
  extractPiggyTake,
} from "../../utils/insightMeta";
import { buildInsightSnapshot } from "../../utils/voteSnapshots";

function InsightIllustrationBlock({ className = "" }) {
  return (
    <InsightIllustration
      className={className || "mx-auto h-28 w-28 sm:h-36 sm:w-36 md:h-52 md:w-52"}
    />
  );
}

function InsightExpandedBody({ children }) {
  return (
    <div className="insight-expanded-grid">
      <div className="insight-expanded-text min-w-0">{children}</div>
      <div className="insight-expanded-illustration pointer-events-none">
        <InsightIllustrationBlock />
      </div>
    </div>
  );
}

function InsightExpandedContent({ insight, relatedCoins, preferences }) {
  if (!insight?.insight) return null;

  return (
    <InsightExpandedBody>
      <PiggyTakeBlock
        insightText={insight.insight}
        relatedCoins={relatedCoins}
        preferences={preferences}
      />
    </InsightExpandedBody>
  );
}

export default function AiInsightSection({
  insight,
  status,
  error,
  itemReference,
  relatedCoins = [],
  preferences,
  onRetry,
  expanded = false,
  onExpandedChange,
  staggerIndex = 0,
}) {
  const preview = insight?.insight
    ? extractPiggyTake(insight.insight)
    : EMPTY_INSIGHT_MESSAGE;

  return (
    <SectionCard
      id="section-insight"
      staggerIndex={staggerIndex}
      title="AI Insight of the Day"
      icon={<InsightIcon />}
      preview={preview}
      collapsedPreview={
        insight?.insight ? (
          <PiggyTakeBlock
            insightText={insight.insight}
            relatedCoins={relatedCoins}
            preferences={preferences}
            compact
          />
        ) : (
          <p className="text-sm text-piggy-gray">{EMPTY_INSIGHT_MESSAGE}</p>
        )
      }
      expandLabel="Open full AI insight"
      sectionName="insight"
      itemReference={itemReference}
      contentSnapshot={status === "success" ? buildInsightSnapshot(insight) : null}
      sourceLabel={buildSourceLabel(insight)}
      relatedCoins={relatedCoins}
      status={status}
      error={error}
      variant="hero"
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      skeletonLayout="hero"
      onRetry={onRetry}
      expandedContent={
        <SectionContent
          isEmpty={!insight?.insight}
          emptyMessage={EMPTY_INSIGHT_MESSAGE}
          renderContent={() => (
            <InsightExpandedContent
              insight={insight}
              relatedCoins={relatedCoins}
              preferences={preferences}
            />
          )}
        />
      }
    />
  );
}
