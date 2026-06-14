import { formatPercent } from "../../utils/format";
import { buildSnapshotItems } from "../../utils/marketIndicators";

export default function MarketSnapshotBar({ prices = [], pricesStatus, variant = "default" }) {
  const isLoading = pricesStatus === "loading" || pricesStatus === "refreshing";
  const isHero = variant === "hero";

  if (isLoading) {
    return (
      <p
        className={`text-sm text-piggy-gray ${isHero ? "relative" : "mt-4"}`}
        role="status"
        aria-live="polite"
      >
        Piggy is reading the market…
      </p>
    );
  }

  const items = buildSnapshotItems(prices);

  return (
    <div
      className={
        isHero
          ? "dashboard-hero-snapshot relative"
          : "mt-4 overflow-x-auto rounded-lg border border-piggy-border bg-piggy-cream/50 px-4 py-2.5"
      }
      role="region"
      aria-label="Market snapshot"
    >
      <div className="flex min-w-max items-center gap-3 text-sm whitespace-nowrap">
        {items.map((item, index) => (
          <span key={item.symbol} className="flex items-center gap-3">
            {index > 0 && <span className="text-piggy-border" aria-hidden="true">·</span>}
            <span className="font-semibold text-piggy-charcoal">
              {item.symbol}{" "}
              <span
                className={
                  item.change24h >= 0 ? "text-piggy-positive" : "text-piggy-negative"
                }
              >
                {formatPercent(item.change24h)}
              </span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
