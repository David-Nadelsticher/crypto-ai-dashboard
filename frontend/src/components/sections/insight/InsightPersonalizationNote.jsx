import { formatPersonalizationContext } from "../../../utils/insightMeta";

export default function InsightPersonalizationNote({ preferences }) {
  const personalization = formatPersonalizationContext(
    preferences?.assets || [],
    preferences?.content_types || [],
  );

  if (!personalization) return null;

  return (
    <p className="rounded-lg border border-piggy-border/60 bg-piggy-cream/40 px-3 py-2 text-sm text-piggy-gray">
      <span className="font-semibold text-piggy-charcoal">Why Piggy picked this: </span>
      {personalization}
    </p>
  );
}
