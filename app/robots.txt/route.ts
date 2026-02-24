export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const content = `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml`;
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
