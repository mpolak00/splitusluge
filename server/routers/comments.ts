import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc.js";
import { getDb } from "../db.js";
import { userAccounts, businessComments } from "../../drizzle/schema.js";
import { eq, desc, and, sql } from "drizzle-orm";
import { createHash, randomBytes } from "crypto";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "white1413";

export const commentsRouter = router({
  // Register a new user account
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2).max(255),
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if email already exists
      const existing = await db
        .select()
        .from(userAccounts)
        .where(eq(userAccounts.email, input.email));

      if (existing.length > 0) {
        throw new Error("Email je već registriran. Pokušajte se prijaviti.");
      }

      const passwordHash = hashPassword(input.password);

      await db.insert(userAccounts).values({
        name: input.name,
        email: input.email,
        passwordHash,
      });

      // Auto-login after registration
      const user = await db
        .select()
        .from(userAccounts)
        .where(eq(userAccounts.email, input.email));

      return {
        success: true,
        user: {
          id: user[0].id,
          name: user[0].name,
          email: user[0].email,
        },
      };
    }),

  // Login
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const users = await db
        .select()
        .from(userAccounts)
        .where(eq(userAccounts.email, input.email));

      if (users.length === 0) {
        throw new Error("Pogrešan email ili lozinka.");
      }

      const user = users[0];
      const passwordHash = hashPassword(input.password);

      if (user.passwordHash !== passwordHash) {
        throw new Error("Pogrešan email ili lozinka.");
      }

      if (user.isBanned) {
        throw new Error("Vaš račun je blokiran.");
      }

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    }),

  // Get comments for a business
  getByBusiness: publicProcedure
    .input(
      z.object({
        businessId: z.number().int().positive(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const comments = await db
        .select({
          id: businessComments.id,
          businessId: businessComments.businessId,
          userId: businessComments.userId,
          rating: businessComments.rating,
          content: businessComments.content,
          status: businessComments.status,
          createdAt: businessComments.createdAt,
          userName: userAccounts.name,
        })
        .from(businessComments)
        .innerJoin(userAccounts, eq(businessComments.userId, userAccounts.id))
        .where(
          and(
            eq(businessComments.businessId, input.businessId),
            eq(businessComments.status, "approved")
          )
        )
        .orderBy(desc(businessComments.createdAt));

      return comments;
    }),

  // Get comment stats for a business
  getStats: publicProcedure
    .input(z.object({ businessId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const comments = await db
        .select({
          rating: businessComments.rating,
        })
        .from(businessComments)
        .where(
          and(
            eq(businessComments.businessId, input.businessId),
            eq(businessComments.status, "approved")
          )
        );

      const withRating = comments.filter((c) => c.rating !== null);
      const avgRating =
        withRating.length > 0
          ? withRating.reduce((sum, c) => sum + (c.rating || 0), 0) / withRating.length
          : 0;

      return {
        totalComments: comments.length,
        totalRatings: withRating.length,
        averageRating: Number(avgRating.toFixed(1)),
      };
    }),

  // Add a comment (requires user auth via userId + email verification)
  add: publicProcedure
    .input(
      z.object({
        businessId: z.number().int().positive(),
        userId: z.number().int().positive(),
        userEmail: z.string().email(),
        rating: z.number().int().min(1).max(5).optional(),
        content: z.string().min(3).max(2000),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify user exists and matches
      const users = await db
        .select()
        .from(userAccounts)
        .where(
          and(
            eq(userAccounts.id, input.userId),
            eq(userAccounts.email, input.userEmail)
          )
        );

      if (users.length === 0) {
        throw new Error("Korisnik nije pronađen. Prijavite se ponovo.");
      }

      if (users[0].isBanned) {
        throw new Error("Vaš račun je blokiran.");
      }

      await db.insert(businessComments).values({
        businessId: input.businessId,
        userId: input.userId,
        rating: input.rating || null,
        content: input.content,
        status: "approved",
      });

      return {
        success: true,
        message: "Komentar je objavljen!",
      };
    }),

  // Delete own comment
  delete: publicProcedure
    .input(
      z.object({
        commentId: z.number().int().positive(),
        userId: z.number().int().positive(),
        userEmail: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify ownership
      const comment = await db
        .select()
        .from(businessComments)
        .where(eq(businessComments.id, input.commentId));

      if (comment.length === 0) throw new Error("Komentar nije pronađen.");
      if (comment[0].userId !== input.userId) throw new Error("Nemate dozvolu.");

      await db.delete(businessComments).where(eq(businessComments.id, input.commentId));

      return { success: true };
    }),

  // ===== ADMIN ENDPOINTS =====

  // Get all comments (admin)
  adminGetAll: publicProcedure
    .input(
      z.object({
        adminPassword: z.string(),
        status: z.string().optional(),
        limit: z.number().int().positive().default(50),
        offset: z.number().int().nonnegative().default(0),
      })
    )
    .query(async ({ input }) => {
      if (input.adminPassword !== ADMIN_PASSWORD) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const conditions = [];
      if (input.status) {
        conditions.push(eq(businessComments.status, input.status));
      }

      const query = db
        .select({
          id: businessComments.id,
          businessId: businessComments.businessId,
          userId: businessComments.userId,
          rating: businessComments.rating,
          content: businessComments.content,
          status: businessComments.status,
          createdAt: businessComments.createdAt,
          userName: userAccounts.name,
          userEmail: userAccounts.email,
        })
        .from(businessComments)
        .innerJoin(userAccounts, eq(businessComments.userId, userAccounts.id))
        .orderBy(desc(businessComments.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      if (conditions.length > 0) {
        return query.where(and(...conditions));
      }
      return query;
    }),

  // Update comment status (admin)
  adminUpdateStatus: publicProcedure
    .input(
      z.object({
        adminPassword: z.string(),
        commentId: z.number().int().positive(),
        status: z.string(), // approved, hidden, flagged
      })
    )
    .mutation(async ({ input }) => {
      if (input.adminPassword !== ADMIN_PASSWORD) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(businessComments)
        .set({ status: input.status })
        .where(eq(businessComments.id, input.commentId));

      return { success: true };
    }),

  // Delete comment (admin)
  adminDelete: publicProcedure
    .input(
      z.object({
        adminPassword: z.string(),
        commentId: z.number().int().positive(),
      })
    )
    .mutation(async ({ input }) => {
      if (input.adminPassword !== ADMIN_PASSWORD) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(businessComments).where(eq(businessComments.id, input.commentId));
      return { success: true };
    }),

  // Get all users (admin)
  adminGetUsers: publicProcedure
    .input(
      z.object({
        adminPassword: z.string(),
        limit: z.number().int().positive().default(50),
        offset: z.number().int().nonnegative().default(0),
      })
    )
    .query(async ({ input }) => {
      if (input.adminPassword !== ADMIN_PASSWORD) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const users = await db
        .select({
          id: userAccounts.id,
          name: userAccounts.name,
          email: userAccounts.email,
          isBanned: userAccounts.isBanned,
          createdAt: userAccounts.createdAt,
        })
        .from(userAccounts)
        .orderBy(desc(userAccounts.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      // Get comment count per user
      const commentCounts = await db
        .select({
          userId: businessComments.userId,
          count: sql<number>`COUNT(*)`.as("count"),
        })
        .from(businessComments)
        .groupBy(businessComments.userId);

      const countMap = new Map(commentCounts.map((c) => [c.userId, c.count]));

      return users.map((u) => ({
        ...u,
        commentCount: countMap.get(u.id) || 0,
      }));
    }),

  // Ban/unban user (admin)
  adminToggleBan: publicProcedure
    .input(
      z.object({
        adminPassword: z.string(),
        userId: z.number().int().positive(),
        banned: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      if (input.adminPassword !== ADMIN_PASSWORD) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(userAccounts)
        .set({ isBanned: input.banned ? 1 : 0 })
        .where(eq(userAccounts.id, input.userId));

      return { success: true };
    }),
});
