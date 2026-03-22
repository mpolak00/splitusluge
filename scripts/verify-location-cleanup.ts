import { getDb } from '../server/db';
import { businesses } from '../drizzle/schema';

const db = await getDb();

console.log('🔍 Verifying Location Cleanup - Trogir-Omiš Region Only\n');

// Allowed cities
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

// Forbidden keywords
const forbiddenKeywords = [
  'beograd', 'belgrad', 'zagreb', 'zadar', 'metkovic', 'makarska', 'brela', 
  'baska voda', 'sinj', 'sibenik', 'osijek', 'rijeka', 'pula', 'pazin', 
  'karlovac', 'sisak', 'vinkovci', 'vukovar', 'slavonski brod', 'bosna', 
  'sarajevo', 'mostar', 'zenica', 'tuzla', 'banja luka', 'bihac', 'konjic', 
  'travnik', 'gorazde', 'prijedor', 'gradiska', 'samac', 'derventa', 'jajce', 
  'livno', 'tomislavgrad', 'posusje', 'siroki brijeg', 'citluk', 'grude', 
  'neum', 'capljina', 'stolac', 'kalinovik', 'rogatica', 'sokolac', 'pale', 
  'trnovo', 'foca', 'cajnice', 'visegrad', 'srebrenica', 'zvornik', 'vlasenica', 
  'kladanj', 'osmaci', 'maglaj', 'doboj', 'bijeljina', 'lopare', 'ugljevik', 
  'vucja', 'pancevo', 'smederevo', 'pozarevac', 'jagodina', 'svetozarevo', 
  'nis', 'leskovac', 'vranje', 'pirot', 'krusevac', 'cacak', 'uzice', 
  'titovo uzice', 'valjevo', 'sabac', 'sremska mitrovica', 'zemun', 'vozdovac', 
  'cukarica', 'rakovica', 'palilula', 'podgorica', 'novi sad', 'pag', 'hvar', 
  'brac', 'vis', 'stari grad', 'jelsa', 'bol', 'supetar', 'korcula', 'dubrovnik', 
  'cavtat', 'peljesac', 'lopud', 'kolocep',
];

// Get all businesses
const allBusinesses = await db.select().from(businesses);

console.log(`📊 Total businesses: ${allBusinesses.length}\n`);

let violations: typeof allBusinesses = [];
let byCity: { [key: string]: number } = {};

for (const business of allBusinesses) {
  const city = business.city?.toLowerCase().trim() || '';
  const address = business.address?.toLowerCase().trim() || '';
  const name = business.name?.toLowerCase().trim() || '';
  const fullText = `${city} ${address} ${name}`;

  // Count by city
  if (city) {
    byCity[city] = (byCity[city] || 0) + 1;
  }

  // Check for violations
  const isForbidden = forbiddenKeywords.some(keyword => fullText.includes(keyword));
  
  if (isForbidden) {
    violations.push(business);
  }
}

console.log('📍 Businesses by City:');
const sortedCities = Object.entries(byCity).sort((a, b) => b[1] - a[1]);
for (const [city, count] of sortedCities) {
  console.log(`   ${city}: ${count}`);
}

console.log(`\n📊 Summary:`);
console.log(`   Total businesses: ${allBusinesses.length}`);
console.log(`   Violations found: ${violations.length}`);

if (violations.length > 0) {
  console.log(`\n❌ VIOLATIONS - Businesses outside allowed region:`);
  for (let i = 0; i < Math.min(20, violations.length); i++) {
    console.log(`   ${i + 1}. ${violations[i].name} (${violations[i].city || 'N/A'})`);
  }
  if (violations.length > 20) {
    console.log(`   ... and ${violations.length - 20} more`);
  }
} else {
  console.log(`\n✅ All businesses are from Trogir-Omiš region!`);
}

process.exit(violations.length > 0 ? 1 : 0);
