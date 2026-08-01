"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowRight,
  FiExternalLink,
  FiFolder,
  FiGithub,
  FiHash,
  FiMail,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import styles from "./CommandPalette.module.css";
import { PALETTE_OPEN_EVENT } from "@/lib/palette";
import type { Project } from "@/types/types";

type Command = {
  id: string;
  label: string;
  group: string;
  hint?: string;
  icon: React.ReactNode;
  run: () => void;
};

export default function CommandPalette({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  // Restores keyboard focus to whatever opened the palette.
  const restoreFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
    restoreFocus.current?.focus();
  }, []);

  const goto = useCallback(
    (hash: string) => {
      close();
      document
        .getElementById(hash)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [close]
  );

  const commands = useMemo<Command[]>(() => {
    const nav = [
      { id: "top", label: "Go to top" },
      { id: "about", label: "About" },
      { id: "skills", label: "Skills" },
      { id: "work", label: "Selected work" },
      { id: "experience", label: "Experience" },
      { id: "education", label: "Education" },
      { id: "contact", label: "Contact" },
    ].map<Command>((item) => ({
      id: `nav-${item.id}`,
      label: item.label,
      group: "Navigate",
      hint: `#${item.id}`,
      icon: <FiHash size={14} />,
      run: () => goto(item.id),
    }));

    const projectCmds = projects.map<Command>((project) => ({
      id: `project-${project.slug}`,
      label: project.title,
      group: "Projects",
      hint: project.year ?? undefined,
      icon: <FiFolder size={14} />,
      run: () => {
        close();
        router.push(`/work/${project.slug}`);
      },
    }));

    const liveCmds = projects
      .filter((p) => p.liveUrl)
      .map<Command>((project) => ({
        id: `live-${project.slug}`,
        label: `Open ${project.title} live`,
        group: "Links",
        hint: "external",
        icon: <FiExternalLink size={14} />,
        run: () => {
          close();
          window.open(project.liveUrl!, "_blank", "noopener,noreferrer");
        },
      }));

    const actions: Command[] = [
      {
        id: "github",
        label: "Open GitHub profile",
        group: "Links",
        hint: "external",
        icon: <FiGithub size={14} />,
        run: () => {
          close();
          window.open(
            "https://github.com/toddpolakdev",
            "_blank",
            "noopener,noreferrer"
          );
        },
      },
      {
        id: "email",
        label: "Send an email",
        group: "Links",
        icon: <FiMail size={14} />,
        run: () => {
          close();
          window.location.href = "mailto:toddpolakdev@gmail.com";
        },
      },
      {
        id: "theme",
        label: "Toggle light / dark theme",
        group: "Actions",
        icon:
          typeof document !== "undefined" &&
          document.documentElement.getAttribute("data-theme") === "light" ? (
            <FiMoon size={14} />
          ) : (
            <FiSun size={14} />
          ),
        run: () => {
          const el = document.documentElement;
          const next =
            el.getAttribute("data-theme") === "light" ? "dark" : "light";
          el.setAttribute("data-theme", next);
          try {
            localStorage.setItem("theme", next);
          } catch {
            // Ignore — the theme just will not persist.
          }
          close();
        },
      },
    ];

    return [...nav, ...projectCmds, ...liveCmds, ...actions];
  }, [projects, goto, close, router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // Open on ⌘K / Ctrl+K, or when something dispatches the open event.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        restoreFocus.current = document.activeElement as HTMLElement;
        setOpen((v) => !v);
      }
    }

    function onOpen() {
      restoreFocus.current = document.activeElement as HTMLElement;
      setOpen(true);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(PALETTE_OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(PALETTE_OPEN_EVENT, onOpen);
    };
  }, []);

  // Lock body scroll and focus the input while open.
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Reset the highlight whenever the result set changes under it.
  useEffect(() => setIndex(0), [query]);

  // Keep the highlighted row in view during keyboard navigation.
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [index]);

  if (!open) return null;

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i + 1) % results.length : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) =>
        results.length ? (i - 1 + results.length) % results.length : 0
      );
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      results[index]?.run();
    }
  }

  let lastGroup = "";

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={onKeyDown}
      >
        <div className={styles.inputRow}>
          <span className={styles.sigil} aria-hidden="true">
            $
          </span>
          <input
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search…"
            aria-label="Search commands"
            autoComplete="off"
            spellCheck={false}
          />
          <span className={styles.esc}>esc</span>
        </div>

        {results.length === 0 ? (
          <p className={styles.empty}>
            command not found: {query.trim() || " "}
          </p>
        ) : (
          <ul className={styles.list} ref={listRef}>
            {results.map((cmd, i) => {
              const showGroup = cmd.group !== lastGroup;
              lastGroup = cmd.group;

              return (
                <li key={cmd.id}>
                  {showGroup && (
                    <p className={styles.groupLabel}>{cmd.group}</p>
                  )}
                  <button
                    type="button"
                    className={styles.item}
                    data-active={i === index}
                    onMouseEnter={() => setIndex(i)}
                    onClick={cmd.run}
                  >
                    <span className={styles.itemIcon}>{cmd.icon}</span>
                    <span className={styles.itemLabel}>{cmd.label}</span>
                    {cmd.hint && (
                      <span className={styles.itemHint}>{cmd.hint}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className={styles.footer}>
          <span>
            <kbd>↑↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> select
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
          <span style={{ marginLeft: "auto" }}>
            <FiArrowRight size={11} /> {results.length} results
          </span>
        </div>
      </div>
    </div>
  );
}
