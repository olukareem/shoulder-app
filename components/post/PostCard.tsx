import Link from "next/link";
import { Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Author {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface PostCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  view_count: number;
  published_at: string | null;
  created_at: string;
  profiles: Author;
  post_categories?: { categories: Category | null }[];
}

export function PostCard({
  title,
  slug,
  excerpt,
  view_count,
  published_at,
  created_at,
  profiles,
  post_categories,
}: PostCardProps) {
  const categories = (post_categories ?? [])
    .map((pc) => pc.categories)
    .filter(Boolean) as Category[];

  const displayDate = published_at ?? created_at;

  return (
    <article className="group border-b border-border py-6 last:border-0">
      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/categories/${cat.slug}`}>
              <Badge variant="muted" className="hover:bg-primary/15 hover:text-foreground">
                {cat.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Title */}
      <h2 className="mb-1.5 text-xl font-semibold leading-snug text-foreground">
        <Link
          href={`/posts/${slug}`}
          className="hover:text-primary transition-colors"
        >
          {title}
        </Link>
      </h2>

      {/* Excerpt */}
      {excerpt && (
        <p className="mb-3 line-clamp-2 text-muted-foreground">{excerpt}</p>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Link
          href={`/u/${profiles.username}`}
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          {profiles.full_name ?? profiles.username}
        </Link>
        <span>{formatDate(displayDate)}</span>
        <span className="ml-auto flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" aria-hidden />
          {view_count.toLocaleString()}
        </span>
      </div>
    </article>
  );
}
