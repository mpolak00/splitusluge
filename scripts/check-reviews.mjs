import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { platformReviews } from '../drizzle/schema.ts';
import { count } from 'drizzle-orm';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(conn);

const result = await db.select({ count: count() }).from(platformReviews);
console.log('Total reviews in database:', result[0].count);

await conn.end();
