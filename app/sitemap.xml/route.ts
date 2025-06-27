import { prisma } from "@/lib/prisma";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [projects, articles] = await Promise.all([
    prisma.project.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.article.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticPaths = [
    "",
    "/projects",
    "/services",
    "/articles",
    "/parcours",
    "/contact",
  ];

  const urls = [
    ...staticPaths.map(
      (path) => `<url><loc>${baseUrl}${path}</loc></url>`
    ),
    ...projects.map(
      (p) =>
        `<url><loc>${baseUrl}/projects/${p.slug}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod></url>`
    ),
    ...articles.map(
      (a) =>
        `<url><loc>${baseUrl}/articles/${a.slug}</loc><lastmod>${a.updatedAt.toISOString()}</lastmod></url>`
    ),
  ].join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
