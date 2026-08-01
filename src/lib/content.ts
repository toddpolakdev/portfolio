import "server-only";
import { gql, TAGS } from "./gql";
import { GET_PROJECTS, GET_SECTIONS } from "./queries";
import type { Project, Section } from "@/types/types";

/**
 * The portfolio should never 500 because the API is briefly unreachable. Reads
 * log and fall back to empty, and the page renders whatever it does have.
 */
async function safe<T>(fn: () => Promise<T>, fallback: T, label: string) {
  try {
    return await fn();
  } catch (err) {
    console.error(`[content] failed to load ${label}:`, err);
    return fallback;
  }
}

export async function getSections(): Promise<Section[]> {
  const data = await safe(
    () =>
      gql<{ sections: Section[] }>(GET_SECTIONS, {
        tags: [TAGS.sections],
      }),
    { sections: [] },
    "sections"
  );
  return data.sections;
}

export async function getProjects(): Promise<Project[]> {
  const data = await safe(
    () =>
      gql<{ projects: Project[] }>(GET_PROJECTS, {
        tags: [TAGS.projects],
      }),
    { projects: [] },
    "projects"
  );
  return data.projects;
}

/** Index sections by their string id so callers can pull them by name. */
export function bySectionId(sections: Section[]): Record<string, Section> {
  return Object.fromEntries(sections.map((s) => [s.id, s]));
}
