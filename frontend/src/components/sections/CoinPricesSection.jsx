import { useEffect, useRef, useState } from "react";
import SectionCard from "../features/dashboard/SectionCard";
import SectionContent from "../features/dashboard/SectionContent";
import PriceSparkline from "../features/prices/PriceSparkline";
import PricesIllustration from "../illustrations/PricesIllustration";
import { PricesIcon } from "../icons/SectionIcons";
import CoinIcon from "../brand/CoinIcon";
import { resolveAssetMeta } from "../../config/cryptoAssets";
import { SECTION_BY_ID } from "../../config/dashboardSections";
import { formatPercent, formatUsd, formatVolume } from "../../utils/format";
import { buildPricesSnapshot } from "../../utils/voteSnapshots";

const SECTION_META = SECTION_BY_ID["section-prices"];

function PricesMonitoringLabel({ count }) {
  if (count === 0) return null;

  return (
    <p className="section-preview-kicker mb-3">
      Piggy is tracking{" "}
      <span className="section-preview-kicker-accent">{count}</span>{" "}
      {count === 1 ? "asset" : "assets"} today.
    </p>
  );
}

function useFlashingPriceIds(prices) {
  const prevRef = useRef(null);
  const [flashingIds, setFlashingIds] = useState(() => new Set());

  useEffect(() => {
    if (!Array.isArray(prices) || prices.length === 0) {
      prevRef.current = prices;
      return;
    }

    if (!prevRef.current) {
      prevRef.current = prices;
      return;
    }

    const changed = new Set();
    for (const coin of prices) {
      const prev = prevRef.current.find((item) => item.id === coin.id);
      if (prev && prev.price_usd !== coin.price_usd) {
        changed.add(coin.id);
      }
    }

    prevRef.current = prices;

    if (changed.size === 0) return undefined;

    setFlashingIds(changed);
    const timer = window.setTimeout(() => setFlashingIds(new Set()), 320);
    return () => window.clearTimeout(timer);
  }, [prices]);

  return flashingIds;
}

function PricesMiniTable({ prices, flashingIds }) {
  if (prices.length === 0) {
    return (
      <p className="text-sm text-piggy-gray">No price data available for your assets.</p>
    );
  }

  return (
    <div>
      <PricesMonitoringLabel count={prices.length} />
      <div className="overflow-hidden rounded-lg border border-piggy-border">
      <table className="w-full text-sm">
        <caption className="sr-only">Coin prices for your tracked assets</caption>
        <thead>
          <tr className="border-b border-piggy-border bg-piggy-cream/50 text-left text-xs text-piggy-gray">
            <th scope="col" className="px-3 py-2 font-medium">
              Coin
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              Price
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              24h
            </th>
          </tr>
        </thead>
        <tbody>
          {prices.slice(0, 4).map((coin) => {
            const asset = resolveAssetMeta(coin.id);

            return (
            <tr key={coin.id} className="border-b border-piggy-border/60 last:border-0">
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <CoinIcon asset={asset} size="md" />
                  <div className="min-w-0">
                    <span className="block font-medium leading-tight text-piggy-charcoal">
                      {asset?.name || coin.name}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-piggy-gray">
                      {asset?.ticker || coin.symbol}
                    </span>
                  </div>
                </div>
              </td>
              <td
                className={`px-3 py-2.5 text-right font-medium tabular-nums text-piggy-charcoal ${
                  flashingIds.has(coin.id) ? "motion-flash motion-reduce:animate-none rounded" : ""
                }`}
              >
                {formatUsd(coin.price_usd)}
              </td>
              <td
                className={`px-3 py-2.5 text-right font-medium tabular-nums ${
                  coin.change_24h >= 0 ? "text-piggy-positive" : "text-piggy-negative"
                }`}
              >
                {formatPercent(coin.change_24h)}
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    </div>
  );
}

function PricesChartGrid({ prices, flashingIds }) {
  return (
    <div className="space-y-6">
      <PricesMonitoringLabel count={prices.length} />
      <div className="grid gap-4 sm:grid-cols-2">
        {prices.map((coin) => {
          const asset = resolveAssetMeta(coin.id);

          return (
          <div
            key={coin.id}
            className="motion-card rounded-xl border border-piggy-border bg-piggy-cream/40 p-4"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <CoinIcon asset={asset} size="md" />
                <div className="min-w-0">
                  <p className="font-medium leading-tight text-piggy-charcoal">{asset?.name || coin.name}</p>
                  <p className="text-xs uppercase tracking-wide text-piggy-gray">{asset?.ticker || coin.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-bold tabular-nums text-piggy-charcoal ${
                    flashingIds.has(coin.id) ? "motion-flash motion-reduce:animate-none rounded px-1" : ""
                  }`}
                >
                  {formatUsd(coin.price_usd)}
                </p>
                <p
                  className={`text-sm font-medium tabular-nums ${
                    coin.change_24h >= 0 ? "text-piggy-positive" : "text-piggy-negative"
                  }`}
                >
                  {formatPercent(coin.change_24h)}
                </p>
              </div>
            </div>

            <PriceSparkline
              series={coin.sparkline_7d}
              change24h={coin.change_24h}
              seedKey={coin.id}
              className="h-14 sm:h-16"
            />
            <p className="mt-1 text-[10px] uppercase tracking-wide text-piggy-gray">7d trend</p>

            {coin.volume_24h != null && (
              <p className="mt-3 text-xs text-piggy-gray">
                24h volume:{" "}
                <span className="font-medium text-piggy-charcoal">{formatVolume(coin.volume_24h)}</span>
              </p>
            )}
          </div>
          );
        })}
      </div>

      <div className="border-t border-piggy-border pt-6">
        <figure className="mx-auto flex justify-center px-2 py-3 sm:px-4">
          <PricesIllustration className="aspect-[16/10] sm:aspect-[5/3]" />
        </figure>
      </div>
    </div>
  );
}

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
