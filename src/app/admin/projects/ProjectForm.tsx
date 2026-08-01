"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiExternalLink, FiTrash2 } from "react-icons/fi";
import styles from "../admin.module.css";
import ImageField from "./ImageField";
import SaveBar from "../SaveBar";
import {
  deleteProjectAction,
  saveProjectAction,
  type ActionState,
} from "@/app/actions/admin";
import type { Project } from "@/types/types";

const INITIAL: ActionState = { status: "idle" };

const BLANK: Project = {
  slug: "",
  title: "",
  tagline: "",
  description: [],
  image: "",
  images: [],
  tags: [],
  liveUrl: "",
  githubUrl: "",
  year: "",
  role: "",
  status: "draft",
  featured: false,
  order: 0,
};

export default function ProjectForm({
  project,
  isNew = false,
}: {
  project?: Project;
  isNew?: boolean;
}) {
  const router = useRouter();
  const p = project ?? BLANK;

  const [state, formAction] = useActionState(saveProjectAction, INITIAL);
  const [deleteState, deleteAction] = useActionState(
    deleteProjectAction,
    INITIAL
  );
  const [confirming, setConfirming] = useState(false);

  // Creating and deleting both leave this page invalid — go back to the list.
  useEffect(() => {
    if (isNew && state.status === "ok") router.replace("/admin/projects");
  }, [isNew, state.status, router]);

  useEffect(() => {
    if (deleteState.status === "ok") router.replace("/admin/projects");
  }, [deleteState.status, router]);

  return (
    <>
      <form action={formAction} className={styles.card}>
        <div className={styles.cardHead}>
          <span className={styles.cardTitle}>
            {isNew ? "New project" : p.title}
          </span>
          {!isNew && (
            <span className={styles.cardMeta}>
              <a
                href={`/work/${p.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                view on site <FiExternalLink size={11} />
              </a>
            </span>
          )}
        </div>

        <div className={`${styles.cardBody} ${styles.form}`}>
          <div className={styles.grid2}>
            <label className={styles.field}>
              <span className={styles.label}>title</span>
              <input
                className={styles.input}
                name="title"
                defaultValue={p.title}
                required
                placeholder="Flipbook Image Viewer"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>slug</span>
              <input
                className={styles.input}
                name="slug"
                defaultValue={p.slug}
                required
                readOnly={!isNew}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                placeholder="flipbook-viewer"
              />
              <span className={styles.hint}>
                {isNew
                  ? "Lowercase words separated by hyphens. Becomes /work/<slug>."
                  : "The slug is the page URL and cannot be changed here."}
              </span>
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>tagline</span>
            <input
              className={styles.input}
              name="tagline"
              defaultValue={p.tagline ?? ""}
              placeholder="Page-turning image books, driven by a GraphQL backend."
            />
            <span className={styles.hint}>
              One line. Shown on the card and under the title.
            </span>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>description</span>
            <textarea
              className={`${styles.textarea} ${styles.textareaTall}`}
              name="description"
              defaultValue={p.description.join("\n")}
              placeholder="What it does and why it is interesting."
            />
            <span className={styles.hint}>
              One paragraph per line. Shown on the project detail page.
            </span>
          </label>

          <ImageField
            name="image"
            label="cover image"
            defaultValue={p.image}
          />

          <label className={styles.field}>
            <span className={styles.label}>gallery</span>
            <textarea
              className={styles.textarea}
              name="images"
              defaultValue={p.images.join("\n")}
              placeholder="https://res.cloudinary.com/…"
            />
            <span className={styles.hint}>
              One image URL per line. Upload them with the cover picker above,
              then paste the URLs here.
            </span>
          </label>

          <div className={styles.grid2}>
            <label className={styles.field}>
              <span className={styles.label}>live url</span>
              <input
                className={styles.input}
                name="liveUrl"
                type="url"
                defaultValue={p.liveUrl ?? ""}
                placeholder="https://example.vercel.app"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>github url</span>
              <input
                className={styles.input}
                name="githubUrl"
                type="url"
                defaultValue={p.githubUrl ?? ""}
                placeholder="https://github.com/you/repo"
              />
            </label>
          </div>

          <div className={styles.grid2}>
            <label className={styles.field}>
              <span className={styles.label}>tech tags</span>
              <input
                className={styles.input}
                name="tags"
                defaultValue={p.tags.join(", ")}
                placeholder="Next.js, GraphQL, MongoDB"
              />
              <span className={styles.hint}>Comma separated.</span>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>year</span>
              <input
                className={styles.input}
                name="year"
                defaultValue={p.year ?? ""}
                placeholder="2026"
              />
            </label>
          </div>

          <div className={styles.grid2}>
            <label className={styles.field}>
              <span className={styles.label}>role</span>
              <input
                className={styles.input}
                name="role"
                defaultValue={p.role ?? ""}
                placeholder="Full-stack"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>order</span>
              <input
                className={styles.input}
                name="order"
                type="number"
                defaultValue={p.order}
              />
              <span className={styles.hint}>Lower numbers appear first.</span>
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>status</span>
            <select
              className={styles.select}
              name="status"
              defaultValue={p.status}
            >
              <option value="draft">draft — hidden from the site</option>
              <option value="published">published — live</option>
            </select>
          </label>

          <label className={styles.checkRow}>
            <input
              type="checkbox"
              name="featured"
              defaultChecked={p.featured}
            />
            Featured — highlighted on the work grid
          </label>
        </div>

        <SaveBar state={state} label={isNew ? "Create project" : "Save project"} />
      </form>

      {!isNew && (
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.cardTitle}>Danger zone</span>
          </div>
          <div className={styles.cardBody}>
            <p className={styles.hint} style={{ marginBottom: "0.75rem" }}>
              Deleting removes the project and destroys its uploaded Cloudinary
              images. This cannot be undone.
            </p>

            {confirming ? (
              <form action={deleteAction} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <input type="hidden" name="slug" value={p.slug} />
                <button type="submit" className={styles.btnDanger}>
                  <FiTrash2 size={13} /> Yes, delete {p.slug}
                </button>
                <button
                  type="button"
                  className={styles.btnGhost}
                  onClick={() => setConfirming(false)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                type="button"
                className={styles.btnDanger}
                onClick={() => setConfirming(true)}
              >
                <FiTrash2 size={13} /> Delete project
              </button>
            )}

            {deleteState.status === "error" && deleteState.message && (
              <p className={`${styles.status} ${styles.statusErr}`} style={{ marginTop: "0.6rem" }}>
                {deleteState.message}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
