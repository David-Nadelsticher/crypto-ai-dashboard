export default function SectionCardCollapsedPreview({
  expanded,
  error,
  isInitialLoading,
  previewContent,
}) {
  if (isInitialLoading || expanded || error) return null;

  return (
    <div className="flex-1 transition-opacity duration-normal ease-product">{previewContent}</div>
  );
}
