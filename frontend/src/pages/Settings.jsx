import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePreferences } from "../api/auth";
import PreferencesFields from "../components/features/preferences/PreferencesFields";
import PageHeader from "../components/layout/PageHeader";
import PageLayout from "../components/layout/PageLayout";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import usePreferencesForm from "../hooks/usePreferencesForm";
import { getApiErrorMessage } from "../utils/apiError";

export default function Settings() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const preferences = user?.preferences;
  const [success, setSuccess] = useState("");

  const {
    assets,
    investorType,
    contentTypes,
    error,
    setError,
    submitting,
    toggleAsset,
    setInvestorType,
    toggleContentType,
    handleSubmit,
  } = usePreferencesForm({
    initialPreferences: preferences,
    onSubmit: async (values) => {
      setSuccess("");
      try {
        const updatedUser = await updatePreferences(values);
        updateUser(updatedUser);
        setSuccess("Piggy will use these preferences in future briefs.");
      } catch (err) {
        setError(getApiErrorMessage(err, "Unable to save your preferences."));
      }
    },
  });

  return (
    <PageLayout>
      <PageHeader
        backTo="/dashboard"
        backLabel="Back to dashboard"
        title="Edit preferences"
        description="Update what Piggy Daily prioritizes in your daily brief."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <PreferencesFields
          assets={assets}
          investorType={investorType}
          contentTypes={contentTypes}
          onAssetsChange={toggleAsset}
          onInvestorTypeChange={setInvestorType}
          onContentTypesChange={toggleContentType}
          idPrefix="settings-"
          variant="flat"
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={submitting}>
            {submitting ? "Saving preferences..." : "Save preferences"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            fullWidth
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </PageLayout>
  );
}
