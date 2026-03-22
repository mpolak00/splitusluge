import { getDb } from '../server/db';
import { businesses } from '../drizzle/schema';
import { inArray } from 'drizzle-orm';

const db = await getDb();

console.log('🗺️  Analyzing business locations...\n');

// Allowed cities and neighborhoods
const allowedLocations = [
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
];

// Cities/regions to remove
const forbiddenPatterns = [
  /beograd/i,
  /belgrad/i,
  /zagreb/i,
  /zadar/i,
  /metkovic/i,
  /makarska/i,
  /sinj/i,
  /sibenik/i,
  /trogir/i, // Only if not in allowed list
  /bosna/i,
  /sarajevo/i,
  /mostar/i,
  /zenica/i,
  /tuzla/i,
  /banja luka/i,
  /bihac/i,
  /konjic/i,
  /travnik/i,
  /gorazde/i,
  /prijedor/i,
  /gradiska/i,
  /samac/i,
  /derventa/i,
  /jajce/i,
  /livno/i,
  /tomislavgrad/i,
  /posusje/i,
  /siroki brijeg/i,
  /citluk/i,
  /grude/i,
  /neum/i,
  /capljina/i,
  /stolac/i,
  /konjic/i,
  /kalinovik/i,
  /rogatica/i,
  /sokolac/i,
  /pale/i,
  /trnovo/i,
  /foca/i,
  /cajnice/i,
  /visegrad/i,
  /srebrenica/i,
  /zvornik/i,
  /vlasenica/i,
  /kladanj/i,
  /osmaci/i,
  /maglaj/i,
  /doboj/i,
  /bijeljina/i,
  /lopare/i,
  /ugljevik/i,
  /vucja/i,
  /pancevo/i,
  /smederevo/i,
  /pozarevac/i,
  /jagodina/i,
  /svetozarevo/i,
  /nis/i,
  /leskovac/i,
  /vranje/i,
  /pirot/i,
  /krusevac/i,
  /cacak/i,
  /uzice/i,
  /titovo uzice/i,
  /valjevo/i,
  /sabac/i,
  /sremska mitrovica/i,
  /zemun/i,
  /vozdovac/i,
  /cukarica/i,
  /rakovica/i,
  /vozdovac/i,
  /palilula/i,
  /vozdovac/i,
];

// Get all businesses
const allBusinesses = await db.select().from(businesses);

console.log(`📊 Total businesses: ${allBusinesses.length}\n`);

// Categorize businesses
let toDelete: number[] = [];
let toKeep: typeof allBusinesses = [];
let suspicious: typeof allBusinesses = [];

for (const business of allBusinesses) {
  const city = business.city?.toLowerCase() || '';
  const address = business.address?.toLowerCase() || '';
  const name = business.name?.toLowerCase() || '';
  const fullText = `${city} ${address} ${name}`;

  // Check if it matches forbidden patterns
  let isForbidden = false;
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(fullText)) {
      isForbidden = true;
      break;
    }
  }

  if (isForbidden) {
    toDelete.push(business.id);
    console.log(`🗑️  DELETE: ${business.name} (${business.city})`);
  } else if (allowedLocations.some(loc => city.includes(loc.toLowerCase()) || address.includes(loc.toLowerCase()))) {
    toKeep.push(business);
  } else {
    // Suspicious - might be outside allowed area
    suspicious.push(business);
    console.log(`⚠️  SUSPICIOUS: ${business.name} (${business.city})`);
  }
}

console.log(`\n📊 Analysis Results:`);
console.log(`   To Delete: ${toDelete.length}`);
console.log(`   To Keep: ${toKeep.length}`);
console.log(`   Suspicious (needs review): ${suspicious.length}`);

if (suspicious.length > 0 && suspicious.length <= 20) {
  console.log(`\n⚠️  Suspicious businesses (might be outside allowed area):`);
  for (const business of suspicious.slice(0, 20)) {
    console.log(`   - ${business.name} (${business.city})`);
  }
}

// Delete the marked businesses
if (toDelete.length > 0) {
  console.log(`\n🗑️  Deleting ${toDelete.length} businesses from outside Split region...`);
  await db.delete(businesses).where(inArray(businesses.id, toDelete));
  console.log(`✅ Deleted ${toDelete.length} businesses`);
} else {
  console.log(`\n✅ No businesses to delete`);
}

console.log(`\n📊 Final Summary:`);
console.log(`   Remaining businesses: ${toKeep.length + suspicious.length}`);
console.log(`   Deleted: ${toDelete.length}`);

process.exit(0);
