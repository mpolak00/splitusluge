import { describe, it, expect } from 'vitest';

/**
 * Weighted sorting algorithm: 70% reviews, 30% rating
 * Normalized reviews: reviewCount / 500 (capped at 1)
 * Normalized rating: rating / 5
 * Score = (normalizedReviews * 0.7) + (normalizedRating * 0.3)
 */

const calculateWeightedScore = (business: { reviewCount?: number; rating?: string }) => {
  const reviewCount = business.reviewCount || 0;
  const rating = business.rating ? parseFloat(business.rating) : 0;
  const maxReviews = 500;
  const normalizedReviews = Math.min(reviewCount / maxReviews, 1);
  const normalizedRating = rating / 5;
  return (normalizedReviews * 0.7) + (normalizedRating * 0.3);
};

describe('Weighted Sorting Algorithm (70% reviews, 30% rating)', () => {
  it('should prioritize businesses with many reviews over high rating', () => {
    const businessA = { reviewCount: 400, rating: '3.0' }; // 400 reviews, 3.0 rating
    const businessB = { reviewCount: 50, rating: '5.0' }; // 50 reviews, 5.0 rating

    const scoreA = calculateWeightedScore(businessA);
    const scoreB = calculateWeightedScore(businessB);

    // businessA: (400/500 * 0.7) + (3/5 * 0.3) = 0.56 + 0.18 = 0.74
    // businessB: (50/500 * 0.7) + (5/5 * 0.3) = 0.07 + 0.3 = 0.37
    expect(scoreA).toBeGreaterThan(scoreB);
  });

  it('should handle missing review count', () => {
    const businessA = { rating: '4.5' }; // No reviews
    const businessB = { reviewCount: 100, rating: '3.0' };

    const scoreA = calculateWeightedScore(businessA);
    const scoreB = calculateWeightedScore(businessB);

    // businessA: (0 * 0.7) + (4.5/5 * 0.3) = 0 + 0.27 = 0.27
    // businessB: (100/500 * 0.7) + (3/5 * 0.3) = 0.14 + 0.18 = 0.32
    expect(scoreB).toBeGreaterThan(scoreA);
  });

  it('should handle missing rating', () => {
    const businessA = { reviewCount: 200 }; // No rating
    const businessB = { reviewCount: 100, rating: '5.0' };

    const scoreA = calculateWeightedScore(businessA);
    const scoreB = calculateWeightedScore(businessB);

    // businessA: (200/500 * 0.7) + (0/5 * 0.3) = 0.28 + 0 = 0.28
    // businessB: (100/500 * 0.7) + (5/5 * 0.3) = 0.14 + 0.3 = 0.44
    expect(scoreB).toBeGreaterThan(scoreA);
  });

  it('should cap normalized reviews at 1.0', () => {
    const businessA = { reviewCount: 500, rating: '4.0' }; // Exactly 500 reviews
    const businessB = { reviewCount: 1000, rating: '4.0' }; // More than 500 reviews

    const scoreA = calculateWeightedScore(businessA);
    const scoreB = calculateWeightedScore(businessB);

    // Both should have same score since reviews are capped at 500
    // businessA: (500/500 * 0.7) + (4/5 * 0.3) = 0.7 + 0.24 = 0.94
    // businessB: (1000/500 capped at 1 * 0.7) + (4/5 * 0.3) = 0.7 + 0.24 = 0.94
    expect(scoreA).toBeCloseTo(scoreB, 2);
  });

  it('should sort multiple businesses correctly', () => {
    const businesses = [
      { name: 'A', reviewCount: 50, rating: '5.0' },
      { name: 'B', reviewCount: 300, rating: '3.0' },
      { name: 'C', reviewCount: 100, rating: '4.5' },
      { name: 'D', reviewCount: 200, rating: '4.0' },
    ];

    const sorted = [...businesses].sort((a: any, b: any) => {
      const scoreA = calculateWeightedScore(a);
      const scoreB = calculateWeightedScore(b);
      return scoreB - scoreA;
    });

    // Expected order by score:
    // B: (300/500 * 0.7) + (3/5 * 0.3) = 0.42 + 0.18 = 0.60
    // D: (200/500 * 0.7) + (4/5 * 0.3) = 0.28 + 0.24 = 0.52
    // C: (100/500 * 0.7) + (4.5/5 * 0.3) = 0.14 + 0.27 = 0.41
    // A: (50/500 * 0.7) + (5/5 * 0.3) = 0.07 + 0.3 = 0.37

    expect(sorted[0].name).toBe('B');
    expect(sorted[1].name).toBe('D');
    expect(sorted[2].name).toBe('C');
    expect(sorted[3].name).toBe('A');
  });

  it('should handle zero reviews and zero rating', () => {
    const business = { reviewCount: 0, rating: '0' };
    const score = calculateWeightedScore(business);
    expect(score).toBe(0);
  });
});
