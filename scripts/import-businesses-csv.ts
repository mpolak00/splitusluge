import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { businesses } from "../drizzle/schema.ts";
import { getAllCategories, getDb, upsertBusiness } from "../server/db.ts";

const DEFAULT_CSV_PATH = path.resolve(process.cwd(), "data/imports/businesses_20260129_022602.csv");

type CsvRow = Record<string, string>;

type CategoryRecord = {
  id: number;
  name: string;
  slug: string;
};

const categoryImages: Record<string, string[]> = {
  vulkanizeri: [
    "https://images.unsplash.com/photo-1486262715619-3417ca6ef29f?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=1200&h=900&fit=crop",
  ],
  automehanicari: [
    "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1493238792000-8113da705763?w=1200&h=900&fit=crop",
  ],
  vodoinstalateri: [
    "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&h=900&fit=crop",
  ],
  elektricari: [
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&h=900&fit=crop",
  ],
  "servisi-za-ciscenje": [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1200&h=900&fit=crop",
  ],
  stolari: [
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&h=900&fit=crop",
  ],
  "frizerski-saloni": [
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&h=900&fit=crop",
  ],
  stomatolozi: [
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&h=900&fit=crop",
  ],
  "prijevoz-i-selidbe": [
    "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1614018453562-77f6180d18da?w=1200&h=900&fit=crop",
  ],
  vrtlari: [
    "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=900&fit=crop",
  ],
  klima: [
    "https://images.unsplash.com/photo-1621905252472-e8be8feea233?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&h=900&fit=crop",
  ],
  zidari: [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=900&fit=crop",
  ],
  krovopokrivaci: [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=900&fit=crop",
  ],
  prozori: [
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=900&fit=crop",
  ],
  restorani: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&h=900&fit=crop",
  ],
  hoteli: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=900&fit=crop",
  ],
  slikari: [
    "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1200&h=900&fit=crop",
  ],
  zdravstvo: [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=900&fit=crop",
  ],
  default: [
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=900&fit=crop",
  ],
};

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

function normalizeText(value?: string | null) {
  if (!value) {
    return null;
  }

  const cleaned = value
    .replace(/\u00a0/g, " ")
    .replace(/\u202f/g, " ")
    .replace(/\u2009/g, " ")
    .replace(/\u2013/g, "-")
    .replace(/\u2014/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned === "" ? null : cleaned;
}

function normalizeNumber(value?: string | null) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }

  return Number(normalized.replace(/,/g, "."));
}

function normalizeDate(value?: string | null) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return undefined;
  }

  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function selectFallbackImage(category: CategoryRecord | undefined, businessName: string) {
  const bucket = categoryImages[category?.slug || ""] || categoryImages.default;
  return bucket[hashString(businessName) % bucket.length];
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const fileArg = args.find(arg => arg !== "--dry-run");
  const csvPath = fileArg ? path.resolve(fileArg) : DEFAULT_CSV_PATH;

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found: ${csvPath}`);
  }

  const rawCsv = fs.readFileSync(csvPath, "utf8");
  const rows = parseCsv(rawCsv);

  if (dryRun) {
    console.log(`CSV rows parsed: ${rows.length}`);
    console.log("Sample row:", rows[0]);
    return;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }

  const db = await getDb();
  if (!db) {
    throw new Error("Database connection is not available.");
  }

  const categoryList = (await getAllCategories()) as CategoryRecord[];
  const categoryMap = new Map(categoryList.map(category => [String(category.id), category]));

  let imported = 0;
  let skipped = 0;
  let generatedImages = 0;

  for (const row of rows) {
    const categoryId = Number(row.categoryId);
    const category = categoryMap.get(String(categoryId));
    const googlePlaceId = normalizeText(row.googlePlaceId);
    const name = normalizeText(row.name);

    if (!name || !Number.isFinite(categoryId) || !category) {
      skipped += 1;
      continue;
    }

    const imageUrl = normalizeText(row.imageUrl) || selectFallbackImage(category, name);
    if (!normalizeText(row.imageUrl)) {
      generatedImages += 1;
    }

    await upsertBusiness({
      googlePlaceId,
      categoryId,
      name,
      description: normalizeText(row.description),
      address: normalizeText(row.address),
      phone: normalizeText(row.phone),
      email: normalizeText(row.email),
      website: normalizeText(row.website),
      latitude: normalizeText(row.latitude),
      longitude: normalizeText(row.longitude),
      imageUrl,
      rating: normalizeText(row.rating),
      reviewCount: Number(normalizeNumber(row.reviewCount) || 0),
      openingHours: normalizeText(row.openingHours),
      city: normalizeText(row.city),
      neighborhood: normalizeText(row.neighborhood),
      isActive: Number(normalizeNumber(row.isActive) || 1),
      tags: normalizeText(row.tags),
      createdAt: normalizeDate(row.createdAt),
      updatedAt: normalizeDate(row.updatedAt),
    });

    imported += 1;
    if (imported % 100 === 0) {
      console.log(`Imported ${imported}/${rows.length} businesses...`);
    }
  }

  const totalInDb = await db.select().from(businesses);

  console.log(`CSV rows parsed: ${rows.length}`);
  console.log(`Imported or updated: ${imported}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Generated fallback images: ${generatedImages}`);
  console.log(`Businesses currently in DB: ${totalInDb.length}`);
}

main().catch(error => {
  console.error("Import failed:", error);
  process.exit(1);
});
