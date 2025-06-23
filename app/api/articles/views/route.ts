import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const articles = await prisma.article.findMany({
    select: {
      slug: true,
      views: true,
    },
  });

if (!articles) {
    return NextResponse.json({ error: "Articles not found" }, { status: 404 });
  }

  return NextResponse.json({ views: articles.reduce((acc, article) => acc + article.views, 0) });
}