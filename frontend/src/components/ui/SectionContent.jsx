import StateMessage from "./StateMessage";

export default function SectionContent({ isEmpty, emptyMessage, children, renderContent }) {
  if (isEmpty) {
    return <StateMessage variant="empty" message={emptyMessage} />;
  }

  if (renderContent) {
    return renderContent();
  }

  return children;
}
