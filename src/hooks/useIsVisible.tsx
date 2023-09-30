import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useIsVisible(ref, rootMargin) {
  const [isIntersecting, setIntersecting] = useState(false);
  const {pathname} = useLocation();

  
  useEffect(() => {
    if (pathname !== '/') return;
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { root: null, rootMargin, threshold: [0.01, 0.99] }
    );

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref, pathname, rootMargin]);

  return isIntersecting;
}
