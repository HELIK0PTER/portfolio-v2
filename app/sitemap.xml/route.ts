import { getAllProjectSlugs } from "@/lib/data";
import { routing } from "@/i18n/routing";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const slugs = getAllProjectSlugs();
  const staticPaths = ["", "/projects", "/services", "/parcours", "/contact"];

  const localePrefix = (locale: string) =>
    locale === routing.defaultLocale ? "" : `/${locale}`;

  const urls = routing.locales.flatMap((locale) => {
    const prefix = localePrefix(locale);
    return [
      ...staticPaths.map(
        (path) => `<url><loc>${baseUrl}${prefix}${path}</loc></url>`,
      ),
      ...slugs.map(
        (slug) =>
          `<url><loc>${baseUrl}${prefix}/projects/${slug}</loc></url>`,
      ),
    ];
  }).join("");

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
