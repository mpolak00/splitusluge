import { getDb } from '../server/db';
import { businesses, categories } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const db = await getDb();

console.log('🔍 Searching for duplicate businesses...\n');

// Get all businesses
const allBusinesses = await db.select().from(businesses);

// Group by name (case-insensitive)
const businessesByName: Record<string, typeof allBusinesses> = {};

for (const business of allBusinesses) {
  const key = business.name.toLowerCase().trim();
  if (!businessesByName[key]) {
    businessesByName[key] = [];
  }
  businessesByName[key].push(business);
}

// Find duplicates
let duplicateCount = 0;
let totalDuplicates = 0;

for (const [name, businesses_list] of Object.entries(businessesByName)) {
  if (businesses_list.length > 1) {
    duplicateCount++;
    totalDuplicates += businesses_list.length;
    
    // Get category names
    const categories_data = await Promise.all(
      businesses_list.map(b => 
        db.select().from(categories).where(eq(categories.id, b.categoryId))
      )
    );
    
    const categoryNames = categories_data.map(c => c[0]?.name || 'Unknown').join(', ');
    
    console.log(`📌 "${name}"`);
    console.log(`   Pojavljuje se u: ${businesses_list.length} kategorije/a`);
    console.log(`   Kategorije: ${categoryNames}`);
    console.log(`   IDs: ${businesses_list.map(b => b.id).join(', ')}`);
    console.log('');
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Firmi s duplikatima: ${duplicateCount}`);
console.log(`   Ukupno duplikata: ${totalDuplicates}`);
console.log(`   Jedinstvenih firmi: ${Object.keys(businessesByName).length - duplicateCount}`);

process.exit(0);
