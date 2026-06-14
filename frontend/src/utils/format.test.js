import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatUsd, formatPercent } from "./format.js";

describe("formatUsd", () => {
  it("returns em dash for null", () => {
    assert.equal(formatUsd(null), "—");
  });

  it("formats large values with two decimals", () => {
    assert.equal(formatUsd(42000.5), "$42,000.50");
  });

  it("formats small values with up to six decimals", () => {
    assert.match(formatUsd(0.00001234), /^\$0\.0+/);
  });
});

describe("formatPercent", () => {
  it("adds plus prefix for positive values", () => {
    assert.equal(formatPercent(2.5), "+2.50%");
  });

  it("keeps minus for negative values", () => {
    assert.equal(formatPercent(-1.25), "-1.25%");
  });

  it("returns em dash for null", () => {
    assert.equal(formatPercent(null), "—");
  });
});
