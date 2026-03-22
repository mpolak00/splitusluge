import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { platformReviews } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const reviewsRouter = router({
  // Get all approved reviews with pagination
  getApproved: publicProcedure
    .input(
      z.object({
        limit: z.number().int().positive().max(100).default(10),
        offset: z.number().int().nonnegative().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const reviews = await db
        .select()
        .from(platformReviews)
        .where(eq(platformReviews.status, "approved"))
        .orderBy(desc(platformReviews.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return reviews;
    }),

  // Get review statistics
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const reviews = await db
      .select()
      .from(platformReviews)
      .where(eq(platformReviews.status, "approved"));

    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;

    reviews.forEach((review: any) => {
      totalRating += review.rating;
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });

    return {
      totalReviews: reviews.length,
      averageRating: (totalRating / reviews.length).toFixed(1),
      ratingDistribution,
    };
  }),

  // Submit a new review
  submit: publicProcedure
    .input(
      z.object({
        authorName: z.string().min(2).max(255),
        authorEmail: z.string().email().optional(),
        rating: z.number().int().min(1).max(5),
        title: z.string().min(5).max(255),
        content: z.string().min(10).max(2000),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const review = await db.insert(platformReviews).values({
        authorName: input.authorName,
        authorEmail: input.authorEmail || null,
        rating: input.rating,
        title: input.title,
        content: input.content,
        status: "pending", // Require moderation
      });

      return {
        success: true,
        message: "Hvala na vašem review-u! Bit će objavljen nakon provjere.",
      };
    }),

  // Mark review as helpful (for logged-in users only)
  markHelpful: publicProcedure
    .input(
      z.object({
        reviewId: z.number().int().positive(),
        helpful: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const review = await db
        .select()
        .from(platformReviews)
        .where(eq(platformReviews.id, input.reviewId));

      if (!review.length) {
        throw new Error("Review not found");
      }

      const currentReview = review[0] as any;
      const newHelpful = input.helpful
        ? currentReview.helpful + 1
        : currentReview.helpful;
      const newUnhelpful = !input.helpful
        ? currentReview.unhelpful + 1
        : currentReview.unhelpful;

      await db
        .update(platformReviews)
        .set({
          helpful: newHelpful,
          unhelpful: newUnhelpful,
        })
        .where(eq(platformReviews.id, input.reviewId));

      return { success: true };
    }),
});
