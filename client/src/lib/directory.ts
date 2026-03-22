export type DirectoryBusiness = {
  id: number | string;
  name: string;
  categoryId?: number | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  rating?: string | number | null;
  reviewCount?: number | null;
  neighborhood?: string | null;
  city?: string | null;
  tags?: string | null;
  openingHours?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  imageUrl?: string | null;
  description?: string | null;
};

export function getRatingValue(business: Pick<DirectoryBusiness, "rating">): number {
  if (business.rating === null || business.rating === undefined || business.rating === "") {
    return 0;
  }

  return typeof business.rating === "number" ? business.rating : parseFloat(business.rating);
}

export function calculateWeightedScore(business: Pick<DirectoryBusiness, "reviewCount" | "rating">): number {
  const reviewCount = business.reviewCount || 0;
  const rating = getRatingValue(business);
  const normalizedReviews = Math.min(reviewCount / 500, 1);
  const normalizedRating = rating / 5;

  return normalizedReviews * 0.7 + normalizedRating * 0.3;
}

export function sortBusinessesByWeighted<T extends Pick<DirectoryBusiness, "reviewCount" | "rating">>(
  businesses: T[]
): T[] {
  return [...businesses].sort((a, b) => calculateWeightedScore(b) - calculateWeightedScore(a));
}

export function parseBusinessTags(tagsJson: string | null | undefined): string[] {
  if (!tagsJson) {
    return [];
  }

  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed.filter((tag): tag is string => typeof tag === "string") : [];
  } catch {
    return [];
  }
}

export function getAverageRating(businesses: Array<Pick<DirectoryBusiness, "rating">>): number {
  const ratings = businesses.map(getRatingValue).filter(rating => rating > 0);
  if (ratings.length === 0) {
    return 0;
  }

  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
}

export function getTopLocations(
  businesses: Array<Pick<DirectoryBusiness, "neighborhood" | "city">>,
  limit = 4
): string[] {
  const counts = new Map<string, number>();

  businesses.forEach(business => {
    const label = business.neighborhood || business.city;
    if (!label) {
      return;
    }

    counts.set(label, (counts.get(label) || 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label]) => label);
}

export function getContactCoverage(businesses: Array<Pick<DirectoryBusiness, "phone" | "website">>) {
  return {
    withPhone: businesses.filter(business => Boolean(business.phone)).length,
    withWebsite: businesses.filter(business => Boolean(business.website)).length,
  };
}
