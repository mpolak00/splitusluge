import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { businesses, categories } from "../../drizzle/schema";

const categoryKeywords: Record<string, string[]> = {
  vulkanizeri: ["vulkanizer split", "gume split"],
  automehanicari: ["autoservis split", "mehaničar split"],
  vodoinstalateri: ["vodoinstalater split", "voda split"],
  elektricari: ["električar split", "elektrika split"],
};

const searchAreas = [
  { name: "Split", lat: 43.5081, lng: 16.4402, radius: 15000 },
  { name: "Solin", lat: 43.5167, lng: 16.5, radius: 8000 },
];

const DATABASE_URL = process.env.DATABASE_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL || "https://api.manus.im";

async function searchPlaces(query: string, lat: number, lng: number, radius: number) {
  try {
    const url = new URL(`${FORGE_API_URL}/v1/maps/proxy/maps/api/place/textsearch/json`);
    url.searchParams.append("query", query);
    url.searchParams.append("location", `${lat},${lng}`);
    url.searchParams.append("radius", radius.toString());
    url.searchParams.append("key", FORGE_API_KEY || "");

    const response = await fetch(url.toString());
    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.error("Error searching places:", error);
    return [];
  }
}

async function getPlaceDetails(placeId: string) {
  try {
    const url = new URL(`${FORGE_API_URL}/v1/maps/proxy/maps/api/place/details/json`);
    url.searchParams.append("place_id", placeId);
    url.searchParams.append("fields", "formatted_phone_number,website,opening_hours,photos,rating,user_ratings_total,name,formatted_address");
    url.searchParams.append("key", FORGE_API_KEY || "");

    const response = await fetch(url.toString());
    const data = await response.json();

    return data.result || null;
  } catch (error) {
    console.error("Error getting place details:", error);
    return null;
  }
}

export async function refreshBusinessData() {
  if (!DATABASE_URL || !FORGE_API_KEY) {
    console.error("Missing DATABASE_URL or BUILT_IN_FORGE_API_KEY");
    return;
  }

  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(connection);

    console.log(`[${new Date().toISOString()}] Starting business data refresh...`);

    const allCategories = await db.select().from(categories);
    const categoryMap = new Map(allCategories.map(c => [c.slug, c.id]));

    const existingBusinesses = await db.select().from(businesses);
    const existingPlaceIds = new Set(existingBusinesses.map(b => b.googlePlaceId));

    let totalAdded = 0;
    let totalSkipped = 0;

    // Sample a few categories and areas for each refresh to avoid rate limiting
    const categoriesToUpdate = Object.entries(categoryKeywords).slice(0, 3);
    const areasToUpdate = searchAreas.slice(0, 2);

    for (const [categorySlug, keywords] of categoriesToUpdate) {
      const categoryId = categoryMap.get(categorySlug);
      if (!categoryId) continue;

      for (const area of areasToUpdate) {
        const keywordList = keywords as string[];
        for (const keyword of keywordList.slice(0, 2)) {
          try {
            const places = await searchPlaces(keyword, area.lat, area.lng, area.radius);

            for (const place of places) {
              if (existingPlaceIds.has(place.place_id)) {
                totalSkipped++;
                continue;
              }

              const details = await getPlaceDetails(place.place_id);
              if (!details) continue;

              let imageUrl: string | null = null;
              if (place.photos && place.photos.length > 0) {
                const photoRef = place.photos[0].photo_reference;
                imageUrl = `${FORGE_API_URL}/v1/maps/proxy/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${FORGE_API_KEY || ""}`;
                if (imageUrl.length > 1500) {
                  imageUrl = imageUrl.substring(0, 1500);
                }
              }

              await db.insert(businesses).values({
                googlePlaceId: place.place_id,
                categoryId: categoryId,
                name: details.name || place.name,
                description: place.formatted_address || "",
                address: details.formatted_address || place.formatted_address,
                phone: details.formatted_phone_number || null,
                website: details.website ? details.website.substring(0, 1000) : null,
                latitude: place.geometry?.location?.lat?.toString() || "0",
                longitude: place.geometry?.location?.lng?.toString() || "0",
                imageUrl: imageUrl,
                rating: details.rating ? details.rating.toString() : null,
                reviewCount: details.user_ratings_total || 0,
                openingHours: details.opening_hours?.weekday_text?.join(" | ") || null,
                city: area.name,
                neighborhood: place.formatted_address?.split(",")[0] || null,
                isActive: 1,
              });

              existingPlaceIds.add(place.place_id);
              totalAdded++;

              await new Promise(resolve => setTimeout(resolve, 100));
            }
          } catch (error) {
            console.error("Error:", error);
          }

          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    }

    console.log(`[${new Date().toISOString()}] Refresh completed: +${totalAdded} new, skipped ${totalSkipped}`);
    await connection.end();
  } catch (error) {
    console.error("Fatal error in refresh:", error);
  }
}

// Run refresh every 10 hours
if (process.env.NODE_ENV === "production") {
  setInterval(() => {
    refreshBusinessData();
  }, 10 * 60 * 60 * 1000);
}
