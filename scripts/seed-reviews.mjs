import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { platformReviews } from '../drizzle/schema.ts';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(conn);

console.log('🚀 Seeding 1000+ reviews...\n');

// Review templates for different ratings
const reviewTemplates = {
  5: [
    { title: 'Odličan servis!', content: 'Split Usluge je fantastična platforma. Brzo sam pronašao sve što mi je trebalo. Preporučujem svima!' },
    { title: 'Savršeno!', content: 'Najbolja stranica za pronalaženje lokalnih usluga u Splitu. Sve je jasno i jednostavno. Hvala!' },
    { title: 'Veoma zadovoljan', content: 'Pronašao sam odličnog vulkanizera kroz Split Usluge. Cijene su poštene i rad je kvalitetan.' },
    { title: 'Preporučujem!', content: 'Korištim Split Usluge redovito. Uvijek pronađem što trebam bez problema. Odličan izbor.' },
    { title: 'Genijalno!', content: 'Konačno jedna stranica gdje mogu pronaći sve lokalne usluge. Bravo Split Usluge!' },
    { title: 'Pravi hit!', content: 'Moji prijatelji su mi preporučili Split Usluge i sad je koristim svakodnevno. Super!' },
    { title: 'Odličan izbor usluga', content: 'Veoma sam zadovoljan s ponudom na Split Usluge. Sve što trebam je tu na jednom mjestu.' },
    { title: 'Najbolje što sam pronašao', content: 'Split Usluge je najbolja stranica za pronalaženje usluga. Preporučujem svima!' },
  ],
  4: [
    { title: 'Dobra stranica', content: 'Split Usluge je dobra, ali bi mogla biti malo bolja. Uglavnom sam zadovoljan.' },
    { title: 'Solidno', content: 'Pronašao sam što mi je trebalo, ali bi mogla biti malo više informacija o pružateljima.' },
    { title: 'Zadovoljan', content: 'Stranica je korisna, ali bi mogla imati bolji pregled cijena.' },
    { title: 'Dobro, ali...', content: 'Split Usluge je dobar početak, ali trebalo bi više detalja o svakom pružatelju.' },
    { title: 'Preporučujem s napomenom', content: 'Dobar izbor usluga, ali bi mogla biti malo brža stranica.' },
    { title: 'Koristan resurs', content: 'Korisna stranica, pronašao sam što trebam. Malo je sporija nego što bih očekivao.' },
  ],
  3: [
    { title: 'Prosječno', content: 'Split Usluge je OK, ali ima mjesta za poboljšanja. Nisu svi pružatelji dostupni.' },
    { title: 'Može biti bolje', content: 'Stranica je korisna, ali bi trebala više informacija o dostupnosti usluga.' },
    { title: 'Zadovoljan, ali...', content: 'Pronašao sam što trebam, ali je bilo teško pronaći prave kontakte.' },
    { title: 'Mješovito iskustvo', content: 'Neki pružatelji su odličnih, a neki nisu dostupni. Trebalo bi bolje ažuriranje.' },
    { title: 'Dovoljna', content: 'Split Usluge je dovoljna za osnovne potrebe, ali nedostaje detaljnije informacije.' },
  ],
  2: [
    { title: 'Razočaravajuće', content: 'Pronašao sam pružatelja, ali se nije javio. Trebalo bi bolje provjeravati dostupnost.' },
    { title: 'Problemi s dostupnošću', content: 'Mnogi pružatelji nisu dostupni ili se ne javljaju. Trebalo bi bolje ažuriranje podataka.' },
    { title: 'Nije onako kako se očekuje', content: 'Stranica ima potencijal, ali trebala bi bolja provjera pružatelja prije nego što se pojave.' },
    { title: 'Loša iskustva', content: 'Kontaktirao sam nekoliko pružatelja, ali se nisu javili. Razočaravajuće.' },
  ],
  1: [
    { title: 'Loša iskustva', content: 'Kontaktirao sam pružatelja, ali se nikad nije javio. Gubitak vremena.' },
    { title: 'Neće preporučiti', content: 'Većina pružatelja se ne javlja. Stranica nije korisna.' },
    { title: 'Razočaravajuće', content: 'Očekivao sam više. Pružatelji nisu dostupni ili se ne javljaju.' },
  ],
};

// Author names
const firstNames = ['Marko', 'Ana', 'Petar', 'Maja', 'Ivan', 'Jelena', 'Nikola', 'Katarina', 'Jovan', 'Mirjana', 'Dragan', 'Vesna', 'Aleksandar', 'Tamara', 'Goran'];
const lastNames = ['Horvat', 'Novak', 'Marić', 'Pavlović', 'Nikolić', 'Jovanović', 'Stanković', 'Mitrović', 'Đorđević', 'Ćirković', 'Bogdanović', 'Rajić', 'Kostić', 'Simić', 'Knežević'];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomDate() {
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  const now = new Date();
  
  const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime());
  return new Date(randomTime);
}

// Generate reviews
const reviews = [];
const ratingDistribution = [
  { rating: 5, count: 400 },
  { rating: 4, count: 350 },
  { rating: 3, count: 150 },
  { rating: 2, count: 80 },
  { rating: 1, count: 20 },
];

let totalReviews = 0;

for (const { rating, count } of ratingDistribution) {
  console.log(`📝 Generating ${count} ${rating}-star reviews...`);
  
  for (let i = 0; i < count; i++) {
    const template = getRandomElement(reviewTemplates[rating]);
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    
    reviews.push({
      authorName: `${firstName} ${lastName}`,
      authorEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      rating,
      title: template.title,
      content: template.content,
      verified: 1,
      status: 'approved',
      createdAt: generateRandomDate(),
    });
  }
}

console.log(`\n📊 Inserting ${reviews.length} reviews into database...\n`);

// Insert in batches
const batchSize = 100;
for (let i = 0; i < reviews.length; i += batchSize) {
  const batch = reviews.slice(i, i + batchSize);
  
  try {
    await db.insert(platformReviews).values(batch);
    console.log(`✓ Inserted ${Math.min(i + batchSize, reviews.length)}/${reviews.length} reviews`);
  } catch (error) {
    console.error(`✗ Error inserting batch: ${error.message}`);
  }
}

console.log(`\n✅ Successfully seeded ${reviews.length} reviews!`);
await conn.end();
