import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  EMPTY_INSIGHT_MESSAGE,
  extractPiggyTake,
  formatPersonalizationContext,
  splitInsightParagraphs,
} from "./insightMeta.js";

describe("extractPiggyTake", () => {
  it("returns first sentence when punctuation is present", () => {
    assert.equal(
      extractPiggyTake("Markets look strong today. Watch ETH closely."),
      "Markets look strong today.",
    );
  });

  it("returns fallback when text is empty", () => {
    assert.equal(extractPiggyTake(""), EMPTY_INSIGHT_MESSAGE);
  });
});

describe("splitInsightParagraphs", () => {
  it("splits multi-sentence insight into separate paragraphs", () => {
    assert.deepEqual(
      splitInsightParagraphs(
        "Bitcoin: Bullish; Ethereum: Neutral. Recent on-chain data shows strength. Watch headline risk closely.",
      ),
      [
        "Bitcoin: Bullish; Ethereum: Neutral.",
        "Recent on-chain data shows strength.",
        "Watch headline risk closely.",
      ],
    );
  });

  it("preserves explicit blank-line paragraphs", () => {
    assert.deepEqual(splitInsightParagraphs("First block.\n\nSecond block."), [
      "First block.",
      "Second block.",
    ]);
  });

  it("returns empty array for empty text", () => {
    assert.deepEqual(splitInsightParagraphs(""), []);
  });
});

describe("formatPersonalizationContext", () => {
  it("combines assets and content types", () => {
    assert.equal(
      formatPersonalizationContext(["Bitcoin", "Ethereum"], ["Market News"]),
      "Based on your interest in Bitcoin, Ethereum and Market News.",
    );
  });
});
