// Runs before vite dev/build via predev/prebuild hooks; writes public/sitemap.xml
import { writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://webiro.nl";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/pakketten", changefreq: "weekly", priority: "0.9" },
  { path: "/marketing", changefreq: "weekly", priority: "0.9" },
  { path: "/proces", changefreq: "monthly", priority: "0.8" },
  { path: "/oplossingen", changefreq: "monthly", priority: "0.8" },
  { path: "/over-ons", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/intake", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/shop", changefreq: "weekly", priority: "0.8" },
  { path: "/documentatie", changefreq: "monthly", priority: "0.5" },
  { path: "/moodboard", changefreq: "monthly", priority: "0.6" },
  { path: "/partner", changefreq: "monthly", priority: "0.6" },
  { path: "/algemene-voorwaarden", changefreq: "yearly", priority: "0.3" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/disclaimer", changefreq: "yearly", priority: "0.3" },
  { path: "/cookiebeleid", changefreq: "yearly", priority: "0.3" },
];

async function fetchDynamic(): Promise<SitemapEntry[]> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];
  const supabase = createClient(url, key);
  const entries: SitemapEntry[] = [];

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at, published_at")
    .eq("published", true);
  if (posts) {
    for (const p of posts) {
      entries.push({
        path: `/blog/${p.slug}`,
        lastmod: (p.updated_at || p.published_at || "").slice(0, 10) || undefined,
        changefreq: "monthly",
        priority: "0.6",
      });
    }
  }
  return entries;
}

function build(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ].filter(Boolean).join("\n")
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

(async () => {
  let dynamic: SitemapEntry[] = [];
  try { dynamic = await fetchDynamic(); } catch (e) { console.warn("sitemap: dynamic fetch failed", e); }
  const all = [...staticEntries, ...dynamic];
  writeFileSync(resolve("public/sitemap.xml"), build(all));
  console.log(`sitemap.xml written (${all.length} entries)`);
})();
