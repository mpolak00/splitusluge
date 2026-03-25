import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc.js";
import { getDb } from "../db.js";
import { pageViews, clickEvents, searchQueries } from "../../drizzle/schema.js";

export const analyticsRouter = router({
  trackPageView: publicProcedure
    .input(z.object({
      path: z.string(),
      categorySlug: z.string().optional(),
      businessId: z.number().optional(),
      referrer: z.string().optional(),
      language: z.string().optional(),
      sessionId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const userAgent = ctx.req?.headers?.["user-agent"]?.toString() || null;
      const ip = ctx.req?.headers?.["x-forwarded-for"]?.toString()?.split(",")[0] || ctx.req?.ip || null;
      const language = input.language || ctx.req?.headers?.["accept-language"]?.toString()?.split(",")[0] || null;

      try {
        await db.insert(pageViews).values({
          path: input.path,
          categorySlug: input.categorySlug || null,
          businessId: input.businessId || null,
          referrer: input.referrer || null,
          userAgent: userAgent ? userAgent.substring(0, 500) : null,
          ip,
          language,
          sessionId: input.sessionId || null,
        });
      } catch {
        // Don't fail the request if analytics fails
      }

      return { success: true };
    }),

  trackClick: publicProcedure
    .input(z.object({
      eventType: z.string(),
      businessId: z.number().optional(),
      businessName: z.string().optional(),
      categorySlug: z.string().optional(),
      sessionId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const ip = ctx.req?.headers?.["x-forwarded-for"]?.toString()?.split(",")[0] || ctx.req?.ip || null;

      try {
        await db.insert(clickEvents).values({
          eventType: input.eventType,
          businessId: input.businessId || null,
          businessName: input.businessName || null,
          categorySlug: input.categorySlug || null,
          sessionId: input.sessionId || null,
          ip,
        });
      } catch {
        // Don't fail the request if analytics fails
      }

      return { success: true };
    }),

  trackSearch: publicProcedure
    .input(z.object({
      query: z.string(),
      resultsCount: z.number().optional(),
      categorySlug: z.string().optional(),
      sessionId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const ip = ctx.req?.headers?.["x-forwarded-for"]?.toString()?.split(",")[0] || ctx.req?.ip || null;

      try {
        await db.insert(searchQueries).values({
          query: input.query,
          resultsCount: input.resultsCount || 0,
          categorySlug: input.categorySlug || null,
          sessionId: input.sessionId || null,
          ip,
        });
      } catch {
        // Don't fail the request if analytics fails
      }

      return { success: true };
    }),
});
