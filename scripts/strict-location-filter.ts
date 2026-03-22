import { getDb } from '../server/db';
import { businesses } from '../drizzle/schema';
import { inArray } from 'drizzle-orm';

const db = await getDb();

console.log('🗺️  STRICT Location Filter - Trogir-Omiš Region Only\n');

// ALLOWED cities - ONLY between Trogir and Omiš
const allowedCities = [
  'Split',
  'Solin',
  'Trogir',
  'Kaštela',
  'Kastel Stari',
  'Kastel Novi',
  'Kastel Gomilica',
  'Kastel Sućurac',
  'Kastel Štafilić',
  'Kastel Lukšić',
  'Podstrana',
  'Stobrec',
  'Dugopolje',
  'Omiš',
];

// FORBIDDEN cities - DELETE EVERYTHING ELSE
const forbiddenCities = [
  'beograd',
  'belgrad',
  'zagreb',
  'zadar',
  'metkovic',
  'makarska',
  'brela',
  'baska voda',
  'sinj',
  'sibenik',
  'osijek',
  'rijeka',
  'pula',
  'pazin',
  'karlovac',
  'sisak',
  'vinkovci',
  'vukovar',
  'slavonski brod',
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
  'pag',
  'hvar',
  'brac',
  'vis',
  'stari grad',
  'jelsa',
  'bol',
  'supetar',
  'korcula',
  'dubrovnik',
  'cavtat',
  'peljesac',
  'lopud',
  'kolocep',
];

// Get all businesses
const allBusinesses = await db.select().from(businesses);
console.log(`📊 Total businesses in database: ${allBusinesses.length}\n`);

let toDelete: number[] = [];
let toKeep: typeof allBusinesses = [];
let deletedNames: string[] = [];

for (const business of allBusinesses) {
  const city = business.city?.toLowerCase().trim() || '';
  const address = business.address?.toLowerCase().trim() || '';
  const name = business.name?.toLowerCase().trim() || '';
  const description = business.description?.toLowerCase().trim() || '';
  const fullText = `${city} ${address} ${name} ${description}`;

  // Check if city is in allowed list
  const isAllowed = allowedCities.some(allowed => 
    city.includes(allowed.toLowerCase()) || 
    address.includes(allowed.toLowerCase())
  );

  // Check if contains forbidden keywords
  const isForbidden = forbiddenCities.some(forbidden => 
    fullText.includes(forbidden)
  );

  if (isForbidden || (!isAllowed && city && city !== '')) {
    // Delete if explicitly forbidden OR if city is not in allowed list
    toDelete.push(business.id);
    deletedNames.push(`${business.name} (${business.city || 'N/A'})`);
  } else if (isAllowed || !city || city === '') {
    // Keep if in allowed list or city is empty (might be Split)
    toKeep.push(business);
  } else {
    // Unknown city - delete to be safe
    toDelete.push(business.id);
    deletedNames.push(`${business.name} (${business.city || 'N/A'}) - UNKNOWN CITY`);
  }
}

console.log(`🗑️  Found ${toDelete.length} businesses to DELETE:\n`);

// Show all to delete
for (let i = 0; i < Math.min(100, deletedNames.length); i++) {
  console.log(`   ${i + 1}. ${deletedNames[i]}`);
}

if (deletedNames.length > 100) {
  console.log(`   ... and ${deletedNames.length - 100} more`);
}

// Delete the marked businesses
if (toDelete.length > 0) {
  console.log(`\n🗑️  DELETING ${toDelete.length} businesses from outside Trogir-Omiš region...`);
  await db.delete(businesses).where(inArray(businesses.id, toDelete));
  console.log(`✅ Successfully deleted ${toDelete.length} businesses`);
} else {
  console.log(`\n✅ No businesses to delete`);
}

// Verify remaining businesses
const remaining = await db.select().from(businesses);
console.log(`\n📊 FINAL SUMMARY:`);
console.log(`   Deleted: ${toDelete.length}`);
console.log(`   Remaining: ${remaining.length}`);
console.log(`\n✅ Location cleanup complete!`);

process.exit(0);
