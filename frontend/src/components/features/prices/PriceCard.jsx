import CoinIcon from "../../brand/CoinIcon";
import PriceSparkline from "./PriceSparkline";
import { formatPercent, formatUsd, formatVolume } from "../../../utils/format";

export default function PriceCard({ coin, asset, flashing = false, variant = "card" }) {
  if (variant === "table") {
    return (
      <tr className="border-b border-piggy-border/60 last:border-0">
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
            flashing ? "motion-flash motion-reduce:animate-none rounded" : ""
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
  }

  return (
    <div className="motion-card rounded-xl border border-piggy-border bg-piggy-cream/40 p-4">
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
              flashing ? "motion-flash motion-reduce:animate-none rounded px-1" : ""
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
}
