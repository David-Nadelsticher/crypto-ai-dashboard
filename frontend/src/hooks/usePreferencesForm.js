import { useState } from "react";

const DEFAULT_VALIDATION_MESSAGES = {
  assets: "Pick at least one asset for Piggy to monitor.",
  investorType: "Select the investor profile that fits you best.",
  contentTypes: "Pick at least one content type for your daily brief.",
};

export default function usePreferencesForm({
  initialPreferences,
  onSubmit,
  validationMessages = DEFAULT_VALIDATION_MESSAGES,
  onValidationFail,
}) {
  const [assets, setAssets] = useState(initialPreferences?.assets || []);
  const [investorType, setInvestorType] = useState(initialPreferences?.investor_type || "");
  const [contentTypes, setContentTypes] = useState(initialPreferences?.content_types || []);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isComplete = assets.length > 0 && Boolean(investorType) && contentTypes.length > 0;

  function toggleAsset(value) {
    setAssets((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  }

  function toggleContentType(value) {
    setContentTypes((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  }

  function validate() {
    if (assets.length === 0) {
      setError(validationMessages.assets);
      onValidationFail?.("assets");
      return false;
    }
    if (!investorType) {
      setError(validationMessages.investorType);
      onValidationFail?.("investorType");
      return false;
    }
    if (contentTypes.length === 0) {
      setError(validationMessages.contentTypes);
      onValidationFail?.("contentTypes");
      return false;
    }
    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        assets,
        investor_type: investorType,
        content_types: contentTypes,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return {
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
  };
}
