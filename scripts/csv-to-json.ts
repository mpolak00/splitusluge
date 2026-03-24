/**
 * Converts the businesses CSV into static JSON files.
 * Uses the same CSV parser as import-businesses-csv.ts.
 */
import fs from "node:fs";
import path from "node:path";

const CSV_PATH = path.resolve(process.cwd(), "data/imports/businesses_20260129_022602.csv");
const OUT_DIR = path.resolve(process.cwd(), "server/static-data");

const CATEGORIES = [
  { id: 1, name: "Vulkanizeri", slug: "vulkanizeri", description: "Popravka i zamjena guma, vulkanizacija", icon: "tire", imageUrl: null, createdAt: "2026-01-29T00:00:00.000Z", updatedAt: "2026-01-29T00:00:00.000Z" },
  { id: 2, name: "Automehaničari", slug: "automehanicari", description: "Servis i popravka automobila", icon: "wrench", imageUrl: null, createdAt: "2026-01-29T00:00:00.000Z", updatedAt: "2026-01-29T00:00:00.000Z" },
  { id: 3, name: "Vodoinstalateri", slug: "vodoinstalateri", description: "Instalacija i popravka vodovodnih sustava", icon: "droplet", imageUrl: null, createdAt: "2026-01-29T00:00:00.000Z", updatedAt: "2026-01-29T00:00:00.000Z" },
  { id: 4, name: "Električari", slug: "elektricari", description: "Električne instalacije i popravke", icon: "zap", imageUrl: null, createdAt: "2026-01-29T00:00:00.000Z", updatedAt: "2026-01-29T00:00:00.000Z" },
  { id: 5, name: "Servisi za čišćenje", slug: "servisi-za-ciscenje", description: "Čišćenje domova i poslovnih prostora", icon: "sparkles", imageUrl: null, createdAt: "2026-01-29T00:00:00.000Z", updatedAt: "2026-01-29T00:00:00.000Z" },
  { id: 6, name: "Stolari", slug: "stolari", description: "Stolarske usluge i izrada namještaja", icon: "hammer", imageUrl: null, createdAt: "2026-01-29T00:00:00.000Z", updatedAt: "2026-01-29T00:00:00.000Z" },
  { id: 7, name: "Frizerski saloni", slug: "frizerski-saloni", description: "Frizerske usluge za muškarce i žene", icon: "scissors", imageUrl: null, createdAt: "2026-01-29T00:00:00.000Z", updatedAt: "2026-01-29T00:00:00.000Z" },
  { id: 8, name: "Stomatolozi", slug: "stomatolozi", description: "Stomatološke usluge i liječenje zuba", icon: "tooth", imageUrl: null, createdAt: "2026-01-29T00:00:00.000Z", updatedAt: "2026-01-29T00:00:00.000Z" },
  { id: 9, name: "Prijevoz i selidbe", slug: "prijevoz-i-selidbe", description: "Usluge prijevoza i selidbi", icon: "truck", imageUrl: null, createdAt: "2026-01-29T00:00:00.000Z", updatedAt: "2026-01-29T00:00:00.000Z" },
  { id: 10, name: "Vrtlari i uređenje vrtova", slug: "vrtlari", description: "Uređenje i održavanje vrtova", icon: "leaf", imageUrl: null, createdAt: "2026-01-29T00:00:00.000Z", updatedAt: "2026-01-29T00:00:00.000Z" },
];

type CsvRow = Record<string, string>;

// Exact same parser from import-businesses-csv.ts
function parseCsvRow(content: string): string[] {
  const row: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const next = content[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  row.push(current);
  return row;
}

function parseCsv(content: string): CsvRow[] {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const next = content[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current);
    rows.push(row);
  }

  const [headerRow, ...bodyRows] = rows;
  if (!headerRow) {
    return [];
  }

  const headers = headerRow.map((value, index) =>
    index === 0 ? value.replace(/^\uFEFF/, "").trim() : value.trim()
  );

  return bodyRows
    .filter(columns => columns.some(column => column.trim() !== ""))
    .map(columns => {
      const normalizedColumns = columns.length === 1 && headers.length > 1 ? parseCsvRow(columns[0]) : columns;
      const record: CsvRow = {};
      headers.forEach((header, index) => {
        record[header] = normalizedColumns[index] ?? "";
      });
      return record;
    });
}

