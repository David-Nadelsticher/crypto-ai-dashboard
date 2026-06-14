function normalizeSeries(values, height, padding) {
  let min = Math.min(...values);
  let max = Math.max(...values);
  const mid = (min + max) / 2;
  const minRange = Math.max(mid * 0.02, 1.5);

  if (max - min < minRange) {
    min = mid - minRange / 2;
    max = mid + minRange / 2;
  }

  const range = max - min || 1;
  const usableHeight = height - padding * 2;

  return values.map((value) => padding + usableHeight - ((value - min) / range) * usableHeight);
}

function buildPathFromValues(values, width = 160, height = 56) {
  const padding = 6;
  const yValues = normalizeSeries(values, height, padding);
  const step = width / (values.length - 1);

  const points = yValues.map((y, index) => ({
    x: index * step,
    y: Math.max(padding, Math.min(height - padding, y)),
  }));

  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const lastPoint = points[points.length - 1];
  const baselineY = yValues[0];

  return { line, area, points, lastPoint, baselineY, width, height };
}

function hashSeed(value) {
  const str = String(value ?? "default");
  let hash = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createSeededRandom(seed) {
  let state = seed || 1;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateSyntheticSeries(change24h, seedKey, pointCount = 24) {
  const change = Number.isFinite(change24h) ? change24h : 0;
  const random = createSeededRandom(hashSeed(seedKey));
  const start = 100;
  const end = start * (1 + change / 100);
  const volatility = Math.max(Math.abs(change) * 0.22, 2.4);

  const values = [start];

  for (let index = 1; index < pointCount - 1; index += 1) {
    const progress = index / (pointCount - 1);
    const target = start + (end - start) * progress;
    const noise = (random() - 0.5) * volatility;
    const previous = values[index - 1];
    const next = previous * 0.35 + target * 0.65 + noise;
    values.push(next);
  }

  values.push(end);
  return values;
}

export function buildSparklinePathFromSeries(series, width = 160, height = 56) {
  const values = series.filter((value) => Number.isFinite(value));
  if (values.length < 2) {
    return null;
  }
  return buildPathFromValues(values, width, height);
}

export function buildSparklinePath({
  series,
  change24h,
  seedKey = "default",
  width = 160,
  height = 56,
  pointCount = 24,
}) {
  const realPath = Array.isArray(series) ? buildSparklinePathFromSeries(series, width, height) : null;
  if (realPath) {
    return realPath;
  }

  const syntheticValues = generateSyntheticSeries(change24h, seedKey, pointCount);
  return buildPathFromValues(syntheticValues, width, height);
}
