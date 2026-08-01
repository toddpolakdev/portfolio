"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminSession } from "@/auth";
import { gqlAdmin, TAGS } from "@/lib/gql";
import {
  DELETE_CONTACT,
  DELETE_PROJECT,
  MARK_CONTACT_READ,
  REORDER_PROJECTS,
  SIGN_UPLOAD,
  UPSERT_PROJECT,
  UPSERT_SECTION,
} from "@/lib/queries";
import type {
  EducationEntry,
  JobEntry,
  LinkEntry,
  SkillCategory,
  UploadSignature,
} from "@/types/types";

export type ActionState = {
  status: "idle" | "ok" | "error";
  message?: string;
};

/**
 * Every action starts here. Middleware and layouts also gate `/admin`, but a
 * server action is a public POST endpoint — it must authorize itself and never
 * rely on the page that rendered the form.
 */
async function assertAdmin() {
  const session = await requireAdminSession();
  if (!session) throw new Error("Unauthorized");
}

/** Blank lines are separators, not content — used for textarea-driven lists. */
function toLines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function toCsv(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Parses the repeated indexed inputs the array editors submit. */
function collectRows(
  formData: FormData,
  prefix: string,
  fields: string[]
): Record<string, string>[] {
  const rows: Record<string, string>[] = [];

  for (let i = 0; formData.has(`${prefix}.${i}.${fields[0]}`); i++) {
    const row: Record<string, string> = {};
    for (const field of fields) {
      row[field] = String(formData.get(`${prefix}.${i}.${field}`) ?? "").trim();
    }
    rows.push(row);
  }

  // A row whose first field was cleared is treated as deleted.
  return rows.filter((row) => row[fields[0]]);
}

function revalidatePublic() {
  revalidateTag(TAGS.sections);
  revalidateTag(TAGS.projects);
  revalidatePath("/", "layout");
}

/* ------------------------------------------------------------- sections -- */

export async function saveSectionAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await assertAdmin();

    const id = String(formData.get("id") ?? "").trim();
    const type = String(formData.get("type") ?? "").trim();

    if (!id) return { status: "error", message: "Section id is required." };

    const input: Record<string, unknown> = {
      id,
      type: type || id,
      title: String(formData.get("title") ?? "").trim(),
      subtitle: String(formData.get("subtitle") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      content: toLines(formData.get("content")),
      published: formData.get("published") === "on",
      order: Number(formData.get("order") ?? 0) || 0,
    };

    if (!input.title) {
      return { status: "error", message: "Title is required." };
    }

    // Only send the array the section type actually uses, so editing the About
    // copy cannot wipe the Skills entries stored on another section.
    if (type === "skills") {
      const cats = collectRows(formData, "skills", ["category", "tags"]);
      const skills: SkillCategory[] = cats.map((row) => ({
        category: row.category,
        tags: row.tags
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [name, url] = line.split("|").map((s) => s.trim());
            return { name, url: url || "#" };
          })
          .filter((tag) => tag.name),
      }));
      input.skills = skills;
    }

    if (type === "experience") {
      const rows = collectRows(formData, "experience", [
        "title",
        "company",
        "duration",
        "description",
      ]);
      const experience: JobEntry[] = rows.map((row) => ({
        title: row.title,
        company: row.company,
        duration: row.duration,
        description: row.description
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      }));
      input.experience = experience;
    }

    if (type === "education") {
      const rows = collectRows(formData, "education", [
        "degree",
        "institution",
        "duration",
        "description",
      ]);
      const education: EducationEntry[] = rows.map((row) => ({
        degree: row.degree,
        institution: row.institution,
        duration: row.duration,
        description: row.description
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      }));
      input.education = education;
    }

    const linkRows = collectRows(formData, "links", ["label", "url", "icon"]);
    if (linkRows.length || formData.has("links.0.label")) {
      const links: LinkEntry[] = linkRows
        .filter((row) => row.url)
        .map((row) => ({
          label: row.label,
          url: row.url,
          icon: row.icon || null,
        }));
      input.links = links;
    }

    await gqlAdmin(UPSERT_SECTION, { input });
    revalidatePublic();
    revalidatePath("/admin/sections");

    return { status: "ok", message: `Saved “${input.title}”.` };
  } catch (err) {
    console.error("[admin] saveSection failed:", err);
    return { status: "error", message: describe(err) };
  }
}

