import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/dashboard/",
        "/posts/new",
        // Block all edit routes regardless of slug
        "/posts/*/edit",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
