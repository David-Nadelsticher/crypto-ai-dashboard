import { ONBOARDING_STEPS } from "../../utils/onboardingSteps";

export default function OnboardingProgress({ summary }) {
  const { completedCount, totalSteps, status } = summary;
  const containerStyle =
    status === "all-done"
      ? "border-piggy-positive/25 bg-piggy-positive/5"
      : status === "ahead-warning"
        ? "border-piggy-peach/60 bg-piggy-peach/15"
        : "border-piggy-border bg-piggy-card";

  return (
    <section
      className={`mb-6 rounded-xl border p-4 shadow-card ${containerStyle}`}
      aria-label={`Setup progress: ${completedCount} of ${totalSteps} steps saved`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="section-preview-kicker">Setup progress</p>
        <p className="shrink-0 rounded-full bg-piggy-cream px-2.5 py-1 text-xs font-semibold text-piggy-charcoal ring-1 ring-piggy-border">
          {completedCount}/{totalSteps} saved
        </p>
      </div>

      <div className="flex gap-2" role="presentation" aria-hidden="true">
        {ONBOARDING_STEPS.map((step, index) => {
          const isComplete = summary.stepCompletion[index];

          return (
            <div key={step.id} className="flex-1">
              <div
                className={`h-2 rounded-full transition-colors ${
                  isComplete ? "bg-piggy-pink" : "bg-piggy-border"
                }`}
                title={isComplete ? `${step.label} complete` : `${step.label} required`}
              />
              <p className="mt-1 text-center text-[10px] font-medium uppercase tracking-wide text-piggy-gray">
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
