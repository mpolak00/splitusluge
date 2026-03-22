import { getDb } from '../server/db.ts';
import { businesses } from '../drizzle/schema.ts';

async function checkBusinesses() {
  const db = await getDb();
  if (!db) {
    console.log('Database not available');
    return;
  }

  const allBusinesses = await db.select().from(businesses);
  console.log('Total businesses in database:', allBusinesses.length);
  
  const withImages = allBusinesses.filter(b => b.imageUrl).length;
  const withoutImages = allBusinesses.filter(b => !b.imageUrl).length;
  
  console.log('With images:', withImages);
  console.log('Without images:', withoutImages);
  
  console.log('\nFirst 5 businesses:');
  allBusinesses.slice(0, 5).forEach(b => {
    console.log(`- ${b.name} (${b.address}) - Image: ${b.imageUrl ? 'YES' : 'NO'}`);
  });
}

checkBusinesses().catch(console.error);
