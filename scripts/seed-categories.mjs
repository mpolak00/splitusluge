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
  {
    name: "Čišćenje apartmana",
    slug: "ciscenje-apartmana",
    description: "Profesionalno čišćenje apartmana i smještajnih objekata",
    icon: "home",
  },
  {
    name: "Pranje brodova",
    slug: "pranje-brodova",
    description: "Pranje, poliranje i čišćenje brodova i jahti",
    icon: "anchor",
  },
  {
    name: "Taxi i transfer",
    slug: "taxi-i-transfer",
    description: "Taxi službe i aerodromski transferi",
    icon: "car",
  },
  {
    name: "Iznajmljivanje plovila",
    slug: "iznajmljivanje-plovila",
    description: "Najam brodova, jedrilica i jet ski-eva",
    icon: "ship",
  },
  {
    name: "Hitni klima servis",
    slug: "klima-servis-apartmani",
    description: "Hitne popravke klima uređaja za apartmane",
    icon: "thermometer",
  },
  {
    name: "Dezinsekcija i deratizacija",
    slug: "pest-control",
    description: "Dezinsekcija, deratizacija i zaštita od štetočina",
    icon: "bug",
  },
  {
    name: "Održavanje bazena",
    slug: "bazeni-i-odrzavanje",
    description: "Servis i čišćenje bazena",
    icon: "waves",
  },
  {
    name: "Fotografske usluge",
    slug: "fotografija",
    description: "Profesionalno fotografiranje i drone snimanje",
    icon: "camera",
  },
  {
    name: "Catering i dostava hrane",
    slug: "catering",
    description: "Catering za evente i privatne zabave",
    icon: "utensils",
  },
  {
    name: "Turistički vodiči",
    slug: "turisticki-vodici",
    description: "Licencirani turistički vodiči",
    icon: "compass",
  },
  {
    name: "Pranje tepiha i namještaja",
    slug: "pranje-tepiha",
    description: "Dubinsko pranje tepiha, madraca i namještaja",
    icon: "wind",
  },
  {
    name: "Ključar",
    slug: "kljucar",
    description: "Hitne usluge ključara i zamjena brava",
    icon: "key",
  },
  {
    name: "Odvoz otpada",
    slug: "odvoz-otpada",
    description: "Odvoz glomaznog otpada i građevinskog šuta",
    icon: "trash-2",
  },
  {
    name: "Sigurnosni sustavi",
    slug: "sigurnosni-sustavi",
    description: "Ugradnja kamera, alarma i video nadzora",
    icon: "shield",
  },
  {
    name: "Web dizajn",
    slug: "web-dizajn",
    description: "Izrada web stranica za lokalne biznise",
    icon: "globe",
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
