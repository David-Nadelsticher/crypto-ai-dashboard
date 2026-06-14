import LazyImage from "../ui/LazyImage";

function OnboardingIllustrationFallback({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center bg-gradient-to-br from-piggy-peach/30 to-piggy-pink/20 ${className}`}
    >
      <span className="text-4xl" aria-hidden="true">
        🐷
      </span>
    </div>
  );
}

export default function OnboardingIllustration({ className = "" }) {
  return (
    <LazyImage
      src="/onboarding-illustration.png"
      alt="Piggy Daily editor reviewing market data"
      wrapperClassName={`w-full bg-piggy-cream ${className}`}
      imgClassName="h-full w-full object-contain object-center"
      loading="eager"
      fallback={<OnboardingIllustrationFallback className={className} />}
    />
  );
}
