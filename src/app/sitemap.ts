import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { SITE_URL, siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((project) => ({
      url: siteUrl(`work/${project.slug}`),
      lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
