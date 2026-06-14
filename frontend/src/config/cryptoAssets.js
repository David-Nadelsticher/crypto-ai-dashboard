export const CRYPTO_ASSETS = {
  bitcoin: {
    id: "bitcoin",
    name: "Bitcoin",
    ticker: "BTC",
    iconUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  },
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    ticker: "ETH",
    iconUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  },
  solana: {
    id: "solana",
    name: "Solana",
    ticker: "SOL",
    iconUrl: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  },
  cardano: {
    id: "cardano",
    name: "Cardano",
    ticker: "ADA",
    iconUrl: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
  },
};

const ASSET_ALIASES = Object.values(CRYPTO_ASSETS).reduce((aliases, asset) => {
  aliases[asset.id] = asset;
  aliases[asset.name.toLowerCase()] = asset;
  aliases[asset.ticker.toLowerCase()] = asset;
  return aliases;
}, {});

export function resolveAssetMeta(asset) {
  if (!asset?.trim()) return null;

  const normalized = asset.trim().toLowerCase();
  const known = ASSET_ALIASES[normalized];
  if (known) return known;

  return {
    id: normalized.replace(/\s+/g, "-"),
    name: asset.trim(),
    ticker: asset.trim().slice(0, 4).toUpperCase(),
    iconUrl: null,
  };
}

export function resolveFocusAssets(assets = []) {
  return assets.map(resolveAssetMeta).filter(Boolean);
}
