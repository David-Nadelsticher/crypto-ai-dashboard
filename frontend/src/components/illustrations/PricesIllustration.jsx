import LazyImage from "../ui/LazyImage";

function PricesIllustrationFallback({ className = "" }) {
  return (
    <svg viewBox="0 0 640 400" aria-hidden="true" className={`object-contain ${className}`}>
      <rect width="640" height="400" rx="16" fill="#FFF8F1" />
      <rect x="180" y="40" width="280" height="170" rx="8" fill="#FFFDF9" stroke="#F1E7DE" />
      <polyline
        points="200,170 240,140 280,150 320,120 360,130 400,100 440,110"
        fill="none"
        stroke="#55B685"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="80" y="230" width="480" height="120" rx="12" fill="#F1E7DE" opacity="0.5" />
      <circle cx="320" cy="290" r="36" fill="#FF8BA7" />
      <text x="320" y="300" textAnchor="middle" fontSize="28" fill="#2E2A27">
        ₿
      </text>
    </svg>
  );
}

export default function PricesIllustration({ className = "" }) {
  return (
    <div className={`prices-illustration-soft mx-auto w-[88%] max-w-sm sm:max-w-md ${className}`}>
      <LazyImage
        src="/prices-trader-illustration.png"
        alt="Editorial illustration of market price analysis"
        wrapperClassName="mx-auto w-full overflow-hidden rounded-3xl"
        imgClassName="h-full w-full rounded-3xl object-contain object-center"
        fallback={<PricesIllustrationFallback className="w-full" />}
      />
    </div>
  );
}
