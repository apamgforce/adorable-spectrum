"use client";

import { useCallback } from "react";

export function useReveal() {
  // We use useCallback instead of useRef to ensure the observer attaches 
  // only when the element is fully bound and painted in the DOM layout tree.
  const revealRef = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Wrap in requestAnimationFrame to execute smoothly right before the next browser repaint
          requestAnimationFrame(() => {
            node.classList.add("visible");
          });
          observer.unobserve(node);
        }
      },
      { 
        // Trigger slightly earlier (0.05 instead of 0.15) to prevent empty space flashing on fast scrolls
        threshold: 0.05, 
        // Expand the check zone 20px below the viewport so it starts fading in right before crossing the boundary
        rootMargin: "0px 0px 20px 0px"
      }
    );

    observer.observe(node);
  }, []);

  return revealRef;
}
