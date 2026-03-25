export type Language = "hr" | "en";

export type Translations = Record<string, string>;

const hr: Translations = {
  "site.name": "Split Usluge",
  "site.tagline": "Lokalni imenik usluga, obrta i firmi u Splitu",
  "site.description": "Pronađite lokalne usluge, obrte i firme u Splitu i okolici.",
  "nav.home": "Naslovnica",
  "nav.map": "Mapa",
  "nav.all": "Svi obrti",
  "nav.register": "Registracija",
  "nav.about": "O nama",
  "nav.terms": "Uvjeti",
  "nav.categories": "Kategorije",
  "nav.options": "Opcije",
  "nav.search": "Pretraži usluge...",
  "nav.newService": "Postavi novu uslugu",
  "nav.local": "Lokalno u Splitu",
  "nav.localDesc": "Pronađite najbolje lokalne stručnjake u vašem kvartu.",
  "home.hero.title": "Pronađite lokalne usluge u Splitu",
  "home.hero.subtitle": "Pouzdani obrtnici, servisi i firme na jednom mjestu",
  "home.hero.search": "Pretraži po imenu, adresi...",
  "home.categories": "Kategorije usluga",
  "home.featured": "Istaknuti biznisi",
  "home.viewAll": "Pogledaj sve",
  "home.stats.businesses": "biznisa",
  "home.stats.categories": "kategorija",
  "home.stats.avgRating": "prosječna ocjena",
  "category.businesses": "biznisa u kategoriji",
  "category.avgRating": "Prosječna ocjena",
  "category.contact": "S kontaktom",
  "category.website": "S web stranicom",
  "category.sort.weighted": "Preporučeno",
  "category.sort.rating": "Po ocjeni",
  "category.sort.name": "Po imenu",
  "category.search": "Pretraži u kategoriji...",
  "category.noResults": "Nema rezultata za pretragu",
  "category.faq": "Česta pitanja",
  "business.phone": "Nazovi",
  "business.website": "Web stranica",
  "business.directions": "Upute",
  "business.reviews": "recenzija",
  "business.openNow": "Otvoreno",
  "business.closed": "Zatvoreno",
  "footer.rights": "Sva prava zadržana.",
  "lang.switch": "English",
};

const en: Translations = {
  "site.name": "Split Services",
  "site.tagline": "Local directory of services and businesses in Split",
  "site.description": "Find local services and businesses in Split, Croatia and surrounding areas.",
  "nav.home": "Home",
  "nav.map": "Map",
  "nav.all": "All businesses",
  "nav.register": "Register",
  "nav.about": "About",
  "nav.terms": "Terms",
  "nav.categories": "Categories",
  "nav.options": "Options",
  "nav.search": "Search services...",
  "nav.newService": "Add new service",
  "nav.local": "Local in Split",
  "nav.localDesc": "Find the best local experts in your neighborhood.",
  "home.hero.title": "Find local services in Split",
  "home.hero.subtitle": "Reliable craftsmen, services and businesses in one place",
  "home.hero.search": "Search by name, address...",
  "home.categories": "Service categories",
  "home.featured": "Featured businesses",
  "home.viewAll": "View all",
  "home.stats.businesses": "businesses",
  "home.stats.categories": "categories",
  "home.stats.avgRating": "average rating",
  "category.businesses": "businesses in category",
  "category.avgRating": "Average rating",
  "category.contact": "With contact",
  "category.website": "With website",
  "category.sort.weighted": "Recommended",
  "category.sort.rating": "By rating",
  "category.sort.name": "By name",
  "category.search": "Search in category...",
  "category.noResults": "No results found",
  "category.faq": "Frequently asked questions",
  "business.phone": "Call",
  "business.website": "Website",
  "business.directions": "Directions",
  "business.reviews": "reviews",
  "business.openNow": "Open now",
  "business.closed": "Closed",
  "footer.rights": "All rights reserved.",
  "lang.switch": "Hrvatski",
};

const translations: Record<Language, Translations> = { hr, en };

export function t(key: string, lang: Language = "hr"): string {
  return translations[lang]?.[key] || translations.hr[key] || key;
}

export function detectLanguage(): Language {
  if (typeof window === "undefined") return "hr";
  const path = window.location.pathname;
  if (path.startsWith("/en")) return "en";
  const stored = localStorage.getItem("su_lang");
  if (stored === "en") return "en";
  return "hr";
}

// English category names for SEO
export const CATEGORY_NAMES_EN: Record<string, string> = {
  "automehanicari": "Auto Mechanics",
  "servisi-za-ciscenje": "Cleaning Services",
  "elektricari": "Electricians",
  "frizerski-saloni": "Hair Salons",
  "hoteli": "Hotels",
  "klima": "AC Services",
  "prijevoz-i-selidbe": "Transport & Moving",
  "prozori": "Windows & Carpentry",
  "restorani": "Restaurants",
  "slikari": "Painters & Decorators",
  "stolari": "Woodworkers",
  "stomatolozi": "Dentists",
  "vodoinstalateri": "Plumbers",
  "vrtlari": "Gardeners",
  "vulkanizeri": "Tire Services",
  "zdravstvo": "Healthcare",
  "zidari": "Masons & Construction",
  "ciscenje-apartmana": "Apartment Cleaning",
  "pranje-brodova": "Boat Cleaning",
  "taxi-i-transfer": "Taxi & Transfer",
  "iznajmljivanje-plovila": "Boat Rental",
  "klima-servis-apartmani": "Emergency AC Service",
  "pest-control": "Pest Control",
  "bazeni-i-odrzavanje": "Pool Maintenance",
  "fotografija": "Photography Services",
  "catering": "Catering",
  "turisticki-vodici": "Tour Guides",
  "pranje-tepiha": "Carpet Cleaning",
  "kljucar": "Locksmith",
  "odvoz-otpada": "Waste Removal",
  "sigurnosni-sustavi": "Security Systems",
  "web-dizajn": "Web Design",
};
