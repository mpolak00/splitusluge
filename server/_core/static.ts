import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { injectSeoIntoHtml, resolveSiteUrl } from "./seo.js";

const currentDir =
  typeof __dirname === "string"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export function serveStatic(app: Express) {
  const candidateDistPaths = [
    path.resolve(currentDir, "../..", "dist", "public"),
    path.resolve(currentDir, "public"),
  ];
  const distPath = candidateDistPaths.find(currentPath => fs.existsSync(currentPath)) || candidateDistPaths[0];

  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath, { index: false }));

  app.use("*", async (req, res, next) => {
    try {
      const indexHtml = path.resolve(distPath, "index.html");
      const template = await fs.promises.readFile(indexHtml, "utf-8");
      const page = injectSeoIntoHtml(template, req.originalUrl, resolveSiteUrl(req));

      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (error) {
      next(error);
    }
  });
}
