import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "dist", "public");
const targetDir = path.join(rootDir, "server", "_core", "public");

async function main() {
  await fs.access(sourceDir);
  await fs.rm(targetDir, { recursive: true, force: true });
  await fs.mkdir(path.dirname(targetDir), { recursive: true });
  await fs.cp(sourceDir, targetDir, { recursive: true });
}

main().catch(error => {
  console.error("[prepare-server-static] Failed to copy client build output.", error);
  process.exitCode = 1;
});
