"use client";

import { useEffect } from "react";

const FadeInObserver = () => {
  useEffect(() => {
    console.log("[FadeInObserver] running...");

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    const observeElements = () => {
      const elements = document.querySelectorAll(".fade-in:not(.visible)");
      console.log("Found fade-in elements:", elements);
      elements.forEach((el) => intersectionObserver.observe(el));
    };

    observeElements();

    const mutationObserver = new MutationObserver(observeElements);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    console.log("[FadeInObserver] running...");
    document.querySelectorAll(".fade-in").forEach((el) => {
      console.log("Found fade-in element:", el);
    });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
};

export default FadeInObserver;
