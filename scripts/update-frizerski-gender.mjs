import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { businesses, categories } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(conn);

console.log('🚀 Updating frizerski salon businesses with gender information...\n');

// Get frizerski salon category
const frizerCategory = await db
  .select()
  .from(categories)
  .where(eq(categories.slug, 'frizerski-saloni'));

if (!frizerCategory.length) {
  console.error('❌ Frizerski salon category not found');
  await conn.end();
  process.exit(1);
}

const categoryId = frizerCategory[0].id;
console.log(`✓ Found frizerski salon category (ID: ${categoryId})\n`);

// Get all frizerski salon businesses
const frizerBusinesses = await db
  .select()
  .from(businesses)
  .where(eq(businesses.categoryId, categoryId));

console.log(`📊 Found ${frizerBusinesses.length} frizerski salon businesses\n`);

// Keywords for identifying gender-specific salons
const muskaKeywords = ['muski', 'muško', 'za muškarce', 'barber', 'barbershop', 'muški frizer'];
const zenskaKeywords = ['zenski', 'ženski', 'za žene', 'beauty', 'salon za žene', 'ženski frizer'];

let muskaCount = 0;
let zenskaCount = 0;
let bothCount = 0;

// Update each business based on name and description
for (const business of frizerBusinesses) {
  const nameAndDesc = `${business.name} ${business.description || ''}`.toLowerCase();
  
  let gender = null;
  
  // Check for gender-specific keywords
  const hasMuska = muskaKeywords.some(keyword => nameAndDesc.includes(keyword));
  const hasZenska = zenskaKeywords.some(keyword => nameAndDesc.includes(keyword));
  
  if (hasMuska && !hasZenska) {
    gender = 'muski';
    muskaCount++;
  } else if (hasZenska && !hasMuska) {
    gender = 'zenski';
    zenskaCount++;
  } else {
    bothCount++;
  }
  
  // Update the business
  await db
    .update(businesses)
    .set({ gender })
    .where(eq(businesses.id, business.id));
  
  if (gender) {
    console.log(`✓ ${business.name} → ${gender === 'muski' ? '👨 Muški' : '👩 Ženski'}`);
  }
}

console.log(`\n📊 Summary:`);
console.log(`   👨 Muški saloni: ${muskaCount}`);
console.log(`   👩 Ženski saloni: ${zenskaCount}`);
console.log(`   👥 Oba spola: ${bothCount}`);
console.log(`\n✅ Successfully updated ${frizerBusinesses.length} businesses!`);

await conn.end();
