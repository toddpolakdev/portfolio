import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiExternalLink, FiGithub } from "react-icons/fi";
import TopBar from "@/components/TopBar/TopBar";
import Footer from "@/components/Footer/Footer";
import RevealObserver from "@/components/Reveal/RevealObserver";
import styles from "./page.module.css";
import { gql, TAGS } from "@/lib/gql";
import { GET_PROJECT, GET_PROJECTS } from "@/lib/queries";
import { bySectionId, getSections } from "@/lib/content";
import type { Project } from "@/types/types";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

async function loadProject(slug: string): Promise<Project | null> {
  try {
    const data = await gql<{ project: Project | null }>(GET_PROJECT, {
      variables: { slug },
      tags: [TAGS.projects],
    });
    return data.project;
  } catch (err) {
    console.error(`[work] failed to load project "${slug}":`, err);
    return null;
  }
}

/** Pre-renders a page per published project at build time. */
export async function generateStaticParams() {
  try {
    const data = await gql<{ projects: Project[] }>(GET_PROJECTS, {
      tags: [TAGS.projects],
    });
    return data.projects.map((p) => ({ slug: p.slug }));
  } catch {
    // Falls back to on-demand rendering if the API is unreachable at build.
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await loadProject(slug);

  if (!project) return { title: "Project not found" };

  const description =
    project.tagline ?? project.description[0] ?? `${project.title} — a project by Todd Polak.`;

  return {
    title: project.title,
    description,
    openGraph: {
      title: project.title,
      description,
      type: "article",
      images: project.image ? [{ url: project.image }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const [project, sections] = await Promise.all([
    loadProject(slug),
    getSections(),
  ]);

  if (!project) notFound();

  const hero = bySectionId(sections).hero;

  const chips = [
    project.year && { key: "year", value: project.year },
    project.role && { key: "role", value: project.role },
    project.tags.length > 0 && { key: "stack", value: project.tags.join(", ") },
  ].filter(Boolean) as { key: string; value: string }[];

  return (
    <>
      <TopBar />

      <main className={styles.page}>
        <div className="wrap">
          <Link href="/#work" className={styles.back}>
            <FiArrowLeft size={14} /> cd ..
          </Link>

          <p className={styles.crumb}>
            <span className={styles.sigil}>$</span> cat ~/projects/
            {project.slug}/README.md
          </p>

          <h1 className={styles.title}>{project.title}</h1>

          {project.tagline && (
            <p className={styles.tagline}>{project.tagline}</p>
          )}

          {chips.length > 0 && (
            <div className={styles.metaRow}>
              {chips.map((chip) => (
                <span key={chip.key} className={styles.chip}>
                  <span className={styles.chipKey}>{chip.key}:</span>
                  {chip.value}
                </span>
              ))}
            </div>
          )}

          <div className={styles.actions}>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.action}
              >
                <FiExternalLink size={14} /> Visit live site
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionGhost}
              >
                <FiGithub size={14} /> View source
              </a>
            )}
          </div>

          {project.image && (
            <div className={styles.shot}>
              <Image
                src={project.image}
                alt={`${project.title} screenshot`}
                fill
                priority
                sizes="(max-width: 1180px) 100vw, 1140px"
              />
            </div>
          )}

          {project.description.length > 0 && (
            <div className={`${styles.prose} reveal`}>
              <h2>
                <span className={styles.sigil}>$</span> cat ./overview.md
              </h2>
              {project.description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {project.images.length > 0 && (
            <div className={styles.gallery}>
              {project.images.map((src, i) => (
                <div key={src} className={`${styles.galleryItem} reveal`}>
                  <Image
                    src={src}
                    alt={`${project.title} screenshot ${i + 2}`}
                    fill
                    sizes="(max-width: 760px) 100vw, 360px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer hero={hero} />
      <RevealObserver />
    </>
  );
}
