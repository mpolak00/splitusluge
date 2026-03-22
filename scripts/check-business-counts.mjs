import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { businesses, categories } from '../drizzle/schema.ts';
import { eq, count } from 'drizzle-orm';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(conn);

// Count businesses by category
const categoryNames = ['klima-i-grijanje', 'zidari', 'prozori-i-vrata'];

console.log('\n📊 Business counts by category:\n');

for (const slug of categoryNames) {
  const cat = await db.select().from(categories).where(eq(categories.slug, slug));
  if (cat.length > 0) {
    const biz = await db.select({ count: count() }).from(businesses).where(eq(businesses.categoryId, cat[0].id));
    console.log(`${slug}: ${biz[0].count} businesses`);
  } else {
    console.log(`${slug}: Category not found`);
  }
}

await conn.end();
console.log('\n✅ Check complete!');
