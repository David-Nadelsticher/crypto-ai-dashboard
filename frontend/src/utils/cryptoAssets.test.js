import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveAssetMeta, resolveFocusAssets } from "../config/cryptoAssets.js";

describe("resolveAssetMeta", () => {
  it("resolves asset names and tickers to known metadata", () => {
    assert.deepEqual(resolveAssetMeta("Bitcoin"), {
      id: "bitcoin",
      name: "Bitcoin",
      ticker: "BTC",
      iconUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
    });
    assert.equal(resolveAssetMeta("ETH")?.ticker, "ETH");
  });

  it("returns a fallback for unknown assets", () => {
    assert.deepEqual(resolveAssetMeta("Dogecoin"), {
      id: "dogecoin",
      name: "Dogecoin",
      ticker: "DOGE",
      iconUrl: null,
    });
  });
});

describe("resolveFocusAssets", () => {
  it("returns metadata for each tracked asset", () => {
    const assets = resolveFocusAssets(["Cardano", "Solana"]);
    assert.equal(assets.length, 2);
    assert.equal(assets[0].ticker, "ADA");
    assert.equal(assets[1].ticker, "SOL");
  });
});
