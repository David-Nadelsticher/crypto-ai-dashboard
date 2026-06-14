import ContentSkeleton from "../../ui/ContentSkeleton";

export default function SectionCardLoadingState({ skeletonLayout }) {
  return (
    <div>
      <ContentSkeleton layout={skeletonLayout} />
      <p className="mt-3 text-center text-sm text-piggy-gray" role="status" aria-live="polite">
        Piggy is preparing today&apos;s brief…
      </p>
    </div>
  );
}
