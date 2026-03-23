import express, { type Express } from "express";
import type { Server } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers.js";
import { createContext } from "./_core/context.js";
import { registerOAuthRoutes } from "./_core/oauth.js";
import { registerSeoRoutes } from "./_core/seo.js";
import { serveStatic, setupVite } from "./_core/vite.js";

type AppMode = "development" | "production";

export async function configureApp(
  app: Express,
  options: { mode: AppMode; server?: Server }
) {
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerSeoRoutes(app);
  registerOAuthRoutes(app);

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  if (options.mode === "development") {
    if (!options.server) {
      throw new Error("HTTP server is required in development mode.");
    }

    await setupVite(app, options.server);
  } else {
    serveStatic(app);
  }

  return app;
}

export async function createApp(options: { mode: AppMode; server?: Server }) {
  const app = express();
  await configureApp(app, options);
  return app;
}
