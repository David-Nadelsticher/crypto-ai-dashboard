import SectionCard from "../ui/SectionCard";
import SectionContent from "../ui/SectionContent";
import InsightIllustration from "../ui/InsightIllustration";
import { InsightIcon } from "../ui/SectionIcons";
import { SECTION_BY_ID } from "../../config/dashboardSections";
import { resolveFocusAssets } from "../../config/cryptoAssets";
import {
  EMPTY_INSIGHT_MESSAGE,
  extractPiggyTake,
  formatPersonalizationContext,
  splitInsightParagraphs,
} from "../../utils/insightMeta";
import CoinIcon from "../ui/CoinIcon";
import { buildInsightSnapshot } from "../../utils/voteSnapshots";

const SECTION_META = SECTION_BY_ID["section-insight"];

function buildSourceLabel(insight) {
  if (!insight) return null;
  if (insight.source === "openrouter" && insight.model) {
    return `OpenRouter (${insight.model})`;
  }
  if (insight.source === "simulated") return "Simulated insight";
  return insight.source || null;
}

function PiggyTakeBlock({ insightText, relatedCoins = [], preferences, compact = false }) {
  const displayText = compact ? extractPiggyTake(insightText) : insightText;
  const paragraphs = compact ? [] : splitInsightParagraphs(insightText);
  const focusAssets = resolveFocusAssets(relatedCoins);
  const personalization = formatPersonalizationContext(
    preferences?.assets || [],
    preferences?.content_types || [],
  );

  return (
    <div className={compact ? "insight-preview space-y-2.5" : "space-y-4"}>
      <h3 className="section-preview-kicker">Piggy&apos;s Take</h3>
      {compact ? (
        <p className="insight-preview-teaser line-clamp-2">{displayText}</p>
      ) : (
        <blockquote className="piggy-insight-quote" cite="Piggy Daily AI insight">
          <div className="relative space-y-3.5">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`leading-relaxed text-piggy-charcoal text-sm sm:text-base md:text-lg ${
                  index === 0 ? "font-medium" : "text-piggy-charcoal/90"
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </blockquote>
      )}
      {!compact && focusAssets.length > 0 && (
        <dl className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-piggy-gray">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <dt className="font-medium">Focus:</dt>
            <dd className="m-0 flex flex-wrap items-center gap-1.5">
              {focusAssets.map((asset) => (
                <span
                  key={asset.id}
                  className="inline-flex items-center gap-1 rounded-full bg-piggy-peach/35 px-2 py-0.5 font-semibold text-piggy-charcoal"
                >
                  <CoinIcon asset={asset} size="sm" />
                  <span>{asset.ticker}</span>
                </span>
              ))}
            </dd>
          </div>
        </dl>
      )}
      {!compact && personalization && (
        <p className="rounded-lg border border-piggy-border/60 bg-piggy-cream/40 px-3 py-2 text-sm text-piggy-gray">
          <span className="font-semibold text-piggy-charcoal">Why Piggy picked this: </span>
          {personalization}
        </p>
      )}
    </div>
  );
}

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
