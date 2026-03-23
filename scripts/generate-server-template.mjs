import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const sourcePath = path.join(rootDir, "dist", "public", "index.html");
const targetPath = path.join(rootDir, "dist", "server-template.js");

async function main() {
  const template = await fs.readFile(sourcePath, "utf-8");
  const moduleContents = `export const indexHtmlTemplate = ${JSON.stringify(template)};\n`;
  await fs.writeFile(targetPath, moduleContents, "utf-8");
}

main().catch(error => {
  console.error("[generate-server-template] Failed to generate HTML template module.", error);
  process.exitCode = 1;
});
