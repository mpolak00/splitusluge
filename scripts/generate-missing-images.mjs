import { getDb } from '../server/db.ts';
import { businesses } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

async function generateMissingImages() {
  const db = await getDb();
  if (!db) {
    console.log('Database not available');
    return;
  }

  const businessesWithoutImages = await db
    .select()
    .from(businesses)
    .where(eq(businesses.imageUrl, null));

  console.log(`Found ${businessesWithoutImages.length} businesses without images`);
  console.log('Generating placeholder images...');

  // Generate placeholder images for businesses without images
  // Using a simple placeholder service
  const placeholderBaseUrl = 'https://via.placeholder.com/400x300?text=';

  let updated = 0;
  for (const business of businessesWithoutImages) {
    try {
      // Create a simple placeholder URL with the business name
      const placeholderUrl = `${placeholderBaseUrl}${encodeURIComponent(business.name.substring(0, 20))}`;
      
      await db
        .update(businesses)
        .set({ imageUrl: placeholderUrl })
        .where(eq(businesses.id, business.id));
      
      updated++;
      if (updated % 50 === 0) {
        console.log(`Updated ${updated}/${businessesWithoutImages.length}`);
      }
    } catch (error) {
      console.error(`Error updating business ${business.id}:`, error);
    }
  }

  console.log(`✅ Updated ${updated} businesses with placeholder images`);
}

generateMissingImages().catch(console.error);
