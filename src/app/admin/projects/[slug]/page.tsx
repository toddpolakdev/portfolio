import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import styles from "../../admin.module.css";
import ProjectForm from "../ProjectForm";
import { gqlAdmin } from "@/lib/gql";
import { GET_ADMIN_PROJECTS } from "@/lib/queries";
import type { Project } from "@/types/types";

export const dynamic = "force-dynamic";

/**
 * Reads through the admin list rather than the public `project(slug:)` query,
 * which filters to published only — drafts must be editable too.
 */
async function loadProject(slug: string): Promise<Project | null> {
  try {
    const data = await gqlAdmin<{ adminProjects: Project[] }>(
      GET_ADMIN_PROJECTS
    );
    return data.adminProjects.find((p) => p.slug === slug) ?? null;
  } catch (err) {
    console.error("[admin] project load failed:", err);
    return null;
  }
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await loadProject(slug);

  if (!project) notFound();

  return (
    <>
      <header className={styles.header}>
        <p className={styles.crumb}>
          <Link href="/admin/projects">
            <FiArrowLeft size={11} /> projects
          </Link>{" "}
          / {project.slug}
        </p>
        <h1 className={styles.h1}>{project.title}</h1>
      </header>

      <ProjectForm project={project} />
    </>
  );
}
