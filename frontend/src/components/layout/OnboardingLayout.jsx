import PiggyAvatar from "../brand/PiggyAvatar";
import OnboardingIllustration from "../illustrations/OnboardingIllustration";

export default function OnboardingLayout({ title, subtitle, overline, intro, children }) {
  return (
    <div className="crypto-bg-pattern min-h-screen px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
            <PiggyAvatar size="md" />
          </div>
          {overline && (
            <p className="text-sm font-medium uppercase tracking-wider text-piggy-pink">{overline}</p>
          )}
          <h1 className="mt-2 font-heading text-3xl font-bold text-piggy-charcoal">{title}</h1>
          {intro && (
            <p className="mt-3 text-base font-medium text-piggy-charcoal">{intro}</p>
          )}
          {subtitle && <p className="mt-2 text-piggy-gray">{subtitle}</p>}
        </div>

        <div className="mb-8 overflow-hidden rounded-card border border-piggy-border bg-piggy-cream shadow-card">
          <OnboardingIllustration className="aspect-[3/2] w-full" />
        </div>

        {children}
      </div>
    </div>
  );
}
