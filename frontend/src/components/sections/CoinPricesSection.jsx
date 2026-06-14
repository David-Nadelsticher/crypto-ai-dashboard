import SectionCard from "../features/dashboard/SectionCard";
import SectionContent from "../features/dashboard/SectionContent";
import PricesChartGrid from "../features/prices/PricesChartGrid";
import PricesMiniTable from "../features/prices/PricesMiniTable";
import { PricesIcon } from "../icons/SectionIcons";
import useFlashingPriceIds from "../../hooks/useFlashingPriceIds";
import { formatPercent, formatUsd } from "../../utils/format";
import { buildPricesSnapshot } from "../../utils/voteSnapshots";

export default function CoinPricesSection({
  prices,
  status,
  error,
  itemReference,
  relatedCoins = [],
  onRetry,
  expanded = false,
  onExpandedChange,
  staggerIndex = 0,
}) {
  const flashingIds = useFlashingPriceIds(prices);

  return (
    <SectionCard
      id="section-prices"
      staggerIndex={staggerIndex}
      title="Coin Prices"
      icon={<PricesIcon />}
      preview={
        prices.length > 0
          ? `${prices[0].name}: ${formatUsd(prices[0].price_usd)} (${formatPercent(prices[0].change_24h)} 24h)`
          : "No price data available for your assets."
      }
      collapsedPreview={<PricesMiniTable prices={prices} flashingIds={flashingIds} />}
      expandLabel="Open full coin prices"
      sectionName="prices"
      itemReference={itemReference}
      contentSnapshot={status === "success" ? buildPricesSnapshot(prices) : null}
      sourceLabel="CoinGecko"
      relatedCoins={relatedCoins}
      status={status}
      error={error}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      skeletonLayout="list"
      onRetry={onRetry}
      expandedContent={
        <SectionContent
          isEmpty={prices.length === 0}
          emptyMessage="No price data available for your assets."
          renderContent={() => <PricesChartGrid prices={prices} flashingIds={flashingIds} />}
        />
      }
    />
  );
}
