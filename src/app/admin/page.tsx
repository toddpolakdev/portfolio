import Link from "next/link";
import { FiAlertTriangle, FiFolder, FiInbox, FiType } from "react-icons/fi";
import styles from "./admin.module.css";
import { gqlAdmin } from "@/lib/gql";
import { GET_ADMIN_PROJECTS, GET_ADMIN_SECTIONS, GET_CONTACTS } from "@/lib/queries";
import type { ContactEntry, Project, Section } from "@/types/types";

export const dynamic = "force-dynamic";

type Snapshot = {
  sections: Section[];
  projects: Project[];
  contacts: ContactEntry[];
  error: string | null;
};

async function loadSnapshot(): Promise<Snapshot> {
  try {
    const [s, p, c] = await Promise.all([
      gqlAdmin<{ adminSections: Section[] }>(GET_ADMIN_SECTIONS),
      gqlAdmin<{ adminProjects: Project[] }>(GET_ADMIN_PROJECTS),
      gqlAdmin<{ contacts: ContactEntry[] }>(GET_CONTACTS),
    ]);

    return {
      sections: s.adminSections,
      projects: p.adminProjects,
      contacts: c.contacts,
      error: null,
    };
  } catch (err) {
    console.error("[admin] dashboard load failed:", err);
    return {
      sections: [],
      projects: [],
      contacts: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function timeAgo(iso?: string | null): string {
  if (!iso) return "never";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "unknown";

  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;

  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.round(hours / 24)}d ago`;
}

export default async function AdminDashboard() {
  const { sections, projects, contacts, error } = await loadSnapshot();

  const published = projects.filter((p) => p.status === "published");
  const drafts = projects.filter((p) => p.status !== "published");
  const unread = contacts.filter((c) => !c.read);

  const lastEdit = [...sections, ...projects]
    .map((item) => item.updatedAt)
    .filter(Boolean)
    .sort()
    .pop();

  return (
    <>
      <header className={styles.header}>
        <p className={styles.crumb}>
          <span className={styles.sigil}>$</span> cd ~/admin
        </p>
        <h1 className={styles.h1}>Dashboard</h1>
        <p className={styles.sub}>
          Everything on the public site is served from these records. Saving
          here revalidates the live pages immediately.
        </p>
      </header>

      {error && (
        <p className={styles.warn}>
          <FiAlertTriangle size={16} />
          <span>
            Could not reach the GraphQL API: {error}. Check that the backend is
            running and <code>ADMIN_API_TOKEN</code> matches on both sides.
          </span>
        </p>
      )}

      <div className={styles.tiles}>
        <Link href="/admin/sections" className={styles.tile}>
          <span className={styles.tileLabel}>
            <FiType size={12} /> copy sections
          </span>
          <span className={styles.tileValue}>{sections.length}</span>
          <span className={styles.tileHint}>
            {sections.filter((s) => s.published !== false).length} published
          </span>
        </Link>

        <Link href="/admin/projects" className={styles.tile}>
          <span className={styles.tileLabel}>
            <FiFolder size={12} /> projects
          </span>
          <span className={styles.tileValue}>{projects.length}</span>
          <span className={styles.tileHint}>
            {published.length} live · {drafts.length} draft
          </span>
        </Link>

        <Link href="/admin/inbox" className={styles.tile}>
          <span className={styles.tileLabel}>
            <FiInbox size={12} /> messages
          </span>
          <span className={styles.tileValue}>{contacts.length}</span>
          <span className={styles.tileHint}>
            {unread.length ? `${unread.length} unread` : "all read"}
          </span>
        </Link>

        <div className={styles.tile}>
          <span className={styles.tileLabel}>last edit</span>
          <span className={styles.tileValue} style={{ fontSize: "1.15rem" }}>
            {timeAgo(lastEdit)}
          </span>
          <span className={styles.tileHint}>across copy and projects</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHead}>
          <span className={styles.cardTitle}>Recent messages</span>
          <span className={styles.cardMeta}>
            <Link href="/admin/inbox">view all →</Link>
          </span>
        </div>

        {contacts.length === 0 ? (
          <p className={styles.cardBody} style={{ color: "var(--dim)" }}>
            No messages yet.
          </p>
        ) : (
          <div className={styles.rows}>
            {contacts.slice(0, 5).map((c) => (
              <div key={c._id} className={styles.row}>
                <div className={styles.rowMain}>
                  <p className={styles.rowTitle}>{c.subject}</p>
                  <p className={styles.rowSub}>
                    {c.name} · {c.email} · {timeAgo(c.createdAt)}
                  </p>
                </div>
                {!c.read && (
                  <span className={`${styles.pill} ${styles.pillNew}`}>new</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.card}>
        <div className={styles.cardHead}>
          <span className={styles.cardTitle}>Projects</span>
          <span className={styles.cardMeta}>
            <Link href="/admin/projects">manage →</Link>
          </span>
        </div>

        {projects.length === 0 ? (
          <p className={styles.cardBody} style={{ color: "var(--dim)" }}>
            No projects yet.
          </p>
        ) : (
          <div className={styles.rows}>
            {projects.map((p) => (
              <div key={p.slug} className={styles.row}>
                <div className={styles.rowMain}>
                  <p className={styles.rowTitle}>{p.title}</p>
                  <p className={styles.rowSub}>
                    /work/{p.slug} · updated {timeAgo(p.updatedAt)}
                  </p>
                </div>
                <span
                  className={`${styles.pill} ${
                    p.status === "published" ? styles.pillOn : styles.pillOff
                  }`}
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
