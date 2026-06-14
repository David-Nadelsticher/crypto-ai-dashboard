import { ONBOARDING_STEPS } from "../../utils/onboardingSteps";
import Badge from "./Badge";
import Kicker from "./Kicker";

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
        <Kicker>Setup progress</Kicker>
        <Badge variant="cream" size="sm" className="shrink-0 ring-1 ring-piggy-border">
          {completedCount}/{totalSteps} saved
        </Badge>
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
