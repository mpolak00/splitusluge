import type { Express, Request } from "express";
import { buildRobotsTxt, buildSitemapXml, getFallbackCategorySlugs, getSeoForPath, serializeStructuredData } from "../../shared/seo.js";
import { getBusinessPath } from "../../shared/paths.js";
import { getAllCategories, getBusinessesForSitemap } from "../db.js";

const DEFAULT_SITE_URL = "https://splitmajstori.com";

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function resolveSiteUrl(req?: Request): string {
  const configured = process.env.SITE_URL || process.env.VITE_SITE_URL;
  if (configured) {
    return stripTrailingSlash(configured);
  }

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercelUrl) {
    const host = vercelUrl.replace(/^https?:\/\//, "");
    return `https://${stripTrailingSlash(host)}`;
  }

  if (req) {
    return `${req.protocol}://${req.get("host")}`;
  }

  return DEFAULT_SITE_URL;
}

export function injectSeoIntoHtml(template: string, pathname: string, siteUrl?: string): string {
  const seo = getSeoForPath(pathname, siteUrl);
  const replacements: Record<string, string> = {
    "%SEO_TITLE%": escapeHtml(seo.title),
    "%SEO_DESCRIPTION%": escapeHtml(seo.description),
    "%SEO_KEYWORDS%": escapeHtml(seo.keywords),
    "%SEO_URL%": escapeHtml(seo.canonicalUrl),
    "%SEO_OG_TITLE%": escapeHtml(seo.ogTitle),
    "%SEO_OG_DESCRIPTION%": escapeHtml(seo.ogDescription),
    "%SEO_OG_IMAGE%": escapeHtml(seo.ogImage),
    "%SEO_OG_TYPE%": escapeHtml(seo.ogType),
    "%SEO_TWITTER_TITLE%": escapeHtml(seo.twitterTitle),
    "%SEO_TWITTER_DESCRIPTION%": escapeHtml(seo.twitterDescription),
    "%SEO_ROBOTS%": escapeHtml(seo.robots),
    "%SEO_LOCALE%": escapeHtml(seo.locale),
    "%SEO_SITE_NAME%": escapeHtml(seo.siteName),
    "%SEO_SCHEMA%": serializeStructuredData(seo.structuredData),
  };

  return Object.entries(replacements).reduce(
    (html, [token, value]) => html.replaceAll(token, value),
    template
  );
}

export function registerSeoRoutes(app: Express) {
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain").send(buildRobotsTxt(resolveSiteUrl(req)));
  });

  app.get("/sitemap.xml", async (req, res) => {
    const [categories, businesses] = await Promise.all([
      getAllCategories().catch(() => []),
      getBusinessesForSitemap().catch(() => []),
    ]);

    const categorySlugs = [
      ...getFallbackCategorySlugs(),
      ...categories.map(category => category.slug).filter(Boolean),
    ];

    const dynamicEntries = businesses.map(business => ({
      path: getBusinessPath(business),
      changefreq: "weekly",
      priority: "0.7",
      lastmod:
        business.updatedAt instanceof Date
          ? business.updatedAt.toISOString().slice(0, 10)
          : undefined,
    }));

    res
      .type("application/xml")
      .send(buildSitemapXml(categorySlugs, dynamicEntries, resolveSiteUrl(req)));
  });
}
