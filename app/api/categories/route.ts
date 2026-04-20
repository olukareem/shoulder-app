import { NextResponse } from "next/server";
import { listCategories } from "@/lib/db/categories";

export async function GET() {
  const categories = await listCategories();
  return NextResponse.json(categories);
}
