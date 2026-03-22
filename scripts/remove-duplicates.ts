import { getDb } from '../server/db';
import { businesses } from '../drizzle/schema';
import { eq, inArray } from 'drizzle-orm';

const db = await getDb();

console.log('🗑️  Removing duplicates and test data...\n');

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

let deletedCount = 0;
const idsToDelete: number[] = [];

// Find and mark duplicates for deletion
for (const [name, businesses_list] of Object.entries(businessesByName)) {
  if (businesses_list.length > 1) {
    // Keep the first one, delete the rest
    const toDelete = businesses_list.slice(1);
    
    for (const business of toDelete) {
      idsToDelete.push(business.id);
      console.log(`🗑️  Deleting duplicate: "${name}" (ID: ${business.id})`);
    }
    
    deletedCount += toDelete.length;
  }
}

// Also delete test data
const testDataPatterns = ['test', 'demo', 'sample', 'xxx', 'yyy', 'zzz'];
for (const business of allBusinesses) {
  const nameLower = business.name.toLowerCase();
  for (const pattern of testDataPatterns) {
    if (nameLower.includes(pattern) && !idsToDelete.includes(business.id)) {
      // Check if it's actually test data (like "test vulkanizer" with many duplicates)
      const key = business.name.toLowerCase().trim();
      if (businessesByName[key]?.length > 5) {
        idsToDelete.push(business.id);
        console.log(`🗑️  Deleting test data: "${business.name}" (ID: ${business.id})`);
        deletedCount++;
      }
    }
  }
}

// Delete the marked businesses
if (idsToDelete.length > 0) {
  await db.delete(businesses).where(inArray(businesses.id, idsToDelete));
  console.log(`\n✅ Deleted ${deletedCount} duplicate/test entries`);
} else {
  console.log(`\n✅ No duplicates found to delete`);
}

console.log(`\n📊 Summary:`);
console.log(`   Total deleted: ${deletedCount}`);
console.log(`   Remaining businesses: ${allBusinesses.length - deletedCount}`);

process.exit(0);
