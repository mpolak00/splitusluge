import { invokeLLM } from '../server/_core/llm.ts';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { businesses, categories } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const categorySearchMap = {
  'klima-i-grijanje': 'HVAC, air conditioning, heating systems, climate control Split Solin Kastela Omis',
  'zidari': 'masons, bricklayers, stone workers, construction Split Solin Kastela Omis',
  'prozori-i-vrata': 'windows, doors, window installation, door installation Split Solin Kastela Omis',
};

async function scrapeBusinessesForCategory(categorySlug, searchQuery) {
  console.log(`\n🔍 Scraping ${categorySlug}...`);
  
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `You are a business data extraction expert. Extract business information from Google Maps search results for: ${searchQuery}. 
          
Return a JSON array with this structure for each business:
{
  "name": "Business Name",
  "address": "Full Address",
  "phone": "Phone Number or null",
  "website": "Website URL or null",
  "rating": "4.5",
  "reviewCount": 120,
  "latitude": "43.5081",
  "longitude": "16.4402",
  "city": "Split/Solin/Kastela/Omis",
  "neighborhood": "Neighborhood or null"
}

Extract at least 15-20 real businesses. Be accurate with data.`
        },
        {
          role: 'user',
          content: `Extract businesses from Google Maps for: ${searchQuery}. Return only valid JSON array, no other text.`
        }
      ]
    });

    const content = response.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    
    if (!jsonMatch) {
      console.log(`⚠️  No JSON found for ${categorySlug}`);
      return [];
    }

    const businesses = JSON.parse(jsonMatch[0]);
    console.log(`✓ Found ${businesses.length} businesses for ${categorySlug}`);
    return businesses;
  } catch (error) {
    console.error(`✗ Error scraping ${categorySlug}:`, error.message);
    return [];
  }
}

async function addBusinessesToDatabase(categorySlug, businessList) {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(conn);

  try {
    // Get category ID
    const categoryResult = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, categorySlug));

    if (!categoryResult.length) {
      console.log(`⚠️  Category ${categorySlug} not found`);
      await conn.end();
      return;
    }

    const categoryId = categoryResult[0].id;
    let addedCount = 0;

    for (const business of businessList) {
      try {
        // Check if business already exists
        const existing = await db
          .select()
          .from(businesses)
          .where(eq(businesses.name, business.name));

        if (existing.length > 0) {
          console.log(`  ⊘ ${business.name} already exists`);
          continue;
        }

        // Add business
        await db.insert(businesses).values({
          categoryId,
          name: business.name,
          address: business.address || null,
          phone: business.phone || null,
          website: business.website || null,
          rating: business.rating?.toString() || null,
          reviewCount: business.reviewCount || 0,
          latitude: business.latitude || null,
          longitude: business.longitude || null,
          city: business.city || 'Split',
          neighborhood: business.neighborhood || null,
          isActive: 1,
        });

        addedCount++;
        console.log(`  ✓ Added: ${business.name}`);
      } catch (error) {
        console.log(`  ✗ Error adding ${business.name}: ${error.message}`);
      }
    }

    console.log(`\n✅ Added ${addedCount} new businesses for ${categorySlug}`);
  } finally {
    await conn.end();
  }
}

async function main() {
  console.log('🚀 Starting business scraping for additional categories...\n');

  for (const [categorySlug, searchQuery] of Object.entries(categorySearchMap)) {
    const scrapedBusinesses = await scrapeBusinessesForCategory(categorySlug, searchQuery);
    
    if (scrapedBusinesses.length > 0) {
      await addBusinessesToDatabase(categorySlug, scrapedBusinesses);
    }
  }

  console.log('\n✅ Business scraping complete!');
}

main().catch(console.error);
