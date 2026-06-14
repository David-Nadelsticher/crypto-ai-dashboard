import { InsightIcon, MemeIcon, NewsIcon, PricesIcon } from "../components/ui/SectionIcons";

export const DASHBOARD_SECTIONS = [
  { id: "section-insight", label: "AI Insight", icon: InsightIcon },
  { id: "section-news", label: "Market News", icon: NewsIcon },
  { id: "section-prices", label: "Coin Prices", icon: PricesIcon },
  { id: "section-meme", label: "Market Break", icon: MemeIcon },
];

export const SECTION_IDS = DASHBOARD_SECTIONS.map((section) => section.id);

export const SECTION_BY_ID = Object.fromEntries(
  DASHBOARD_SECTIONS.map((section) => [section.id, section]),
);
