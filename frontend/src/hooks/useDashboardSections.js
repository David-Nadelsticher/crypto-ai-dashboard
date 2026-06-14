import { useCallback, useEffect, useRef, useState } from "react";
import { DASHBOARD_SECTIONS } from "../config/dashboardSections";
import { orderDashboardSections } from "../config/personalization";
import { scrollToSectionContent } from "../utils/scrollToSectionContent";

export default function useDashboardSections(user, dashboardData) {
  const {
    prices,
    news,
    meme,
    insight,
    sectionStatus,
    errors,
    loadDashboard,
    resolveItemReference,
  } = dashboardData;

  const [expandedSectionId, setExpandedSectionId] = useState(null);
  const scrollTimeoutRef = useRef(undefined);

  const relatedCoins = user?.preferences?.assets || [];
  const contentTypes = user?.preferences?.content_types || [];
  const orderedSections = orderDashboardSections(DASHBOARD_SECTIONS, contentTypes);

  const handleSectionExpandedChange = useCallback((sectionId, nextExpanded) => {
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    setExpandedSectionId(nextExpanded ? sectionId : null);

    if (nextExpanded) {
      scrollTimeoutRef.current = scrollToSectionContent(sectionId);
    }
  }, []);

  const handleSectionNavigate = useCallback((sectionId) => {
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    setExpandedSectionId(sectionId);
    scrollTimeoutRef.current = scrollToSectionContent(sectionId);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const sectionProps = {
    insight: {
      insight,
      status: sectionStatus.insight,
      error: errors.insight,
      itemReference: resolveItemReference("insight"),
      relatedCoins,
      preferences: user?.preferences,
      onRetry: loadDashboard,
    },
    news: {
      news,
      status: sectionStatus.news,
      error: errors.news,
      itemReference: resolveItemReference("news"),
      onRetry: loadDashboard,
    },
    prices: {
      prices,
      status: sectionStatus.prices,
      error: errors.prices,
      itemReference: resolveItemReference("prices"),
      relatedCoins,
      onRetry: loadDashboard,
    },
    meme: {
      meme,
      status: sectionStatus.meme,
      error: errors.meme,
      itemReference: resolveItemReference("meme"),
      onRetry: loadDashboard,
    },
  };

  return {
    orderedSections,
    sectionProps,
    expandedSectionId,
    handleSectionExpandedChange,
    handleSectionNavigate,
  };
}
