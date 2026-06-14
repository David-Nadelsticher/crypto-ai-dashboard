export const EMPTY_INSIGHT_MESSAGE = "Piggy is still reviewing the market.";

export function buildSourceLabel(insight) {
  if (!insight) return null;
  if (insight.source === "openrouter" && insight.model) {
    return `OpenRouter (${insight.model})`;
  }
  if (insight.source === "simulated") return "Simulated insight";
  return insight.source || null;
}

export function extractPiggyTake(text) {
  if (!text) return EMPTY_INSIGHT_MESSAGE;
  const trimmed = text.trim();
  const sentenceMatch = trimmed.match(/^[^.!?]+[.!?]?/);
  if (sentenceMatch?.[0]) {
    return sentenceMatch[0].trim();
  }
  return trimmed.length > 160 ? `${trimmed.slice(0, 160).trim()}…` : trimmed;
}

export function splitInsightParagraphs(text) {
  if (!text?.trim()) return [];

  const byBlankLine = text
    .split(/\n\s*\n/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  if (byBlankLine.length > 1) {
    return byBlankLine;
  }

  const normalized = text.replace(/\s+/g, " ").trim();
  const sentences = normalized
    .split(/(?<=[.!?])\s+(?=[A-Z"'(0-9])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length <= 1) {
    return sentences.length ? sentences : [normalized];
  }

  return sentences;
}

export function formatPersonalizationContext(assets = [], contentTypes = []) {
  const parts = [];

  if (assets.length > 0) {
    parts.push(assets.join(", "));
  }

  if (contentTypes.length > 0) {
    parts.push(contentTypes.join(", "));
  }

  if (parts.length === 0) return null;

  if (assets.length > 0 && contentTypes.length > 0) {
    return `Based on your interest in ${assets.join(", ")} and ${contentTypes.join(", ")}.`;
  }

  if (assets.length > 0) {
    return `Based on your interest in ${assets.join(", ")}.`;
  }

  return `Based on your preferred content: ${contentTypes.join(", ")}.`;
}
