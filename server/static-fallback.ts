/**
 * Static data fallback when DATABASE_URL is not configured.
 * Imports pre-generated JSON files from server/static-data/.
 */
import categoriesData from "./static-data/categories.json" with { type: "json" };
import businessesData from "./static-data/businesses.json" with { type: "json" };

const allBusinesses: any[] = businessesData;
const allCategories: any[] = categoriesData;

export function getStaticCategories() {
  return allCategories;
}

export function getStaticCategoryBySlug(slug: string) {
  return allCategories.find((c: any) => c.slug === slug) || undefined;
}

export function getStaticBusinesses(options?: {
  categoryId?: number;
  limit?: number;
  offset?: number;
}) {
  let result = allBusinesses;

  if (options?.categoryId) {
    result = result.filter((b: any) => b.categoryId === options.categoryId);
  }

  const offset = options?.offset ?? 0;
  const limit = options?.limit ?? result.length;

  return result.slice(offset, offset + limit);
}

export function getStaticBusinessById(id: number) {
  return allBusinesses.find((b: any) => b.id === id) || undefined;
}

export function searchStaticBusinesses(query: string, limit = 20) {
  const normalized = query.toLowerCase();

  return allBusinesses
    .filter(
      (b: any) =>
        b.name?.toLowerCase().includes(normalized) ||
        b.description?.toLowerCase().includes(normalized) ||
        b.address?.toLowerCase().includes(normalized) ||
        b.neighborhood?.toLowerCase().includes(normalized)
    )
    .slice(0, limit);
}
