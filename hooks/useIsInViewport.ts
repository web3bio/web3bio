import { useEffect, useMemo, useState } from "react";

export function useIsInViewport(ele) {
  const [isIntersecting, setIsIntersecting] = useState(true);
  const observer = useMemo(() => {
    if (ele) {
      return new IntersectionObserver(([entry]) =>
        setIsIntersecting(entry.isIntersecting)
      );
    }
  }, [ele]);

  useEffect(() => {
    if (ele && observer) {
      observer.observe(ele);
    }

    return () => {
      observer?.disconnect();
    };
  }, [ele, observer]);

  return isIntersecting;
}
