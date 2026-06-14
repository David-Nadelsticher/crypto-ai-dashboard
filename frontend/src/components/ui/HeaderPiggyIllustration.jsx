import LazyImage from "./LazyImage";

function HeaderPiggyFallback({ className = "" }) {
  return (
    <svg
      viewBox="0 0 320 280"
      aria-hidden="true"
      className={`shrink-0 object-contain ${className}`}
    >
      <circle cx="170" cy="118" r="52" fill="#FF8BA7" />
      <ellipse cx="170" cy="128" rx="36" ry="28" fill="#FFC9A5" />
      <rect x="88" y="96" width="64" height="16" rx="8" fill="#2E2A27" opacity="0.85" />
      <circle cx="118" cy="168" r="22" fill="#E8B923" />
    </svg>
  );
}

const VARIANTS = {
  mobile: {
    shell: "h-32 w-[8.5rem] sm:h-36 sm:w-40",
    src: "/piggy-header-trader.png",
    img: "h-full w-full object-contain object-right-bottom",
  },
  desktop: {
    shell: "h-[min(20rem,38vh)] w-[min(26rem,34vw)] xl:h-[22rem] xl:w-[30rem]",
    src: "/piggy-header-trader.png",
    img: "h-full w-full object-contain object-right-bottom",
  },
};

export default function HeaderPiggyIllustration({ variant = "desktop", className = "" }) {
  const config = VARIANTS[variant] || VARIANTS.desktop;

  return (
    <div className={`dashboard-header-piggy-slot shrink-0 ${className}`} aria-hidden="true">
      <div className={`dashboard-header-piggy-image-shell ${config.shell}`}>
        <LazyImage
          src={config.src}
          alt=""
          wrapperClassName="h-full w-full"
          imgClassName={`dashboard-header-piggy-image ${config.img}`}
          fallback={<HeaderPiggyFallback className="h-full w-full" />}
        />
      </div>
    </div>
  );
}
