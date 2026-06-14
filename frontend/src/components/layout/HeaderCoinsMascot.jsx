import LazyImage from "../ui/LazyImage";

export default function HeaderCoinsMascot({ className = "" }) {
  return (
    <div
      className={`header-coins-mascot aspect-square h-80 w-80 shrink-0 md:h-[22rem] md:w-[22rem] lg:h-[32rem] lg:w-[32rem] xl:h-[36rem] xl:w-[36rem] ${className}`}
      aria-hidden="true"
    >
      <LazyImage
        src="/piggy-coins-header-transparent.png"
        alt=""
        loading="eager"
        wrapperClassName="h-full w-full rounded-full p-2 md:p-3"
        imgClassName="h-full w-full rounded-full object-contain object-bottom"
      />
    </div>
  );
}
