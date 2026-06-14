import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updatePreferences } from "../api/auth";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import CheckboxCard from "../components/ui/CheckboxCard";
import RadioCard from "../components/ui/RadioCard";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/apiError";

const ASSET_OPTIONS = ["Bitcoin", "Ethereum", "Solana", "Cardano"];
const INVESTOR_TYPES = ["Day Trader", "HODLer", "NFT Collector"];
const CONTENT_TYPES = ["Market News", "Charts", "Social", "Fun"];

function SettingsCard({ title, description, children }) {
  return (
    <section className="scroll-mt-8 rounded-card border border-piggy-border bg-piggy-card p-6 shadow-card">
      <h2 className="font-heading text-lg font-semibold text-piggy-charcoal">{title}</h2>
      {description && <p className="mt-1 text-sm text-piggy-gray">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const preferences = user?.preferences;

  const [assets, setAssets] = useState(preferences?.assets || []);
  const [investorType, setInvestorType] = useState(preferences?.investor_type || "");
  const [contentTypes, setContentTypes] = useState(preferences?.content_types || []);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function toggleItem(list, setList, value) {
    setList((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (assets.length === 0) {
      setError("Pick at least one asset for Piggy to monitor.");
      return;
    }
    if (!investorType) {
      setError("Select the investor profile that fits you best.");
      return;
    }
    if (contentTypes.length === 0) {
      setError("Pick at least one content type for your daily brief.");
      return;
    }

    setSubmitting(true);
    try {
      const updatedUser = await updatePreferences({
        assets,
        investor_type: investorType,
        content_types: contentTypes,
      });
      updateUser(updatedUser);
      setSuccess("Piggy will use these preferences in future briefs.");
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to save your preferences."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="crypto-bg-pattern min-h-screen px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="focus-ring text-sm font-medium text-piggy-pink hover:opacity-80"
          >
            ← Back to dashboard
          </Link>
          <h1 className="mt-4 font-heading text-3xl font-bold text-piggy-charcoal">
            Edit preferences
          </h1>
          <p className="mt-2 text-piggy-gray">
            Update what Piggy Daily prioritizes in your daily brief.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <Alert variant="error">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <SettingsCard
            title="Which assets should Piggy keep an eye on for you?"
            description="Pick the coins you want in your daily brief."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {ASSET_OPTIONS.map((asset) => (
                <CheckboxCard
                  key={asset}
                  id={`settings-asset-${asset}`}
                  name="assets"
                  label={asset}
                  checked={assets.includes(asset)}
                  onChange={() => toggleItem(assets, setAssets, asset)}
                />
              ))}
            </div>
          </SettingsCard>

          <SettingsCard
            title="Which investor profile sounds most like you?"
            description="This helps Piggy tailor tone and focus."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {INVESTOR_TYPES.map((type) => (
                <RadioCard
                  key={type}
                  id={`settings-investor-${type}`}
                  name="investor_type"
                  value={type}
                  label={type}
                  checked={investorType === type}
                  onChange={(event) => setInvestorType(event.target.value)}
                />
              ))}
            </div>
          </SettingsCard>

          <SettingsCard
            title="What should Piggy focus on in your daily brief?"
            description="Choose the content types that matter most to you."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {CONTENT_TYPES.map((type) => (
                <CheckboxCard
                  key={type}
                  id={`settings-content-${type}`}
                  name="content_types"
                  label={type}
                  checked={contentTypes.includes(type)}
                  onChange={() => toggleItem(contentTypes, setContentTypes, type)}
                />
              ))}
            </div>
          </SettingsCard>

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
      </div>
    </div>
  );
}
