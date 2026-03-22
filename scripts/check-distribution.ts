import { getDb } from '../server/db';
import { businesses, categories } from '../drizzle/schema';
import { count, eq } from 'drizzle-orm';

const db = await getDb();

console.log('📊 Business Distribution by Category:\n');

const allCategories = await db.select().from(categories);

for (const cat of allCategories) {
  const result = await db
    .select({ count: count() })
    .from(businesses)
    .where(eq(businesses.categoryId, cat.id));
  
  console.log(`${cat.name.padEnd(30)} (${cat.slug}): ${result[0].count} firmi`);
}

process.exit(0);
