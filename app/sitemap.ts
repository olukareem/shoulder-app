import type { MetadataRoute } from "next";
import { listPublishedSlugs } from "@/lib/db/posts";
import { listUsernames } from "@/lib/db/profiles";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, usernames] = await Promise.all([
    listPublishedSlugs(),
    listUsernames(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/posts`,
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/posts/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const profileRoutes: MetadataRoute.Sitemap = usernames.map((username) => ({
    url: `${BASE_URL}/u/${username}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes, ...profileRoutes];
}
