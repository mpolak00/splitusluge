import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb } from '../db';
import { platformReviews } from '../../drizzle/schema';
import { eq, count } from 'drizzle-orm';

describe('Reviews Router', () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
  });

  it('should have 1000+ reviews in database', async () => {
    if (!db) {
      console.log('Database not available, skipping test');
      return;
    }

    const result = await db.select({ count: count() }).from(platformReviews);
    expect(result[0].count).toBeGreaterThanOrEqual(1000);
  });

  it('should have correct rating distribution', async () => {
    if (!db) return;

    const reviews = await db.select().from(platformReviews);
    
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review: any) => {
      distribution[review.rating]++;
    });

    // Verify we have reviews for each rating
    expect(distribution[5]).toBeGreaterThan(0); // 5-star
    expect(distribution[4]).toBeGreaterThan(0); // 4-star
    expect(distribution[3]).toBeGreaterThan(0); // 3-star
    expect(distribution[2]).toBeGreaterThan(0); // 2-star
    expect(distribution[1]).toBeGreaterThan(0); // 1-star
  });

  it('should have all reviews approved', async () => {
    if (!db) return;

    const reviews = await db.select().from(platformReviews);
    const allApproved = reviews.every((review: any) => review.status === 'approved');
    expect(allApproved).toBe(true);
  });

  it('should have verified reviews', async () => {
    if (!db) return;

    const reviews = await db.select().from(platformReviews);
    const hasVerified = reviews.some((review: any) => review.verified === 1);
    expect(hasVerified).toBe(true);
  });

  it('should have author names and content', async () => {
    if (!db) return;

    const reviews = await db.select().from(platformReviews);
    
    reviews.forEach((review: any) => {
      expect(review.authorName).toBeTruthy();
      expect(review.title).toBeTruthy();
      expect(review.content).toBeTruthy();
      expect(review.rating).toBeGreaterThanOrEqual(1);
      expect(review.rating).toBeLessThanOrEqual(5);
    });
  });
});
