export function buildInsightSnapshot(insight) {
  if (!insight?.insight) return null;

  return {
    source: insight.source ?? null,
    model: insight.model ?? null,
    excerpt: insight.insight.slice(0, 500),
  };
}

export function buildNewsSnapshot(news) {
  if (!news?.length) return null;

  return {
    article_ids: news.map((article) => article.id),
    titles: news.map((article) => article.title),
    count: news.length,
  };
}

export function buildPricesSnapshot(prices) {
  if (!prices?.length) return null;

  return {
    coin_ids: prices.map((coin) => coin.id),
    symbols: prices.map((coin) => coin.symbol),
    snapshot_prices: Object.fromEntries(prices.map((coin) => [coin.id, coin.price_usd])),
  };
}

export function buildMemeSnapshot(meme) {
  if (!meme?.image_url) return null;

  return {
    id: meme.id ?? null,
    title: meme.title ?? null,
    image_url: meme.image_url,
    source: meme.source ?? null,
  };
}
