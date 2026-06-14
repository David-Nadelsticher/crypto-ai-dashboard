import LazyImage from "./LazyImage";

function InsightIllustrationFallback({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={`insight-guide-mascot shrink-0 object-contain ${className}`}
    >
      <circle cx="100" cy="100" r="88" fill="#FF8BA7" opacity="0.25" />
      <circle cx="100" cy="105" r="50" fill="#FF8BA7" />
      <ellipse cx="100" cy="112" rx="35" ry="28" fill="#FFC9A5" />
      <circle cx="82" cy="95" r="5" fill="#2E2A27" />
      <circle cx="118" cy="95" r="5" fill="#2E2A27" />
      <rect x="70" y="88" width="60" height="12" rx="6" fill="#2E2A27" opacity="0.8" />
    </svg>
  );
}

export default function InsightIllustration({ className = "" }) {
  return (
    <div className={`insight-guide-mascot aspect-square shrink-0 ${className}`} aria-hidden="true">
      <LazyImage
        src="/piggy-guide.png"
        alt=""
        wrapperClassName="h-full w-full overflow-hidden rounded-full"
        imgClassName="h-full w-full scale-[1.18] object-cover object-[center_18%]"
        fallback={<InsightIllustrationFallback className="h-full w-full" />}
      />
    </div>
  );
}
