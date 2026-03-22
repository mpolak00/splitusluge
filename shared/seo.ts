import { ALL_BUSINESSES_PATH, LEGACY_ALL_BUSINESSES_PATH } from "./paths";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type SeoPayload = {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: "website" | "article";
  twitterTitle: string;
  twitterDescription: string;
  robots: string;
  locale: string;
  siteName: string;
  structuredData: Array<Record<string, unknown>>;
};

export type CategoryPageCopy = {
  title: string;
  intro: string;
  keywords: string[];
  faq: FaqItem[];
};

export type SitemapEntry = {
  path: string;
  changefreq?: string;
  priority?: string;
  lastmod?: string;
};

type SeoBuilderInput = {
  title: string;
  description: string;
  keywords: string[];
  pathname: string;
  siteUrl?: string;
  ogType?: "website" | "article";
  robots?: string;
  structuredData?: Array<Record<string, unknown>>;
  ogImagePath?: string;
};

export const DEFAULT_SITE_URL = "https://split-usluge.com";
export const DEFAULT_SITE_NAME = "Split Usluge";
export const DEFAULT_OG_IMAGE = "/images/hero-split.jpg";

export const SERVICE_AREAS = [
  "Split",
  "Solin",
  "Kaštela",
  "Podstrana",
  "Dugopolje",
  "Omiš",
];

const CATEGORY_ALIASES: Record<string, string> = {
  ciscenje: "servisi-za-ciscenje",
  prijevoz: "prijevoz-i-selidbe",
  stomatolog: "stomatolozi",
};

