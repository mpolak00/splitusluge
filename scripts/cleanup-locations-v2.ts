import { getDb } from '../server/db';
import { businesses } from '../drizzle/schema';
import { inArray } from 'drizzle-orm';

const db = await getDb();

console.log('🗺️  Cleaning up businesses outside Split region...\n');

// Allowed cities and neighborhoods
const allowedCities = [
  'Split',
  'Solin',
  'Trogir',
  'Kastel Stari',
  'Kastel Novi',
  'Kastel Gomilica',
  'Kastela',
  'Stobrec',
  'Vranjic',
  'Sukoisan',
  'Podstrana',
  'Brela',
  'Bol',
  'Stari Grad',
  'Jelsa',
  'Vis',
  'Omis', // Allow Omis since it's close
  'Dugopolje', // Allow Dugopolje since it's close
];

// Keywords that indicate business is from outside allowed area
const forbiddenKeywords = [
  'beograd',
  'belgrad',
  'zagreb',
  'zadar',
  'metkovic',
  'makarska',
  'sinj',
  'sibenik',
  'bosna',
  'sarajevo',
  'mostar',
  'zenica',
  'tuzla',
  'banja luka',
  'bihac',
  'konjic',
  'travnik',
  'gorazde',
  'prijedor',
  'gradiska',
  'samac',
  'derventa',
  'jajce',
  'livno',
  'tomislavgrad',
  'posusje',
  'siroki brijeg',
  'citluk',
  'grude',
  'neum',
  'capljina',
  'stolac',
  'kalinovik',
  'rogatica',
  'sokolac',
  'pale',
  'trnovo',
  'foca',
  'cajnice',
  'visegrad',
  'srebrenica',
  'zvornik',
  'vlasenica',
  'kladanj',
  'osmaci',
  'maglaj',
  'doboj',
  'bijeljina',
  'lopare',
  'ugljevik',
  'vucja',
  'pancevo',
  'smederevo',
  'pozarevac',
  'jagodina',
  'svetozarevo',
  'nis',
  'leskovac',
  'vranje',
  'pirot',
  'krusevac',
  'cacak',
  'uzice',
  'titovo uzice',
  'valjevo',
  'sabac',
  'sremska mitrovica',
  'zemun',
  'vozdovac',
  'cukarica',
  'rakovica',
  'palilula',
  'podgorica',
  'novi sad',
  'nis',
  'pag',
];

// Get all businesses
const allBusinesses = await db.select().from(businesses);

console.log(`📊 Total businesses: ${allBusinesses.length}\n`);

let toDelete: number[] = [];
let deletedNames: string[] = [];

for (const business of allBusinesses) {
  const city = business.city?.toLowerCase() || '';
  const address = business.address?.toLowerCase() || '';
  const name = business.name?.toLowerCase() || '';
  const description = business.description?.toLowerCase() || '';
  const fullText = `${city} ${address} ${name} ${description}`;

  // Check if name or address contains forbidden keywords
  let isForbidden = false;
  for (const keyword of forbiddenKeywords) {
    if (fullText.includes(keyword)) {
      isForbidden = true;
      break;
    }
  }

  if (isForbidden) {
    toDelete.push(business.id);
    deletedNames.push(`${business.name} (${business.city || 'N/A'})`);
  }
}

console.log(`🗑️  Found ${toDelete.length} businesses to delete:\n`);

// Show first 50 to delete
for (let i = 0; i < Math.min(50, deletedNames.length); i++) {
  console.log(`   ${i + 1}. ${deletedNames[i]}`);
}

if (deletedNames.length > 50) {
  console.log(`   ... and ${deletedNames.length - 50} more`);
}

// Delete the marked businesses
if (toDelete.length > 0) {
  console.log(`\n🗑️  Deleting ${toDelete.length} businesses from outside Split region...`);
  await db.delete(businesses).where(inArray(businesses.id, toDelete));
  console.log(`✅ Successfully deleted ${toDelete.length} businesses`);
} else {
  console.log(`\n✅ No businesses to delete`);
}

// Verify remaining businesses
const remaining = await db.select().from(businesses);
console.log(`\n📊 Final Summary:`);
console.log(`   Deleted: ${toDelete.length}`);
console.log(`   Remaining: ${remaining.length}`);

process.exit(0);
