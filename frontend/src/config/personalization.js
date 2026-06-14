export const CONTENT_TYPE_TO_SECTION = {
  "Market News": "section-news",
  Charts: "section-prices",
  Social: "section-news",
  Fun: "section-meme",
};

export const DEFAULT_SECTION_ORDER = [
  "section-insight",
  "section-news",
  "section-prices",
  "section-meme",
];

const MIDDLE_SECTION_ORDER = DEFAULT_SECTION_ORDER.filter(
  (sectionId) => sectionId !== "section-insight" && sectionId !== "section-meme",
);

export function getOrderedSectionIds(contentTypes = []) {
  if (!contentTypes.length) {
    return [...DEFAULT_SECTION_ORDER];
  }

  const orderedMiddle = [];
  const seen = new Set();

  for (const contentType of contentTypes) {
    const sectionId = CONTENT_TYPE_TO_SECTION[contentType];
    if (
      sectionId &&
      sectionId !== "section-insight" &&
      sectionId !== "section-meme" &&
      !seen.has(sectionId)
    ) {
      orderedMiddle.push(sectionId);
      seen.add(sectionId);
    }
  }

  for (const sectionId of MIDDLE_SECTION_ORDER) {
    if (!seen.has(sectionId)) {
      orderedMiddle.push(sectionId);
      seen.add(sectionId);
    }
  }

  return ["section-insight", ...orderedMiddle, "section-meme"];
}

export function orderDashboardSections(sections, contentTypes = []) {
  const sectionsById = Object.fromEntries(sections.map((section) => [section.id, section]));
  return getOrderedSectionIds(contentTypes)
    .map((sectionId) => sectionsById[sectionId])
    .filter(Boolean);
}

export function getDefaultExpandedSections(contentTypes = []) {
  const expanded = new Set(["section-insight"]);

  if (contentTypes.includes("Charts")) {
    expanded.add("section-prices");
  }

  if (contentTypes.includes("Fun")) {
    expanded.add("section-meme");
  }

  if (contentTypes.includes("Market News") || contentTypes.includes("Social")) {
    expanded.add("section-news");
  }

  return expanded;
}

export function shouldExpandSection(sectionId, contentTypes = []) {
  return getDefaultExpandedSections(contentTypes).has(sectionId);
}
