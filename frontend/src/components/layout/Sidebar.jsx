import { useRef, useState, useCallback } from "react";
import Toast from "../ui/Toast";
import Overlay from "../ui/Overlay";
import IconButton from "../ui/IconButton";
import { DASHBOARD_SECTIONS } from "../../config/dashboardSections";
import { useSidebarFocusTrap } from "../../hooks/useSidebarFocusTrap";
import SidebarActions from "./sidebar/SidebarActions";
import SidebarBrand from "./sidebar/SidebarBrand";
import SidebarLegalFooter from "./sidebar/SidebarLegalFooter";
import SidebarSectionNav from "./sidebar/SidebarSectionNav";

const DEFAULT_NAV_ITEMS = DASHBOARD_SECTIONS;

export default function Sidebar({
  sections = DEFAULT_NAV_ITEMS,
  activeSection,
  onNavigate,
  onRefresh,
  onLogout,
  refreshing,
  lastUpdated,
  mobileOpen,
  onMobileClose,
}) {
  const asideRef = useRef(null);
  const [legalNotice, setLegalNotice] = useState(null);

  const handleLegalLinkClick = useCallback((label) => {
    setLegalNotice(`${label} will be added to the site soon.`);
  }, []);

  useSidebarFocusTrap({ mobileOpen, asideRef, onMobileClose });

  return (
    <>
      <Toast
        variant="info"
        message={legalNotice}
        onDismiss={() => setLegalNotice(null)}
      />

      <Overlay open={mobileOpen} onClose={onMobileClose} variant="backdrop" ariaLabel="Close menu" />

      <aside
        ref={asideRef}
        aria-label="Sidebar navigation"
        aria-modal={mobileOpen ? "true" : undefined}
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-piggy-border bg-piggy-card p-6 transition-transform duration-slow ease-product motion-reduce:transition-none md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <SidebarBrand />

          <nav className="space-y-1" aria-label="Dashboard navigation">
            <SidebarSectionNav
              sections={sections}
              activeSection={activeSection}
              onNavigate={(id) => {
                onNavigate(id);
                onMobileClose?.();
              }}
            />

            <SidebarActions
              onRefresh={onRefresh}
              onLogout={onLogout}
              onMobileClose={onMobileClose}
              refreshing={refreshing}
              lastUpdated={lastUpdated}
            />
          </nav>

          <SidebarLegalFooter onLegalLinkClick={handleLegalLinkClick} />
        </div>
      </aside>
    </>
  );
}

function MenuIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function MobileMenuButton({ onClick, ariaExpanded }) {
  return (
    <IconButton
      icon={<MenuIcon className="h-5 w-5" />}
      ariaLabel="Open menu"
      variant="ghost"
      size="md"
      aria-expanded={ariaExpanded}
      className="motion-interactive motion-press rounded-lg border border-piggy-border hover:border-piggy-pink/40 hover:bg-piggy-peach/40 active:bg-piggy-peach/60 md:hidden"
      onClick={onClick}
    />
  );
}
