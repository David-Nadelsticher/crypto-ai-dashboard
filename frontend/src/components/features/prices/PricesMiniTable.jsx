import { SectionCountKicker } from "../../ui/Kicker";
import { resolveAssetMeta } from "../../../config/cryptoAssets";
import PriceCard from "./PriceCard";

export default function PricesMiniTable({ prices, flashingIds }) {
  if (prices.length === 0) {
    return (
      <p className="text-sm text-piggy-gray">No price data available for your assets.</p>
    );
  }

  return (
    <div>
      <SectionCountKicker verb="Piggy is tracking" count={prices.length} noun="asset" />
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
                <PriceCard
                  key={coin.id}
                  coin={coin}
                  asset={asset}
                  flashing={flashingIds.has(coin.id)}
                  variant="table"
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
