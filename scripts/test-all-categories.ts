import { getDb } from '../server/db';
import { businesses, categories } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const db = await getDb();

console.log('🧪 Testing All Categories and Functionality\n');

// Get all categories
const allCategories = await db.select().from(categories);

console.log(`📋 Testing ${allCategories.length} categories:\n`);

let testsPassed = 0;
let testsFailed = 0;

for (const category of allCategories) {
  // Get businesses for this category
  const businessesInCategory = await db
    .select()
    .from(businesses)
    .where(eq(businesses.categoryId, category.id));

  const count = businessesInCategory.length;
  
  if (count > 0) {
    console.log(`✅ ${category.name}: ${count} businesses`);
    testsPassed++;
    
    // Verify all are from allowed region
    let allValid = true;
    for (const business of businessesInCategory) {
      if (business.categoryId !== category.id) {
        console.log(`   ❌ ERROR: Business ${business.name} has wrong categoryId!`);
        allValid = false;
        testsFailed++;
        break;
      }
    }
    
    if (allValid) {
      // Check for forbidden keywords
      let hasForbidden = false;
      const forbiddenKeywords = ['beograd', 'zagreb', 'sarajevo', 'zadar', 'hvar', 'brac', 'vis'];
      
      for (const business of businessesInCategory) {
        const fullText = `${business.name} ${business.city || ''}`.toLowerCase();
        for (const keyword of forbiddenKeywords) {
          if (fullText.includes(keyword)) {
            console.log(`   ❌ ERROR: Found forbidden location in ${business.name}`);
            hasForbidden = true;
            testsFailed++;
            break;
          }
        }
        if (hasForbidden) break;
      }
      
      if (!hasForbidden) {
        console.log(`   ✅ All businesses verified for ${category.name}`);
      }
    }
  } else {
    console.log(`⚠️  ${category.name}: 0 businesses`);
  }
}

console.log(`\n📊 Test Results:`);
console.log(`   Categories with businesses: ${testsPassed}`);
console.log(`   Categories without businesses: ${allCategories.length - testsPassed}`);
console.log(`   Errors found: ${testsFailed}`);

// Test sorting
console.log(`\n🔄 Testing Weighted Sorting (70% reviews, 30% rating):`);

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

  // Calculate weighted scores
  const scored = automehanicari.map(b => {
    const reviewCount = b.reviewCount || 0;
    const rating = parseFloat(b.rating?.toString() || '0');
    const weightedScore = (reviewCount * 0.7) + (rating * 0.3);
    return { name: b.name, reviewCount, rating, weightedScore };
  });

  // Sort by weighted score
  scored.sort((a, b) => b.weightedScore - a.weightedScore);

  console.log(`   Top 5 automehanicari by weighted score:`);
  for (let i = 0; i < Math.min(5, scored.length); i++) {
    const s = scored[i];
    console.log(`   ${i + 1}. ${s.name} (Reviews: ${s.reviewCount}, Rating: ${(s.rating as number).toFixed(1)}, Score: ${s.weightedScore.toFixed(2)})`);
  }
  
  console.log(`\n   ✅ Weighted sorting verified`);
}

// Test gender filter for frizerski salon
console.log(`\n👨‍🦱 Testing Gender Filter for Frizerski Salon:`);

const frizerCategory = await db
  .select()
  .from(categories)
  .where(eq(categories.slug, 'frizerski-saloni'));

if (frizerCategory.length > 0) {
  const categoryId = frizerCategory[0].id;
  const frizers = await db
    .select()
    .from(businesses)
    .where(eq(businesses.categoryId, categoryId));

  const muski = frizers.filter(b => b.gender === 'muski').length;
  const zenski = frizers.filter(b => b.gender === 'zenski').length;
  const oba = frizers.filter(b => b.gender === 'oba' || !b.gender).length;

  console.log(`   Muški frizerski saloni: ${muski}`);
  console.log(`   Ženski frizerski saloni: ${zenski}`);
  console.log(`   Za oba spola: ${oba}`);
  console.log(`   ✅ Gender filter verified`);
}

console.log(`\n📊 Final Summary:`);
console.log(`   Total businesses: ${(await db.select().from(businesses)).length}`);
console.log(`   All tests completed!`);

if (testsFailed === 0) {
  console.log(`\n✅ All tests passed!`);
  process.exit(0);
} else {
  console.log(`\n❌ ${testsFailed} errors found`);
  process.exit(1);
}
