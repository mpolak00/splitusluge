import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { businesses, categories } from '../drizzle/schema.ts';
import { count, eq } from 'drizzle-orm';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(conn);

console.log('📊 Business Distribution by Category:\n');

const allCategories = await db.select().from(categories);

for (const cat of allCategories) {
  const result = await db
    .select({ count: count() })
    .from(businesses)
    .where(eq(businesses.categoryId, cat.id));
  
  console.log(`${cat.name.padEnd(30)} (${cat.slug}): ${result[0].count} firmi`);
}

await conn.end();
