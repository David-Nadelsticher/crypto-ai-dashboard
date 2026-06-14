import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import Sidebar from "./Sidebar";
import MainHeader from "./MainHeader";
import { DASHBOARD_SECTIONS } from "../../config/dashboardSections";

const SCROLL_SPY_THRESHOLD = [0, 0.25, 0.5];
const DASHBOARD_SCROLL_SPY_ROOT_MARGIN = "-15% 0px -55% 0px";

export default function DashboardLayout({
  userName,
  preferences,
  prices = [],
  pricesStatus,
  refreshing,
  lastUpdated,
  onRefresh,
  onLogout,
  onSectionNavigate,
  sections = DASHBOARD_SECTIONS,
  children,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mainRef = useRef(null);
  const [scrollRoot, setScrollRoot] = useState(null);
  const sectionIds = useMemo(
    () => sections.map((section) => section.id),
    [sections],
  );

  useEffect(() => {
    if (mainRef.current) {
      setScrollRoot(mainRef.current);
    }
  }, []);

  const activeSection = useScrollSpy(sectionIds, {
    root: scrollRoot,
    rootMargin: DASHBOARD_SCROLL_SPY_ROOT_MARGIN,
    threshold: SCROLL_SPY_THRESHOLD,
  });

  const handleNavigate = useCallback((sectionId) => {
    onSectionNavigate?.(sectionId);
  }, [onSectionNavigate]);

  const handleMobileClose = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="flex min-h-screen">
      <a href="#dashboard-content" className="skip-link focus-ring">
        Skip to dashboard content
      </a>

      <Sidebar
        sections={sections}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onRefresh={onRefresh}
        onLogout={onLogout}
        refreshing={refreshing}
        lastUpdated={lastUpdated}
        mobileOpen={mobileOpen}
        onMobileClose={handleMobileClose}
      />

      <main ref={mainRef} className="flex-1 overflow-y-auto px-4 py-8 md:px-10 md:py-10">
        <MainHeader
          userName={userName}
          preferences={preferences}
          prices={prices}
          pricesStatus={pricesStatus}
          onMenuOpen={() => setMobileOpen(true)}
        />
        {children}
      </main>
    </div>
  );
}
