interface BlogPostingProps {
  title: string;
  slug: string;
  excerpt: string | null;
  authorName: string;
  authorUsername: string;
  publishedAt: string | null;
  updatedAt: string;
  siteUrl: string;
}

export function BlogPostingJsonLd({
  title,
  slug,
  excerpt,
  authorName,
  authorUsername,
  publishedAt,
  updatedAt,
  siteUrl,
}: BlogPostingProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt ?? undefined,
    url: `${siteUrl}/posts/${slug}`,
    datePublished: publishedAt ?? undefined,
    dateModified: updatedAt,
    author: {
      "@type": "Person",
      name: authorName,
      url: `${siteUrl}/u/${authorUsername}`,
    },
    publisher: {
      "@type": "Organization",
      name: "shoulder",
      url: siteUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
