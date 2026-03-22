import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { categories } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const categoryImageMap = {
  'vulkanizeri': '/categories/vulkanizeri.jpg',
  'automehanicari': '/categories/automehanicari.jpg',
  'frizerski-saloni': '/categories/frizerski-saloni.jpg',
  'vodoinstalateri': '/categories/vodoinstalateri.jpg',
  'elektricari': '/categories/elektricari.jpg',
  'ciscenje': '/categories/ciscenje.jpg',
  'stolari': '/categories/stolari.jpg',
  'stomatolog': '/categories/stomatolog.jpg',
  'prijevoz-i-selidbe': '/categories/prijevoz.jpg',
  'vrtlari': '/categories/vrtlari.jpg',
  'krovopokrivaci': '/categories/krovopokrivaci.jpg',
  'zidari': '/categories/zidari.jpg',
  'slikari-i-dekoratori': '/categories/slikari.jpg',
  'klima-i-grijanje': '/categories/klima.jpg',
  'prozori-i-vrata': '/categories/prozori.jpg',
  'pranje-automobila': '/categories/pranje-auta.jpg',
  'zdravstvo': '/categories/zdravstvo.jpg',
  'restorani-i-kafici': '/categories/restorani.jpg',
  'hoteli-i-smještaj': '/categories/hoteli.jpg',
};

async function updateCategoryImages() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(conn);

  try {
    for (const [slug, imageUrl] of Object.entries(categoryImageMap)) {
      await db
        .update(categories)
        .set({ imageUrl })
        .where(eq(categories.slug, slug));
      console.log(`✓ Updated ${slug} with image: ${imageUrl}`);
    }
    console.log('\n✅ All category images updated successfully!');
  } catch (error) {
    console.error('Error updating category images:', error);
  } finally {
    await conn.end();
  }
}

updateCategoryImages();
