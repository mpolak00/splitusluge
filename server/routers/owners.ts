import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc.js";
import { getDb } from "../db.js";
import { businesses, businessOwners, categories, voiceAgentSubs } from "../../drizzle/schema.js";
import { eq, and, desc } from "drizzle-orm";
import crypto from "crypto";

const OWNER_EMAIL = "kondor1413@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "white1413";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export const ownersRouter = router({
  // Claim a business - register as owner
  claimBusiness: publicProcedure
    .input(z.object({
      businessId: z.number(),
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(1),
      phone: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check business exists
      const [business] = await db.select().from(businesses).where(eq(businesses.id, input.businessId));
      if (!business) throw new Error("Djelatnost nije pronađena");

      // Check if already claimed
      const [existing] = await db.select().from(businessOwners).where(eq(businessOwners.businessId, input.businessId));
      if (existing) throw new Error("Ova djelatnost je već preuzeta. Kontaktirajte nas na kondor1413@gmail.com");

      const verificationToken = generateToken();

      await db.insert(businessOwners).values({
        businessId: input.businessId,
        email: input.email,
        passwordHash: hashPassword(input.password),
        name: input.name,
        phone: input.phone || null,
        verificationToken,
        isVerified: 0,
      });

      return {
        success: true,
        message: "Zahtjev za preuzimanje djelatnosti je poslan! Potvrditi ćemo Vašu djelatnost putem emaila u roku od 24 sata.",
      };
    }),

  // Login as business owner
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [owner] = await db.select().from(businessOwners)
        .where(and(
          eq(businessOwners.email, input.email),
          eq(businessOwners.passwordHash, hashPassword(input.password)),
        ));

      if (!owner) throw new Error("Pogrešan email ili lozinka");
      if (!owner.isVerified) throw new Error("Vaša djelatnost još nije potvrđena. Provjerite email ili nas kontaktirajte na kondor1413@gmail.com");

      const sessionToken = generateToken();
      await db.update(businessOwners).set({
        sessionToken,
        lastLoginAt: new Date(),
      }).where(eq(businessOwners.id, owner.id));

      return {
        success: true,
        token: sessionToken,
        businessId: owner.businessId,
        name: owner.name,
        email: owner.email,
      };
    }),

  // Get owner dashboard data
  getDashboard: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [owner] = await db.select().from(businessOwners)
        .where(eq(businessOwners.sessionToken, input.token));
      if (!owner) throw new Error("Neovlašteni pristup");

      const [business] = await db.select().from(businesses)
        .where(eq(businesses.id, owner.businessId));

      const [category] = business?.categoryId
        ? await db.select().from(categories).where(eq(categories.id, business.categoryId))
        : [null];

      const [voiceAgent] = await db.select().from(voiceAgentSubs)
        .where(eq(voiceAgentSubs.businessId, owner.businessId));

      return {
        owner: { id: owner.id, name: owner.name, email: owner.email, phone: owner.phone },
        business,
        category,
        voiceAgent: voiceAgent || null,
      };
    }),

  // Update business info (owner only)
  updateBusiness: publicProcedure
    .input(z.object({
      token: z.string(),
      description: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      address: z.string().optional(),
      openingHours: z.string().optional(),
      website: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [owner] = await db.select().from(businessOwners)
        .where(eq(businessOwners.sessionToken, input.token));
      if (!owner) throw new Error("Neovlašteni pristup");

      const updates: Record<string, unknown> = {};
      if (input.description !== undefined) updates.description = input.description;
      if (input.phone !== undefined) updates.phone = input.phone;
      if (input.email !== undefined) updates.email = input.email;
      if (input.address !== undefined) updates.address = input.address;
      if (input.openingHours !== undefined) updates.openingHours = input.openingHours;
      if (input.website !== undefined) updates.website = input.website;

      if (Object.keys(updates).length > 0) {
        await db.update(businesses).set(updates).where(eq(businesses.id, owner.businessId));
      }

      return { success: true };
    }),

  // Get all pending claims (admin)
  getPendingClaims: publicProcedure
    .input(z.object({ adminPassword: z.string() }))
    .query(async ({ input }) => {
      if (input.adminPassword !== ADMIN_PASSWORD) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) return [];

      return await db.select({
        claimId: businessOwners.id,
        businessId: businessOwners.businessId,
        ownerEmail: businessOwners.email,
        ownerName: businessOwners.name,
        ownerPhone: businessOwners.phone,
        isVerified: businessOwners.isVerified,
        createdAt: businessOwners.createdAt,
        businessName: businesses.name,
        businessPhone: businesses.phone,
      })
        .from(businessOwners)
        .leftJoin(businesses, eq(businessOwners.businessId, businesses.id))
        .orderBy(desc(businessOwners.createdAt));
    }),

  // Approve or reject claim (admin)
  verifyClaim: publicProcedure
    .input(z.object({
      adminPassword: z.string(),
      claimId: z.number(),
      approved: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      if (input.adminPassword !== ADMIN_PASSWORD) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) return { success: false };

      if (input.approved) {
        await db.update(businessOwners).set({ isVerified: 1 }).where(eq(businessOwners.id, input.claimId));
      } else {
        await db.delete(businessOwners).where(eq(businessOwners.id, input.claimId));
      }

      return { success: true };
    }),

  // Get contact info
  getContactInfo: publicProcedure.query(() => ({
    email: OWNER_EMAIL,
    siteName: "Split Usluge",
  })),
});
