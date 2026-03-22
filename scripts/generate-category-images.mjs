import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { categories } from '../drizzle/schema.ts';
import { invokeLLM } from '../server/_core/llm.ts';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(conn);

// Get all categories
const allCategories = await db.select().from(categories);

console.log(`Found ${allCategories.length} categories. Generating images...`);

const categoryPrompts = {
  'vulkanizeri': 'Professional tire shop with colorful stacked tires, modern garage setting, Mediterranean architecture, sunny day, professional lighting',
  'automehaničari': 'Modern auto repair shop with cars on lifts, professional mechanics working, tools organized on walls, clean garage, Mediterranean style',
  'frizerski-saloni': 'Elegant hair salon with modern styling chairs, mirrors with lights, professional hairstylist working, Mediterranean coastal aesthetic, warm lighting',
  'vodoinstalateri': 'Professional plumber working on pipes, modern bathroom fixtures displayed, tools and equipment organized, Mediterranean tile work, professional setting',
  'električari': 'Electrician working on electrical panel, modern electrical equipment, organized tools, professional workspace, Mediterranean architecture',
  'čišćenje': 'Professional cleaning service team with modern equipment, bright clean spaces, organized supplies, Mediterranean coastal home, sunny day',
  'stolari': 'Carpenter workshop with wooden furniture, tools, sawdust, Mediterranean wooden doors and windows, professional craftsmanship',
  'stomatolog': 'Modern dental office with professional equipment, clean bright space, Mediterranean design, professional dentist at work',
  'prijevoz-i-selidbe': 'Moving truck loaded with furniture, professional movers, Mediterranean street scene, organized logistics',
  'vrtlari': 'Beautiful Mediterranean garden with olive trees, colorful flowers, professional landscaper working, sunny day, stone walls',
  'krovopokrivači': 'Roofer working on Mediterranean tile roof, traditional architecture, sunny day, professional tools, coastal town background',
  'zidari': 'Bricklayer working on stone wall, Mediterranean architecture, traditional building materials, professional craftsmanship',
  'slikari-i-dekoratori': 'Painter working on Mediterranean-style walls, color palette, professional equipment, beautiful interior design',
  'klima-i-grijanje': 'HVAC technician installing air conditioning unit, modern equipment, professional workspace, Mediterranean home',
  'prozori-i-vrata': 'Display of Mediterranean-style wooden doors and windows, professional installation, traditional craftsmanship',
  'pranje-automobila': 'Professional car wash with gleaming clean vehicles, modern equipment, Mediterranean setting, sunny day',
  'zdravstvo': 'Modern pharmacy or health clinic, professional staff, organized medicines and supplies, Mediterranean design',
  'restorani-i-kafici': 'Cozy Mediterranean restaurant or café with outdoor seating, traditional food, sunny day, stone architecture',
  'hoteli-i-smještaj': 'Beautiful Mediterranean hotel or guesthouse with sea view, traditional architecture, welcoming entrance, sunny day'
};

for (const category of allCategories) {
  const slug = category.slug || '';
  const prompt = categoryPrompts[slug] || `Professional ${category.name} service in Mediterranean style, sunny day, professional setting`;
  
  try {
    console.log(`\nGenerating image for: ${category.name}`);
    
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: 'You are an image generation expert. Generate a professional, high-quality image based on the description provided.'
        },
        {
          role: 'user',
          content: `Generate a professional image for a service category. Description: ${prompt}`
        }
      ]
    });
    
    console.log(`✓ Image generation initiated for: ${category.name}`);
  } catch (error) {
    console.error(`✗ Error generating image for ${category.name}:`, error.message);
  }
}

await conn.end();
console.log('\n✅ Image generation process complete!');
