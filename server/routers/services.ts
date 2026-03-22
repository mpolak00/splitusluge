import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  getAllBusinesses,
  getAllCategories,
  getBusinessById,
  getBusinessesByCategory,
  getBusinessesByCity,
  getCategoryBySlug,
  searchBusinesses,
} from "../db";

export const servicesRouter = router({
  getAllCategories: publicProcedure.query(async () => {
    return await getAllCategories();
  }),

  getCategoryBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return await getCategoryBySlug(input.slug);
    }),

  getBusinessesByCategory: publicProcedure
    .input(z.object({ categoryId: z.number(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      return await getBusinessesByCategory(input.categoryId, input.limit);
    }),

  getBusinessesByCity: publicProcedure
    .input(z.object({ city: z.string(), limit: z.number().default(100) }))
    .query(async ({ input }) => {
      return await getBusinessesByCity(input.city, input.limit);
    }),

  searchBusinesses: publicProcedure
    .input(z.object({ query: z.string(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      return await searchBusinesses(input.query, input.limit);
    }),

  getBusinessById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getBusinessById(input.id);
    }),

  getAllBusinesses: publicProcedure
    .input(
      z.object({
        categoryId: z.number().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        return await getAllBusinesses({
          categoryId: input.categoryId,
          limit: input.limit,
          offset: input.offset,
        });
      } catch (error) {
        console.error("Error fetching businesses:", error);
        return [];
      }
    }),
});
