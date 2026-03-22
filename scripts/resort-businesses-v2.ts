import { getDb } from '../server/db';
import { businesses, categories } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const db = await getDb();

// More precise category keywords with negative keywords to avoid misclassification
const categoryRules: Record<string, {
  keywords: string[];
  negativeKeywords?: string[];
  categorySlug: string;
}> = {
  'vulkanizeri': {
    keywords: ['vulkanizer', 'gume', 'auto gume', 'guma', 'tire', 'pneumatic', 'vulkanizacija'],
    negativeKeywords: ['servis', 'auto servis'],
    categorySlug: 'vulkanizeri'
  },
  'automehanicari': {
    keywords: ['automehani', 'auto servis', 'servis automobila', 'mehanika', 'auto popravka', 'autoservis'],
    negativeKeywords: ['vulkanizer', 'pranje', 'car wash', 'detailing'],
    categorySlug: 'automehanicari'
  },
  'vodoinstalateri': {
    keywords: ['vodoinstalater', 'vodoinst', 'voda', 'instalacija vode', 'kanalizacija', 'cjevovod', 'vodovod', 'sanitarni'],
    negativeKeywords: ['restoran', 'hotel', 'restoran'],
    categorySlug: 'vodoinstalateri'
  },
  'elektricari': {
    keywords: ['elektricar', 'elektri', 'struja', 'električne instalacije', 'elektro', 'autoelektrika'],
    negativeKeywords: ['auto servis', 'vulkanizer'],
    categorySlug: 'elektricari'
  },
  'ciscenje': {
    keywords: ['čišćenje', 'cisćenje', 'cleaning', 'čistač', 'usluga čišćenja', 'pranje rublja', 'laundry'],
    negativeKeywords: ['auto', 'car', 'automobil'],
    categorySlug: 'servisi-za-ciscenje'
  },
  'stolari': {
    keywords: ['stolar', 'drvo', 'namještaj', 'namjestaj', 'drvene konstrukcije', 'stolarija', 'stolarski'],
    negativeKeywords: [''],
    categorySlug: 'stolari'
  },
  'frizerski': {
    keywords: ['frizer', 'frizerski', 'salon', 'frizura', 'kosa', 'beauty', 'hair'],
    negativeKeywords: [''],
    categorySlug: 'frizerski-saloni'
  },
  'stomatolog': {
    keywords: ['stomatolog', 'zubar', 'zubni', 'stomatološka', 'zubna ordinacija', 'dental', 'dentalne medicine'],
    negativeKeywords: [''],
    categorySlug: 'stomatolozi'
  },
  'prijevoz': {
    keywords: ['prijevoz', 'selidba', 'transport', 'prevoz', 'taxi', 'vozač', 'guming', 'towing'],
    negativeKeywords: ['auto servis', 'vulkanizer'],
    categorySlug: 'prijevoz-i-selidbe'
  },
  'vrtlari': {
    keywords: ['vrtlar', 'vrt', 'uređenje vrta', 'biljke', 'vrtlarstvo', 'landscape', 'vrtlarstvo'],
    negativeKeywords: [''],
    categorySlug: 'vrtlari'
  },
  'krovopokrivaci': {
    keywords: ['krovopokriva', 'krov', 'krovni', 'pokrivanje krova', 'krovopokrivač', 'roofing'],
    negativeKeywords: [''],
    categorySlug: 'krovopokrivaci'
  },
  'zidari': {
    keywords: ['zidar', 'zidanje', 'cigla', 'gradnja', 'zidanje', 'mason'],
    negativeKeywords: [''],
    categorySlug: 'zidari'
  },
  'slikari': {
    keywords: ['slikar', 'slikanje', 'boja', 'farba', 'painting', 'bojanje', 'painter'],
    negativeKeywords: [''],
    categorySlug: 'slikari'
  },
  'klima': {
    keywords: ['klima', 'grijanje', 'hlađenje', 'klimatizacija', 'ac', 'air conditioning', 'heating', 'cooling'],
    negativeKeywords: [''],
    categorySlug: 'klima'
  },
  'prozori': {
    keywords: ['prozor', 'vrata', 'prozori i vrata', 'stolarija', 'pvc', 'aluminij', 'windows', 'doors'],
    negativeKeywords: [''],
    categorySlug: 'prozori'
  },
  'pranje_auta': {
    keywords: ['pranje', 'auto pranje', 'pranje automobila', 'car wash', 'detailing', 'autopraonica'],
    negativeKeywords: [''],
    categorySlug: 'pranje_auta'
  },
  'zdravstvo': {
    keywords: ['zdravstvo', 'doktor', 'liječnik', 'ordinacija', 'klinika', 'bolnica', 'medical', 'clinic'],
    negativeKeywords: ['dental', 'zubar', 'stomatolog'],
    categorySlug: 'zdravstvo'
  },
  'restorani': {
    keywords: ['restoran', 'hrana', 'jelo', 'kuhinja', 'restaurant', 'food', 'gostilnica'],
    negativeKeywords: ['hotel', 'apartman'],
    categorySlug: 'restorani'
  },
  'hoteli': {
    keywords: ['hotel', 'smještaj', 'apartman', 'hostel', 'accommodation', 'rooms'],
    negativeKeywords: [''],
    categorySlug: 'hoteli'
  }
};

console.log('🔄 Re-sorting businesses with improved logic...\n');

let movedCount = 0;
let totalChecked = 0;
let problemBusinesses: Array<{name: string; current: string; candidates: string[]}> = [];

// Get all businesses
const allBusinesses = await db.select().from(businesses);

for (const business of allBusinesses) {
  totalChecked++;
  const nameAndDesc = `${business.name} ${business.description || ''}`.toLowerCase();
  
  let bestMatch: { categorySlug: string; score: number } | null = null;
  let allMatches: Array<{categorySlug: string; score: number}> = [];
  
  // Find all matching categories
  for (const [key, rule] of Object.entries(categoryRules)) {
    let score = 0;
    
    // Count positive keyword matches
    for (const kw of rule.keywords) {
      if (nameAndDesc.includes(kw.toLowerCase())) {
        score += 1;
      }
    }
    
    // Penalize negative keyword matches
    if (rule.negativeKeywords) {
      for (const negKw of rule.negativeKeywords) {
        if (negKw && nameAndDesc.includes(negKw.toLowerCase())) {
          score -= 0.5;
        }
      }
    }
    
    if (score > 0) {
      allMatches.push({ categorySlug: rule.categorySlug, score });
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { categorySlug: rule.categorySlug, score };
      }
    }
  }
  
  // If we found a match and it's different from current category, update it
  if (bestMatch && bestMatch.score > 0.5) {
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
      console.log(`✓ ${business.name.substring(0, 45).padEnd(45)} → ${bestMatch.categorySlug}`);
    }
  } else if (allMatches.length > 1) {
    // If multiple matches with similar scores, flag as potential problem
    problemBusinesses.push({
      name: business.name,
      current: business.categoryId.toString(),
      candidates: allMatches.map(m => m.categorySlug)
    });
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Total businesses checked: ${totalChecked}`);
console.log(`   Businesses moved: ${movedCount}`);
console.log(`   Potential problems: ${problemBusinesses.length}`);

if (problemBusinesses.length > 0 && problemBusinesses.length <= 10) {
  console.log(`\n⚠️  Potential misclassifications (manual review recommended):`);
  for (const pb of problemBusinesses.slice(0, 10)) {
    console.log(`   - ${pb.name}: could be ${pb.candidates.join(', ')}`);
  }
}

console.log(`\n✅ Re-sorting complete!`);

process.exit(0);
