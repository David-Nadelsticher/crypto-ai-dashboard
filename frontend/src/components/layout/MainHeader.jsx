import { MobileMenuButton } from "./Sidebar";
import MarketSnapshotBar from "./MarketSnapshotBar";
import PreferencesSummary from "./PreferencesSummary";
import HeaderPiggyIllustration from "../illustrations/HeaderPiggyIllustration";

export default function MainHeader({
  userName,
  preferences,
  prices = [],
  pricesStatus,
  onMenuOpen,
}) {
  const displayName = userName || "Investor";

  return (
    <header className="dashboard-header-band -mx-4 -mt-8 mb-8 md:-mx-10 md:-mt-10">
      <div className="dashboard-header-band-inner px-4 pb-0 pt-8 md:px-10 md:pt-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-8 xl:gap-10">
          <div className="dashboard-header-content mb-8 min-w-0 lg:mb-10">
            <div className="mb-3 flex items-center gap-3 md:hidden">
              <MobileMenuButton onClick={onMenuOpen} />
            </div>

            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="dashboard-hero-eyebrow">Piggy Daily</p>
                <h1 className="dashboard-hero-title">
                  Hello, <span className="dashboard-hero-name">{displayName}</span>
                </h1>
                <p className="dashboard-hero-subtitle">
                  Your personalized daily crypto brief — tuned to what you care about.
                </p>
              </div>

              <aside className="dashboard-header-piggy lg:hidden" aria-hidden="true">
                <HeaderPiggyIllustration variant="mobile" />
              </aside>
            </div>

            <div className="dashboard-hero-divider" aria-hidden="true" />

            <MarketSnapshotBar
              prices={prices}
              pricesStatus={pricesStatus}
              variant="hero"
            />

            <PreferencesSummary preferences={preferences} variant="hero" />
          </div>

          <aside className="dashboard-header-piggy dashboard-header-piggy--desktop" aria-hidden="true">
            <HeaderPiggyIllustration variant="desktop" />
          </aside>
        </div>
      </div>
    </header>
  );
}
