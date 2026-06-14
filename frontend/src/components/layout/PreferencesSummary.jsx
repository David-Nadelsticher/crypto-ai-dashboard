import { resolveFocusAssets } from "../../config/cryptoAssets";
import CoinIcon from "../brand/CoinIcon";

export default function PreferencesSummary({ preferences, variant = "default" }) {
  if (!preferences) return null;

  const { assets = [], investor_type: investorType, content_types: contentTypes = [] } = preferences;

  if (assets.length === 0 && !investorType && contentTypes.length === 0) return null;

  const focusAssets = resolveFocusAssets(assets);
  const isHero = variant === "hero";

  return (
    <div
      className={
        isHero
          ? "relative mt-5 space-y-4"
          : "preferences-summary-bg relative mt-4 space-y-3 rounded-lg border border-piggy-border px-4 py-3"
      }
    >
      {focusAssets.length > 0 && (
        <div className="relative">
          <p className={isHero ? "dashboard-hero-label" : "text-xs font-medium uppercase tracking-wide text-piggy-gray"}>
            Piggy is monitoring
          </p>
          <div className={`flex flex-wrap gap-2 ${isHero ? "mt-2.5" : "mt-1.5"}`}>
            {focusAssets.map((asset) => (
              <span key={asset.id} className={isHero ? "dashboard-hero-chip" : "inline-flex items-center gap-1 text-sm font-medium text-piggy-charcoal"}>
                <CoinIcon asset={asset} size="sm" />
                <span>{asset.name}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {(investorType || contentTypes.length > 0) && (
        <div className="relative">
          <p className={isHero ? "dashboard-hero-label" : "text-xs font-medium uppercase tracking-wide text-piggy-gray"}>
            Piggy prepared today&apos;s brief using
          </p>
          <dl className={`space-y-2 ${isHero ? "mt-2.5 text-sm" : "mt-1 space-y-1 text-sm text-piggy-charcoal"}`}>
            {investorType && (
              <div className="flex flex-wrap items-center gap-2">
                <dt className="font-medium text-piggy-gray">Investor profile</dt>
                <dd className={isHero ? "dashboard-hero-chip m-0" : "m-0 font-medium text-piggy-charcoal"}>
                  {investorType}
                </dd>
              </div>
            )}
            {contentTypes.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <dt className="font-medium text-piggy-gray">Preferred content</dt>
                <dd className="m-0 flex flex-wrap gap-1.5">
                  {contentTypes.map((contentType) => (
                    <span
                      key={contentType}
                      className={isHero ? "dashboard-hero-chip" : "font-medium text-piggy-charcoal"}
                    >
                      {contentType}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
