import SectionCard from "../features/dashboard/SectionCard";
import SectionContent from "../features/dashboard/SectionContent";
import ExternalLink from "../ui/ExternalLink";
import Kicker from "../ui/Kicker";
import { NewsIcon } from "../icons/SectionIcons";
import { formatTimestamp } from "../../utils/format";
import { buildNewsSnapshot } from "../../utils/voteSnapshots";

const EMPTY_NEWS_MESSAGE = "Piggy couldn't find anything worth reading right now.";

function buildPreview(news) {
  if (news.length === 0) return EMPTY_NEWS_MESSAGE;
  if (news.length === 1) return news[0].title;
  return `${news.length} stories today — ${news[0].title}`;
}

function NewsEditorialLabel({ count }) {
  if (count === 0) return null;

  return (
    <Kicker as="p" className="mb-3">
      Piggy selected{" "}
      <span className="section-preview-kicker-accent">{count}</span>{" "}
      {count === 1 ? "story" : "stories"} for you.
    </Kicker>
  );
}

function NewsCollapsedPreview({ news }) {
  if (news.length === 0) {
    return <p className="text-sm text-piggy-gray">{EMPTY_NEWS_MESSAGE}</p>;
  }

  return (
    <div>
      <NewsEditorialLabel count={news.length} />
      <ul className="news-preview-list">
        {news.slice(0, 3).map((article, index) => (
          <li
            key={article.id}
            className={`news-preview-item${index === 0 ? " news-preview-item--lead" : ""}`}
          >
            <span className="news-preview-bullet" aria-hidden="true" />
            <span className="news-preview-title line-clamp-2">{article.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewsExpandedContent({ news }) {
  return (
    <div>
      <NewsEditorialLabel count={news.length} />
      <ul className="space-y-3">
        {news.map((article, index) => (
          <li
            key={article.id}
            style={{ "--motion-delay": `${index * 40}ms` }}
            className="news-article-item motion-stagger-item rounded-lg border border-piggy-border bg-piggy-cream/50 p-4 motion-reduce:animate-none"
          >
            <ExternalLink href={article.url} className="news-article-link">
              {article.title}
            </ExternalLink>
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-piggy-gray">
              {article.source && <span>{article.source}</span>}
              {article.published_at && (
                <>
                  <span>·</span>
                  <span>{formatTimestamp(article.published_at)}</span>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MarketNewsSection({
  news,
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
      id="section-news"
      staggerIndex={staggerIndex}
      title="Market News"
      icon={<NewsIcon />}
      preview={buildPreview(news)}
      collapsedPreview={<NewsCollapsedPreview news={news} />}
      expandLabel="Open full market news"
      sectionName="news"
      itemReference={itemReference}
      contentSnapshot={status === "success" ? buildNewsSnapshot(news) : null}
      sourceLabel="CCData CryptoCompare"
      status={status}
      error={error}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      skeletonLayout="text"
      onRetry={onRetry}
      expandedContent={
        <SectionContent
          isEmpty={news.length === 0}
          emptyMessage={EMPTY_NEWS_MESSAGE}
          renderContent={() => <NewsExpandedContent news={news} />}
        />
      }
    />
  );
}
