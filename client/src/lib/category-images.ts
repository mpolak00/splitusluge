/**
 * Category-specific placeholder images from Unsplash (free, no API key needed).
 * Used when a business doesn't have its own imageUrl.
 * Images are sized 400x300 for optimal card display.
 */

const CATEGORY_IMAGES: Record<string, string[]> = {
  vulkanizeri: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=400&h=300&fit=crop&q=80",
  ],
  automehanicari: [
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=400&h=300&fit=crop&q=80",
  ],
  vodoinstalateri: [
    "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop&q=80",
  ],
  elektricari: [
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=400&h=300&fit=crop&q=80",
  ],
  "servisi-za-ciscenje": [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop&q=80",
  ],
  stolari: [
    "https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=400&h=300&fit=crop&q=80",
  ],
  "frizerski-saloni": [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1521590832167-7228fcb10d6e?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop&q=80",
  ],
  stomatolozi: [
    "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop&q=80",
  ],
  "prijevoz-i-selidbe": [
    "https://images.unsplash.com/photo-1586864387789-628af9feed72?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400&h=300&fit=crop&q=80",
  ],
  vrtlari: [
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop&q=80",
  ],
};

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&q=80",
  "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400&h=300&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop&q=80",
];

/**
 * Get a deterministic placeholder image for a business based on its category and id.
 * Returns the business's own image if available, otherwise a category-relevant placeholder.
 */
export function getBusinessImage(
  businessId: number | string,
  categorySlug: string,
  ownImageUrl?: string | null
): string {
  if (ownImageUrl) return ownImageUrl;

  const images = CATEGORY_IMAGES[categorySlug] || DEFAULT_IMAGES;
  const index = (typeof businessId === "number" ? businessId : parseInt(String(businessId), 10) || 0) % images.length;
  return images[index];
}
