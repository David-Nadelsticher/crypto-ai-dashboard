import LazyImage from "./LazyImage";

const SIZE_CLASSES = {
  sm: "h-4 w-4 text-[8px]",
  md: "h-5 w-5 text-[9px]",
};

function TickerFallback({ ticker, size = "sm" }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-piggy-peach/50 font-bold uppercase text-piggy-charcoal ${SIZE_CLASSES[size]}`}
      aria-hidden="true"
    >
      {ticker.slice(0, 3)}
    </span>
  );
}

export default function CoinIcon({ asset, size = "sm", className = "" }) {
  if (!asset) return null;

  const fallback = <TickerFallback ticker={asset.ticker} size={size} />;

  if (!asset.iconUrl) {
    return fallback;
  }

  return (
    <LazyImage
      src={asset.iconUrl}
      alt=""
      wrapperClassName={`shrink-0 ${SIZE_CLASSES[size]} ${className}`.trim()}
      imgClassName="h-full w-full rounded-full object-cover"
      fallback={fallback}
    />
  );
}
