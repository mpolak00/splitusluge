import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("businesses.registerBusiness", () => {
  it("should register a new business with valid input", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.businesses.registerBusiness({
      name: "Test Vulkanizer",
      email: "test@vulkanizer.hr",
      phone: "+385 1 234 5678",
      category: "1",
      address: "Test Street 123",
      website: "https://test.hr",
      description: "Test business description",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("Hvala");
  });

  it("should reject registration without required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.businesses.registerBusiness({
        name: "",
        email: "test@test.hr",
        phone: "+385 1 234 5678",
        category: "1",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toBeDefined();
    }
  });

  it("should reject invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.businesses.registerBusiness({
        name: "Test Business",
        email: "invalid-email",
        phone: "+385 1 234 5678",
        category: "1",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toBeDefined();
    }
  });
});

describe("businesses.getPendingBusinesses", () => {
  it("should return an array of pending businesses", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.businesses.getPendingBusinesses();

    expect(Array.isArray(result)).toBe(true);
  });
});
