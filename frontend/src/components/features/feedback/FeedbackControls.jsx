import useFeedbackVote from "../../../hooks/useFeedbackVote";
import VoteButton from "./VoteButton";

export default function FeedbackControls({ sectionName, itemReference, contentSnapshot = null }) {
  const { selectedVote, submitting, message, messageType, isDisabled, handleVote } = useFeedbackVote({
    sectionName,
    itemReference,
    contentSnapshot,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2" role="group" aria-label="Rate this content">
        <VoteButton
          voteValue={1}
          selectedVote={selectedVote}
          submitting={submitting}
          disabled={isDisabled}
          onVote={handleVote}
          label="Helpful"
        />
        <VoteButton
          voteValue={-1}
          selectedVote={selectedVote}
          submitting={submitting}
          disabled={isDisabled}
          onVote={handleVote}
          label="Not helpful"
        />
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
