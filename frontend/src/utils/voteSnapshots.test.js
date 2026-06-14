import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildInsightSnapshot,
  buildMemeSnapshot,
  buildNewsSnapshot,
  buildPricesSnapshot,
} from "./voteSnapshots.js";

describe("buildInsightSnapshot", () => {
  it("returns null when insight text is missing", () => {
    assert.equal(buildInsightSnapshot(null), null);
    assert.equal(buildInsightSnapshot({ source: "openrouter" }), null);
  });

  it("includes source, model, and excerpt", () => {
    const snapshot = buildInsightSnapshot({
      source: "openrouter",
      model: "test-model",
      insight: "Bitcoin looks strong today.",
    });

    assert.deepEqual(snapshot, {
      source: "openrouter",
      model: "test-model",
      excerpt: "Bitcoin looks strong today.",
    });
  });
});

describe("buildNewsSnapshot", () => {
  it("returns article metadata", () => {
    const snapshot = buildNewsSnapshot([
      { id: "1", title: "BTC update" },
      { id: "2", title: "ETH update" },
    ]);

    assert.deepEqual(snapshot, {
      article_ids: ["1", "2"],
      titles: ["BTC update", "ETH update"],
      count: 2,
    });
  });
});

describe("buildPricesSnapshot", () => {
  it("returns coin ids, symbols, and prices", () => {
    const snapshot = buildPricesSnapshot([
      { id: "bitcoin", symbol: "btc", price_usd: 50000 },
      { id: "ethereum", symbol: "eth", price_usd: 3000 },
    ]);

    assert.deepEqual(snapshot, {
      coin_ids: ["bitcoin", "ethereum"],
      symbols: ["btc", "eth"],
      snapshot_prices: {
        bitcoin: 50000,
        ethereum: 3000,
      },
    });
  });
});

describe("buildMemeSnapshot", () => {
  it("returns meme metadata", () => {
    const snapshot = buildMemeSnapshot({
      id: "meme-1",
      title: "HODL",
      image_url: "https://example.com/meme.png",
      source: "reddit",
    });

    assert.deepEqual(snapshot, {
      id: "meme-1",
      title: "HODL",
      image_url: "https://example.com/meme.png",
      source: "reddit",
    });
  });
});