function clean(value?: string | null) {
  if (!value) return null;
  const cleaned = value
    .replace(/\u00a0/g, " ")
    .replace(/\u202f/g, " ")
    .replace(/\u2009/g, " ")
    .replace(/\u2013/g, "-")
    .replace(/\u2014/g, "-")
    .replace(/\u200f/g, "")
    .replace(/\u200e/g, "")
    .replace(/\u2069/g, "")
    .replace(/\u2066/g, "")
    .replace(/[\u2000-\u206f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned === "" ? null : cleaned;
}

function main() {
  if (!fs.existsSync(CSV_PATH)) {
    throw new Error(`CSV not found: ${CSV_PATH}`);
  }

  const raw = fs.readFileSync(CSV_PATH, "utf8");
  const rows = parseCsv(raw);

  console.log(`Parsed ${rows.length} CSV rows`);

  // Debug: show first row's keys and city
  if (rows[0]) {
    console.log("First row keys:", Object.keys(rows[0]).join(", "));
    console.log("First row city:", JSON.stringify(rows[0].city));
    console.log("First row name:", JSON.stringify(rows[0].name));
  }

  const businesses: any[] = [];
  const categorySet = new Set<number>();

  for (const row of rows) {
    const name = clean(row.name);
    const categoryId = Number(row.categoryId);
    if (!name || !Number.isFinite(categoryId)) continue;

    categorySet.add(categoryId);

    const ratingStr = row.rating?.replace(",", ".");
    const rating = ratingStr ? parseFloat(ratingStr) : null;
    const reviewCount = row.reviewCount ? parseInt(row.reviewCount, 10) : 0;

    businesses.push({
      id: Number(row.id) || businesses.length + 1,
      googlePlaceId: clean(row.googlePlaceId),
      categoryId,
      name,
      description: clean(row.description),
      address: clean(row.address),
      phone: clean(row.phone),
      email: clean(row.email),
      website: clean(row.website),
      latitude: clean(row.latitude),
      longitude: clean(row.longitude),
      imageUrl: clean(row.imageUrl),
      rating: Number.isFinite(rating!) ? rating : null,
      reviewCount: Number.isFinite(reviewCount) ? reviewCount : 0,
      openingHours: clean(row.openingHours),
      city: clean(row.city),
      neighborhood: clean(row.neighborhood),
      isActive: Number(row.isActive || 1),
      tags: clean(row.tags) || null,
      gender: null,
    });
  }

  // Filter only active AND in the Split-Trogir-Omiš area
  // Bounding box: lat 43.3-43.6, lng 16.1-16.8 (covers Split, Solin, Kaštela, Trogir, Omiš)
  const active = businesses.filter(b => {
    if (b.isActive !== 1) return false;

    const lat = parseFloat(b.latitude);
    const lng = parseFloat(b.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      if (lat < 43.3 || lat > 43.7 || lng < 16.1 || lng > 16.85) {
        return false; // Outside Split area
      }
    }

    return true;
  });

  // Sort by weighted score (best reviews first)
  active.sort((a, b) => {
    const scoreA = Math.min((a.reviewCount || 0) / 500, 1) * 0.7 + ((a.rating || 0) / 5) * 0.3;
    const scoreB = Math.min((b.reviewCount || 0) / 500, 1) * 0.7 + ((b.rating || 0) / 5) * 0.3;
    return scoreB - scoreA;
  });

  // Re-assign IDs
  active.forEach((b, i) => { b.id = i + 1; });

  // Create output directory
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  fs.writeFileSync(path.join(OUT_DIR, "categories.json"), JSON.stringify(CATEGORIES, null, 2), "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "businesses.json"), JSON.stringify(active, null, 2), "utf8");

  // Stats
  const cityCount: Record<string, number> = {};
  const catCount: Record<number, number> = {};
  active.forEach(b => {
    cityCount[b.city || "nepoznato"] = (cityCount[b.city || "nepoznato"] || 0) + 1;
    catCount[b.categoryId] = (catCount[b.categoryId] || 0) + 1;
  });

  console.log(`\nUkupno: ${active.length} biznisa`);
  console.log("\nPo gradu:");
  Object.entries(cityCount).sort((a, b) => b[1] - a[1]).forEach(([city, count]) => {
    console.log(`  ${city}: ${count}`);
  });
  console.log("\nPo kategoriji:");
  CATEGORIES.forEach(cat => {
    console.log(`  ${cat.name}: ${catCount[cat.id] || 0}`);
  });
  console.log(`\nSaved to: ${OUT_DIR}`);
}

main();
