import { getDb } from '../server/db';
import { businesses, categories } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const db = await getDb();

console.log('🔍 Verifying Category Filtering...\n');

// Get all categories
const allCategories = await db.select().from(categories);
console.log(`📋 Total categories: ${allCategories.length}\n`);

// Test filtering for each category
let testsPassed = 0;
let testsFailed = 0;

for (const category of allCategories.slice(0, 5)) {
  console.log(`Testing category: ${category.name} (ID: ${category.id})`);
  
  // Get businesses for this category
  const businessesInCategory = await db
    .select()
    .from(businesses)
    .where(eq(businesses.categoryId, category.id));
  
  console.log(`  ✓ Found ${businessesInCategory.length} businesses`);
  
  // Verify all businesses belong to this category
  let allCorrect = true;
  for (const business of businessesInCategory) {
    if (business.categoryId !== category.id) {
      console.log(`  ✗ ERROR: Business ${business.name} has wrong categoryId!`);
      allCorrect = false;
      testsFailed++;
      break;
    }
  }
  
  if (allCorrect) {
    console.log(`  ✓ All businesses verified for category ${category.name}`);
    testsPassed++;
  }
  
  console.log('');
}

// Specific test for automehanicari
console.log('🔧 Specific Test: Automehanicari Category');
const automehanicariCategory = await db
  .select()
  .from(categories)
  .where(eq(categories.slug, 'automehanicari'));

if (automehanicariCategory.length > 0) {
  const categoryId = automehanicariCategory[0].id;
  const automehanicari = await db
    .select()
    .from(businesses)
    .where(eq(businesses.categoryId, categoryId));
  
  console.log(`  ✓ Found ${automehanicari.length} automehanicari`);
  
  // Verify none are from other categories
  let hasOtherCategories = false;
  for (const business of automehanicari) {
    if (business.categoryId !== categoryId) {
      console.log(`  ✗ ERROR: Found business from different category!`);
      hasOtherCategories = true;
      break;
    }
  }
  
  if (!hasOtherCategories) {
    console.log(`  ✓ All automehanicari are correctly categorized`);
    testsPassed++;
  } else {
    testsFailed++;
  }
} else {
  console.log(`  ✗ automehanicari category not found`);
  testsFailed++;
}

console.log(`\n📊 Results:`);
console.log(`   Tests Passed: ${testsPassed}`);
console.log(`   Tests Failed: ${testsFailed}`);

if (testsFailed === 0) {
  console.log(`\n✅ All category filtering tests passed!`);
} else {
  console.log(`\n❌ Some tests failed. Please review the errors above.`);
}

process.exit(testsFailed > 0 ? 1 : 0);
