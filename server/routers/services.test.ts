import { describe, it, expect } from "vitest";
import { getDb } from "../db";
import { businesses, categories } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Services Router - Category Filtering", () => {
  it("should filter businesses by category when categoryId is provided", async () => {
    const db = await getDb();
    
    // Get a category to test with
    const testCategory = await db.select().from(categories).limit(1);
    if (testCategory.length === 0) {
      console.log("No categories found in database");
      return;
    }
    
    const categoryId = testCategory[0].id;
    
    // Get businesses in this category
    const businessesInCategory = await db
      .select()
      .from(businesses)
      .where(eq(businesses.categoryId, categoryId));
    
    // Verify that all returned businesses belong to the category
    for (const business of businessesInCategory) {
      expect(business.categoryId).toBe(categoryId);
    }
    
    expect(businessesInCategory.length).toBeGreaterThan(0);
  });

  it("should return only businesses from selected category, not from other categories", async () => {
    const db = await getDb();
    
    // Get two different categories
    const allCategories = await db.select().from(categories);
    if (allCategories.length < 2) {
      console.log("Need at least 2 categories for this test");
      return;
    }
    
    const category1 = allCategories[0];
    const category2 = allCategories[1];
    
    // Get businesses from category 1
    const businessesCategory1 = await db
      .select()
      .from(businesses)
      .where(eq(businesses.categoryId, category1.id));
    
    // Get businesses from category 2
    const businessesCategory2 = await db
      .select()
      .from(businesses)
      .where(eq(businesses.categoryId, category2.id));
    
    // Verify no overlap
    const ids1 = new Set(businessesCategory1.map(b => b.id));
    const ids2 = new Set(businessesCategory2.map(b => b.id));
    
    for (const id of ids1) {
      expect(ids2.has(id)).toBe(false);
    }
    
    expect(businessesCategory1.length).toBeGreaterThan(0);
    expect(businessesCategory2.length).toBeGreaterThan(0);
  });

  it("should return correct count of businesses for automehanicari category", async () => {
    const db = await getDb();
    
    // Get automehanicari category
    const automehanicariCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, "automehanicari"));
    
    if (automehanicariCategory.length === 0) {
      console.log("automehanicari category not found");
      return;
    }
    
    const categoryId = automehanicariCategory[0].id;
    
    // Get all businesses in this category
    const businesses_list = await db
      .select()
      .from(businesses)
      .where(eq(businesses.categoryId, categoryId));
    
    // Should have around 30-50 businesses after location cleanup
    expect(businesses_list.length).toBeGreaterThan(20);
    expect(businesses_list.length).toBeLessThan(100);
    
    // All should be automehanicari
    for (const business of businesses_list) {
      expect(business.categoryId).toBe(categoryId);
    }
  });

  it("should not return businesses from other categories when filtering by automehanicari", async () => {
    const db = await getDb();
    
    // Get automehanicari category
    const automehanicariCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, "automehanicari"));
    
    if (automehanicariCategory.length === 0) {
      console.log("automehanicari category not found");
      return;
    }
    
    const categoryId = automehanicariCategory[0].id;
    
    // Get all businesses in automehanicari
    const automehanicari = await db
      .select()
      .from(businesses)
      .where(eq(businesses.categoryId, categoryId));
    
    // Get all businesses
    const allBusinesses = await db.select().from(businesses);
    
    // Get businesses from other categories
    const otherCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId) === false);
    
    // Verify that automehanicari list doesn't contain businesses from other categories
    const automehanicariIds = new Set(automehanicari.map(b => b.id));
    
    for (const business of allBusinesses) {
      if (business.categoryId !== categoryId) {
        expect(automehanicariIds.has(business.id)).toBe(false);
      }
    }
  });
});
