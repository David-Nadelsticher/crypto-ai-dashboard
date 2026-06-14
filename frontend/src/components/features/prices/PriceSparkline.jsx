import { buildSparklinePath } from "../../../utils/priceSparkline.js";

export default function PriceSparkline({ series, change24h, seedKey, className = "" }) {
  const positive = (change24h ?? 0) >= 0;
  const stroke = positive ? "var(--color-piggy-positive)" : "var(--color-piggy-negative)";
  const fill = positive ? "var(--color-piggy-positive)" : "var(--color-piggy-negative)";

  const { line, area, lastPoint, baselineY, width, height } = buildSparklinePath({
    series,
    change24h,
    seedKey,
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full ${className}`}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {[0.25, 0.5, 0.75].map((ratio) => (
        <line
          key={ratio}
          x1="0"
          y1={height * ratio}
          x2={width}
          y2={height * ratio}
          stroke="var(--color-piggy-border)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
      ))}
      <line
        x1="0"
        y1={baselineY}
        x2={width}
        y2={baselineY}
        stroke={stroke}
        strokeWidth="1"
        strokeOpacity="0.25"
        strokeDasharray="2 3"
      />
      <path d={area} fill={fill} fillOpacity="0.12" />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="motion-draw-stroke motion-reduce:animate-none"
      />
      <circle cx={lastPoint.x} cy={lastPoint.y} r="3" fill={stroke} />
    </svg>
  );
}
