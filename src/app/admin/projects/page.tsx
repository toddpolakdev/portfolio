import Link from "next/link";
import { FiAlertTriangle, FiEdit3, FiPlus } from "react-icons/fi";
import styles from "../admin.module.css";
import { gqlAdmin } from "@/lib/gql";
import { GET_ADMIN_PROJECTS } from "@/lib/queries";
import type { Project } from "@/types/types";

export const dynamic = "force-dynamic";

async function loadProjects() {
  try {
    const data = await gqlAdmin<{ adminProjects: Project[] }>(
      GET_ADMIN_PROJECTS
    );
    return { projects: data.adminProjects, error: null as string | null };
  } catch (err) {
    console.error("[admin] projects load failed:", err);
    return {
      projects: [] as Project[],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export default async function ProjectsPage() {
  const { projects, error } = await loadProjects();

  return (
    <>
      <header className={styles.header}>
        <p className={styles.crumb}>
          <span className={styles.sigil}>$</span> ls ~/admin/projects
        </p>
        <h1 className={styles.h1}>Projects</h1>
        <p className={styles.sub}>
          Add a side project here and it appears on the work grid without a
          deploy. Drafts stay hidden until you publish them.
        </p>
      </header>

      {error && (
        <p className={styles.warn}>
          <FiAlertTriangle size={16} />
          <span>Could not load projects: {error}</span>
        </p>
      )}

      <div style={{ marginBottom: "1.25rem" }}>
        <Link href="/admin/projects/new" className={styles.btn}>
          <FiPlus size={14} /> New project
        </Link>
      </div>

      {projects.length === 0 && !error ? (
        <p className={styles.empty}>
          No projects yet. Create your first one above.
        </p>
      ) : (
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.cardTitle}>All projects</span>
            <span className={styles.cardMeta}>
              {projects.length} total · ordered as shown on the site
            </span>
          </div>

          <div className={styles.rows}>
            {projects.map((project) => (
              <div key={project.slug} className={styles.row}>
                <div className={styles.rowMain}>
                  <p className={styles.rowTitle}>{project.title}</p>
                  <p className={styles.rowSub}>
                    /work/{project.slug}
                    {project.tags.length > 0 && ` · ${project.tags.join(", ")}`}
                  </p>
                </div>

                <div className={styles.rowActions}>
                  {project.featured && (
                    <span className={styles.pill}>featured</span>
                  )}
                  <span
                    className={`${styles.pill} ${
                      project.status === "published"
                        ? styles.pillOn
                        : styles.pillOff
                    }`}
                  >
                    {project.status}
                  </span>
                  <Link
                    href={`/admin/projects/${project.slug}`}
                    className={`${styles.btnGhost} ${styles.btnSm}`}
                  >
                    <FiEdit3 size={12} /> edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
