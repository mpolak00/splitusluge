import { useEffect } from "react";
import { useLocation } from "wouter";
import { getSeoForPath, serializeStructuredData } from "@shared/seo";
import { useSeoContext } from "@/contexts/SeoContext";

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

function upsertStructuredData(payload: string) {
  let element = document.head.querySelector<HTMLScriptElement>("#seo-structured-data");

  if (!element) {
    element = document.createElement("script");
    element.id = "seo-structured-data";
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }

  element.textContent = payload;
}

export default function SeoHead() {
  const [location] = useLocation();
  const { override } = useSeoContext();

  useEffect(() => {
    const seo = override || getSeoForPath(location, window.location.origin);

    document.title = seo.title;
    document.documentElement.lang = "hr";

    upsertMeta("name", "description", seo.description);
    upsertMeta("name", "keywords", seo.keywords);
    upsertMeta("name", "robots", seo.robots);
    upsertMeta("property", "og:type", seo.ogType);
    upsertMeta("property", "og:url", seo.canonicalUrl);
    upsertMeta("property", "og:title", seo.ogTitle);
    upsertMeta("property", "og:description", seo.ogDescription);
    upsertMeta("property", "og:image", seo.ogImage);
    upsertMeta("property", "og:site_name", seo.siteName);
    upsertMeta("property", "og:locale", seo.locale);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:url", seo.canonicalUrl);
    upsertMeta("name", "twitter:title", seo.twitterTitle);
    upsertMeta("name", "twitter:description", seo.twitterDescription);
    upsertMeta("name", "twitter:image", seo.ogImage);
    upsertCanonical(seo.canonicalUrl);
    upsertStructuredData(serializeStructuredData(seo.structuredData));
  }, [location, override]);

  return null;
}
