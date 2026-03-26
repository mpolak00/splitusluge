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
  "ciscenje-apartmana": [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop&q=80",
  ],
  "pranje-brodova": [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=400&h=300&fit=crop&q=80",
  ],
  "taxi-i-transfer": [
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0aca?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511527844068-006b95d162c4?w=400&h=300&fit=crop&q=80",
  ],
  "iznajmljivanje-plovila": [
    "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1530870110042-98b2cb110834?w=400&h=300&fit=crop&q=80",
  ],
  "klima-servis-apartmani": [
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1631545806609-30b27c200554?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1635048424329-a9bfb146d7aa?w=400&h=300&fit=crop&q=80",
  ],
  "pest-control": [
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1527515637462-cee1cc710140?w=400&h=300&fit=crop&q=80",
  ],
  "bazeni-i-odrzavanje": [
    "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1572331165267-854da2b021b1?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519449556851-5720b33024e7?w=400&h=300&fit=crop&q=80",
  ],
  fotografija: [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=400&h=300&fit=crop&q=80",
  ],
  catering: [
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&q=80",
  ],
  "turisticki-vodici": [
    "https://images.unsplash.com/photo-1555990538-1e1a583c3b45?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1580910365203-91ea9115a319?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=300&fit=crop&q=80",
  ],
  "pranje-tepiha": [
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop&q=80",
  ],
  kljucar: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1621600411688-4be93cd68504?w=400&h=300&fit=crop&q=80",
  ],
  "odvoz-otpada": [
    "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&h=300&fit=crop&q=80",
  ],
  "sigurnosni-sustavi": [
    "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop&q=80",
  ],
  "web-dizajn": [
    "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop&q=80",
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
