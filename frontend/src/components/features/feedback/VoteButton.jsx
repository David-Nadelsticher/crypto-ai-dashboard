import Spinner from "../../ui/Spinner";
import { ThumbDownIcon, ThumbUpIcon } from "../../icons/ThumbIcons";

function voteButtonClass(voteValue, selectedVote) {
  if (selectedVote === voteValue) {
    return voteValue === 1
      ? "bg-piggy-pink/30 text-piggy-charcoal ring-1 ring-piggy-pink"
      : "bg-piggy-negative/15 text-piggy-negative ring-1 ring-piggy-negative/40";
  }
  return "bg-piggy-cream text-piggy-gray hover:bg-piggy-peach/30 hover:text-piggy-charcoal disabled:opacity-50";
}

export default function VoteButton({
  voteValue,
  selectedVote,
  submitting,
  disabled,
  onVote,
  label,
}) {
  const Icon = voteValue === 1 ? ThumbUpIcon : ThumbDownIcon;
  const isSelected = selectedVote === voteValue;
  const showSpinner = submitting && isSelected;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onVote(voteValue)}
      aria-pressed={isSelected}
      className={`focus-ring motion-interactive flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium motion-safe:active:scale-95 disabled:cursor-not-allowed ${voteButtonClass(voteValue, selectedVote)} ${isSelected ? "scale-105" : ""}`}
    >
      {showSpinner ? <Spinner size="sm" /> : <Icon className="h-4 w-4" />}
      {label}
    </button>
  );
}
