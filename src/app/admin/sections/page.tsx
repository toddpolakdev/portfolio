import { FiAlertTriangle } from "react-icons/fi";
import styles from "../admin.module.css";
import SectionForm from "./SectionForm";
import { gqlAdmin } from "@/lib/gql";
import { GET_ADMIN_SECTIONS } from "@/lib/queries";
import type { Section } from "@/types/types";

export const dynamic = "force-dynamic";

/** Display order in the editor, mirroring the order on the public page. */
const ORDER = ["hero", "about", "skills", "experience", "education", "contact"];

/**
 * Sections the site renders that may not exist as records yet. They are shown
 * as empty forms — saving one upserts it into the database.
 */
const STUBS: Record<string, { title: string; type: string }> = {
  hero: { title: "Todd Polak", type: "hero" },
  about: { title: "About Me", type: "about" },
  skills: { title: "Technical Skills", type: "skills" },
  experience: { title: "Professional Experience", type: "experience" },
  education: { title: "Education", type: "education" },
  contact: { title: "Get in touch", type: "contact" },
};

async function loadSections(): Promise<
  { sections: Section[]; error: string | null }
> {
  try {
    const data = await gqlAdmin<{ adminSections: Section[] }>(
      GET_ADMIN_SECTIONS
    );
    return { sections: data.adminSections, error: null };
  } catch (err) {
    console.error("[admin] sections load failed:", err);
    return {
      sections: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export default async function SectionsPage() {
  const { sections, error } = await loadSections();

  const existing = new Set(sections.map((s) => s.id));

  // Surface any section the site renders but the database has no row for, so
  // its copy is editable rather than stuck on the hardcoded fallback.
  const missing: Section[] = error
    ? []
    : Object.entries(STUBS)
        .filter(([id]) => !existing.has(id))
        .map(([id, stub]) => ({
          id,
          title: stub.title,
          type: stub.type,
          published: true,
          order: ORDER.indexOf(id),
        }));

  const sorted = [...sections, ...missing].sort((a, b) => {
    const ai = ORDER.indexOf(a.id);
    const bi = ORDER.indexOf(b.id);
    // Unknown ids sort after the known ones, alphabetically.
    if (ai === -1 && bi === -1) return a.id.localeCompare(b.id);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <>
      <header className={styles.header}>
        <p className={styles.crumb}>
          <span className={styles.sigil}>$</span> $EDITOR ~/admin/copy
        </p>
        <h1 className={styles.h1}>Copy</h1>
        <p className={styles.sub}>
          Every word on the public site. Each block saves independently and
          publishes as soon as you hit save.
        </p>
      </header>

      {error && (
        <p className={styles.warn}>
          <FiAlertTriangle size={16} />
          <span>Could not load sections: {error}</span>
        </p>
      )}

      {!error && sorted.length === 0 && (
        <p className={styles.empty}>
          No sections found in the database yet.
        </p>
      )}

      {missing.length > 0 && (
        <p className={styles.warn}>
          <FiAlertTriangle size={16} />
          <span>
            {missing.map((m) => m.id).join(", ")}{" "}
            {missing.length === 1 ? "has" : "have"} no record yet — the site is
            using built-in fallback copy. Fill the form in and save to take
            control of it.
          </span>
        </p>
      )}

      {sorted.map((section) => (
        <div key={section.id} style={{ marginBottom: "1.25rem" }}>
          <SectionForm section={section} />
        </div>
      ))}
    </>
  );
}
