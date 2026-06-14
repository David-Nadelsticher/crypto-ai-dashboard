import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitOnboarding } from "../api/auth";
import OnboardingLayout from "../components/OnboardingLayout";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import CheckboxCard from "../components/ui/CheckboxCard";
import OnboardingProgress from "../components/ui/OnboardingProgress";
import PiggyAvatar from "../components/ui/PiggyAvatar";
import RadioCard from "../components/ui/RadioCard";
import { useAuth } from "../context/AuthContext";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { getApiErrorMessage } from "../utils/apiError";
import {
  getFocusedStep,
  getFirstIncompleteStep,
  getOnboardingStepCompletion,
  getProgressSummary,
  ONBOARDING_STEP_IDS,
  ONBOARDING_STEPS,
  scrollToOnboardingStep,
} from "../utils/onboardingSteps";

const ASSET_OPTIONS = ["Bitcoin", "Ethereum", "Solana", "Cardano"];
const INVESTOR_TYPES = ["Day Trader", "HODLer", "NFT Collector"];
const CONTENT_TYPES = ["Market News", "Charts", "Social", "Fun"];

function SelectionCard({
  step,
  stepLabel,
  title,
  description,
  isBlockedAhead,
  children,
}) {
  return (
    <section
      id={ONBOARDING_STEP_IDS[step - 1]}
      className="scroll-mt-8 rounded-xl border border-piggy-border bg-piggy-card p-6 shadow-card"
    >
      <p className="section-preview-kicker">
        Step {step}
        <span className="section-preview-kicker-accent"> · {stepLabel}</span>
      </p>
      <h2 className="mt-1 font-heading text-lg font-semibold text-piggy-charcoal">
        {title}
        <span className="text-piggy-pink" aria-hidden="true">
          {" "}
          *
        </span>
        <span className="sr-only"> (required)</span>
      </h2>
      {description && <p className="mt-1 text-sm text-piggy-gray">{description}</p>}
      {isBlockedAhead && (
        <p className="mt-2 text-sm text-piggy-gray">
          Complete the earlier step{step > 2 ? "s" : ""} above before finishing here.
        </p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const prefersReducedMotion = usePrefersReducedMotion();

  const [assets, setAssets] = useState([]);
  const [investorType, setInvestorType] = useState("");
  const [contentTypes, setContentTypes] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigateTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (navigateTimeoutRef.current) {
        window.clearTimeout(navigateTimeoutRef.current);
      }
    };
  }, []);

  const activeSectionId = useScrollSpy(ONBOARDING_STEP_IDS, {
    rootMargin: "-20% 0px -55% 0px",
    threshold: [0, 0.25, 0.5],
  });

  const stepCompletion = getOnboardingStepCompletion({
    assets,
    investorType,
    contentTypes,
  });
  const focusedStep = getFocusedStep(activeSectionId);
  const firstIncompleteStep = getFirstIncompleteStep(stepCompletion);
  const progressSummary = getProgressSummary(focusedStep, stepCompletion);
  const isOnboardingComplete = stepCompletion.every(Boolean);

  function toggleItem(list, setList, value) {
    setList((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (assets.length === 0) {
      setError("Pick at least one asset for Piggy to monitor.");
      scrollToOnboardingStep(1);
      return;
    }
    if (!investorType) {
      setError("Select the investor profile that fits you best.");
      scrollToOnboardingStep(2);
      return;
    }
    if (contentTypes.length === 0) {
      setError("Pick at least one content type for your daily brief.");
      scrollToOnboardingStep(3);
      return;
    }

    setSubmitting(true);
    try {
      const updatedUser = await submitOnboarding({
        assets,
        investor_type: investorType,
        content_types: contentTypes,
      });
      updateUser(updatedUser);
      if (prefersReducedMotion) {
        navigate("/dashboard", { replace: true });
        return;
      }
      setShowSuccess(true);
      navigateTimeoutRef.current = window.setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 400);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to save your preferences."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {showSuccess && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-piggy-card/95 px-6 motion-fade-in motion-reduce:animate-none"
          role="status"
          aria-live="polite"
        >
          <PiggyAvatar size="lg" className="motion-scale-in motion-reduce:animate-none" />
          <p
            className="mt-4 text-center font-heading text-xl font-semibold text-piggy-charcoal motion-slide-up motion-reduce:animate-none"
            style={{ "--motion-delay": "80ms" }}
          >
            Piggy has your brief ready
          </p>
          <p
            className="mt-2 text-sm text-piggy-gray motion-slide-up motion-reduce:animate-none"
            style={{ "--motion-delay": "140ms" }}
          >
            Opening today&apos;s brief…
          </p>
        </div>
      )}

      <OnboardingLayout
      overline={`Welcome${user?.name ? `, ${user.name}` : ""}`}
      title="Personalize your dashboard"
      intro="Just before jumping into the water"
      subtitle="Tell Piggy what to watch so your daily brief is tailored to you."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <OnboardingProgress summary={progressSummary} />

        {error && <Alert variant="error">{error}</Alert>}

        <SelectionCard
          step={1}
          stepLabel={ONBOARDING_STEPS[0].label}
          title="Which assets should Piggy keep an eye on for you?"
          description="Pick the coins you want in your daily brief."
          isBlockedAhead={false}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {ASSET_OPTIONS.map((asset) => (
              <CheckboxCard
                key={asset}
                id={`asset-${asset}`}
                name="assets"
                label={asset}
                checked={assets.includes(asset)}
                onChange={() => toggleItem(assets, setAssets, asset)}
              />
            ))}
          </div>
        </SelectionCard>

        <SelectionCard
          step={2}
          stepLabel={ONBOARDING_STEPS[1].label}
          title="Which investor profile sounds most like you?"
          description="This helps Piggy tailor tone and focus."
          isBlockedAhead={focusedStep === 2 && firstIncompleteStep === 1}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {INVESTOR_TYPES.map((type) => (
              <RadioCard
                key={type}
                id={`investor-${type}`}
                name="investor_type"
                value={type}
                label={type}
                checked={investorType === type}
                onChange={(event) => setInvestorType(event.target.value)}
              />
            ))}
          </div>
        </SelectionCard>

        <SelectionCard
          step={3}
          stepLabel={ONBOARDING_STEPS[2].label}
          title="What should Piggy focus on in your daily brief?"
          description="Choose the content types that matter most to you."
          isBlockedAhead={
            focusedStep === 3 && firstIncompleteStep !== null && firstIncompleteStep < 3
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {CONTENT_TYPES.map((type) => (
              <CheckboxCard
                key={type}
                id={`content-${type}`}
                name="content_types"
                label={type}
                checked={contentTypes.includes(type)}
                onChange={() => toggleItem(contentTypes, setContentTypes, type)}
              />
            ))}
          </div>
        </SelectionCard>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          className="btn-onboarding-submit"
          disabled={!isOnboardingComplete || submitting}
          aria-disabled={!isOnboardingComplete || submitting}
        >
          {submitting ? "Saving preferences..." : "Continue to dashboard"}
        </Button>
      </form>
    </OnboardingLayout>
    </>
  );
}