const CATEGORY_CONTENT: Record<string, CategoryPageCopy> = {
  automehanicari: {
    title: "Automehaničari",
    intro:
      "Pronađite automehaničare u Splitu i okolici za dijagnostiku, redovni servis, pripremu za tehnički pregled i hitne kvarove. Na jednom mjestu možete usporediti lokaciju, kontakt, radno vrijeme i ocjene.",
    keywords: [
      "automehaničar split",
      "auto servis split",
      "servis auta split",
      "dijagnostika vozila split",
    ],
    faq: [
      {
        question: "Kako odabrati dobrog automehaničara u Splitu?",
        answer:
          "Najbolje je usporediti ocjene, broj recenzija, lokaciju i specijalizaciju servisa. Posebno je korisno provjeriti nude li dijagnostiku, limarske radove ili servis određene marke vozila.",
      },
      {
        question: "Mogu li pronaći servis blizu svoje lokacije?",
        answer:
          "Da. Na stranici kategorije možete pregledati popis poslovanja i kartu kako biste lakše pronašli servis u svom kvartu ili najbližu opciju u Splitu i okolici.",
      },
    ],
  },
  "servisi-za-ciscenje": {
    title: "Servisi za čišćenje",
    intro:
      "Usporedite servise za čišćenje u Splitu za stanove, apartmane, urede i poslovne prostore. Stranica pomaže brzo pronaći kontakt, područje rada i dodatne usluge poput dubinskog čišćenja.",
    keywords: [
      "čišćenje split",
      "servis za čišćenje split",
      "čišćenje apartmana split",
      "dubinsko čišćenje split",
    ],
    faq: [
      {
        question: "Jesu li navedeni servisi za čišćenje pogodni za apartmane?",
        answer:
          "Mnogi servisi rade čišćenje apartmana, stanova i poslovnih prostora. U opisu i oznakama možete provjeriti nudi li pojedini pružatelj upravo ono što vam treba.",
      },
      {
        question: "Kako pronaći servis za hitno čišćenje u Splitu?",
        answer:
          "Najbrže je pregledati listu, filtrirati rezultate i odmah kontaktirati pružatelje koji imaju istaknut telefon ili radno vrijeme.",
      },
    ],
  },
  elektricari: {
    title: "Električari",
    intro:
      "Popis električara u Splitu za hitne intervencije, elektroinstalacije, rasvjetu, popravke i adaptacije. Brzo pronađite majstora prema lokaciji, kontaktu i korisničkim ocjenama.",
    keywords: [
      "električar split",
      "elektroinstalacije split",
      "majstor za struju split",
      "hitni električar split",
    ],
    faq: [
      {
        question: "Mogu li pronaći električara za hitne intervencije?",
        answer:
          "Da. Za hitne kvarove preporuka je pregledati električare s jasno istaknutim telefonom i radnim vremenom, kako biste ih mogli odmah kontaktirati.",
      },
      {
        question: "Jesu li dostupni i izvođači za veće adaptacije?",
        answer:
          "Da. Uz manje popravke, mnogi električari rade i kompletne instalacije, rasvjetu i pripremu za renovacije stanova ili poslovnih prostora.",
      },
    ],
  },
  "frizerski-saloni": {
    title: "Frizerski saloni",
    intro:
      "Pregled frizerskih salona u Splitu za muško i žensko šišanje, bojanje, tretmane i njegu kose. Usporedite ocjene, adrese i filtre kako biste brže pronašli salon koji vam odgovara.",
    keywords: [
      "frizer split",
      "frizerski salon split",
      "muški frizer split",
      "ženski frizer split",
    ],
    faq: [
      {
        question: "Mogu li filtrirati muške i ženske frizerske salone?",
        answer:
          "Da. Ova kategorija ima dodatni filter kojim možete brže izdvojiti muške, ženske ili opće salone.",
      },
      {
        question: "Kako pronaći frizerski salon u svom kvartu?",
        answer:
          "Pogledajte kartu i adresu svakog salona, zatim usporedite ocjene i broj recenzija prije poziva ili posjeta.",
      },
    ],
  },
  hoteli: {
    title: "Hoteli",
    intro:
      "Pregled hotela u Splitu i okolici s osnovnim informacijama, lokacijom i kontaktima na jednom mjestu. Korisno za brzo pretraživanje smještaja prije direktnog kontakta ili rezervacije.",
    keywords: ["hoteli split", "smještaj split", "hotel split centar", "hoteli dalmacija"],
    faq: [
      {
        question: "Jesu li dostupne informacije o lokaciji hotela?",
        answer:
          "Da. Svaki unos može sadržavati adresu, lokaciju na karti i poveznicu za otvaranje u mapama radi lakšeg snalaženja.",
      },
      {
        question: "Mogu li usporediti više hotela na jednom mjestu?",
        answer:
          "Da. Popis omogućuje brz pregled više opcija prije odlaska na službenu stranicu hotela ili izravnog kontakta.",
      },
    ],
  },
  klima: {
    title: "Klima servisi",
    intro:
      "Pronađite klima servise u Splitu za montažu, punjenje plina, redovni servis i hitne popravke klima uređaja. Na jednom mjestu možete usporediti kontakt, ocjene i područje rada.",
    keywords: [
      "klima servis split",
      "montaža klime split",
      "servis klima uređaja split",
      "popravak klime split",
    ],
    faq: [
      {
        question: "Pomaže li stranica pronaći servis za montažu klime?",
        answer:
          "Da. U ovoj kategoriji možete pronaći izvođače za montažu, servis i održavanje klima uređaja u Splitu i okolici.",
      },
      {
        question: "Kako odabrati klima servis?",
        answer:
          "Provjerite lokaciju, radno vrijeme, broj recenzija i specifične usluge poput punjenja plina, čišćenja ili popravka vanjske jedinice.",
      },
    ],
  },
  "prijevoz-i-selidbe": {
    title: "Prijevoz i selidbe",
    intro:
      "Usporedite lokalne prijevoznike, selidbe i kombi prijevoz u Splitu. Ovdje možete brzo pronaći kontakte za prijevoz stvari, manjih tereta, selidbi stanova i poslovnih prostora.",
    keywords: [
      "selidbe split",
      "kombi prijevoz split",
      "prijevoz stvari split",
      "odvoz glomaznog otpada split",
    ],
    faq: [
      {
        question: "Jesu li na stranici samo selidbe ili i drugi oblici prijevoza?",
        answer:
          "Možete pronaći selidbe, kombi prijevoz, prijevoz robe i srodne usluge, ovisno o podacima pojedinog poslovanja.",
      },
      {
        question: "Kako najbrže doći do ponude za selidbu?",
        answer:
          "Najbrže je odabrati nekoliko prijevoznika iz popisa i izravno ih kontaktirati telefonom ili preko web stranice.",
      },
    ],
  },
  prozori: {
    title: "Prozori i stolarija",
    intro:
      "Popis tvrtki za prozore i stolariju u Splitu uključuje montažu, servis, zamjenu PVC i ALU stolarije te prilagođena rješenja za domove i poslovne prostore.",
    keywords: [
      "prozori split",
      "pvc stolarija split",
      "alu stolarija split",
      "zamjena prozora split",
    ],
    faq: [
      {
        question: "Mogu li ovdje pronaći izvođače za PVC i ALU stolariju?",
        answer:
          "Da. U ovoj kategoriji mogu se pronaći izvođači za različite vrste prozora, vrata i stolarije, uz kontakt podatke i lokaciju.",
      },
      {
        question: "Jesu li dostupne usluge servisa postojećih prozora?",
        answer:
          "Da. Ovisno o poslovanju, uz montažu su često navedeni i servis, zamjena okova ili popravci postojećih sustava.",
      },
    ],
  },
  restorani: {
    title: "Restorani",
    intro:
      "Pretražite restorane u Splitu po lokaciji, kontaktu i osnovnim informacijama. Korisno za brz pregled ponude prije dolaska, rezervacije ili otvaranja u kartama.",
    keywords: ["restorani split", "gdje jesti split", "konoba split", "restoran split centar"],
    faq: [
      {
        question: "Mogu li pronaći restorane po lokaciji?",
        answer:
          "Da. Popis uključuje adresu i kartu kako biste lakše pronašli restoran u centru Splita ili okolnim kvartovima.",
      },
      {
        question: "Jesu li na raspolaganju i kontakti restorana?",
        answer:
          "Da. Ako su dostupni, vidjet ćete broj telefona i web stranicu za rezervacije ili dodatne informacije.",
      },
    ],
  },
  slikari: {
    title: "Soboslikari i ličioci",
    intro:
      "Pronađite soboslikare u Splitu za bojanje stanova, poslovnih prostora, fasada i adaptacije. Brzo usporedite kontakte, ocjene i lokacije izvođača.",
    keywords: [
      "soboslikar split",
      "ličilac split",
      "bojanje stanova split",
      "farbanje zidova split",
    ],
    faq: [
      {
        question: "Pokrivaju li soboslikari i manje i veće radove?",
        answer:
          "Da. Ovisno o izvođaču, možete pronaći majstore za manje zahvate, adaptacije stanova, poslovne prostore i fasadne radove.",
      },
      {
        question: "Kako odabrati soboslikara za adaptaciju stana?",
        answer:
          "Provjerite recenzije, lokaciju, fotografije i opise usluga, pa zatim usporedite nekoliko izvođača prije dogovora.",
      },
    ],
  },
  stolari: {
    title: "Stolari",
    intro:
      "Usporedite stolare u Splitu za izradu namještaja po mjeri, kuhinja, ugradbenih ormara i drugih drvenih elemenata. Popis pomaže brzo pronaći lokalnog izvođača s odgovarajućom ponudom.",
    keywords: [
      "stolar split",
      "namještaj po mjeri split",
      "kuhinje po mjeri split",
      "drveni namještaj split",
    ],
    faq: [
      {
        question: "Jesu li dostupni stolari za namještaj po mjeri?",
        answer:
          "Da. U ovoj kategoriji možete pronaći izvođače za kuhinje, ormare, police i ostali namještaj po mjeri.",
      },
      {
        question: "Mogu li pronaći stolara blizu sebe?",
        answer:
          "Da. Adresa, lokacija na karti i kontakti pomažu da brzo izdvojite stolara iz Splita ili okolice.",
      },
    ],
  },
  stomatolozi: {
    title: "Stomatološke ordinacije",
    intro:
      "Pregled stomatoloških ordinacija u Splitu za redovne preglede, estetsku stomatologiju, implantate i hitne dentalne zahvate. Usporedite kontakte, lokacije i recenzije prije naručivanja.",
    keywords: [
      "stomatolog split",
      "zubar split",
      "dentalna ordinacija split",
      "implantati split",
    ],
    faq: [
      {
        question: "Mogu li pronaći stomatologa prema lokaciji?",
        answer:
          "Da. Svaki unos može sadržavati adresu i kartu, što olakšava izbor ordinacije blizu kuće, posla ili centra Splita.",
      },
      {
        question: "Jesu li navedene i estetske dentalne usluge?",
        answer:
          "Ovisno o ordinaciji, uz osnovne podatke mogu biti navedene i usluge poput izbjeljivanja, implantologije ili protetike.",
      },
    ],
  },
  vodoinstalateri: {
    title: "Vodoinstalateri",
    intro:
      "Pronađite vodoinstalatere u Splitu za hitne intervencije, odštopavanje odvoda, zamjenu sanitarija i adaptacije kupaonica. Popis je prilagođen brzom pronalasku dostupnog majstora u vašoj blizini.",
    keywords: [
      "vodoinstalater split",
      "odštopavanje odvoda split",
      "hitni vodoinstalater split",
      "adaptacija kupaonice split",
    ],
    faq: [
      {
        question: "Mogu li pronaći vodoinstalatera za hitnu intervenciju?",
        answer:
          "Da. Za hitne situacije korisno je otvoriti ovu kategoriju, provjeriti telefone i odmah kontaktirati nekoliko najbližih izvođača.",
      },
      {
        question: "Jesu li obuhvaćene i veće adaptacije kupaonica?",
        answer:
          "Da. Uz manje popravke često su dostupni i izvođači za zamjenu instalacija, sanitarija i kompletnu adaptaciju kupaonica.",
      },
    ],
  },
  vrtlari: {
    title: "Vrtlari i održavanje okućnice",
    intro:
      "Popis vrtlara u Splitu za uređenje okućnice, šišanje živice, navodnjavanje i redovno održavanje zelenih površina. Usporedite kontakte i lokacije za brži dogovor radova.",
    keywords: ["vrtlar split", "uređenje okućnice split", "održavanje vrta split", "navodnjavanje split"],
    faq: [
      {
        question: "Mogu li pronaći vrtlara za redovno održavanje?",
        answer:
          "Da. Ova kategorija uključuje i povremene i redovne usluge održavanja vrtova, dvorišta i zelenih površina.",
      },
      {
        question: "Jesu li dostupne i usluge navodnjavanja?",
        answer:
          "Kod pojedinih izvođača dostupni su i sustavi navodnjavanja, sezonska priprema vrta i slični radovi.",
      },
    ],
  },
  vulkanizeri: {
    title: "Vulkanizeri",
    intro:
      "Pronađite vulkanizere u Splitu za zamjenu guma, balansiranje, popravak pneumatika i sezonsko skladištenje. Na jednom mjestu možete usporediti lokaciju, telefon i ocjene servisa.",
    keywords: [
      "vulkanizer split",
      "zamjena guma split",
      "balansiranje guma split",
      "servis guma split",
    ],
    faq: [
      {
        question: "Kako pronaći vulkanizera blizu mene u Splitu?",
        answer:
          "Otvorite ovu kategoriju, pregledajte lokacije na karti i usporedite telefone servisa kako biste brzo kontaktirali najbližu opciju.",
      },
      {
        question: "Jesu li uvrštene i usluge popravka guma?",
        answer:
          "Da. U ovoj kategoriji se često nalaze servisi za zamjenu, balansiranje, krpanje i srodne usluge vezane uz pneumatike.",
      },
    ],
  },
  zdravstvo: {
    title: "Zdravstvene usluge",
    intro:
      "Pretražite zdravstvene usluge u Splitu na jednom mjestu, od specijalističkih ordinacija do privatnih pružatelja različitih medicinskih usluga. Usporedite lokaciju i osnovne informacije prije kontakta.",
    keywords: ["zdravstvo split", "privatna ordinacija split", "medicinske usluge split", "ambulanta split"],
    faq: [
      {
        question: "Koje vrste zdravstvenih usluga mogu pronaći?",
        answer:
          "To ovisi o podacima u bazi, ali kategorija može uključivati različite ordinacije, ambulante i specijalističke usluge na području Splita i okolice.",
      },
      {
        question: "Jesu li dostupni kontakti i adrese?",
        answer:
          "Da. Kada su dostupni u bazi, prikazani su telefon, web stranica, lokacija i osnovne informacije o poslovanju.",
      },
    ],
  },
  zidari: {
    title: "Zidari i građevinski radovi",
    intro:
      "Pregled zidara u Splitu za grube radove, adaptacije, zidanje i manje građevinske zahvate. Popis pomaže brzo doći do kontakata i usporediti izvođače po lokaciji i dojmu korisnika.",
    keywords: [
      "zidar split",
      "građevinski radovi split",
      "adaptacija stana split",
      "majstor za zidanje split",
    ],
    faq: [
      {
        question: "Jesu li dostupni izvođači za manje i veće građevinske radove?",
        answer:
          "Da. U ovoj kategoriji mogu se pronaći izvođači za zidanje, pregradne zidove, adaptacije i druge građevinske zahvate.",
      },
      {
        question: "Kako odabrati zidara za adaptaciju?",
        answer:
          "Preporuka je usporediti ocjene, lokaciju, opise usluga i po potrebi kontaktirati više izvođača radi ponude.",
      },
    ],
  },
};

