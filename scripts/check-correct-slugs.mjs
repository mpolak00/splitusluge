import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { categories, businesses } from '../drizzle/schema.ts';
import { eq, count } from 'drizzle-orm';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(conn);

console.log('\n📋 Checking categories for climate, windows, and masonry:\n');

const searchTerms = ['klima', 'prozori', 'zidari'];

for (const term of searchTerms) {
  const cat = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, term));

  if (cat.length > 0) {
    const bizCount = await db
      .select({ count: count() })
      .from(businesses)
      .where(eq(businesses.categoryId, cat[0].id));
    
    console.log(`✓ ${cat[0].name} (${term}): ${bizCount[0].count} businesses`);
  } else {
    console.log(`✗ Category with slug "${term}" not found`);
  }
}

await conn.end();
