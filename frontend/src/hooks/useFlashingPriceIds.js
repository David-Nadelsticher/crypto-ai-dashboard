import { useEffect, useRef, useState } from "react";

export default function useFlashingPriceIds(prices) {
  const prevRef = useRef(null);
  const [flashingIds, setFlashingIds] = useState(() => new Set());

  useEffect(() => {
    if (!Array.isArray(prices) || prices.length === 0) {
      prevRef.current = prices;
      return;
    }

    if (!prevRef.current) {
      prevRef.current = prices;
      return;
    }

    const changed = new Set();
    for (const coin of prices) {
      const prev = prevRef.current.find((item) => item.id === coin.id);
      if (prev && prev.price_usd !== coin.price_usd) {
        changed.add(coin.id);
      }
    }

    prevRef.current = prices;

    if (changed.size === 0) return undefined;

    setFlashingIds(changed);
    const timer = window.setTimeout(() => setFlashingIds(new Set()), 320);
    return () => window.clearTimeout(timer);
  }, [prices]);

  return flashingIds;
}
