import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc.js";
import { getDb } from "../db.js";
import { businesses } from "../../drizzle/schema.js";
import { notifyOwner } from "../_core/notification.js";
import { eq } from "drizzle-orm";

export const businessesRouter = router({
  registerBusiness: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Naziv je obavezan"),
        email: z.string().email("Validan email je obavezan"),
        phone: z.string().min(1, "Telefon je obavezan"),
        category: z.string().min(1, "Kategorija je obavezna"),
        address: z.string().optional(),
        website: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        // Create a pending business entry
        const result = await db.insert(businesses).values({
          googlePlaceId: `pending-${Date.now()}-${Math.random()}`,
          categoryId: parseInt(input.category),
          name: input.name,
          description: input.description || "",
          address: input.address || "",
          phone: input.phone,
          website: input.website || null,
          latitude: "0",
          longitude: "0",
          imageUrl: null,
          rating: null,
          reviewCount: 0,
          openingHours: null,
          city: "Split",
          neighborhood: null,
          isActive: 0, // Pending approval
        });

        // Notify owner about new registration
        try {
          await notifyOwner({
            title: "Nova prijava obrta",
            content: `${input.name} (${input.email}) se registrirao kao ${input.category}. Telefon: ${input.phone}`,
          });
        } catch (notifyError) {
          console.error("Error notifying owner:", notifyError);
        }

        return {
          success: true,
          message: "Hvala na prijavi! Kontaktirat ćemo vas uskoro.",
        };
      } catch (error) {
        console.error("Error registering business:", error);
        throw new Error("Greška pri registraciji obrta");
      }
    }),

  getPendingBusinesses: publicProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) return [];

      const pending = await db
        .select()
        .from(businesses)
        .where(eq(businesses.isActive, 0));

      return pending;
    } catch (error) {
      console.error("Error fetching pending businesses:", error);
      return [];
    }
  }),
});
