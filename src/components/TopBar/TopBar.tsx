"use client";

import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import styles from "./TopBar.module.css";
import { openPalette } from "@/lib/palette";

const NAV = [
  { id: "about", label: "about" },
  { id: "skills", label: "skills" },
  { id: "work", label: "work" },
  { id: "experience", label: "experience" },
  { id: "education", label: "education" },
  { id: "contact", label: "contact" },
];

export default function TopBar() {
  const [active, setActive] = useState<string>("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isMac, setIsMac] = useState(false);

  // Read the theme the blocking script already applied, so the icon matches.
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);

  // Scrollspy: the section occupying the upper third of the viewport wins.
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.25, 0.5] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private browsing — the theme simply will not persist.
    }
  }

  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <div className={styles.lights} aria-hidden="true">
          <span className={styles.light} />
          <span className={styles.light} />
          <span className={styles.light} />
        </div>

        <a href="#top" className={styles.path}>
          <b>todd-polak</b> — ~/portfolio
        </a>

        <nav className={styles.nav} aria-label="Sections">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={styles.link}
              aria-current={active === item.id ? "true" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.kbd}
            onClick={openPalette}
            aria-label="Open command palette"
          >
            <span className={styles.kbdLabel}>Jump to…</span>
            <kbd>{isMac ? "⌘" : "Ctrl"}K</kbd>
          </button>

          <button
            type="button"
            className={styles.iconBtn}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <FiSun size={14} /> : <FiMoon size={14} />}
          </button>
        </div>
      </div>
    </header>
  );
}
