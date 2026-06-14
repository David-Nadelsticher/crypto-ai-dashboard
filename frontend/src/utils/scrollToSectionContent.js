const EXPAND_ANIMATION_MS = 350;

export function scrollToSectionContent(sectionId) {
  if (!sectionId) return undefined;

  const timeoutId = window.setTimeout(() => {
    const section = document.getElementById(sectionId);
    const contentStart =
      section?.querySelector("[data-section-content-start]") ?? section;

    if (!contentStart) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    contentStart.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center",
    });
  }, EXPAND_ANIMATION_MS);

  return timeoutId;
}
