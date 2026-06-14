import { useEffect, useRef, useState } from "react";
import { Routes, useLocation } from "react-router-dom";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

export default function AnimatedRoutes({ children }) {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayLocation, setDisplayLocation] = useState(location);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (prefersReducedMotion || typeof document.startViewTransition !== "function") {
      setDisplayLocation(location);
      return;
    }

    document.startViewTransition(() => {
      setDisplayLocation(location);
    });
  }, [location, prefersReducedMotion]);

  return (
    <Routes location={displayLocation} key={displayLocation.pathname}>
      {children}
    </Routes>
  );
}
