import SectionCard from "../ui/SectionCard";
import SectionContent from "../ui/SectionContent";
import ExternalLink from "../ui/ExternalLink";
import LazyImage from "../ui/LazyImage";
import { MemeIcon } from "../ui/SectionIcons";
import { SECTION_BY_ID } from "../../config/dashboardSections";
import { buildMemeSnapshot } from "../../utils/voteSnapshots";

const SECTION_META = SECTION_BY_ID["section-meme"];
const EMPTY_MEME_MESSAGE =
  "Nothing to show right now. Check back after your next brief refresh.";
const MARKET_BREAK_DESCRIPTION = "A quick break from the charts.";

function buildPreview(meme) {
  if (!meme?.title && !meme?.image_url) return MARKET_BREAK_DESCRIPTION;
  return meme.title || MARKET_BREAK_DESCRIPTION;
}

function buildSourceLabel(meme) {
  if (!meme) return null;
  if (meme.source === "reddit") return "Reddit r/CryptoCurrencyMemes";
  if (meme.source === "fallback") return "Curated fallback";
  return meme.source || null;
}

function MemeThumbnailFallback() {
  return (
    <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-lg bg-piggy-peach/40 text-2xl">
      ☕
    </div>
  );
}

function MemeImageFallback() {
  return (
    <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-piggy-border bg-piggy-cream/50 text-piggy-gray">
      Image unavailable
    </div>
  );
}

function MemeThumbnail({ meme }) {
  return (
    <LazyImage
      src={meme?.image_url}
      alt=""
      wrapperClassName="h-[4.5rem] w-[4.5rem] shrink-0"
      imgClassName="h-[4.5rem] w-[4.5rem] rounded-lg object-cover"
      fallback={<MemeThumbnailFallback />}
    />
  );
}

function MemeImage({ meme }) {
  return (
    <LazyImage
      src={meme?.image_url}
      alt={meme?.title || "Market break image"}
      wrapperClassName="w-full"
      imgClassName="max-h-80 w-full rounded-lg object-contain transition-opacity"
      fallback={<MemeImageFallback />}
    />
  );
}

function MemeCollapsedPreview({ meme }) {
  return (
    <div className="meme-preview space-y-2.5">
      <p className="section-preview-kicker">{MARKET_BREAK_DESCRIPTION}</p>
      <div className="meme-preview-body flex items-center gap-4">
        <MemeThumbnail meme={meme} />
        <p className="meme-preview-title line-clamp-2">{buildPreview(meme)}</p>
      </div>
    </div>
  );
}

function MemeExpandedContent({ meme }) {
  if (!meme?.image_url) return null;

  return (
    <div className="space-y-3">
      <p className="section-preview-kicker">{MARKET_BREAK_DESCRIPTION}</p>
      <MemeImage meme={meme} />
      {meme.title && <p className="text-sm text-piggy-charcoal">{meme.title}</p>}
      {meme.permalink && (
        <ExternalLink
          href={meme.permalink}
          className="text-xs font-medium text-piggy-pink hover:opacity-80"
        >
          View on Reddit →
        </ExternalLink>
      )}
    </div>
  );
}

export default function MemeSection({
  meme,
  status,
  error,
  itemReference,
  onRetry,
  expanded = false,
  onExpandedChange,
  staggerIndex = 0,
}) {
  return (
    <SectionCard
      id="section-meme"
      staggerIndex={staggerIndex}
      title="Market Break"
      icon={<MemeIcon />}
      preview={buildPreview(meme)}
      collapsedPreview={<MemeCollapsedPreview meme={meme} />}
      expandLabel="Open market break"
      sectionName="meme"
      itemReference={itemReference}
      contentSnapshot={status === "success" ? buildMemeSnapshot(meme) : null}
      sourceLabel={buildSourceLabel(meme)}
      status={status}
      error={error}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      variant="compact"
      skeletonLayout="meme"
      onRetry={onRetry}
      expandedContent={
        <SectionContent
          isEmpty={!meme?.image_url}
          emptyMessage={EMPTY_MEME_MESSAGE}
          renderContent={() => <MemeExpandedContent meme={meme} />}
        />
      }
    />
  );
}
