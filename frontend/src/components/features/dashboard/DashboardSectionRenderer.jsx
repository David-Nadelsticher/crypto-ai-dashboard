import AiInsightSection from "../../sections/AiInsightSection";
import CoinPricesSection from "../../sections/CoinPricesSection";
import MarketNewsSection from "../../sections/MarketNewsSection";
import MemeSection from "../../sections/MemeSection";

export default function DashboardSectionRenderer({
  sectionId,
  expanded,
  onExpandedChange,
  staggerIndex,
  sectionProps,
}) {
  switch (sectionId) {
    case "section-insight":
      return (
        <AiInsightSection
          key={sectionId}
          expanded={expanded}
          onExpandedChange={onExpandedChange}
          staggerIndex={staggerIndex}
          {...sectionProps.insight}
        />
      );
    case "section-news":
      return (
        <MarketNewsSection
          key={sectionId}
          expanded={expanded}
          onExpandedChange={onExpandedChange}
          staggerIndex={staggerIndex}
          {...sectionProps.news}
        />
      );
    case "section-prices":
      return (
        <CoinPricesSection
          key={sectionId}
          expanded={expanded}
          onExpandedChange={onExpandedChange}
          staggerIndex={staggerIndex}
          {...sectionProps.prices}
        />
      );
    case "section-meme":
      return (
        <MemeSection
          key={sectionId}
          expanded={expanded}
          onExpandedChange={onExpandedChange}
          staggerIndex={staggerIndex}
          {...sectionProps.meme}
        />
      );
    default:
      return null;
  }
}
