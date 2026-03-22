import { invokeLLM } from '../server/_core/llm.ts';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { platformReviews } from '../drizzle/schema.ts';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(conn);

console.log('🚀 Generating 1000+ reviews for Split Usluge...\n');

// Generate reviews in batches
const reviewPrompts = [
  {
    rating: 5,
    count: 400,
    description: 'Very positive reviews about the platform'
  },
  {
    rating: 4,
    count: 350,
    description: 'Positive reviews with minor suggestions'
  },
  {
    rating: 3,
    count: 150,
    description: 'Mixed reviews with some concerns'
  },
  {
    rating: 2,
    count: 80,
    description: 'Negative reviews about specific issues'
  },
  {
    rating: 1,
    count: 20,
    description: 'Very negative reviews'
  }
];

let totalAdded = 0;

for (const batch of reviewPrompts) {
  console.log(`\n📝 Generating ${batch.count} ${batch.rating}-star reviews...`);

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `You are generating realistic customer reviews for Split Usluge - a local business directory platform in Split, Croatia.
Generate ${batch.count} unique, realistic reviews in Croatian language about the platform itself (not individual businesses).
Each review should be authentic and varied.

${batch.description}

For ${batch.rating}-star reviews, include:
- Positive aspects when rating is 4-5 stars
- Constructive criticism when rating is 2-3 stars
- Specific complaints when rating is 1 star

Return ONLY a valid JSON array with this structure for each review:
{
  "authorName": "First Last Name",
  "authorEmail": "email@example.com",
  "rating": ${batch.rating},
  "title": "Short review title",
  "content": "Longer review content (2-3 sentences)",
  "verified": 1
}

Generate exactly ${batch.count} reviews. Return ONLY valid JSON array, no other text.`
        },
        {
          role: 'user',
          content: `Generate ${batch.count} realistic ${batch.rating}-star reviews about Split Usluge platform. Return ONLY JSON array.`
        }
      ]
    });

    const content = response.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    
    if (!jsonMatch) {
      console.log(`⚠️  No JSON found for ${batch.rating}-star batch`);
      continue;
    }

    const reviews = JSON.parse(jsonMatch[0]);
    console.log(`✓ Parsed ${reviews.length} reviews`);

    // Generate dates from 2 years ago to now
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const now = new Date();

    let addedCount = 0;
    for (let i = 0; i < reviews.length; i++) {
      try {
        const review = reviews[i];
        
        // Random date between 2 years ago and now
        const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime());
        const createdAt = new Date(randomTime);

        await db.insert(platformReviews).values({
          authorName: review.authorName || 'Anonymous',
          authorEmail: review.authorEmail || null,
          rating: batch.rating,
          title: review.title || `${batch.rating} star review`,
          content: review.content || 'Great platform!',
          verified: 1,
          status: 'approved',
          createdAt,
        });

        addedCount++;
        if ((i + 1) % 100 === 0) {
          console.log(`  ✓ Added ${i + 1}/${reviews.length} reviews`);
        }
      } catch (error) {
        console.log(`  ✗ Error adding review: ${error.message}`);
      }
    }

    console.log(`✅ Added ${addedCount} ${batch.rating}-star reviews`);
    totalAdded += addedCount;

  } catch (error) {
    console.error(`✗ Error generating ${batch.rating}-star batch:`, error.message);
  }
}

console.log(`\n✅ Total reviews added: ${totalAdded}`);
await conn.end();
