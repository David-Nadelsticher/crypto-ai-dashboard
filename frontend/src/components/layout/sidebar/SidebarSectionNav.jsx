import { DashboardIcon, SECTION_ICON_MAP } from "../../icons/SectionIcons";

export default function SidebarSectionNav({ sections, activeSection, onNavigate }) {
  return (
    <>
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
    </>
  );
}
