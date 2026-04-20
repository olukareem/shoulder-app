import { NextResponse, type NextRequest } from "next/server";
import { incrementViewCount } from "@/lib/db/posts";

export async function POST(request: NextRequest) {
  try {
    const { slug } = (await request.json()) as { slug?: string };
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }
    await incrementViewCount(slug);
    return NextResponse.json({ ok: true });
  } catch {
    // Non-critical — never surface errors to the client
    return NextResponse.json({ ok: true });
  }
}
