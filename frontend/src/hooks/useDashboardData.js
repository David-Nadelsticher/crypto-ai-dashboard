import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchCryptoInsight,
  fetchCryptoMeme,
  fetchCryptoNews,
  fetchCryptoPrices,
} from "../api/dashboard";
import { formatLastUpdated } from "../utils/format";

const INITIAL_STATUS = {
  prices: "loading",
  news: "loading",
  meme: "loading",
  insight: "loading",
};

const SECTION_ERROR_MESSAGE = "Piggy lost connection to the market feed. Try refreshing.";

const SECTION_FETCHERS = [
  {
    key: "prices",
    fetch: fetchCryptoPrices,
    empty: (data) => !data?.length,
    errorMessage: SECTION_ERROR_MESSAGE,
  },
  {
    key: "news",
    fetch: fetchCryptoNews,
    empty: (data) => !data?.length,
    errorMessage: SECTION_ERROR_MESSAGE,
  },
  {
    key: "meme",
    fetch: fetchCryptoMeme,
    empty: (data) => !data?.image_url,
    errorMessage: SECTION_ERROR_MESSAGE,
  },
  {
    key: "insight",
    fetch: fetchCryptoInsight,
    empty: (data) => !data?.insight,
    errorMessage: SECTION_ERROR_MESSAGE,
  },
];

export default function useDashboardData() {
  const [prices, setPrices] = useState([]);
  const [news, setNews] = useState([]);
  const [meme, setMeme] = useState(null);
  const [insight, setInsight] = useState(null);
  const [sectionStatus, setSectionStatus] = useState(INITIAL_STATUS);
  const [errors, setErrors] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [toast, setToast] = useState(null);
  const hasLoadedOnceRef = useRef(false);

  const setSectionState = useCallback((key, status) => {
    setSectionStatus((prev) => ({ ...prev, [key]: status }));
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const loadDashboard = useCallback(async () => {
    const isRefresh = hasLoadedOnceRef.current;

    if (isRefresh) {
      setSectionStatus((prev) => ({
        prices: prev.prices === "loading" ? "loading" : "refreshing",
        news: prev.news === "loading" ? "loading" : "refreshing",
        meme: prev.meme === "loading" ? "loading" : "refreshing",
        insight: prev.insight === "loading" ? "loading" : "refreshing",
      }));
    } else {
      setSectionStatus(INITIAL_STATUS);
      setErrors({});
    }

    const setters = {
      prices: setPrices,
      news: setNews,
      meme: setMeme,
      insight: setInsight,
    };

    let failureCount = 0;

    await Promise.all(
      SECTION_FETCHERS.map(async ({ key, fetch, empty, errorMessage }) => {
        setSectionState(key, isRefresh ? "refreshing" : "loading");

        try {
          const data = await fetch();
          setters[key](data);
          setSectionState(key, empty(data) ? "empty" : "success");
          setErrors((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
          });
        } catch (reason) {
          if (import.meta.env.DEV) {
            console.error(`${key} fetch failed:`, reason);
          }
          failureCount += 1;
          if (!isRefresh) {
            if (key === "prices") setPrices([]);
            if (key === "news") setNews([]);
            if (key === "meme") setMeme(null);
            if (key === "insight") setInsight(null);
          }
          setSectionState(key, "error");
          setErrors((prev) => ({ ...prev, [key]: errorMessage }));
        }
      }),
    );

    const updatedAt = new Date();
    hasLoadedOnceRef.current = true;
    setLastUpdated(updatedAt);

    if (isRefresh) {
      if (failureCount === 0) {
        setToast({
          variant: "success",
          message: `Dashboard updated at ${formatLastUpdated(updatedAt)}`,
        });
      } else {
        setToast({
          variant: "error",
          message: `${failureCount} section${failureCount === 1 ? "" : "s"} failed to refresh`,
        });
      }
    }
  }, [setSectionState]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const isRefreshing = Object.values(sectionStatus).some(
    (status) => status === "loading" || status === "refreshing",
  );

  const itemReferenceReady = (status) => status === "success" || status === "refreshing";

  const itemReferences = {
    prices: prices.length > 0 ? prices.map((coin) => coin.id).join(",") : "",
    news: news.length > 0 ? news.map((item) => item.id).join(",") : "",
    meme: meme?.id || meme?.image_url || "",
    insight: insight?.source || insight?.insight?.slice(0, 64) || "",
  };

  const resolveItemReference = (key) => {
    const status = sectionStatus[key];
    if (!itemReferenceReady(status)) return "";
    return itemReferences[key] || "";
  };

  return {
    prices,
    news,
    meme,
    insight,
    sectionStatus,
    errors,
    lastUpdated,
    loadDashboard,
    isRefreshing,
    toast,
    dismissToast,
    resolveItemReference,
  };
}
