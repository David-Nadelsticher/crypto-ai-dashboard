import { useCallback } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { DASHBOARD_SECTIONS } from "../config/dashboardSections";
import { orderDashboardSections } from "../config/personalization";
import { useAuth } from "../context/AuthContext";
import { scrollToSectionContent } from "../utils/scrollToSectionContent";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const contentTypes = user?.preferences?.content_types || [];
  const orderedSections = orderDashboardSections(DASHBOARD_SECTIONS, contentTypes);

  const handleSectionNavigate = useCallback((sectionId) => {
    scrollToSectionContent(sectionId);
  }, []);

  return (
    <DashboardLayout
      userName={user?.name}
      preferences={user?.preferences}
      prices={[]}
      pricesStatus="loading"
      refreshing={false}
      lastUpdated=""
      onRefresh={() => {}}
      onLogout={logout}
      sections={orderedSections}
      onSectionNavigate={handleSectionNavigate}
    >
      <div id="dashboard-content" className="mx-auto max-w-4xl space-y-6">
        {orderedSections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            className="rounded-card border border-piggy-border bg-piggy-card p-6 text-piggy-muted"
          >
            <p className="text-sm font-medium text-piggy-charcoal">{section.label}</p>
            <p className="mt-2 text-sm">Section content loads in the next branch.</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
