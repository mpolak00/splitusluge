import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers.js";
import { createContext } from "./_core/context.js";
import { registerOAuthRoutes } from "./_core/oauth.js";
import { injectSeoIntoHtml, resolveSiteUrl } from "./_core/seo.js";
import { registerSeoRoutes } from "./_core/seo.js";
// @ts-ignore Generated during the build step.
import { indexHtmlTemplate } from "../dist/server-template.js";

async function createVercelApp() {
  const app = express();

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

  app.use("*", (req, res) => {
    const page = injectSeoIntoHtml(indexHtmlTemplate, req.originalUrl, resolveSiteUrl(req));
    res.status(200).set({ "Content-Type": "text/html" }).end(page);
  });

  return app;
}

let appPromise: ReturnType<typeof createVercelApp> | null = null;

export default async function handler(req: any, res: any) {
  if (!appPromise) {
    appPromise = createVercelApp();
  }

  const app = await appPromise;
  return app(req, res);
}
