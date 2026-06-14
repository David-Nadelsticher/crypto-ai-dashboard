export const DASHBOARD_SECTIONS = [
  { id: "section-insight", label: "AI Insight", iconKey: "insight" },
  { id: "section-news", label: "Market News", iconKey: "news" },
  { id: "section-prices", label: "Coin Prices", iconKey: "prices" },
  { id: "section-meme", label: "Market Break", iconKey: "meme" },
];

export const SECTION_BY_ID = Object.fromEntries(
  DASHBOARD_SECTIONS.map((section) => [section.id, section]),
);
