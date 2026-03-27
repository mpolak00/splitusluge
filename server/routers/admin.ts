import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc.js";
import { getDb } from "../db.js";
import { businesses, categories, pageViews, clickEvents, searchQueries, businessScans, outreachLog, servicePurchases } from "../../drizzle/schema.js";
import { eq, desc, sql, and, gte, lte, count, isNull, or, like } from "drizzle-orm";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "white1413";

const adminAuth = z.object({
  adminPassword: z.string(),
});

function verifyAdmin(password: string) {
  if (password !== ADMIN_PASSWORD) {
    throw new Error("Unauthorized: Invalid admin password");
  }
}

export const adminRouter = router({
  login: publicProcedure
    .input(adminAuth)
    .mutation(({ input }) => {
      verifyAdmin(input.adminPassword);
      return { success: true };
    }),

  getDashboardStats: publicProcedure
    .input(adminAuth.extend({
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
    }))
    .query(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return null;

      const dateFrom = input.dateFrom ? new Date(input.dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dateTo = input.dateTo ? new Date(input.dateTo) : new Date();

      const [totalViews] = await db.select({ count: count() }).from(pageViews)
        .where(and(gte(pageViews.createdAt, dateFrom), lte(pageViews.createdAt, dateTo)));

      const [totalClicks] = await db.select({ count: count() }).from(clickEvents)
        .where(and(gte(clickEvents.createdAt, dateFrom), lte(clickEvents.createdAt, dateTo)));

      const [totalSearches] = await db.select({ count: count() }).from(searchQueries)
        .where(and(gte(searchQueries.createdAt, dateFrom), lte(searchQueries.createdAt, dateTo)));

      const [totalBusinesses] = await db.select({ count: count() }).from(businesses);
      const [totalCategories] = await db.select({ count: count() }).from(categories);

      return {
        totalViews: totalViews?.count || 0,
        totalClicks: totalClicks?.count || 0,
        totalSearches: totalSearches?.count || 0,
        totalBusinesses: totalBusinesses?.count || 0,
        totalCategories: totalCategories?.count || 0,
        dateRange: { from: dateFrom.toISOString(), to: dateTo.toISOString() },
      };
    }),

  getTopCategories: publicProcedure
    .input(adminAuth.extend({
      limit: z.number().default(20),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
    }))
    .query(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return [];

      const dateFrom = input.dateFrom ? new Date(input.dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dateTo = input.dateTo ? new Date(input.dateTo) : new Date();

      return await db.select({
        categorySlug: pageViews.categorySlug,
        views: count(),
      }).from(pageViews)
        .where(and(
          sql`${pageViews.categorySlug} IS NOT NULL`,
          gte(pageViews.createdAt, dateFrom),
          lte(pageViews.createdAt, dateTo),
        ))
        .groupBy(pageViews.categorySlug)
        .orderBy(desc(count()))
        .limit(input.limit);
    }),

  getTopSearches: publicProcedure
    .input(adminAuth.extend({
      limit: z.number().default(20),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
    }))
    .query(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return [];

      const dateFrom = input.dateFrom ? new Date(input.dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dateTo = input.dateTo ? new Date(input.dateTo) : new Date();

      return await db.select({
        query: searchQueries.query,
        searchCount: count(),
        avgResults: sql<number>`AVG(${searchQueries.resultsCount})`,
      }).from(searchQueries)
        .where(and(gte(searchQueries.createdAt, dateFrom), lte(searchQueries.createdAt, dateTo)))
        .groupBy(searchQueries.query)
        .orderBy(desc(count()))
        .limit(input.limit);
    }),

  getClickAnalytics: publicProcedure
    .input(adminAuth.extend({
      limit: z.number().default(20),
      eventType: z.string().optional(),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
    }))
    .query(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return [];

      const dateFrom = input.dateFrom ? new Date(input.dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dateTo = input.dateTo ? new Date(input.dateTo) : new Date();

      const conditions = [
        gte(clickEvents.createdAt, dateFrom),
        lte(clickEvents.createdAt, dateTo),
      ];
      if (input.eventType) {
        conditions.push(eq(clickEvents.eventType, input.eventType));
      }

      return await db.select({
        businessName: clickEvents.businessName,
        businessId: clickEvents.businessId,
        eventType: clickEvents.eventType,
        clickCount: count(),
      }).from(clickEvents)
        .where(and(...conditions))
        .groupBy(clickEvents.businessName, clickEvents.businessId, clickEvents.eventType)
        .orderBy(desc(count()))
        .limit(input.limit);
    }),

  getViewsOverTime: publicProcedure
    .input(adminAuth.extend({
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
    }))
    .query(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return [];

      const dateFrom = input.dateFrom ? new Date(input.dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dateTo = input.dateTo ? new Date(input.dateTo) : new Date();

      return await db.select({
        date: sql<string>`DATE(${pageViews.createdAt})`.as("date"),
        views: count(),
      }).from(pageViews)
        .where(and(gte(pageViews.createdAt, dateFrom), lte(pageViews.createdAt, dateTo)))
        .groupBy(sql`DATE(${pageViews.createdAt})`)
        .orderBy(sql`DATE(${pageViews.createdAt})`);
    }),

  getVisitorLanguages: publicProcedure
    .input(adminAuth.extend({
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
    }))
    .query(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return [];

      const dateFrom = input.dateFrom ? new Date(input.dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dateTo = input.dateTo ? new Date(input.dateTo) : new Date();

      return await db.select({
        language: pageViews.language,
        count: count(),
      }).from(pageViews)
        .where(and(
          gte(pageViews.createdAt, dateFrom),
          lte(pageViews.createdAt, dateTo),
          sql`${pageViews.language} IS NOT NULL`,
        ))
        .groupBy(pageViews.language)
        .orderBy(desc(count()));
    }),

  generateReport: publicProcedure
    .input(adminAuth.extend({
      categorySlug: z.string().optional(),
      businessId: z.number().optional(),
      dateFrom: z.string(),
      dateTo: z.string(),
    }))
    .query(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return null;

      const dateFrom = new Date(input.dateFrom);
      const dateTo = new Date(input.dateTo);

      const viewConditions = [
        gte(pageViews.createdAt, dateFrom),
        lte(pageViews.createdAt, dateTo),
      ];
      const clickConditions = [
        gte(clickEvents.createdAt, dateFrom),
        lte(clickEvents.createdAt, dateTo),
      ];

      if (input.categorySlug) {
        viewConditions.push(eq(pageViews.categorySlug, input.categorySlug));
        clickConditions.push(eq(clickEvents.categorySlug, input.categorySlug));
      }
      if (input.businessId) {
        viewConditions.push(eq(pageViews.businessId, input.businessId));
        clickConditions.push(eq(clickEvents.businessId, input.businessId));
      }

      const [views] = await db.select({ count: count() }).from(pageViews).where(and(...viewConditions));
      const [clicks] = await db.select({ count: count() }).from(clickEvents).where(and(...clickConditions));

      const clicksByType = await db.select({
        eventType: clickEvents.eventType,
        count: count(),
      }).from(clickEvents)
        .where(and(...clickConditions))
        .groupBy(clickEvents.eventType);

      const dailyViews = await db.select({
        date: sql<string>`DATE(${pageViews.createdAt})`.as("date"),
        views: count(),
      }).from(pageViews)
        .where(and(...viewConditions))
        .groupBy(sql`DATE(${pageViews.createdAt})`)
        .orderBy(sql`DATE(${pageViews.createdAt})`);

      return {
        period: { from: dateFrom.toISOString(), to: dateTo.toISOString() },
        totalViews: views?.count || 0,
        totalClicks: clicks?.count || 0,
        clicksByType,
        dailyViews,
        categorySlug: input.categorySlug || null,
        businessId: input.businessId || null,
      };
    }),

  getBusinessesWithoutWebsite: publicProcedure
    .input(adminAuth.extend({
      categoryId: z.number().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return { businesses: [], total: 0 };

      const conditions = [
        or(eq(businesses.isActive, 1), isNull(businesses.isActive)),
        or(
          isNull(businesses.website),
          eq(businesses.website, ""),
          like(businesses.website, "%sites.google.com%"),
          like(businesses.website, "%business.site%"),
        ),
      ];

      if (input.categoryId) {
        conditions.push(eq(businesses.categoryId, input.categoryId));
      }

      const whereClause = and(...conditions);
      const [totalResult] = await db.select({ count: count() }).from(businesses).where(whereClause);
      const results = await db.select().from(businesses).where(whereClause).limit(input.limit).offset(input.offset);

      return {
        businesses: results,
        total: totalResult?.count || 0,
      };
    }),

  saveBusinessScan: publicProcedure
    .input(adminAuth.extend({
      businessId: z.number(),
      hasWebsite: z.number(),
      hasGoogleSite: z.number(),
      websiteUrl: z.string().optional(),
      websiteStatus: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return { success: false };

      await db.insert(businessScans).values({
        businessId: input.businessId,
        hasWebsite: input.hasWebsite,
        hasGoogleSite: input.hasGoogleSite,
        websiteUrl: input.websiteUrl || null,
        websiteStatus: input.websiteStatus || null,
        notes: input.notes || null,
      });

      return { success: true };
    }),

  updateOutreachStatus: publicProcedure
    .input(adminAuth.extend({
      scanId: z.number(),
      status: z.string(),
    }))
    .mutation(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return { success: false };

      const updateData: Record<string, unknown> = { outreachStatus: input.status };
      if (input.status === "sent") {
        updateData.outreachSentAt = new Date();
      }

      await db.update(businessScans).set(updateData).where(eq(businessScans.id, input.scanId));
      return { success: true };
    }),

  getScans: publicProcedure
    .input(adminAuth.extend({
      outreachStatus: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return [];

      const conditions = [];
      if (input.outreachStatus) {
        conditions.push(eq(businessScans.outreachStatus, input.outreachStatus));
      }

      return await db.select().from(businessScans)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(businessScans.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  getAllBusinessesAdmin: publicProcedure
    .input(adminAuth.extend({
      limit: z.number().default(100),
      offset: z.number().default(0),
      search: z.string().optional(),
      categoryId: z.number().optional(),
    }))
    .query(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return { businesses: [], total: 0 };

      const conditions = [];
      if (input.search) {
        conditions.push(or(
          like(businesses.name, `%${input.search}%`),
          like(businesses.address, `%${input.search}%`),
        ));
      }
      if (input.categoryId) {
        conditions.push(eq(businesses.categoryId, input.categoryId));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      const [totalResult] = await db.select({ count: count() }).from(businesses).where(whereClause);
      const results = await db.select().from(businesses).where(whereClause)
        .orderBy(desc(businesses.rating))
        .limit(input.limit)
        .offset(input.offset);

      return {
        businesses: results,
        total: totalResult?.count || 0,
      };
    }),

  // Get businesses with full details for outreach (joins categories)
  getBusinessesForOutreach: publicProcedure
    .input(adminAuth.extend({
      categoryId: z.number().optional(),
      hasPhone: z.boolean().optional(),
      noWebsiteOnly: z.boolean().optional(),
      search: z.string().optional(),
      limit: z.number().default(30),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return { businesses: [], total: 0 };

      const conditions = [
        or(eq(businesses.isActive, 1), isNull(businesses.isActive)),
      ];

      if (input.noWebsiteOnly) {
        conditions.push(
          or(
            isNull(businesses.website),
            eq(businesses.website, ""),
            like(businesses.website, "%sites.google.com%"),
            like(businesses.website, "%business.site%"),
          )!,
        );
      }

      if (input.categoryId) {
        conditions.push(eq(businesses.categoryId, input.categoryId));
      }
      if (input.hasPhone) {
        conditions.push(sql`${businesses.phone} IS NOT NULL AND ${businesses.phone} != ''`);
      }
      if (input.search) {
        conditions.push(like(businesses.name, `%${input.search}%`));
      }

      const whereClause = and(...conditions);
      const [totalResult] = await db.select({ count: count() }).from(businesses).where(whereClause);

      const results = await db.select({
        id: businesses.id,
        name: businesses.name,
        address: businesses.address,
        phone: businesses.phone,
        email: businesses.email,
        website: businesses.website,
        rating: businesses.rating,
        reviewCount: businesses.reviewCount,
        openingHours: businesses.openingHours,
        latitude: businesses.latitude,
        longitude: businesses.longitude,
        description: businesses.description,
        imageUrl: businesses.imageUrl,
        categoryId: businesses.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
        .from(businesses)
        .leftJoin(categories, eq(businesses.categoryId, categories.id))
        .where(whereClause)
        .orderBy(desc(businesses.rating))
        .limit(input.limit)
        .offset(input.offset);

      return {
        businesses: results,
        total: totalResult?.count || 0,
      };
    }),

  // Bot scanner - scan ALL businesses, score digital presence, find leads
  runBotScan: publicProcedure
    .input(adminAuth)
    .query(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return { total: 0, stats: { noWebsite: 0, googleSite: 0, withWebsite: 0, noGoogle: 0, noEmail: 0, noDescription: 0, noHours: 0, lowRating: 0, noReviews: 0 }, leads: [] };

      const allBiz = await db.select({
        id: businesses.id,
        name: businesses.name,
        googlePlaceId: businesses.googlePlaceId,
        address: businesses.address,
        phone: businesses.phone,
        email: businesses.email,
        website: businesses.website,
        rating: businesses.rating,
        reviewCount: businesses.reviewCount,
        categoryId: businesses.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        city: businesses.city,
        neighborhood: businesses.neighborhood,
        description: businesses.description,
        openingHours: businesses.openingHours,
        imageUrl: businesses.imageUrl,
        tags: businesses.tags,
      })
        .from(businesses)
        .leftJoin(categories, eq(businesses.categoryId, categories.id))
        .where(or(eq(businesses.isActive, 1), isNull(businesses.isActive)));

      const total = allBiz.length;
      const stats = { noWebsite: 0, googleSite: 0, withWebsite: 0, noGoogle: 0, noEmail: 0, noDescription: 0, noHours: 0, lowRating: 0, noReviews: 0 };
      const leads: Array<typeof allBiz[number] & { score: number; issues: string[] }> = [];

      for (const b of allBiz) {
        const hasPhone = !!(b.phone && b.phone.trim());
        const hasEmail = !!(b.email && b.email.trim());
        const hasWebsite = !!(b.website && b.website.trim());
        const hasGoogleSite = hasWebsite && (b.website!.includes("sites.google.com") || b.website!.includes("business.site"));
        const hasRealWebsite = hasWebsite && !hasGoogleSite;
        const hasGoogleProfile = !!(b.googlePlaceId && b.googlePlaceId.trim());
        const hasDescription = !!(b.description && b.description.trim() && b.description.trim().length > 20);
        const hasHours = !!(b.openingHours && b.openingHours.trim());
        const ratingNum = b.rating ? parseFloat(b.rating) : 0;
        const reviewNum = b.reviewCount || 0;

        // Stats
        if (!hasWebsite) stats.noWebsite++;
        else if (hasGoogleSite) stats.googleSite++;
        else stats.withWebsite++;
        if (!hasGoogleProfile) stats.noGoogle++;
        if (!hasEmail) stats.noEmail++;
        if (!hasDescription) stats.noDescription++;
        if (!hasHours) stats.noHours++;
        if (ratingNum > 0 && ratingNum < 4) stats.lowRating++;
        if (reviewNum === 0) stats.noReviews++;

        // Score: 0 = worst digital presence, 100 = perfect
        let score = 0;
        const issues: string[] = [];

        if (hasRealWebsite) { score += 30; } else if (hasGoogleSite) { score += 10; issues.push("google_site"); } else { issues.push("no_website"); }
        if (hasGoogleProfile) { score += 15; } else { issues.push("no_google"); }
        if (hasEmail) { score += 10; } else { issues.push("no_email"); }
        if (hasDescription) { score += 10; } else { issues.push("no_description"); }
        if (hasHours) { score += 10; } else { issues.push("no_hours"); }
        if (ratingNum >= 4) { score += 15; } else if (ratingNum > 0) { score += 5; issues.push("low_rating"); } else { issues.push("no_rating"); }
        if (reviewNum >= 10) { score += 10; } else if (reviewNum > 0) { score += 3; issues.push("few_reviews"); } else { issues.push("no_reviews"); }

        // Only leads with contact info and issues to fix
        if ((hasPhone || hasEmail) && issues.length > 0) {
          leads.push({ ...b, score, issues });
        }
      }

      // Sort by score ascending (worst = best lead)
      leads.sort((a, b) => a.score - b.score);

      return { total, stats, leads };
    }),

  // Log an outreach event
  logOutreach: publicProcedure
    .input(adminAuth.extend({
      businessId: z.number(),
      channel: z.string(),
      message: z.string().optional(),
      previewUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return { success: false };

      await db.insert(outreachLog).values({
        businessId: input.businessId,
        channel: input.channel,
        message: input.message || null,
        previewUrl: input.previewUrl || null,
      });

      return { success: true };
    }),

  // Get outreach history for a business
  getOutreachHistory: publicProcedure
    .input(adminAuth.extend({
      businessId: z.number().optional(),
      limit: z.number().default(100),
    }))
    .query(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return [];

      const conditions = [];
      if (input.businessId) {
        conditions.push(eq(outreachLog.businessId, input.businessId));
      }

      return await db.select().from(outreachLog)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(outreachLog.createdAt))
        .limit(input.limit);
    }),

  // Get outreach stats
  getOutreachStats: publicProcedure
    .input(adminAuth)
    .query(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return { total: 0, byChannel: [], byStatus: [] };

      const [total] = await db.select({ count: count() }).from(outreachLog);
      const byChannel = await db.select({
        channel: outreachLog.channel,
        count: count(),
      }).from(outreachLog).groupBy(outreachLog.channel);
      const byStatus = await db.select({
        status: outreachLog.status,
        count: count(),
      }).from(outreachLog).groupBy(outreachLog.status);

      return {
        total: total?.count || 0,
        byChannel,
        byStatus,
      };
    }),

  // Generate mini-site HTML (server-side)
  generateMiniSiteHtml: publicProcedure
    .input(adminAuth.extend({
      businessId: z.number(),
      language: z.enum(["hr", "en"]).default("hr"),
    }))
    .query(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return { html: "", business: null };

      const [business] = await db.select().from(businesses).where(eq(businesses.id, input.businessId));
      if (!business) return { html: "", business: null };

      const [category] = business.categoryId
        ? await db.select().from(categories).where(eq(categories.id, business.categoryId))
        : [null];

      // Dynamic import of the template generator
      const { generateMiniSiteHtml } = await import("../templates/mini-site.js");
      const html = generateMiniSiteHtml(business, category, input.language);

      return { html, business };
    }),

  // Service purchases management
  getServicePurchases: publicProcedure
    .input(adminAuth.extend({
      status: z.string().optional(),
    }))
    .query(async ({ input }) => {
      verifyAdmin(input.adminPassword);
      const db = await getDb();
      if (!db) return [];

      const conditions = [];
      if (input.status) {
        conditions.push(eq(servicePurchases.status, input.status));
      }

      return await db.select({
        purchase: servicePurchases,
        businessName: businesses.name,
        businessPhone: businesses.phone,
        businessEmail: businesses.email,
      })
        .from(servicePurchases)
        .leftJoin(businesses, eq(servicePurchases.businessId, businesses.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(servicePurchases.createdAt));
    }),
});
