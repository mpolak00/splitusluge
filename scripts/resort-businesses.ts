import { getDb } from '../server/db';
import { businesses, categories } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const db = await getDb();

// Define category keywords for intelligent re-sorting
const categoryKeywords: Record<string, { keywords: string[], categorySlug: string }> = {
  'vulkanizeri': {
    keywords: ['vulkanizer', 'gume', 'auto gume', 'guma', 'tire'],
    categorySlug: 'vulkanizeri'
  },
  'automehanicari': {
    keywords: ['automehani', 'auto servis', 'servis automobila', 'mehanika', 'auto popravka'],
    categorySlug: 'automehanicari'
  },
  'vodoinstalateri': {
    keywords: ['vodoinstalater', 'vodoinst', 'voda', 'instalacija vode', 'kanalizacija', 'cjevovod'],
    categorySlug: 'vodoinstalateri'
  },
  'elektricari': {
    keywords: ['elektricar', 'elektri', 'struja', 'električne instalacije', 'elektro'],
    categorySlug: 'elektricari'
  },
  'ciscenje': {
    keywords: ['čišćenje', 'cisćenje', 'cleaning', 'čistač', 'usluga čišćenja', 'pranje'],
    categorySlug: 'servisi-za-ciscenje'
  },
  'stolari': {
    keywords: ['stolar', 'drvo', 'namještaj', 'namjestaj', 'drvene konstrukcije', 'stolarija'],
    categorySlug: 'stolari'
  },
  'frizerski': {
    keywords: ['frizer', 'frizerski', 'salon', 'frizura', 'kosa', 'beauty'],
    categorySlug: 'frizerski-saloni'
  },
  'stomatolog': {
    keywords: ['stomatolog', 'zubar', 'zubni', 'stomatološka', 'zubna ordinacija'],
    categorySlug: 'stomatolozi'
  },
  'prijevoz': {
    keywords: ['prijevoz', 'selidba', 'transport', 'prevoz', 'taxi', 'vozač'],
    categorySlug: 'prijevoz-i-selidbe'
  },
  'vrtlari': {
    keywords: ['vrtlar', 'vrt', 'uređenje vrta', 'biljke', 'vrtlarstvo', 'landscape'],
    categorySlug: 'vrtlari'
  },
  'krovopokrivaci': {
    keywords: ['krovopokriva', 'krov', 'krovni', 'pokrivanje krova', 'krovopokrivač'],
    categorySlug: 'krovopokrivaci'
  },
  'zidari': {
    keywords: ['zidar', 'zidanje', 'cigla', 'gradnja', 'zidanje'],
    categorySlug: 'zidari'
  },
  'slikari': {
    keywords: ['slikar', 'slikanje', 'boja', 'farba', 'painting', 'bojanje'],
    categorySlug: 'slikari'
  },
  'klima': {
    keywords: ['klima', 'grijanje', 'hlađenje', 'klimatizacija', 'ac', 'air conditioning'],
    categorySlug: 'klima'
  },
  'prozori': {
    keywords: ['prozor', 'vrata', 'prozori i vrata', 'stolarija', 'pvc', 'aluminij'],
    categorySlug: 'prozori'
  },
  'pranje_auta': {
    keywords: ['pranje', 'auto pranje', 'pranje automobila', 'car wash', 'detailing'],
    categorySlug: 'pranje_auta'
  },
  'zdravstvo': {
    keywords: ['zdravstvo', 'doktor', 'liječnik', 'ordinacija', 'klinika', 'bolnica'],
    categorySlug: 'zdravstvo'
  },
  'restorani': {
    keywords: ['restoran', 'restoran', 'hrana', 'jelo', 'kuhinja', 'restoran'],
    categorySlug: 'restorani'
  },
  'hoteli': {
    keywords: ['hotel', 'smještaj', 'apartman', 'hostel', 'gostilnica'],
    categorySlug: 'hoteli'
  }
};

console.log('🔄 Re-sorting businesses by category...\n');

let movedCount = 0;
let totalChecked = 0;

// Get all businesses
const allBusinesses = await db.select().from(businesses);

for (const business of allBusinesses) {
  totalChecked++;
  const nameAndDesc = `${business.name} ${business.description || ''}`.toLowerCase();
  
  let bestMatch: { categorySlug: string; matchCount: number } | null = null;
  
  // Find best matching category
  for (const [key, data] of Object.entries(categoryKeywords)) {
    const matchCount = data.keywords.filter(kw => nameAndDesc.includes(kw.toLowerCase())).length;
    
    if (matchCount > 0) {
      if (!bestMatch || matchCount > bestMatch.matchCount) {
        bestMatch = { categorySlug: data.categorySlug, matchCount };
      }
    }
  }
  
  // If we found a match and it's different from current category, update it
  if (bestMatch) {
    const targetCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, bestMatch.categorySlug));
    
    if (targetCategory.length > 0 && targetCategory[0].id !== business.categoryId) {
      await db
        .update(businesses)
        .set({ categoryId: targetCategory[0].id })
        .where(eq(businesses.id, business.id));
      
      movedCount++;
      console.log(`✓ ${business.name.substring(0, 40).padEnd(40)} → ${bestMatch.categorySlug}`);
    }
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Total businesses checked: ${totalChecked}`);
console.log(`   Businesses moved: ${movedCount}`);
console.log(`\n✅ Re-sorting complete!`);

process.exit(0);
