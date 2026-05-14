import { useEffect, useState } from "react";

export const useViewport = (breakpoint: number) => {
  const [matches, setMatches] = useState(
    () => window.matchMedia(`(max-width: ${breakpoint}px)`).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQuery.addEventListener("change", onChange);
    setMatches(mediaQuery.matches);

    return () => mediaQuery.removeEventListener("change", onChange);
  }, [breakpoint]);

  return matches;
};
