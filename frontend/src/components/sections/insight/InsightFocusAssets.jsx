import CoinIcon from "../../brand/CoinIcon";
import Badge from "../../ui/Badge";
import { resolveFocusAssets } from "../../../config/cryptoAssets";

export default function InsightFocusAssets({ relatedCoins = [] }) {
  const focusAssets = resolveFocusAssets(relatedCoins);
  if (focusAssets.length === 0) return null;

  return (
    <dl className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-piggy-gray">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <dt className="font-medium">Focus:</dt>
        <dd className="m-0 flex flex-wrap items-center gap-1.5">
          {focusAssets.map((asset) => (
            <Badge key={asset.id} variant="peach" size="sm" icon={<CoinIcon asset={asset} size="sm" />}>
              {asset.ticker}
            </Badge>
          ))}
        </dd>
      </div>
    </dl>
  );
}
