import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { categories } from '../drizzle/schema.ts';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(conn);

const allCategories = await db.select().from(categories);

console.log('\n📋 All categories in database:\n');
allCategories.forEach((cat) => {
  console.log(`${cat.id}: ${cat.name} (${cat.slug})`);
});

console.log(`\nTotal: ${allCategories.length} categories\n`);

await conn.end();
