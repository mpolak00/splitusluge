import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { categories } from "../drizzle/schema.ts";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

async function addCategories() {
  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(connection);

    const newCategories = [
      { name: "Krovopokrivači", slug: "krovopokrivaci", description: "Krovopokrivači i krovni radovi" },
      { name: "Zidari", slug: "zidari", description: "Zidari i betonari" },
      { name: "Slikari", slug: "slikari", description: "Slikari i dekoratori" },
      { name: "Klima i Grijanje", slug: "klima", description: "Klima i grijanje" },
      { name: "Prozori i Vrata", slug: "prozori", description: "Prozori i vrata" },
      { name: "Pranje Automobila", slug: "pranje_auta", description: "Pranje i detailing automobila" },
      { name: "Zdravstvo", slug: "zdravstvo", description: "Zdravstvo i ljekarne" },
      { name: "Restorani", slug: "restorani", description: "Restorani i kafići" },
      { name: "Hoteli", slug: "hoteli", description: "Hoteli i smještaj" },
    ];

    for (const cat of newCategories) {
      try {
        await db.insert(categories).values(cat);
        console.log(`✅ Added: ${cat.name}`);
      } catch (error) {
        console.log(`⚠ Skipped: ${cat.name} (already exists)`);
      }
    }

    console.log("\n✅ Categories updated!");
    await connection.end();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

addCategories();
