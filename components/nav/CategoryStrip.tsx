import Link from "next/link";
import { listCategories } from "@/lib/db/categories";
import { cn } from "@/lib/utils";

interface CategoryStripProps {
  activeSlug?: string;
}

export async function CategoryStrip({ activeSlug }: CategoryStripProps) {
  const categories = await listCategories();

  return (
    <nav
      aria-label="Categories"
      className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6"
    >
      <Link
        href="/posts"
        className={cn(
          "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
          !activeSlug
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
        )}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/categories/${cat.slug}`}
          className={cn(
            "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
            activeSlug === cat.slug
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
          )}
        >
          {cat.name}
        </Link>
      ))}
    </nav>
  );
}
