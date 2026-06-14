const DEFAULT_LEGAL_LINKS = [
  { id: "privacy", label: "Privacy Policy" },
  { id: "terms", label: "Terms of Use" },
  { id: "cookies", label: "Cookie Policy" },
  { id: "contact", label: "Contact" },
];

export default function SidebarLegalFooter({
  legalLinks = DEFAULT_LEGAL_LINKS,
  onLegalLinkClick,
}) {
  return (
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
              {legalLinks.map((link) => (
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
  );
}
