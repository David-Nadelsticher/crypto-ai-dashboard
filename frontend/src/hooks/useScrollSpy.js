import { useEffect, useState } from "react";

function normalizeThreshold(threshold) {
  return Array.isArray(threshold) ? threshold : [threshold];
}

export function useScrollSpy(
  sectionIds,
  { root = null, rootMargin = "0px", threshold = 0 } = {},
) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { root, rootMargin, threshold: normalizeThreshold(threshold) },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sectionIds, root, rootMargin, threshold]);

  return activeId;
}
