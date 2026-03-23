import { and, eq, ilike, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  categories,
  businesses,
  searchKeywords,
  platformReviews,
  InsertBusiness,
  InsertCategory,
} from "../drizzle/schema.js";
import { ENV } from "./_core/env.js";

let _db: ReturnType<typeof drizzle> | null = null;

const ACTIVE_BUSINESS_CONDITION = eq(businesses.isActive, 1);

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) {
        return;
      }

      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }

    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllCategories() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(categories);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertCategory(category: InsertCategory) {
  const db = await getDb();
  if (!db) {
    return;
  }

  const existing = await db.select().from(categories).where(eq(categories.slug, category.slug!)).limit(1);

  if (existing.length > 0) {
    await db.update(categories).set(category).where(eq(categories.slug, category.slug!));
  } else {
    await db.insert(categories).values(category);
  }
}

export async function getBusinessesByCategory(categoryId: number, limit = 50) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(businesses)
    .where(and(eq(businesses.categoryId, categoryId), ACTIVE_BUSINESS_CONDITION))
    .limit(limit);
}

export async function getBusinessesByCity(city: string, limit = 100) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(businesses)
    .where(and(eq(businesses.city, city), ACTIVE_BUSINESS_CONDITION))
    .limit(limit);
}

export async function searchBusinesses(query: string, limit = 20) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(businesses)
    .where(
      and(
        ACTIVE_BUSINESS_CONDITION,
        or(
          ilike(businesses.name, `%${query}%`),
          ilike(businesses.description, `%${query}%`),
          ilike(businesses.neighborhood, `%${query}%`)
        )
      )
    )
    .limit(limit);
}

export async function getAllBusinesses(options?: {
  categoryId?: number;
  limit?: number;
  offset?: number;
  includeInactive?: boolean;
}) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const limit = options?.limit ?? 20;
  const offset = options?.offset ?? 0;

  const conditions = [];

  if (!options?.includeInactive) {
    conditions.push(ACTIVE_BUSINESS_CONDITION);
  }

  if (options?.categoryId) {
    conditions.push(eq(businesses.categoryId, options.categoryId));
  }

  return await db
    .select()
    .from(businesses)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .limit(limit)
    .offset(offset);
}

export async function getBusinessesForSitemap() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select({
      id: businesses.id,
      name: businesses.name,
      updatedAt: businesses.updatedAt,
    })
    .from(businesses)
    .where(ACTIVE_BUSINESS_CONDITION);
}

export async function upsertBusiness(business: InsertBusiness) {
  const db = await getDb();
  if (!db) {
    return;
  }

  if (business.googlePlaceId) {
    const existing = await db
      .select()
      .from(businesses)
      .where(eq(businesses.googlePlaceId, business.googlePlaceId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(businesses)
        .set(business)
        .where(eq(businesses.googlePlaceId, business.googlePlaceId));
      return existing[0].id;
    }
  }

  await db.insert(businesses).values(business);
  return null;
}

export async function getBusinessById(id: number, options?: { includeInactive?: boolean }) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const conditions = [eq(businesses.id, id)];

  if (!options?.includeInactive) {
    conditions.push(ACTIVE_BUSINESS_CONDITION);
  }

  const result = await db
    .select()
    .from(businesses)
    .where(and(...conditions))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export {
  searchKeywords,
  platformReviews,
};
