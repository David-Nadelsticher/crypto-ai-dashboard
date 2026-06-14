import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardSectionRenderer from "../components/features/dashboard/DashboardSectionRenderer";
import Toast from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";
import useDashboardData from "../hooks/useDashboardData";
import useDashboardSections from "../hooks/useDashboardSections";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const dashboardData = useDashboardData();
  const {
    prices,
    sectionStatus,
    lastUpdated,
    loadDashboard,
    isRefreshing,
    toast,
    dismissToast,
  } = dashboardData;

  const {
    orderedSections,
    sectionProps,
    expandedSectionId,
    handleSectionExpandedChange,
    handleSectionNavigate,
  } = useDashboardSections(user, dashboardData);

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
          {orderedSections.map((section, index) => (
            <DashboardSectionRenderer
              key={section.id}
              sectionId={section.id}
              expanded={expandedSectionId === section.id}
              onExpandedChange={(nextExpanded) =>
                handleSectionExpandedChange(section.id, nextExpanded)
              }
              staggerIndex={index}
              sectionProps={sectionProps}
            />
          ))}
        </div>
      </DashboardLayout>

      <Toast variant={toast?.variant} message={toast?.message} onDismiss={dismissToast} />
    </>
  );
}
