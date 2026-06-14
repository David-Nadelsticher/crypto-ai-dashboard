import { useCallback, useEffect, useRef, useState } from "react";
import { scrollToSectionContent } from "../utils/scrollToSectionContent";
import DashboardLayout from "../components/layout/DashboardLayout";

import AiInsightSection from "../components/sections/AiInsightSection";

import CoinPricesSection from "../components/sections/CoinPricesSection";

import MarketNewsSection from "../components/sections/MarketNewsSection";

import MemeSection from "../components/sections/MemeSection";

import Toast from "../components/ui/Toast";

import {
  orderDashboardSections,
} from "../config/personalization";
import { DASHBOARD_SECTIONS } from "../config/dashboardSections";

import { useAuth } from "../context/AuthContext";

import useDashboardData from "../hooks/useDashboardData";




function renderDashboardSection(sectionId, props) {
  const { expanded, onExpandedChange, staggerIndex, ...sectionProps } = props;

  switch (sectionId) {
    case "section-insight":
      return (
        <AiInsightSection
          key={sectionId}
          expanded={expanded}
          onExpandedChange={onExpandedChange}
          staggerIndex={staggerIndex}
          {...sectionProps.insight}
        />
      );
    case "section-news":
      return (
        <MarketNewsSection
          key={sectionId}
          expanded={expanded}
          onExpandedChange={onExpandedChange}
          staggerIndex={staggerIndex}
          {...sectionProps.news}
        />
      );
    case "section-prices":
      return (
        <CoinPricesSection
          key={sectionId}
          expanded={expanded}
          onExpandedChange={onExpandedChange}
          staggerIndex={staggerIndex}
          {...sectionProps.prices}
        />
      );
    case "section-meme":
      return (
        <MemeSection
          key={sectionId}
          expanded={expanded}
          onExpandedChange={onExpandedChange}
          staggerIndex={staggerIndex}
          {...sectionProps.meme}
        />
      );
    default:
      return null;
  }
}



export default function Dashboard() {
  const { user, logout } = useAuth();
  const [expandedSectionId, setExpandedSectionId] = useState(null);
  const scrollTimeoutRef = useRef(undefined);

  const {

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

  } = useDashboardData();



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



  return (

    <>

      <DashboardLayout

        userName={user?.name}

        preferences={user?.preferences}

        prices={prices}

        pricesStatus={sectionStatus.prices}

        refreshing={isRefreshing}

        lastUpdated={lastUpdated}

        onRefresh={loadDashboard}

        onLogout={logout}

        sections={orderedSections}

        onSectionNavigate={handleSectionNavigate}

      >

        <div id="dashboard-content" className="mx-auto max-w-4xl space-y-6">

          {orderedSections.map((section, index) =>
            renderDashboardSection(section.id, {
              expanded: expandedSectionId === section.id,
              onExpandedChange: (nextExpanded) =>
                handleSectionExpandedChange(section.id, nextExpanded),
              staggerIndex: index,
              insight: sectionProps.insight,
              news: sectionProps.news,
              prices: sectionProps.prices,
              meme: sectionProps.meme,
            }),
          )}

        </div>

      </DashboardLayout>

      <Toast variant={toast?.variant} message={toast?.message} onDismiss={dismissToast} />

    </>

  );

}

