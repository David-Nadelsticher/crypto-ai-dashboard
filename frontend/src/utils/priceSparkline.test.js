import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildSparklinePath, buildSparklinePathFromSeries } from "./priceSparkline.js";

describe("buildSparklinePathFromSeries", () => {
  it("builds a path from real price values", () => {
    const path = buildSparklinePathFromSeries([100, 102, 98, 105, 103]);
    assert.ok(path);
    assert.equal(path.points.length, 5);
    assert.ok(path.line.startsWith("M"));
  });

  it("returns null when fewer than two valid points are provided", () => {
    assert.equal(buildSparklinePathFromSeries([100]), null);
    assert.equal(buildSparklinePathFromSeries([]), null);
  });

  it("uses the full vertical range for distinct prices", () => {
    const path = buildSparklinePathFromSeries([100, 120, 90, 110]);
    const ys = path.points.map((point) => point.y);
    assert.ok(Math.max(...ys) - Math.min(...ys) >= 8);
  });
});

describe("buildSparklinePath", () => {
  it("prefers real series data over synthetic generation", () => {
    const real = buildSparklinePath({
      series: [50000, 51000, 49500, 52000],
      change24h: -5,
      seedKey: "bitcoin",
    });
    const synthetic = buildSparklinePath({ change24h: -5, seedKey: "bitcoin" });
    assert.notEqual(real.line, synthetic.line);
  });

  it("falls back to synthetic data when series is missing", () => {
    const bitcoin = buildSparklinePath({ change24h: 2.5, seedKey: "bitcoin" });
    const ethereum = buildSparklinePath({ change24h: 2.5, seedKey: "ethereum" });
    assert.notEqual(bitcoin.line, ethereum.line);
  });

  it("normalizes small synthetic changes into a visible vertical range", () => {
    const flat = buildSparklinePath({ change24h: 0.1, seedKey: "bitcoin" });
    const ys = flat.points.map((point) => point.y);
    assert.ok(Math.max(...ys) - Math.min(...ys) >= 8);
  });

  it("ends higher for positive synthetic 24h change", () => {
    const rising = buildSparklinePath({ change24h: 5, seedKey: "solana" });
    const first = rising.points[0].y;
    const last = rising.points[rising.points.length - 1].y;
    assert.ok(last < first);
  });
});
