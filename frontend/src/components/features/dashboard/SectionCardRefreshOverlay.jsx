import Spinner from "../../ui/Spinner";

export default function SectionCardRefreshOverlay({ isRefreshing }) {
  if (!isRefreshing) return null;

  return (
    <div
      className="motion-fade-in absolute inset-0 z-10 flex items-center justify-center rounded-card bg-piggy-card/60 backdrop-blur-[1px]"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Piggy is reading the market…</span>
      <Spinner size="md" variant="ring" />
    </div>
  );
}
