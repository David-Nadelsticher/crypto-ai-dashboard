import Kicker from "../../ui/Kicker";
import { extractPiggyTake, splitInsightParagraphs } from "../../../utils/insightMeta";
import InsightFocusAssets from "./InsightFocusAssets";
import InsightPersonalizationNote from "./InsightPersonalizationNote";

export default function PiggyTakeBlock({
  insightText,
  relatedCoins = [],
  preferences,
  compact = false,
}) {
  const displayText = compact ? extractPiggyTake(insightText) : insightText;
  const paragraphs = compact ? [] : splitInsightParagraphs(insightText);

  return (
    <div className={compact ? "insight-preview space-y-2.5" : "space-y-4"}>
      <Kicker as="h3">Piggy&apos;s Take</Kicker>
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
      {!compact && <InsightFocusAssets relatedCoins={relatedCoins} />}
      {!compact && <InsightPersonalizationNote preferences={preferences} />}
    </div>
  );
}
