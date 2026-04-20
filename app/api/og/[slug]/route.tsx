import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/db/posts";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  let title = "shoulder";
  let author = "";
  let excerpt = "";

  try {
    const post = await getPostBySlug(slug);
    if (post) {
      title = post.title;
      const profiles = post.profiles as { username?: string } | null;
      author = profiles?.username ?? "";
      excerpt = post.excerpt ?? "";
    }
  } catch {
    // Fall through to default card
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top brand accent bar */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 10,
            backgroundColor: "#85C0BE",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "60px 80px",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 700,
              color: "#85C0BE",
              letterSpacing: "-0.5px",
            }}
          >
            shoulder
          </div>

          {/* Title + excerpt */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                fontSize: title.length > 60 ? 44 : 56,
                fontWeight: 800,
                color: "#282c34",
                lineHeight: 1.15,
                letterSpacing: "-1px",
                maxWidth: 900,
              }}
            >
              {title}
            </div>

            {excerpt.length > 0 && (
              <div
                style={{
                  fontSize: 24,
                  color: "#6b7280",
                  lineHeight: 1.5,
                  maxWidth: 820,
                  overflow: "hidden",
                  // Truncate long excerpts
                  display: "-webkit-box",
                }}
              >
                {excerpt.slice(0, 140)}
                {excerpt.length > 140 ? "…" : ""}
              </div>
            )}
          </div>

          {/* Author + domain row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {author ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {/* Avatar placeholder */}
                <div
                  style={{
                    display: "flex",
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    backgroundColor: "#85C0BE",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  {author[0]?.toUpperCase() ?? "?"}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    color: "#282c34",
                    fontWeight: 600,
                  }}
                >
                  @{author}
                </div>
              </div>
            ) : (
              <div />
            )}

            <div
              style={{
                fontSize: 20,
                color: "#9ca3af",
                fontWeight: 500,
              }}
            >
              shoulder · where voices connect
            </div>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 6,
            backgroundColor: "#85C0BE",
            opacity: 0.4,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
