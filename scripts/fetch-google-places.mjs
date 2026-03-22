import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { businesses, categories } from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;
const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL || "https://api.manus.im";

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

if (!FORGE_API_KEY) {
  console.error("BUILT_IN_FORGE_API_KEY environment variable is not set");
  process.exit(1);
}

// Search areas in Split region
const searchAreas = [
  { name: "Split", lat: 43.5081, lng: 16.4402, radius: 8000 },
  { name: "Solin", lat: 43.5167, lng: 16.5, radius: 5000 },
  { name: "Kastela", lat: 43.5, lng: 16.35, radius: 5000 },
  { name: "Omis", lat: 43.2333, lng: 16.7, radius: 5000 },
];

// Service category mapping to Google Places types
const categoryMapping = {
  vulkanizeri: ["car_repair", "car_wash"],
  automehanicari: ["car_repair", "auto_parts_store"],
  vodoinstalateri: ["plumber", "home_goods_store"],
  elektricari: ["electrician"],
  "servisi-za-ciscenje": ["cleaning_service", "laundry"],
  stolari: ["furniture_store", "home_goods_store"],
  "frizerski-saloni": ["hair_care", "beauty_salon"],
  stomatolozi: ["dentist"],
  "prijevoz-i-selidbe": ["moving_company", "car_rental"],
  vrtlari: ["landscaping_service", "garden_center"],
};

async function fetchPlacesData(lat, lng, radius, query) {
  try {
    const url = new URL(`${FORGE_API_URL}/v1/maps/proxy/maps/api/place/nearbysearch/json`);
    url.searchParams.append("location", `${lat},${lng}`);
    url.searchParams.append("radius", radius.toString());
    url.searchParams.append("keyword", query);
    url.searchParams.append("key", FORGE_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== "OK") {
      console.warn(`Google Places API error: ${data.status}`);
      return [];
    }

    return data.results || [];
  } catch (error) {
    console.error("Error fetching from Google Places API:", error);
    return [];
  }
}

async function getPlaceDetails(placeId) {
  try {
    const url = new URL(`${FORGE_API_URL}/v1/maps/proxy/maps/api/place/details/json`);
    url.searchParams.append("place_id", placeId);
    url.searchParams.append("fields", "formatted_phone_number,website,opening_hours,photos,rating,user_ratings_total");
    url.searchParams.append("key", FORGE_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== "OK") {
      return null;
    }

    return data.result || null;
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
}

async function importBusinesses() {
  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(connection);

    console.log("Fetching business data from Google Maps...");

    // Get all categories
    const allCategories = await db.select().from(categories);
    const categoryMap = new Map(allCategories.map(c => [c.slug, c.id]));

    let totalAdded = 0;

    for (const [categorySlug, googleTypes] of Object.entries(categoryMapping)) {
      const categoryId = categoryMap.get(categorySlug);
      if (!categoryId) {
        console.warn(`Category not found: ${categorySlug}`);
        continue;
      }

      for (const area of searchAreas) {
        for (const googleType of googleTypes) {
          console.log(`Searching for ${googleType} in ${area.name}...`);

          const places = await fetchPlacesData(area.lat, area.lng, area.radius, googleType);

          for (const place of places) {
            try {
              // Get detailed information
              const details = await getPlaceDetails(place.place_id);

              const businessData = {
                googlePlaceId: place.place_id,
                categoryId: categoryId,
                name: place.name,
                description: place.vicinity || "",
                address: place.formatted_address || place.vicinity,
                phone: details?.formatted_phone_number || null,
                website: details?.website || null,
                latitude: place.geometry.location.lat.toString(),
                longitude: place.geometry.location.lng.toString(),
                imageUrl: place.photos?.[0]?.photo_reference ? 
                  `${FORGE_API_URL}/v1/maps/proxy/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${FORGE_API_KEY}` 
                  : null,
                rating: place.rating?.toString() || null,
                reviewCount: details?.user_ratings_total || 0,
                openingHours: details?.opening_hours?.weekday_text?.join(", ") || null,
                city: area.name,
                neighborhood: place.vicinity?.split(",")[0] || null,
                isActive: 1,
              };

              // Check if already exists
              const existing = await db.select().from(businesses)
                .where(eq(businesses.googlePlaceId, place.place_id))
                .limit(1);

              if (existing.length === 0) {
                await db.insert(businesses).values(businessData);
                totalAdded++;
                console.log(`  ✓ Added: ${place.name}`);
              } else {
                // Update existing
                await db.update(businesses)
                  .set(businessData)
                  .where(eq(businesses.googlePlaceId, place.place_id));
                console.log(`  ↻ Updated: ${place.name}`);
              }

              // Small delay to avoid rate limiting
              await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
              console.error(`Error processing place ${place.name}:`, error);
            }
          }
        }
      }
    }

    console.log(`\n✓ Import completed! Added/Updated ${totalAdded} businesses.`);
    await connection.end();
  } catch (error) {
    console.error("Error importing businesses:", error);
    process.exit(1);
  }
}

importBusinesses();
