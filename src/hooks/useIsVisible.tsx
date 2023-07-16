import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useIsVisible(ref) {
  const [isIntersecting, setIntersecting] = useState(false);
  const {pathname} = useLocation();

  
  useEffect(() => {
    if (pathname !== '/') return;
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { root: null, rootMargin: "0px 0px -92.5% 0px" }
    );

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref, pathname]);

  return isIntersecting;
}
