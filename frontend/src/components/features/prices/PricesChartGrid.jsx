import { SectionCountKicker } from "../../ui/Kicker";
import PricesIllustration from "../../illustrations/PricesIllustration";
import { resolveAssetMeta } from "../../../config/cryptoAssets";
import PriceCard from "./PriceCard";

export default function PricesChartGrid({ prices, flashingIds }) {
  return (
    <div className="space-y-6">
      <SectionCountKicker verb="Piggy is tracking" count={prices.length} noun="asset" />
      <div className="grid gap-4 sm:grid-cols-2">
        {prices.map((coin) => {
          const asset = resolveAssetMeta(coin.id);
          return (
            <PriceCard
              key={coin.id}
              coin={coin}
              asset={asset}
              flashing={flashingIds.has(coin.id)}
              variant="card"
            />
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
