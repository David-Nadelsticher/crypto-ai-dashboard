export const BENCHMARK_TICKERS = [
  { id: "bitcoin", symbol: "BTC" },
  { id: "ethereum", symbol: "ETH" },
  { id: "solana", symbol: "SOL" },
];

const MOCK_CHANGES = {
  bitcoin: 0.42,
  ethereum: 0.46,
  solana: 0.92,
};

export function buildSnapshotItems(prices = []) {
  const priceById = Object.fromEntries(
    (prices || []).map((coin) => [coin.id, coin]),
  );

  return BENCHMARK_TICKERS.map(({ id, symbol }) => {
    const coin = priceById[id];
    const change24h = coin?.change_24h ?? MOCK_CHANGES[id];
    return { symbol, change24h, isMock: coin?.change_24h == null };
  });
}
