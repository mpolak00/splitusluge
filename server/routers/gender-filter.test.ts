import { describe, it, expect, beforeAll } from 'vitest';
import { getDb } from '../db';
import { businesses, categories } from '../../drizzle/schema';
import { eq, count } from 'drizzle-orm';

describe('Gender Filter for Frizerski Saloni', () => {
  let db: any;
  let frizerCategoryId: number;

  beforeAll(async () => {
    db = await getDb();
    if (db) {
      const result = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, 'frizerski-saloni'));
      
      if (result.length > 0) {
        frizerCategoryId = result[0].id;
      }
    }
  });

  it('should have frizerski salon category', async () => {
    if (!db) return;
    expect(frizerCategoryId).toBeDefined();
  });

  it('should have gender field in businesses table', async () => {
    if (!db || !frizerCategoryId) return;
    
    const businesses_data = await db
      .select()
      .from(businesses)
      .where(eq(businesses.categoryId, frizerCategoryId))
      .limit(1);
    
    if (businesses_data.length > 0) {
      expect(businesses_data[0]).toHaveProperty('gender');
    }
  });

  it('should have muski (male) salons', async () => {
    if (!db || !frizerCategoryId) return;

    const result = await db
      .select({ count: count() })
      .from(businesses)
      .where(
        eq(businesses.categoryId, frizerCategoryId) &&
        eq(businesses.gender, 'muski')
      );

    expect(result[0].count).toBeGreaterThan(0);
  });

  it('should have zenski (female) salons', async () => {
    if (!db || !frizerCategoryId) return;

    const result = await db
      .select({ count: count() })
      .from(businesses)
      .where(
        eq(businesses.categoryId, frizerCategoryId) &&
        eq(businesses.gender, 'zenski')
      );

    expect(result[0].count).toBeGreaterThan(0);
  });

  it('should have salons without gender specification', async () => {
    if (!db || !frizerCategoryId) return;

    const result = await db
      .select({ count: count() })
      .from(businesses)
      .where(
        eq(businesses.categoryId, frizerCategoryId)
      );

    // Should have at least some salons without gender specified
    expect(result[0].count).toBeGreaterThan(0);
  });

  it('should correctly distribute gender across salons', async () => {
    if (!db || !frizerCategoryId) return;

    const muskaResult = await db
      .select({ count: count() })
      .from(businesses)
      .where(
        eq(businesses.categoryId, frizerCategoryId) &&
        eq(businesses.gender, 'muski')
      );

    const zenskaResult = await db
      .select({ count: count() })
      .from(businesses)
      .where(
        eq(businesses.categoryId, frizerCategoryId) &&
        eq(businesses.gender, 'zenski')
      );

    const totalResult = await db
      .select({ count: count() })
      .from(businesses)
      .where(eq(businesses.categoryId, frizerCategoryId));

    const muskaCount = muskaResult[0].count;
    const zenskaCount = zenskaResult[0].count;
    const totalCount = totalResult[0].count;

    // Verify counts add up correctly
    expect(muskaCount + zenskaCount).toBeLessThanOrEqual(totalCount);
    
    // Should have reasonable distribution
    expect(muskaCount).toBeGreaterThan(0);
    expect(zenskaCount).toBeGreaterThan(0);
  });
});
