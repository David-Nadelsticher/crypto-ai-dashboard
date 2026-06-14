export const ONBOARDING_STEPS = [
  {
    id: "onboarding-step-assets",
    label: "Assets",
    action: "Select at least one asset.",
  },
  {
    id: "onboarding-step-investor",
    label: "Investor profile",
    action: "Choose the profile that fits you best.",
  },
  {
    id: "onboarding-step-content",
    label: "Content focus",
    action: "Pick at least one content type.",
  },
];

export const ONBOARDING_STEP_IDS = ONBOARDING_STEPS.map((step) => step.id);

export function getOnboardingStepCompletion({ assets, investorType, contentTypes }) {
  return [
    assets.length > 0,
    Boolean(investorType),
    contentTypes.length > 0,
  ];
}

export function getFirstIncompleteStep(completion) {
  const index = completion.findIndex((done) => !done);
  return index === -1 ? null : index + 1;
}

export function getFocusedStep(activeSectionId) {
  const index = ONBOARDING_STEP_IDS.indexOf(activeSectionId);
  return index >= 0 ? index + 1 : 1;
}

export function getProgressSummary(focusedStep, completion) {
  const completedCount = completion.filter(Boolean).length;
  const totalSteps = completion.length;
  const firstIncomplete = getFirstIncompleteStep(completion);
  const focusedComplete = completion[focusedStep - 1];
  const focusedMeta = ONBOARDING_STEPS[focusedStep - 1];

  let status = "current-incomplete";
  if (firstIncomplete === null) {
    status = "all-done";
  } else if (focusedStep > firstIncomplete) {
    status = "ahead-warning";
  } else if (focusedComplete) {
    status = "current-complete";
  }

  return {
    completedCount,
    totalSteps,
    focusedStep,
    stepCompletion: completion,
    stepLabel: focusedMeta.label,
    status,
  };
}

export function scrollToOnboardingStep(stepNumber) {
  const sectionId = ONBOARDING_STEP_IDS[stepNumber - 1];
  const section = sectionId ? document.getElementById(sectionId) : null;

  if (!section) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  section.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
}
