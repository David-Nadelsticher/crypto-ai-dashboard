import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitOnboarding } from "../api/auth";
import OnboardingLayout from "../components/layout/OnboardingLayout";
import PreferencesFields from "../components/features/preferences/PreferencesFields";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import OnboardingProgress from "../components/ui/OnboardingProgress";
import PiggyAvatar from "../components/brand/PiggyAvatar";
import { useAuth } from "../context/AuthContext";
import usePreferencesForm from "../hooks/usePreferencesForm";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { getApiErrorMessage } from "../utils/apiError";
import {
  getFocusedStep,
  getFirstIncompleteStep,
  getOnboardingStepCompletion,
  getProgressSummary,
  ONBOARDING_STEP_IDS,
  scrollToOnboardingStep,
} from "../utils/onboardingSteps";

const VALIDATION_STEP = {
  assets: 1,
  investorType: 2,
  contentTypes: 3,
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const prefersReducedMotion = usePrefersReducedMotion();

  const [showSuccess, setShowSuccess] = useState(false);
  const navigateTimeoutRef = useRef(null);

  const {
    assets,
    investorType,
    contentTypes,
    error,
    setError,
    submitting,
    isComplete,
    toggleAsset,
    setInvestorType,
    toggleContentType,
    handleSubmit,
  } = usePreferencesForm({
    onSubmit: async (values) => {
      try {
        const updatedUser = await submitOnboarding(values);
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
      }
    },
    onValidationFail: (field) => {
      scrollToOnboardingStep(VALIDATION_STEP[field]);
    },
  });

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

          <PreferencesFields
            assets={assets}
            investorType={investorType}
            contentTypes={contentTypes}
            onAssetsChange={toggleAsset}
            onInvestorTypeChange={setInvestorType}
            onContentTypesChange={toggleContentType}
            variant="stepped"
            focusedStep={focusedStep}
            firstIncompleteStep={firstIncompleteStep}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="btn-onboarding-submit"
            disabled={!isComplete || submitting}
            aria-disabled={!isComplete || submitting}
          >
            {submitting ? "Saving preferences..." : "Continue to dashboard"}
          </Button>
        </form>
      </OnboardingLayout>
    </>
  );
}
