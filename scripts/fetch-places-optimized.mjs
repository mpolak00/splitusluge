import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { businesses, categories } from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL || "https://api.manus.im";

if (!DATABASE_URL || !FORGE_API_KEY) {
  console.error("Missing DATABASE_URL or BUILT_IN_FORGE_API_KEY");
  process.exit(1);
}

// Simplified search queries for each category
const categoryQueries = {
  vulkanizeri: ["vulkanizer split", "gume split"],
  automehanicari: ["autoservis split", "mehaničar split"],
  vodoinstalateri: ["vodoinstalater split", "voda split"],
  elektricari: ["električar split", "električna instalacija split"],
  "servisi-za-ciscenje": ["čišćenje split", "pranje split"],
  stolari: ["stolar split", "namještaj split"],
  "frizerski-saloni": ["frizer split", "frizerski salon split"],
  stomatolozi: ["zubni liječnik split", "stomatolog split"],
  "prijevoz-i-selidbe": ["selidba split", "prijevoz split"],
  vrtlari: ["vrtlar split", "uređenje vrta split"],
};

const searchAreas = [
  { name: "Split", lat: 43.5081, lng: 16.4402, radius: 10000 },
  { name: "Solin", lat: 43.5167, lng: 16.5, radius: 5000 },
  { name: "Kastela", lat: 43.5, lng: 16.35, radius: 5000 },
  { name: "Omis", lat: 43.2333, lng: 16.7, radius: 5000 },
];

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
    console.error("Error searching places:", error);
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
    console.error("Error getting place details:", error);
    return null;
  }
}

async function importBusinesses() {
  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(connection);

    console.log("Starting optimized business import from Google Maps...\n");

    const allCategories = await db.select().from(categories);
    const categoryMap = new Map(allCategories.map(c => [c.slug, c.id]));

    let totalAdded = 0;
    let totalUpdated = 0;

    for (const [categorySlug, queries] of Object.entries(categoryQueries)) {
      const categoryId = categoryMap.get(categorySlug);
      if (!categoryId) {
        console.warn(`⚠ Category not found: ${categorySlug}`);
        continue;
      }

      console.log(`\n📍 Processing category: ${categorySlug}`);

      for (const area of searchAreas) {
        for (const query of queries) {
          console.log(`  Searching: "${query}" in ${area.name}...`);

          const places = await searchPlaces(query, area.lat, area.lng, area.radius);
          
          for (const place of places) {
            try {
              // Check if already exists
              const existing = await db.select().from(businesses)
                .where(eq(businesses.googlePlaceId, place.place_id))
                .limit(1);

              if (existing.length > 0) {
                // Skip if already imported
                continue;
              }

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
              totalAdded++;
              console.log(`    ✓ Added: ${place.name}`);

              // Rate limiting
              await new Promise(resolve => setTimeout(resolve, 50));
            } catch (error) {
              console.error(`    ✗ Error: ${place.name} - ${error.message}`);
            }
          }
        }
      }
    }

    console.log(`\n✅ Import completed!`);
    console.log(`   Added: ${totalAdded} businesses`);
    console.log(`   Updated: ${totalUpdated} businesses`);
    
    await connection.end();
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

importBusinesses();
