export default function PageLayout({ maxWidth = "3xl", centered = false, children }) {
  const maxWidthClass = maxWidth === "md" ? "max-w-md" : "max-w-3xl";

  return (
    <div
      className={`crypto-bg-pattern min-h-screen px-4 py-12 ${
        centered ? "flex items-center justify-center" : ""
      }`}
    >
      <div className={`mx-auto w-full ${maxWidthClass}`}>{children}</div>
    </div>
  );
}
