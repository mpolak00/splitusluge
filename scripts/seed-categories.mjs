import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { categories } from "../drizzle/schema.ts";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const seedCategories = [
  {
    name: "Vulkanizeri",
    slug: "vulkanizeri",
    description: "Popravka i zamjena guma, vulkanizacija",
    icon: "tire",
  },
  {
    name: "Automehaničari",
    slug: "automehanicari",
    description: "Servis i popravka automobila",
    icon: "wrench",
  },
  {
    name: "Vodoinstalateri",
    slug: "vodoinstalateri",
    description: "Instalacija i popravka vodovodnih sustava",
    icon: "droplet",
  },
  {
    name: "Električari",
    slug: "elektricari",
    description: "Električne instalacije i popravke",
    icon: "zap",
  },
  {
    name: "Servisi za čišćenje",
    slug: "servisi-za-ciscenje",
    description: "Čišćenje domova i poslovnih prostora",
    icon: "sparkles",
  },
  {
    name: "Stolari",
    slug: "stolari",
    description: "Stolarske usluge i izrada namještaja",
    icon: "hammer",
  },
  {
    name: "Frizerski saloni",
    slug: "frizerski-saloni",
    description: "Frizerske usluge za muškarce i žene",
    icon: "scissors",
  },
  {
    name: "Stomatolozi",
    slug: "stomatolozi",
    description: "Stomatološke usluge i liječenje zuba",
    icon: "tooth",
  },
  {
    name: "Prijevoz i selidbe",
    slug: "prijevoz-i-selidbe",
    description: "Usluge prijevoza i selidbi",
    icon: "truck",
  },
  {
    name: "Vrtlari i uređenje vrtova",
    slug: "vrtlari",
    description: "Uređenje i održavanje vrtova",
    icon: "leaf",
  },
];

async function seed() {
  try {
    const connection = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(connection);

    console.log("Seeding categories...");

    for (const category of seedCategories) {
      try {
        await db.insert(categories).values(category);
        console.log(`✓ Added category: ${category.name}`);
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          console.log(`⚠ Category already exists: ${category.name}`);
        } else {
          throw error;
        }
      }
    }

    console.log("✓ Seeding completed!");
    await connection.end();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
