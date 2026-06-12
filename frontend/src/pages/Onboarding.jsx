import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitOnboarding } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/apiError";

const ASSET_OPTIONS = ["Bitcoin", "Ethereum", "Solana", "Cardano"];
const INVESTOR_TYPES = ["Day Trader", "HODLer", "Crypto Whale", "NFT Collector"];
const CONTENT_TYPES = ["Market News", "Technical Analysis", "Memes & Fun"];

function SelectionCard({ title, description, children }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [assets, setAssets] = useState([]);
  const [investorType, setInvestorType] = useState("");
  const [contentTypes, setContentTypes] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function toggleItem(list, setList, value) {
    setList((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (assets.length === 0) {
      setError("Select at least one crypto asset.");
      return;
    }
    if (!investorType) {
      setError("Select your investor type.");
      return;
    }
    if (contentTypes.length === 0) {
      setError("Select at least one content preference.");
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
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to save your preferences."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">Personalize your dashboard</h1>
        <p className="mt-2 text-slate-400">
          Tell us what you care about so we can tailor your daily crypto feed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        <SelectionCard
          title="Favorite crypto assets"
          description="Which coins do you want to track?"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {ASSET_OPTIONS.map((asset) => (
              <label
                key={asset}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                  assets.includes(asset)
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-slate-700 hover:border-slate-600"
                }`}
              >
                <input
                  type="checkbox"
                  checked={assets.includes(asset)}
                  onChange={() => toggleItem(assets, setAssets, asset)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-slate-200">{asset}</span>
              </label>
            ))}
          </div>
        </SelectionCard>

        <SelectionCard
          title="Investor type"
          description="How do you approach the crypto market?"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {INVESTOR_TYPES.map((type) => (
              <label
                key={type}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                  investorType === type
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-slate-700 hover:border-slate-600"
                }`}
              >
                <input
                  type="radio"
                  name="investor_type"
                  value={type}
                  checked={investorType === type}
                  onChange={(event) => setInvestorType(event.target.value)}
                  className="h-4 w-4 border-slate-600 bg-slate-950 text-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-slate-200">{type}</span>
              </label>
            ))}
          </div>
        </SelectionCard>

        <SelectionCard
          title="Content preferences"
          description="What kind of content should we prioritize?"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {CONTENT_TYPES.map((type) => (
              <label
                key={type}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                  contentTypes.includes(type)
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-slate-700 hover:border-slate-600"
                }`}
              >
                <input
                  type="checkbox"
                  checked={contentTypes.includes(type)}
                  onChange={() => toggleItem(contentTypes, setContentTypes, type)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-slate-200">{type}</span>
              </label>
            ))}
          </div>
        </SelectionCard>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving preferences..." : "Continue to dashboard"}
        </button>
      </form>
    </div>
  );
}