const STATIC_ROUTE_CONTENT: Record<string, { title: string; description: string; keywords: string[] }> = {
  "/": {
    title: "Split Usluge | Lokalni imenik obrta i usluga u Splitu",
    description:
      "Pronađite provjerene obrte, majstore i lokalne usluge u Splitu, Solinu, Kaštelima, Podstrani, Dugopolju i Omišu. Kategorije, karta i kontakti na jednom mjestu.",
    keywords: [
      "split usluge",
      "obrti split",
      "lokalne usluge split",
      "majstori split",
      "imenik obrta split",
    ],
  },
  "/mapa": {
    title: "Mapa lokalnih usluga u Splitu | Split Usluge",
    description:
      "Pregledajte lokalne usluge i obrte na karti Splita i okolice. Brže pronađite najbliži servis, salon ili majstora prema lokaciji.",
    keywords: ["mapa usluga split", "lokalne usluge karta", "obrti split mapa"],
  },
  [ALL_BUSINESSES_PATH]: {
    title: "Svi obrti i lokalne usluge u Splitu | Split Usluge",
    description:
      "Popis svih dostupnih obrta i lokalnih usluga u Splitu i okolici. Usporedite kontakte, lokacije i kategorije na jednoj stranici.",
    keywords: ["svi obrti split", "sve usluge split", "imenik obrta split"],
  },
  "/registracija": {
    title: "Registracija obrta i poslovanja | Split Usluge",
    description:
      "Dodajte svoj obrt ili poslovanje u lokalni imenik Split Usluge i povećajte vidljivost u Splitu i okolici.",
    keywords: ["registracija obrta split", "dodaj poslovanje split", "oglašavanje obrta split"],
  },
  "/o-nama": {
    title: "O nama | Split Usluge",
    description:
      "Saznajte kako Split Usluge pomaže građanima i turistima da lakše pronađu pouzdane lokalne usluge u Splitu i okolici.",
    keywords: ["o nama split usluge", "lokalni imenik split"],
  },
  "/uvjeti": {
    title: "Uvjeti korištenja | Split Usluge",
    description:
      "Uvjeti korištenja i osnovne informacije o pravilima korištenja platforme Split Usluge.",
    keywords: ["uvjeti korištenja split usluge"],
  },
};

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function resolveCategorySlug(slug: string): string {
  return CATEGORY_ALIASES[slug] || slug;
}

