import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { businesses, categories } from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";
import { categoryKeywords, searchAreas } from "./comprehensive-keywords.mjs";

const DATABASE_URL = process.env.DATABASE_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL || "https://api.manus.im";

if (!DATABASE_URL || !FORGE_API_KEY) {
  console.error("Missing DATABASE_URL or BUILT_IN_FORGE_API_KEY");
  process.exit(1);
}

async function searchPlaces(query, lat, lng, radius) {
  try {
    const url = new URL(`${FORGE_API_URL}/v1/maps/proxy/maps/api/place/textsearch/json`);
    url.searchParams.append("query", query);
    url.searchParams.append("location", `${lat},${lng}`);
    url.searchParams.append("radius", radius.toString());
    url.searchParams.append("key", FORGE_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.error("Error searching places:", error.message);
    return [];
  }
}

async function getPlaceDetails(placeId) {
  try {
    const url = new URL(`${FORGE_API_URL}/v1/maps/proxy/maps/api/place/details/json`);
    url.searchParams.append("place_id", placeId);
    url.searchParams.append("fields", "formatted_phone_number,website,opening_hours,photos,rating,user_ratings_total,name,formatted_address");
    url.searchParams.append("key", FORGE_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    return data.result || null;
  } catch (error) {
    console.error("Error getting place details:", error.message);
    return null;
  }
}

async function importComprehensiveBusinesses() {
  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(connection);

    console.log("🚀 Starting comprehensive business import from Google Maps...\n");

    const allCategories = await db.select().from(categories);
    const categoryMap = new Map(allCategories.map(c => [c.slug, c.id]));

    let totalAdded = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    // Get existing businesses to avoid duplicates
    const existingBusinesses = await db.select().from(businesses);
    const existingPlaceIds = new Set(existingBusinesses.map(b => b.googlePlaceId));

    for (const [categorySlug, keywords] of Object.entries(categoryKeywords)) {
      const categoryId = categoryMap.get(categorySlug);
      if (!categoryId) {
        console.warn(`⚠ Category not found: ${categorySlug}`);
        continue;
      }

      console.log(`\n📍 Processing category: ${categorySlug.toUpperCase()}`);
      let categoryAdded = 0;

      for (const area of searchAreas) {
        for (const keyword of keywords) {
          const searchQuery = `${keyword} ${area.name}`;
          console.log(`  🔍 Searching: "${searchQuery}"`);

          try {
            const places = await searchPlaces(keyword, area.lat, area.lng, area.radius);

            for (const place of places) {
              // Skip if already exists
              if (existingPlaceIds.has(place.place_id)) {
                totalSkipped++;
                continue;
              }

              try {
                // Get detailed information
                const details = await getPlaceDetails(place.place_id);
                if (!details) continue;

                // Extract photo URL if available
                let imageUrl = null;
                if (place.photos && place.photos.length > 0) {
                  const photoRef = place.photos[0].photo_reference;
                  imageUrl = `${FORGE_API_URL}/v1/maps/proxy/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${FORGE_API_KEY}`;
                  // Truncate if too long
                  if (imageUrl.length > 1500) {
                    imageUrl = imageUrl.substring(0, 1500);
                  }
                }

                const businessData = {
                  googlePlaceId: place.place_id,
                  categoryId: categoryId,
                  name: details.name || place.name,
                  description: place.formatted_address || "",
                  address: details.formatted_address || place.formatted_address,
                  phone: details.formatted_phone_number || null,
                  website: details.website ? details.website.substring(0, 1000) : null,
                  latitude: place.geometry.location.lat.toString(),
                  longitude: place.geometry.location.lng.toString(),
                  imageUrl: imageUrl,
                  rating: details.rating?.toString() || null,
                  reviewCount: details.user_ratings_total || 0,
                  openingHours: details.opening_hours?.weekday_text?.join(" | ") || null,
                  city: area.name,
                  neighborhood: place.formatted_address?.split(",")[0] || null,
                  isActive: 1,
                };

                await db.insert(businesses).values(businessData);
                existingPlaceIds.add(place.place_id);
                totalAdded++;
                categoryAdded++;
                console.log(`    ✓ Added: ${place.name}`);

                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
              } catch (error) {
                totalErrors++;
                console.error(`    ✗ Error: ${place.name} - ${error.message}`);
              }
            }
          } catch (error) {
            console.error(`  ✗ Search error: ${error.message}`);
          }

          // Rate limiting between searches
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      console.log(`  ✅ Category ${categorySlug}: +${categoryAdded} businesses`);
    }

    console.log(`\n✅ Import completed!`);
    console.log(`   Added: ${totalAdded} businesses`);
    console.log(`   Skipped (duplicates): ${totalSkipped}`);
    console.log(`   Errors: ${totalErrors}`);

    const finalCount = await db.select().from(businesses);
    console.log(`   Total in database: ${finalCount.length}`);

    await connection.end();
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

importComprehensiveBusinesses();
