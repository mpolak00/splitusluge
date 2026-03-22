import { getDb } from '../server/db.ts';
import { businesses, categories } from '../drizzle/schema.ts';
import { eq, count } from 'drizzle-orm';

const db = await getDb();
if (!db) {
  console.log('Database not available');
  process.exit(1);
}

const result = await db
  .select({
    categoryId: businesses.categoryId,
    categoryName: categories.name,
    count: count(),
  })
  .from(businesses)
  .leftJoin(categories, eq(businesses.categoryId, categories.id))
  .groupBy(businesses.categoryId, categories.name)
  .orderBy(categories.name);

console.log(JSON.stringify(result, null, 2));
