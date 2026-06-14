import { useEffect, useState } from "react";
import { submitVote } from "../../api/votes";
import Spinner from "./Spinner";

function ThumbUpIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
      />
    </svg>
  );
}

function ThumbDownIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
      />
    </svg>
  );
}

function voteButtonClass(voteValue, selectedVote) {
  if (selectedVote === voteValue) {
    return voteValue === 1
      ? "bg-piggy-pink/30 text-piggy-charcoal ring-1 ring-piggy-pink"
      : "bg-piggy-negative/15 text-piggy-negative ring-1 ring-piggy-negative/40";
  }
  return "bg-piggy-cream text-piggy-gray hover:bg-piggy-peach/30 hover:text-piggy-charcoal disabled:opacity-50";
}

export default function FeedbackControls({ sectionName, itemReference, contentSnapshot = null }) {
  const [selectedVote, setSelectedVote] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  useEffect(() => {
    setSelectedVote(null);
    setMessage(null);
    setMessageType(null);
  }, [itemReference]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  async function handleVote(voteValue) {
    if (submitting || !itemReference || !contentSnapshot) return;

    const previousVote = selectedVote;
    setSelectedVote(voteValue);
    setSubmitting(true);
    setMessage(null);

    try {
      await submitVote({
        section: sectionName,
        item_reference: itemReference,
        vote_value: voteValue,
        content_snapshot: contentSnapshot,
      });
      setMessage("Piggy will use this feedback in future briefs.");
      setMessageType("success");
    } catch (error) {
      console.error(`Failed to submit vote for ${sectionName}:`, error);
      setSelectedVote(previousVote);
      setMessage("Could not save feedback. Try again.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  }

  const isDisabled = submitting || !itemReference || !contentSnapshot;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2" role="group" aria-label="Rate this content">
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => handleVote(1)}
          aria-pressed={selectedVote === 1}
          className={`focus-ring motion-interactive flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium motion-safe:active:scale-95 disabled:cursor-not-allowed ${voteButtonClass(1, selectedVote)} ${selectedVote === 1 ? "scale-105" : ""}`}
        >
          {submitting && selectedVote === 1 ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <ThumbUpIcon className="h-4 w-4" />
          )}
          Helpful
        </button>
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => handleVote(-1)}
          aria-pressed={selectedVote === -1}
          className={`focus-ring motion-interactive flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium motion-safe:active:scale-95 disabled:cursor-not-allowed ${voteButtonClass(-1, selectedVote)} ${selectedVote === -1 ? "scale-105" : ""}`}
        >
          {submitting && selectedVote === -1 ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <ThumbDownIcon className="h-4 w-4" />
          )}
          Not helpful
        </button>
      </div>
      {message && (
        <p
          className={`motion-fade-in text-xs ${
            messageType === "error" ? "text-piggy-negative" : "text-piggy-positive"
          }`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </div>
  );
}
