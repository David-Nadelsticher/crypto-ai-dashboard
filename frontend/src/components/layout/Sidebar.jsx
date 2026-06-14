import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { formatLastUpdated } from "../../utils/format";
import PiggyAvatar from "../brand/PiggyAvatar";
import Spinner from "../ui/Spinner";
import Toast from "../ui/Toast";
import { DashboardIcon, SECTION_ICON_MAP } from "../icons/SectionIcons";
import { DASHBOARD_SECTIONS } from "../../config/dashboardSections";

const DEFAULT_NAV_ITEMS = DASHBOARD_SECTIONS;

const LEGAL_LINKS = [
  { id: "privacy", label: "Privacy Policy" },
  { id: "terms", label: "Terms of Use" },
  { id: "cookies", label: "Cookie Policy" },
  { id: "contact", label: "Contact" },
];

function SidebarContent({
  sections,
  activeSection,
  onNavigate,
  onRefresh,
  onLogout,
  onMobileClose,
  onLegalLinkClick,
  refreshing,
  lastUpdated,
}) {
  return (
    <>
      <div className="mb-8 flex items-center gap-3">
        <PiggyAvatar size="sm" />
        <div>
          <p className="font-heading text-lg font-bold text-piggy-charcoal">Piggy Daily</p>
          <p className="text-xs text-piggy-gray">Your crypto editor</p>
        </div>
      </div>

      <nav className="space-y-1" aria-label="Dashboard navigation">
        <div
          aria-current="page"
          className="flex w-full items-center gap-3 rounded-lg border-l-2 border-piggy-pink bg-piggy-peach/30 px-3 py-2.5 text-left text-sm font-medium text-piggy-charcoal"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center text-piggy-pink">
            <DashboardIcon className="h-4 w-4" />
          </span>
          <span className="truncate">DashBoard</span>
        </div>

        {sections.map((item) => {
          const Icon = SECTION_ICON_MAP[item.iconKey];
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? "true" : undefined}
              className={`nav-item ${isActive ? "nav-item-active" : ""}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center text-piggy-pink">
                <Icon className="h-4 w-4" />
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        <div className="space-y-1 border-t border-piggy-border pt-3 mt-3" aria-busy={refreshing} aria-live="polite">
          <Link
            to="/settings"
            onClick={() => onMobileClose?.()}
            className="nav-item-accent"
          >
            Edit preferences
          </Link>
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="nav-item disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-transparent disabled:hover:bg-transparent disabled:hover:text-piggy-gray"
          >
            {refreshing && <Spinner className="h-4 w-4 shrink-0" />}
            {refreshing ? "Refreshing brief…" : "Refresh Brief"}
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="nav-item"
          >
            Log out
          </button>
          {lastUpdated && (
            <p className="px-3 pt-1 text-xs text-piggy-gray">
              Updated {formatLastUpdated(lastUpdated)}
            </p>
          )}
        </div>
      </nav>

      <div className="sidebar-mascot-stage mt-auto shrink-0 -mx-6 -mb-6">
        <div className="relative">
          <div className="pointer-events-none relative z-10 flex h-52 w-full items-end justify-center px-1">
            <img
              src="/piggy-sidebar-mascot-transparent.png"
              alt=""
              aria-hidden="true"
              className="h-[118%] w-full max-w-none select-none object-contain object-bottom"
            />
          </div>

          <div className="sidebar-legal-footer relative z-0 -mt-14 px-4 pb-4 pt-12">
            <nav aria-label="Legal and support links">
              <ul className="space-y-1">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => onLegalLinkClick?.(link.label)}
                      className="sidebar-legal-link"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

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

  useEffect(() => {
    if (!mobileOpen || !asideRef.current) return undefined;

    const focusable = asideRef.current.querySelectorAll(
      'button, a, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onMobileClose();
      }
      if (event.key === "Tab" && focusable.length > 0) {
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onMobileClose]);

  return (
    <>
      <Toast
        variant="info"
        message={legalNotice}
        onDismiss={() => setLegalNotice(null)}
      />

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="focus-ring fixed inset-0 z-40 bg-piggy-charcoal/30 motion-fade-in md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        ref={asideRef}
        aria-label="Sidebar navigation"
        aria-modal={mobileOpen ? "true" : undefined}
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-piggy-border bg-piggy-card p-6 transition-transform duration-slow ease-product motion-reduce:transition-none md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <SidebarContent
          sections={sections}
          activeSection={activeSection}
          onNavigate={(id) => {
            onNavigate(id);
            onMobileClose();
          }}
          onRefresh={onRefresh}
          onLogout={onLogout}
          onMobileClose={onMobileClose}
          onLegalLinkClick={handleLegalLinkClick}
          refreshing={refreshing}
          lastUpdated={lastUpdated}
        />
        </div>
      </aside>
    </>
  );
}

export function MobileMenuButton({ onClick }) {
  return (
    <button
      type="button"
      aria-label="Open menu"
      onClick={onClick}
      className="focus-ring motion-interactive motion-press rounded-lg border border-piggy-border p-2 text-piggy-charcoal hover:border-piggy-pink/40 hover:bg-piggy-peach/40 active:bg-piggy-peach/60 md:hidden"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