/* ------------------------------------------------------------- projects -- */

export async function saveProjectAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await assertAdmin();

    const slug = String(formData.get("slug") ?? "")
      .trim()
      .toLowerCase();

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return {
        status: "error",
        message:
          "Slug must be lowercase words separated by single hyphens, e.g. my-project.",
      };
    }

    const title = String(formData.get("title") ?? "").trim();
    if (!title) return { status: "error", message: "Title is required." };

    const input = {
      slug,
      title,
      tagline: String(formData.get("tagline") ?? "").trim() || null,
      description: toLines(formData.get("description")),
      image: String(formData.get("image") ?? "").trim() || null,
      images: toLines(formData.get("images")),
      tags: toCsv(formData.get("tags")),
      liveUrl: String(formData.get("liveUrl") ?? "").trim() || null,
      githubUrl: String(formData.get("githubUrl") ?? "").trim() || null,
      year: String(formData.get("year") ?? "").trim() || null,
      role: String(formData.get("role") ?? "").trim() || null,
      status: formData.get("status") === "published" ? "published" : "draft",
      featured: formData.get("featured") === "on",
      order: Number(formData.get("order") ?? 0) || 0,
    };

    await gqlAdmin(UPSERT_PROJECT, { input });
    revalidatePublic();
    revalidatePath("/admin/projects");
    revalidatePath(`/work/${slug}`);

    return { status: "ok", message: `Saved “${title}”.` };
  } catch (err) {
    console.error("[admin] saveProject failed:", err);
    return { status: "error", message: describe(err) };
  }
}

export async function deleteProjectAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await assertAdmin();

    const slug = String(formData.get("slug") ?? "").trim();
    if (!slug) return { status: "error", message: "Missing project slug." };

    await gqlAdmin(DELETE_PROJECT, { slug });
    revalidatePublic();
    revalidatePath("/admin/projects");

    return { status: "ok", message: `Deleted ${slug}.` };
  } catch (err) {
    console.error("[admin] deleteProject failed:", err);
    return { status: "error", message: describe(err) };
  }
}

export async function reorderProjectsAction(
  orders: { slug: string; order: number }[]
): Promise<ActionState> {
  try {
    await assertAdmin();

    await gqlAdmin(REORDER_PROJECTS, { orders });
    revalidatePublic();
    revalidatePath("/admin/projects");

    return { status: "ok", message: "Order saved." };
  } catch (err) {
    console.error("[admin] reorderProjects failed:", err);
    return { status: "error", message: describe(err) };
  }
}

/* ---------------------------------------------------------------- inbox -- */

export async function markContactReadAction(
  id: string,
  read: boolean
): Promise<ActionState> {
  try {
    await assertAdmin();

    await gqlAdmin(MARK_CONTACT_READ, { id, read });
    revalidatePath("/admin/inbox");
    revalidatePath("/admin");

    return { status: "ok" };
  } catch (err) {
    console.error("[admin] markContactRead failed:", err);
    return { status: "error", message: describe(err) };
  }
}

export async function deleteContactAction(id: string): Promise<ActionState> {
  try {
    await assertAdmin();

    await gqlAdmin(DELETE_CONTACT, { id });
    revalidatePath("/admin/inbox");
    revalidatePath("/admin");

    return { status: "ok", message: "Message deleted." };
  } catch (err) {
    console.error("[admin] deleteContact failed:", err);
    return { status: "error", message: describe(err) };
  }
}

/* --------------------------------------------------------------- upload -- */

/**
 * Returns a short-lived Cloudinary signature. The browser uploads directly to
 * Cloudinary with it, so image bytes never pass through this server.
 */
export async function getUploadSignature(): Promise<
  UploadSignature | { error: string }
> {
  try {
    await assertAdmin();

    const data = await gqlAdmin<{ signUpload: UploadSignature }>(SIGN_UPLOAD, {
      folder: "projects",
    });
    return data.signUpload;
  } catch (err) {
    console.error("[admin] signUpload failed:", err);
    return { error: describe(err) };
  }
}

function describe(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("Unauthorized")) {
    return "Your session is not authorized. Try signing in again.";
  }
  if (message.includes("Cloudinary is not configured")) {
    return "Cloudinary env vars are missing on the API — uploads are disabled.";
  }
  return message;
}
