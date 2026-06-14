import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import Sidebar from "./Sidebar";
import MainHeader from "./MainHeader";
import { DASHBOARD_SECTIONS } from "../../config/dashboardSections";

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
  const sectionIds = sections.map((section) => section.id);

  useEffect(() => {
    if (mainRef.current) {
      setScrollRoot(mainRef.current);
    }
  }, []);

  const activeSection = useScrollSpy(sectionIds, {
    root: scrollRoot,
    rootMargin: "-15% 0px -55% 0px",
    threshold: [0, 0.25, 0.5],
  });

  const handleNavigate = useCallback((sectionId) => {
    onSectionNavigate?.(sectionId);
  }, [onSectionNavigate]);

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
        onMobileClose={() => setMobileOpen(false)}
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
