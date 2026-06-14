function ShimmerBar({ className = "" }) {
  return <div className={`motion-shimmer h-4 rounded ${className}`} />;
}

const LAYOUTS = {
  text: (
    <div className="space-y-3">
      <ShimmerBar className="w-3/4" />
      <ShimmerBar className="w-full" />
      <ShimmerBar className="w-5/6" />
    </div>
  ),
  list: (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-piggy-border bg-piggy-cream/30 px-4 py-3"
        >
          <div className="space-y-2">
            <ShimmerBar className="w-24" />
            <ShimmerBar className="h-3 w-12" />
          </div>
          <div className="space-y-2 text-right">
            <ShimmerBar className="w-20" />
            <ShimmerBar className="h-3 w-14" />
          </div>
        </div>
      ))}
    </div>
  ),
  hero: (
    <div className="space-y-4">
      <ShimmerBar className="h-5 w-full" />
      <ShimmerBar className="h-5 w-full" />
      <ShimmerBar className="h-5 w-4/5" />
      <ShimmerBar className="h-4 w-2/3" />
    </div>
  ),
  meme: (
    <div className="flex items-center gap-4">
      <div className="motion-shimmer h-16 w-16 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2">
        <ShimmerBar className="w-3/4" />
        <ShimmerBar className="h-3 w-1/2" />
      </div>
    </div>
  ),
};

export default function ContentSkeleton({ layout = "text" }) {
  return <div className="flex-1">{LAYOUTS[layout] || LAYOUTS.text}</div>;
}
