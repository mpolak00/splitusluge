import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Service categories
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }),
  imageUrl: varchar("imageUrl", { length: 1500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// Business locations
export const businesses = mysqlTable("businesses", {
  id: int("id").autoincrement().primaryKey(),
  googlePlaceId: varchar("googlePlaceId", { length: 255 }).unique(),
  categoryId: int("categoryId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 1000 }),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  imageUrl: varchar("imageUrl", { length: 1500 }),
  rating: varchar("rating", { length: 10 }),
  reviewCount: int("reviewCount").default(0),
  openingHours: text("openingHours"),
  city: varchar("city", { length: 100 }),
  neighborhood: varchar("neighborhood", { length: 100 }),
  isActive: int("isActive").default(1),
  tags: text("tags"), // JSON array of tags
  gender: varchar("gender", { length: 50 }), // 'muski', 'zenski', or null for both
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = typeof businesses.$inferInsert;

// Search keywords for fuzzy matching
export const searchKeywords = mysqlTable("searchKeywords", {
  id: int("id").autoincrement().primaryKey(),
  keyword: varchar("keyword", { length: 255 }).notNull(),
  categoryId: int("categoryId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SearchKeyword = typeof searchKeywords.$inferSelect;
export type InsertSearchKeyword = typeof searchKeywords.$inferInsert;
// Platform reviews (for the website itself, not individual businesses)
export const platformReviews = mysqlTable("platformReviews", {
  id: int("id").autoincrement().primaryKey(),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  authorEmail: varchar("authorEmail", { length: 320 }),
  rating: int("rating").notNull(), // 1-5
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  verified: int("verified").default(0), // 1 = verified customer
  helpful: int("helpful").default(0), // count of helpful votes
  unhelpful: int("unhelpful").default(0), // count of unhelpful votes
  status: varchar("status", { length: 50 }).default("pending"), // pending, approved, rejected
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlatformReview = typeof platformReviews.$inferSelect;
export type InsertPlatformReview = typeof platformReviews.$inferInsert;

// Analytics - page views
export const pageViews = mysqlTable("pageViews", {
  id: int("id").autoincrement().primaryKey(),
  path: varchar("path", { length: 500 }).notNull(),
  categorySlug: varchar("categorySlug", { length: 255 }),
  businessId: int("businessId"),
  referrer: varchar("referrer", { length: 1000 }),
  userAgent: varchar("userAgent", { length: 500 }),
  ip: varchar("ip", { length: 45 }),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  device: varchar("device", { length: 50 }),
  language: varchar("language", { length: 10 }),
  sessionId: varchar("sessionId", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = typeof pageViews.$inferInsert;

// Analytics - click events
export const clickEvents = mysqlTable("clickEvents", {
  id: int("id").autoincrement().primaryKey(),
  eventType: varchar("eventType", { length: 50 }).notNull(),
  businessId: int("businessId"),
  businessName: varchar("businessName", { length: 255 }),
  categorySlug: varchar("categorySlug", { length: 255 }),
  sessionId: varchar("sessionId", { length: 100 }),
  ip: varchar("ip", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ClickEvent = typeof clickEvents.$inferSelect;
export type InsertClickEvent = typeof clickEvents.$inferInsert;

// Analytics - search queries
export const searchQueries = mysqlTable("searchQueries", {
  id: int("id").autoincrement().primaryKey(),
  query: varchar("query", { length: 500 }).notNull(),
  resultsCount: int("resultsCount").default(0),
  categorySlug: varchar("categorySlug", { length: 255 }),
  sessionId: varchar("sessionId", { length: 100 }),
  ip: varchar("ip", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SearchQuery = typeof searchQueries.$inferSelect;
export type InsertSearchQuery = typeof searchQueries.$inferInsert;

// Business scanner results
export const businessScans = mysqlTable("businessScans", {
  id: int("id").autoincrement().primaryKey(),
  businessId: int("businessId").notNull(),
  hasWebsite: int("hasWebsite").default(0),
  hasGoogleSite: int("hasGoogleSite").default(0),
  websiteUrl: varchar("websiteUrl", { length: 1000 }),
  websiteStatus: varchar("websiteStatus", { length: 50 }),
  hasSocialMedia: int("hasSocialMedia").default(0),
  socialLinks: text("socialLinks"),
  lastScannedAt: timestamp("lastScannedAt").defaultNow().notNull(),
  miniSiteGenerated: int("miniSiteGenerated").default(0),
  miniSiteUrl: varchar("miniSiteUrl", { length: 1000 }),
  outreachStatus: varchar("outreachStatus", { length: 50 }).default("none"),
  outreachSentAt: timestamp("outreachSentAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BusinessScan = typeof businessScans.$inferSelect;
export type InsertBusinessScan = typeof businessScans.$inferInsert;
