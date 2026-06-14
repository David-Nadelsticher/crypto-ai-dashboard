import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getDefaultExpandedSections,
  getOrderedSectionIds,
  shouldExpandSection,
} from "./personalization.js";

describe("getOrderedSectionIds", () => {
  it("returns default order when no content types are provided", () => {
    assert.deepEqual(getOrderedSectionIds([]), [
      "section-insight",
      "section-news",
      "section-prices",
      "section-meme",
    ]);
  });

  it("promotes charts when selected while keeping meme last", () => {
    assert.deepEqual(getOrderedSectionIds(["Charts", "Fun"]), [
      "section-insight",
      "section-prices",
      "section-news",
      "section-meme",
    ]);
  });

  it("maps market news and social to the same section once while keeping meme last", () => {
    assert.deepEqual(getOrderedSectionIds(["Market News", "Social", "Fun"]), [
      "section-insight",
      "section-news",
      "section-prices",
      "section-meme",
    ]);
  });

  it("always keeps insight first and meme last", () => {
    const preferenceSets = [
      [],
      ["Charts"],
      ["Fun"],
      ["Market News"],
      ["Charts", "Fun"],
      ["Market News", "Social", "Fun"],
      ["Fun", "Charts", "Market News", "Social"],
    ];

    for (const contentTypes of preferenceSets) {
      const ordered = getOrderedSectionIds(contentTypes);
      assert.equal(ordered[0], "section-insight");
      assert.equal(ordered.at(-1), "section-meme");
    }
  });
});

describe("getDefaultExpandedSections", () => {
  it("always expands insight and selected preference sections", () => {
    const expanded = getDefaultExpandedSections(["Charts", "Fun"]);
    assert.equal(shouldExpandSection("section-insight", ["Charts", "Fun"]), true);
    assert.equal(shouldExpandSection("section-prices", ["Charts", "Fun"]), true);
    assert.equal(shouldExpandSection("section-meme", ["Charts", "Fun"]), true);
    assert.equal(shouldExpandSection("section-news", ["Charts", "Fun"]), false);
    assert.equal(expanded.has("section-prices"), true);
  });
});
