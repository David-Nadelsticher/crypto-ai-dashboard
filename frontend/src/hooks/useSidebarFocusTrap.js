import { useEffect } from "react";

export function useSidebarFocusTrap({ mobileOpen, asideRef, onMobileClose }) {
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
  }, [mobileOpen, onMobileClose, asideRef]);
}