function normalizeKnownPath(pathname: string): string {
  if (pathname === LEGACY_ALL_BUSINESSES_PATH) {
    return ALL_BUSINESSES_PATH;
  }

  if (pathname.startsWith("/usluga/")) {
    const slug = pathname.replace("/usluga/", "");
    const resolvedSlug = resolveCategorySlug(slug);
    return `/usluga/${resolvedSlug}`;
  }

  return pathname;
}

function normalizePath(pathname: string): string {
  try {
    const url = pathname.startsWith("http")
      ? new URL(pathname)
      : new URL(pathname, DEFAULT_SITE_URL);
    const normalized = url.pathname.replace(/\/+$/, "");
    return normalizeKnownPath(normalized === "" ? "/" : normalized);
  } catch {
    return "/";
  }
}

function getBaseUrl(siteUrl?: string): string {
  return stripTrailingSlash(siteUrl || DEFAULT_SITE_URL);
}

function toTitleCase(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function getFallbackCategorySlugs(): string[] {
  return Object.keys(CATEGORY_CONTENT);
}

export function getCategoryCopy(slug: string, fallbackName?: string | null): CategoryPageCopy {
  const known = CATEGORY_CONTENT[resolveCategorySlug(slug)];
  if (known) {
    return known;
  }

  const name = fallbackName || toTitleCase(slug);
  return {
    title: name,
    intro: `${name} u Splitu i okolici na jednom mjestu. Usporedite lokaciju, kontakt podatke i dostupne informacije prije nego što odaberete poslovanje koje vam najviše odgovara.`,
    keywords: [
      `${name.toLowerCase()} split`,
      `${name.toLowerCase()} split i okolica`,
      `lokalne usluge ${name.toLowerCase()} split`,
    ],
    faq: [
      {
        question: `Kako odabrati ${name.toLowerCase()} u Splitu?`,
        answer:
          "Usporedite lokaciju, dostupne kontakte, ocjene i dodatne informacije na stranici kategorije kako biste lakše suzili izbor.",
      },
      {
        question: `Mogu li pronaći ${name.toLowerCase()} blizu sebe?`,
        answer:
          "Da. Popis i karta pomažu da brzo izdvojite poslovanja u Splitu ili okolnim mjestima koja su vam najbliža.",
      },
    ],
  };
}

function buildBreadcrumbs(pathname: string, categoryTitle?: string, businessTitle?: string): BreadcrumbItem[] {
  const normalized = normalizePath(pathname);
  if (normalized === "/") {
    return [{ name: "Naslovnica", path: "/" }];
  }

  if (normalized.startsWith("/usluga/")) {
    return [
      { name: "Naslovnica", path: "/" },
      { name: "Kategorije", path: ALL_BUSINESSES_PATH },
      { name: categoryTitle || "Usluga", path: normalized },
    ];
  }

  if (normalized.startsWith("/poslovanje/")) {
    return [
      { name: "Naslovnica", path: "/" },
      { name: "Poslovanja", path: ALL_BUSINESSES_PATH },
      { name: businessTitle || "Profil poslovanja", path: normalized },
    ];
  }

  const routeLabel =
    normalized === "/mapa"
      ? "Mapa"
      : normalized === ALL_BUSINESSES_PATH
        ? "Svi obrti"
        : normalized === "/registracija"
          ? "Registracija"
          : normalized === "/o-nama"
            ? "O nama"
            : normalized === "/uvjeti"
              ? "Uvjeti"
              : "Stranica";

  return [
    { name: "Naslovnica", path: "/" },
    { name: routeLabel, path: normalized },
  ];
}

export function buildBreadcrumbSchema(siteUrl: string, breadcrumbs: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function buildBaseStructuredData(siteUrl: string) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: DEFAULT_SITE_NAME,
      url: siteUrl,
      inLanguage: "hr-HR",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: DEFAULT_SITE_NAME,
      url: siteUrl,
      logo: `${siteUrl}${DEFAULT_OG_IMAGE}`,
      areaServed: SERVICE_AREAS,
      sameAs: [],
    },
  ];
}

