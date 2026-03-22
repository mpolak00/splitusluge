import { getDb } from '../server/db.ts';
import { businesses, categories } from '../drizzle/schema.ts';
import { eq, isNull } from 'drizzle-orm';

// Random images for different service categories
const categoryImages = {
  'Vulkanizeri': [
    'https://images.unsplash.com/photo-1486262715619-3417ca6ef29f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1517420879113-f65c82d59a94?w=400&h=300&fit=crop',
  ],
  'Automehaničari': [
    'https://images.unsplash.com/photo-1487754180144-351b8e2b786d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1486262715619-3417ca6ef29f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop',
  ],
  'Vodoinstalateri': [
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
  ],
  'Elektičari': [
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
  ],
  'Frizerski saloni': [
    'https://images.unsplash.com/photo-1521746727202-7d1d4e2d7f7a?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1521746727202-7d1d4e2d7f7a?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1521746727202-7d1d4e2d7f7a?w=400&h=300&fit=crop',
  ],
  'Stomatolozi': [
    'https://images.unsplash.com/photo-1576091160550-112173e7d7cb?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-112173e7d7cb?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-112173e7d7cb?w=400&h=300&fit=crop',
  ],
  'Čišćenje': [
    'https://images.unsplash.com/photo-1563453392212-d0b604b1c622?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1563453392212-d0b604b1c622?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1563453392212-d0b604b1c622?w=400&h=300&fit=crop',
  ],
  'Zidari': [
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
  ],
  'Krovopokrivači': [
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
  ],
  'Klime': [
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
  ],
};

async function addRandomImages() {
  const db = await getDb();
  if (!db) {
    console.log('Database not available');
    return;
  }

  // Get all businesses without images
  const businessesWithoutImages = await db
    .select()
    .from(businesses)
    .where(isNull(businesses.imageUrl));

  console.log(`Found ${businessesWithoutImages.length} businesses without images`);

  // Get all categories
  const allCategories = await db.select().from(categories);
  const categoryMap = new Map();
  allCategories.forEach(cat => {
    categoryMap.set(cat.id, cat.name);
  });

  let updated = 0;
  for (const business of businessesWithoutImages) {
    try {
      const categoryName = categoryMap.get(business.categoryId) || 'Default';
      const images = categoryImages[categoryName] || categoryImages['Default'] || [
        'https://images.unsplash.com/photo-1486262715619-3417ca6ef29f?w=400&h=300&fit=crop'
      ];
      
      // Pick a random image from the category
      const randomImage = images[Math.floor(Math.random() * images.length)];
      
      await db
        .update(businesses)
        .set({ imageUrl: randomImage })
        .where(eq(businesses.id, business.id));
      
      updated++;
      if (updated % 50 === 0) {
        console.log(`Updated ${updated}/${businessesWithoutImages.length}`);
      }
    } catch (error) {
      console.error(`Error updating business ${business.id}:`, error);
    }
  }

  console.log(`✅ Updated ${updated} businesses with random images`);
}

addRandomImages().catch(console.error);
