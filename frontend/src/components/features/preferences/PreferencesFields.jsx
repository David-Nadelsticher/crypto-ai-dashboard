import CheckboxCard from "../../ui/CheckboxCard";
import RadioCard from "../../ui/RadioCard";
import FormSectionCard from "../../ui/FormSectionCard";
import {
  ASSET_OPTIONS,
  CONTENT_TYPES,
  INVESTOR_TYPES,
} from "../../../config/preferencesOptions";
import {
  ONBOARDING_STEP_IDS,
  ONBOARDING_STEPS,
} from "../../../utils/onboardingSteps";

const SECTIONS = [
  {
    field: "assets",
    idSlug: "asset",
    title: "Which assets should Piggy keep an eye on for you?",
    description: "Pick the coins you want in your daily brief.",
    options: ASSET_OPTIONS,
    type: "checkbox",
    name: "assets",
  },
  {
    field: "investorType",
    idSlug: "investor",
    title: "Which investor profile sounds most like you?",
    description: "This helps Piggy tailor tone and focus.",
    options: INVESTOR_TYPES,
    type: "radio",
    name: "investor_type",
  },
  {
    field: "contentTypes",
    idSlug: "content",
    title: "What should Piggy focus on in your daily brief?",
    description: "Choose the content types that matter most to you.",
    options: CONTENT_TYPES,
    type: "checkbox",
    name: "content_types",
  },
];

function getStepBlockedMessage(step, focusedStep, firstIncompleteStep) {
  if (step === 2 && focusedStep === 2 && firstIncompleteStep === 1) {
    return "Complete the earlier step above before finishing here.";
  }
  if (step === 3 && focusedStep === 3 && firstIncompleteStep !== null && firstIncompleteStep < 3) {
    return "Complete the earlier steps above before finishing here.";
  }
  return null;
}

export default function PreferencesFields({
  assets,
  investorType,
  contentTypes,
  onAssetsChange,
  onInvestorTypeChange,
  onContentTypesChange,
  idPrefix = "",
  variant = "flat",
  focusedStep,
  firstIncompleteStep,
}) {
  const values = { assets, investorType, contentTypes };
  const handlers = {
    assets: onAssetsChange,
    investorType: onInvestorTypeChange,
    contentTypes: onContentTypesChange,
  };

  return (
    <>
      {SECTIONS.map((section, index) => {
        const step = index + 1;
        const isStepped = variant === "stepped";
        const kicker = isStepped ? (
          <>
            Step {step}
            <span className="section-preview-kicker-accent"> · {ONBOARDING_STEPS[index].label}</span>
          </>
        ) : undefined;

        const blockedMessage =
          isStepped && focusedStep !== undefined && firstIncompleteStep !== undefined
            ? getStepBlockedMessage(step, focusedStep, firstIncompleteStep)
            : undefined;

        return (
          <FormSectionCard
            key={section.field}
            id={isStepped ? ONBOARDING_STEP_IDS[index] : undefined}
            title={section.title}
            description={section.description}
            kicker={kicker}
            required={isStepped}
            blockedMessage={blockedMessage}
            variant={variant}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {section.options.map((option) => {
                const id = `${idPrefix}${section.idSlug}-${option}`;

                if (section.type === "radio") {
                  return (
                    <RadioCard
                      key={option}
                      id={id}
                      name={section.name}
                      value={option}
                      label={option}
                      checked={investorType === option}
                      onChange={(event) => onInvestorTypeChange(event.target.value)}
                    />
                  );
                }

                const currentValues = values[section.field];
                const onChange = handlers[section.field];

                return (
                  <CheckboxCard
                    key={option}
                    id={id}
                    name={section.name}
                    label={option}
                    checked={currentValues.includes(option)}
                    onChange={() => onChange(option)}
                  />
                );
              })}
            </div>
          </FormSectionCard>
        );
      })}
    </>
  );
}