export function buildSeoPayload({
  title,
  description,
  keywords,
  pathname,
  siteUrl,
  ogType = "website",
  robots = "index, follow",
  structuredData = [],
  ogImagePath = DEFAULT_OG_IMAGE,
}: SeoBuilderInput): SeoPayload {
  const baseUrl = getBaseUrl(siteUrl);
  const normalized = normalizePath(pathname);
  const canonicalPath = normalized === "/" ? "" : normalized;
  const canonicalUrl = `${baseUrl}${canonicalPath}`;
  const ogImage = `${baseUrl}${ogImagePath}`;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    canonicalUrl,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogType,
    twitterTitle: title,
    twitterDescription: description,
    robots,
    locale: "hr_HR",
    siteName: DEFAULT_SITE_NAME,
    structuredData: structuredData.length > 0 ? structuredData : buildBaseStructuredData(baseUrl),
  };
}

export function serializeStructuredData(data: Array<Record<string, unknown>>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function getSeoForPath(pathname: string, siteUrl?: string): SeoPayload {
  const baseUrl = getBaseUrl(siteUrl);
  const normalized = normalizePath(pathname);
  const ogImage = `${baseUrl}${DEFAULT_OG_IMAGE}`;

  if (normalized.startsWith("/usluga/")) {
    const slug = normalized.replace("/usluga/", "");
    const category = getCategoryCopy(slug);
    const breadcrumbs = buildBreadcrumbs(normalized, category.title);
    const title = `${category.title} u Splitu | ${DEFAULT_SITE_NAME}`;
    const description = `${category.intro} Pokrivamo područje: ${SERVICE_AREAS.join(", ")}.`;

    return {
      title,
      description,
      keywords: [...category.keywords, "Split usluge", "lokalne usluge Split"].join(", "),
      canonicalUrl: `${baseUrl}${normalized}`,
      ogTitle: title,
      ogDescription: description,
      ogImage,
      ogType: "article",
      twitterTitle: title,
      twitterDescription: description,
      robots: "index, follow",
      locale: "hr_HR",
      siteName: DEFAULT_SITE_NAME,
      structuredData: [
        ...buildBaseStructuredData(baseUrl),
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description,
          url: `${baseUrl}${normalized}`,
          inLanguage: "hr-HR",
          about: category.title,
          areaServed: SERVICE_AREAS,
        },
        buildBreadcrumbSchema(baseUrl, breadcrumbs),
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: category.faq.map(item => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        },
      ],
    };
  }

  if (normalized.startsWith("/poslovanje/")) {
    const parts = normalized.split("/").filter(Boolean);
    const businessSlug = parts[2] || "profil-poslovanja";
    const businessName = toTitleCase(businessSlug);
    const breadcrumbs = buildBreadcrumbs(normalized, undefined, businessName);
    const title = `${businessName} | ${DEFAULT_SITE_NAME}`;
    const description = `${businessName} u Splitu i okolici. Kontakt, lokacija i osnovne informacije o poslovanju dostupne su na Split Uslugama.`;

    return {
      title,
      description,
      keywords: [
        `${businessName.toLowerCase()} split`,
        `kontakt ${businessName.toLowerCase()}`,
        "lokalne usluge split",
        "split usluge",
      ].join(", "),
      canonicalUrl: `${baseUrl}${normalized}`,
      ogTitle: title,
      ogDescription: description,
      ogImage,
      ogType: "article",
      twitterTitle: title,
      twitterDescription: description,
      robots: "index, follow",
      locale: "hr_HR",
      siteName: DEFAULT_SITE_NAME,
      structuredData: [
        ...buildBaseStructuredData(baseUrl),
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: title,
          description,
          url: `${baseUrl}${normalized}`,
          inLanguage: "hr-HR",
        },
        buildBreadcrumbSchema(baseUrl, breadcrumbs),
      ],
    };
  }

  const routeContent = STATIC_ROUTE_CONTENT[normalized] || STATIC_ROUTE_CONTENT["/"];
  const breadcrumbs = buildBreadcrumbs(normalized);
  const title = routeContent.title;
  const description = routeContent.description;

  return {
    title,
    description,
    keywords: routeContent.keywords.join(", "),
    canonicalUrl: `${baseUrl}${normalized === "/" ? "" : normalized}`,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogType: "website",
    twitterTitle: title,
    twitterDescription: description,
    robots: "index, follow",
    locale: "hr_HR",
    siteName: DEFAULT_SITE_NAME,
    structuredData: [
      ...buildBaseStructuredData(baseUrl),
      {
        "@context": "https://schema.org",
        "@type": normalized === "/" ? "CollectionPage" : "WebPage",
        name: title,
        description,
        url: `${baseUrl}${normalized === "/" ? "" : normalized}`,
        inLanguage: "hr-HR",
        areaServed: SERVICE_AREAS,
      },
      buildBreadcrumbSchema(baseUrl, breadcrumbs),
    ],
  };
}

