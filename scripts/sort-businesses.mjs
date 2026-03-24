/**
 * Smart business re-categorization script.
 * Reads businesses.json, re-assigns categoryId based on name/description keywords,
 * and removes businesses that don't fit any of the 10 categories.
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "..", "server", "static-data", "businesses.json");

const businesses = JSON.parse(readFileSync(DATA_PATH, "utf-8"));

// Category keyword rules: [categoryId, name, keywords (lowercase), negative keywords]
const RULES = [
  {
    id: 1,
    name: "Vulkanizeri",
    keywords: [
      "vulkaniz", "gum", "tire", "pneumati", "auto praon", "car wash", "autopraon",
      "car tire", "car tires", "mega wash", "samouslužna praon", "hotel za gume",
      "gume i naplatci", "wheel", "rim ", "felg",
    ],
    negKeywords: [],
  },
  {
    id: 2,
    name: "Automehaničari",
    keywords: [
      "auto servis", "autoservis", "automehanič", "mehanič", "autoelektr",
      "car service", "car repair", "auto repair", "mototest", "autokuća",
      "autolimar", "autodijelovi", "auto dijelov", "tokić", "ciak auto",
      "kotač", "auto centar", "autocentar", "auto ključ", "bravarija auto",
      "limarija", "autolakir", "lakirnica",
    ],
    negKeywords: ["praon", "wash"],
  },
  {
    id: 3,
    name: "Vodoinstalateri",
    keywords: [
      "vodoinstal", "instalater", "plumb", "vodovod", "kanalizac",
      "grijanj", "heating", "sanitarij", "voda i kanal", "aqua servis",
      "water supply", "instalacije", "kućni meštar", "instalat",
    ],
    negKeywords: ["beach", "plaža", "aqueduct", "vodopád"],
  },
  {
    id: 4,
    name: "Električari",
    keywords: [
      "električar", "elektro", "electri", "elektrik", "el. instal",
      "elektroinst", "elektrotehna", "električ", "struja", "rasvjet",
      "solar panel", "fotonapons", "delta electric",
    ],
    negKeywords: ["chipoteka", "instar info", "trgovin", "dućan", "shop", "nautic"],
  },
  {
    id: 5,
    name: "Servisi za čišćenje",
    keywords: [
      "čišćenj", "čišćenje", "clean", "praon", "laund", "pranje",
      "dubinsk", "higijena", "dezinfek", "dezinsek", "fumigac",
      "tepih servis", "carpet", "lavander", "detailing",
    ],
    negKeywords: ["super konzum", "studenac", "konzum", "hotel", "market", "autoservis"],
  },
  {
    id: 6,
    name: "Stolari",
    keywords: [
      "stolar", "drvo", "namješt", "furnitur", "wood", "carpent",
      "mjera", "po mjeri", "kuhinja po", "drvena", "parket", "podov",
      "brodogradnj", "brodski pod",
    ],
    negKeywords: [
      "kaufland", "lesnina", "emmezeta", "ikea", "mömax", "prima namješt",
      "golden gate", "telegrin", "trebam", "seosko", "jewelry", "brodometalurg",
      "peak", "restaurant", "restoran", "caffe", "bar ", "pizzer", "hotel",
    ],
  },
  {
    id: 7,
    name: "Frizerski saloni",
    keywords: [
      "friz", "barber", "hair", "beauty", "salon", "kosa", "koafor",
      "brijačn", "brijač", "brada", "beard", "she beauty", "mulier",
      "couture", "leekarija", "frame beauty", "ritual barber",
      "studio keko", "d-art studio",
    ],
    negKeywords: [],
  },
  {
    id: 8,
    name: "Stomatolozi",
    keywords: [
      "dental", "stomatol", "zub", "dent", "implant", "ortodon",
      "zubni", "zubar", "oral", "endodont", "protet",
    ],
    negKeywords: [],
  },
  {
    id: 9,
    name: "Prijevoz i selidbe",
    keywords: [
      "selidb", "prijevoz", "transport", "taxi", "transfer", "dostav",
      "moving", "kombi", "kamion", "rent a car", "shuttle", "prevoz",
      "logist", "kurir", "express dostav", "cargo",
    ],
    negKeywords: [
      "pizzer", "restoran", "restaurant", "pub", "bar ", "caffe",
      "chinese", "food", "pizz", "konoba", "spiza", "grill",
      "cvjećar", "cvijeć",
    ],
  },
  {
    id: 10,
    name: "Vrtlari",
    keywords: [
      "vrt", "garden", "horticul", "travnjak", "green", "uređenje vrt",
      "sadnice", "drveć", "stabala", "rasadnik", "arborist", "landscap",
      "održavanje zelen", "park šum",
    ],
    negKeywords: [
      "restoran", "restaurant", "caffe", "bar ", "pizzer", "konoba",
      "grill", "pub", "beer", "club", "ćevabdžin", "tennis", "sport",
      "hotel", "hostel", "apart",
    ],
  },
];

function matchesKeywords(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some(kw => lower.includes(kw.toLowerCase()));
}

function findBestCategory(business) {
  const text = `${business.name} ${business.description || ""}`.toLowerCase();

  // First: check if it matches its current category
  const currentRule = RULES.find(r => r.id === business.categoryId);
  if (currentRule) {
    const matchesCurrent = currentRule.keywords.some(kw => text.includes(kw.toLowerCase()));
    const blockedCurrent = currentRule.negKeywords.some(kw => text.includes(kw.toLowerCase()));
    if (matchesCurrent && !blockedCurrent) {
      return business.categoryId; // Stays in current category
    }
  }

  // Second: find the best matching category
  let bestMatch = null;
  let bestScore = 0;

  for (const rule of RULES) {
    const blocked = rule.negKeywords.some(kw => text.includes(kw.toLowerCase()));
    if (blocked) continue;

    let score = 0;
    for (const kw of rule.keywords) {
      if (text.includes(kw.toLowerCase())) {
        score += kw.length; // Longer keyword matches are more specific
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = rule.id;
    }
  }

  return bestMatch;
}

// Process all businesses
let kept = 0;
let removed = 0;
let moved = 0;
let stayed = 0;
const removedList = [];
const movedList = [];
const result = [];

for (const b of businesses) {
  const newCat = findBestCategory(b);

  if (!newCat) {
    removed++;
    removedList.push(`  [${b.id}] ${b.name.substring(0, 50)} (was cat ${b.categoryId})`);
    continue;
  }

  if (newCat !== b.categoryId) {
    const oldRule = RULES.find(r => r.id === b.categoryId);
    const newRule = RULES.find(r => r.id === newCat);
    movedList.push(
      `  [${b.id}] ${b.name.substring(0, 45)} : ${oldRule?.name} → ${newRule?.name}`
    );
    b.categoryId = newCat;
    moved++;
  } else {
    stayed++;
  }

  result.push(b);
  kept++;
}

// Stats
console.log("\n=== REZULTATI SORTIRANJA ===\n");
console.log(`Ukupno biznisa: ${businesses.length}`);
console.log(`Zadržano: ${kept}`);
console.log(`  - Ostali u istoj kategoriji: ${stayed}`);
console.log(`  - Premješteni u drugu: ${moved}`);
console.log(`Uklonjeno (ne pripadaju nijednoj): ${removed}`);

console.log("\n--- PREMJEŠTENI ---");
movedList.slice(0, 50).forEach(m => console.log(m));
if (movedList.length > 50) console.log(`  ... i još ${movedList.length - 50}`);

console.log("\n--- UKLONJENI (prvih 50) ---");
removedList.slice(0, 50).forEach(r => console.log(r));
if (removedList.length > 50) console.log(`  ... i još ${removedList.length - 50}`);

// Final category counts
console.log("\n--- KONAČAN BROJ PO KATEGORIJI ---");
for (const rule of RULES) {
  const count = result.filter(b => b.categoryId === rule.id).length;
  console.log(`  ${rule.name}: ${count}`);
}

// Write result
writeFileSync(DATA_PATH, JSON.stringify(result, null, 2), "utf-8");
console.log(`\nSpremiljen businesses.json s ${result.length} biznisa.`);
