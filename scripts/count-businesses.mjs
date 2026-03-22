import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { businesses } from "../drizzle/schema.ts";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

async function countBusinesses() {
  try {
    const conn = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(conn);
    
    const allBusinesses = await db.select().from(businesses);
    console.log(`Total businesses in database: ${allBusinesses.length}`);
    
    // Group by city
    const byCityMap = {};
    allBusinesses.forEach(b => {
      byCityMap[b.city] = (byCityMap[b.city] || 0) + 1;
    });
    
    console.log("\nBreakdown by city:");
    Object.entries(byCityMap).forEach(([city, count]) => {
      console.log(`  ${city}: ${count}`);
    });
    
    await conn.end();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

countBusinesses();