export function buildRobotsTxt(siteUrl?: string): string {
  const baseUrl = getBaseUrl(siteUrl);

  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    "User-agent: Googlebot",
    "Allow: /",
    "",
    "User-agent: Bingbot",
    "Allow: /",
    "",
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ].join("\n");
}

export function buildSitemapXml(
  categorySlugs: string[],
  dynamicEntries: SitemapEntry[] = [],
  siteUrl?: string
): string {
  const baseUrl = getBaseUrl(siteUrl);
  const today = new Date().toISOString().slice(0, 10);
  const staticRoutes: SitemapEntry[] = [
    { path: "", changefreq: "weekly", priority: "1.0" },
    { path: "/mapa", changefreq: "weekly", priority: "0.8" },
    { path: ALL_BUSINESSES_PATH, changefreq: "daily", priority: "0.9" },
    { path: "/registracija", changefreq: "monthly", priority: "0.7" },
    { path: "/o-nama", changefreq: "monthly", priority: "0.6" },
    { path: "/uvjeti", changefreq: "monthly", priority: "0.4" },
  ];

  const categoryRoutes: SitemapEntry[] = Array.from(
    new Set(categorySlugs.map(resolveCategorySlug))
  )
    .filter(Boolean)
    .sort()
    .map(slug => ({
      path: `/usluga/${slug}`,
      changefreq: "weekly",
      priority: "0.8",
    }));

  const urls = [...staticRoutes, ...categoryRoutes, ...dynamicEntries]
    .map(route => [
      "  <url>",
      `    <loc>${baseUrl}${route.path}</loc>`,
      `    <lastmod>${route.lastmod || today}</lastmod>`,
      `    <changefreq>${route.changefreq || "weekly"}</changefreq>`,
      `    <priority>${route.priority || "0.6"}</priority>`,
      "  </url>",
    ].join("\n"))
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}
