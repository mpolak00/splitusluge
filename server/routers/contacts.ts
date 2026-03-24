import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc.js";
import { getDb } from "../db.js";
import { contactSubmissions } from "../../drizzle/schema.js";
import { notifyOwner } from "../_core/notification.js";

export const contactsRouter = router({
  submitPromoInterest: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Ime je obavezno").max(255),
        email: z.string().email("Validan email je obavezan").max(320),
        phone: z.string().max(50).optional().or(z.literal("")),
        businessName: z.string().max(255).optional().or(z.literal("")),
        planInterest: z.enum(["standard", "premium", ""]).optional(),
        message: z.string().max(2000).optional().or(z.literal("")),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (db) {
          await db.insert(contactSubmissions).values({
            type: "promo_interest",
            name: input.name,
            email: input.email,
            phone: input.phone || null,
            businessName: input.businessName || null,
            planInterest: input.planInterest || null,
            message: input.message || null,
          });
        }

        try {
          await notifyOwner({
            title: "Novi upit za promociju",
            content: `${input.name} (${input.email}) je zainteresiran za ${input.planInterest || "promociju"}. Biznis: ${input.businessName || "N/A"}. Telefon: ${input.phone || "N/A"}. Poruka: ${input.message || "N/A"}`,
          });
        } catch (e) {
          console.error("Error notifying owner:", e);
        }

        return { success: true, message: "Hvala na upitu! Javit ćemo vam se unutar 24 sata." };
      } catch (error) {
        console.error("Error submitting promo interest:", error);
        throw new Error("Greška pri slanju upita. Pokušajte ponovo.");
      }
    }),

  submitNewsletter: publicProcedure
    .input(
      z.object({
        email: z.string().email("Validan email je obavezan").max(320),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (db) {
          await db.insert(contactSubmissions).values({
            type: "newsletter",
            email: input.email,
          });
        }

        try {
          await notifyOwner({
            title: "Nova prijava na newsletter",
            content: `Email: ${input.email}`,
          });
        } catch (e) {
          console.error("Error notifying owner:", e);
        }

        return { success: true };
      } catch (error) {
        console.error("Error submitting newsletter:", error);
        throw new Error("Greška pri prijavi. Pokušajte ponovo.");
      }
    }),
});
