// Mini-site HTML generator for business landing pages
// Produces a complete, standalone single-file HTML page with inlined CSS

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Business {
  name: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  imageUrl?: string | null;
  rating?: string | null;
  reviewCount?: number | null;
  openingHours?: string | null;
}

interface Category {
  name: string;
  slug: string;
}

type Language = 'hr' | 'en';

interface ColorScheme {
  primary: string;
  gradient: string;
  light: string;
}

// ---------------------------------------------------------------------------
// Color schemes per category slug
// ---------------------------------------------------------------------------

const SERVICE_COLORS: Record<string, ColorScheme> = {
  automehanicari: {
    primary: '#e67e22',
    gradient: 'linear-gradient(135deg, #e67e22, #d35400)',
    light: '#fef5ec',
  },
  'servisi-za-ciscenje': {
    primary: '#00bcd4',
    gradient: 'linear-gradient(135deg, #00bcd4, #00838f)',
    light: '#e0f7fa',
  },
  'ciscenje-apartmana': {
    primary: '#00bcd4',
    gradient: 'linear-gradient(135deg, #00bcd4, #00838f)',
    light: '#e0f7fa',
  },
  'pranje-brodova': {
    primary: '#2196f3',
    gradient: 'linear-gradient(135deg, #2196f3, #1565c0)',
    light: '#e3f2fd',
  },
  vodoinstalateri: {
    primary: '#2196f3',
    gradient: 'linear-gradient(135deg, #2196f3, #1565c0)',
    light: '#e3f2fd',
  },
  'taxi-i-transfer': {
    primary: '#ffc107',
    gradient: 'linear-gradient(135deg, #ffc107, #ff8f00)',
    light: '#fff8e1',
  },
  elektricari: {
    primary: '#ff9800',
    gradient: 'linear-gradient(135deg, #ff9800, #e65100)',
    light: '#fff3e0',
  },
  stomatolozi: {
    primary: '#03a9f4',
    gradient: 'linear-gradient(135deg, #03a9f4, #0277bd)',
    light: '#e1f5fe',
  },
  'turisticki-vodici': {
    primary: '#4caf50',
    gradient: 'linear-gradient(135deg, #4caf50, #2e7d32)',
    light: '#e8f5e9',
  },
  fotografija: {
    primary: '#9c27b0',
    gradient: 'linear-gradient(135deg, #9c27b0, #6a1b9a)',
    light: '#f3e5f5',
  },
  'frizerski-saloni': {
    primary: '#e91e63',
    gradient: 'linear-gradient(135deg, #e91e63, #c2185b)',
    light: '#fce4ec',
  },
  stolari: {
    primary: '#8d6e63',
    gradient: 'linear-gradient(135deg, #8d6e63, #5d4037)',
    light: '#efebe9',
  },
};

const DEFAULT_COLORS: ColorScheme = {
  primary: '#2196f3',
  gradient: 'linear-gradient(135deg, #2196f3, #1565c0)',
  light: '#e3f2fd',
};

// ---------------------------------------------------------------------------
// Emoji favicons per category
// ---------------------------------------------------------------------------

const CATEGORY_EMOJI: Record<string, string> = {
  automehanicari: '\u{1F527}',
  'servisi-za-ciscenje': '\u{1F9F9}',
  'ciscenje-apartmana': '\u{2728}',
  'pranje-brodova': '\u{1F6A2}',
  vodoinstalateri: '\u{1F6BF}',
  'taxi-i-transfer': '\u{1F695}',
  elektricari: '\u{26A1}',
  stomatolozi: '\u{1FA7A}',
  'turisticki-vodici': '\u{1F30D}',
  fotografija: '\u{1F4F7}',
  'frizerski-saloni': '\u{1F487}',
  stolari: '\u{1FA9A}',
};

const DEFAULT_EMOJI = '\u{1F3E2}';

// ---------------------------------------------------------------------------
// Selling points per category (bilingual)
// ---------------------------------------------------------------------------

const SERVICE_SELLING_POINTS: Record<string, { hr: string[]; en: string[] }> = {
  automehanicari: {
    hr: [
      'Stru\u010Dna dijagnostika i popravak svih marki vozila',
      'Originalni i kvalitetni zamjenski dijelovi',
      'Brza usluga uz transparentne cijene',
    ],
    en: [
      'Expert diagnostics and repair for all vehicle brands',
      'Original and quality replacement parts',
      'Fast service with transparent pricing',
    ],
  },
  'servisi-za-ciscenje': {
    hr: [
      'Profesionalno dubinsko \u010Di\u0161\u0107enje svih prostora',
      'Ekolo\u0161ka sredstva sigurna za obitelj',
      'Fleksibilni termini \u2013 radimo i vikendom',
    ],
    en: [
      'Professional deep cleaning for all spaces',
      'Eco-friendly products safe for your family',
      'Flexible scheduling \u2013 weekends available',
    ],
  },
  'ciscenje-apartmana': {
    hr: [
      'Brzo \u010Di\u0161\u0107enje izme\u0111u gostiju',
      'Pranje i mijenjanje posteljine uklju\u010Deno',
      'Pouzdana usluga za Airbnb doma\u0107ine',
    ],
    en: [
      'Fast turnover cleaning between guests',
      'Linen washing and changing included',
      'Reliable service for Airbnb hosts',
    ],
  },
  'pranje-brodova': {
    hr: [
      'Profesionalno pranje i poliranje brodova',
      'Za\u0161tita podvodnog dijela protiv obra\u0161taja',
      'Dolazimo na va\u0161u lokaciju u marini',
    ],
    en: [
      'Professional boat washing and polishing',
      'Antifouling protection for underwater hull',
      'We come to your marina location',
    ],
  },
  vodoinstalateri: {
    hr: [
      'Hitne intervencije 24/7 za curenja i kvarove',
      'Ugradnja i servis bojlera, slavina i sanitarija',
      'Licencirani majstori s dugogodi\u0161njim iskustvom',
    ],
    en: [
      '24/7 emergency response for leaks and breakdowns',
      'Installation and service of boilers, faucets, and sanitary',
      'Licensed professionals with years of experience',
    ],
  },
  'taxi-i-transfer': {
    hr: [
      'Udoban prijevoz \u2013 aerodrom, hotel, izleti',
      'Fiksne cijene bez skrivenih tro\u0161kova',
      'Klimatizirana vozila s profesionalnim voza\u010Dima',
    ],
    en: [
      'Comfortable transport \u2013 airport, hotel, excursions',
      'Fixed prices with no hidden costs',
      'Air-conditioned vehicles with professional drivers',
    ],
  },
  elektricari: {
    hr: [
      'Instalacije, popravci i provjera elektri\u010Dnih sustava',
      'Ugradnja rasvjete, uti\u010Dnica i razvodnih ormara',
      'Brz odziv i sigurnost na prvom mjestu',
    ],
    en: [
      'Installation, repairs, and electrical system inspections',
      'Lighting, outlets, and distribution panel setup',
      'Fast response with safety as top priority',
    ],
  },
  stomatolozi: {
    hr: [
      'Moderan pristup \u2013 bezbolni tretmani',
      'Estetska stomatologija, implantati i protetika',
      'Prijem istog dana za hitne slu\u010Dajeve',
    ],
    en: [
      'Modern approach \u2013 painless treatments',
      'Cosmetic dentistry, implants, and prosthetics',
      'Same-day appointments for emergencies',
    ],
  },
  'turisticki-vodici': {
    hr: [
      'Licencirani vodi\u010Di s lokalnim znanjem',
      'Privatne i grupne ture po mjeri',
      'Vi\u0161ejezi\u010Dne ture \u2013 iskustvo iz prve ruke',
    ],
    en: [
      'Licensed guides with local expertise',
      'Private and group tours tailored to you',
      'Multilingual tours \u2013 firsthand experience',
    ],
  },
  fotografija: {
    hr: [
      'Profesionalno fotografiranje doga\u0111aja i portreta',
      'Drone i video produkcija',
      'Brza isporuka obra\u0111enih fotografija',
    ],
    en: [
      'Professional event and portrait photography',
      'Drone and video production',
      'Fast delivery of edited photos',
    ],
  },
  'frizerski-saloni': {
    hr: [
      '\u0160i\u0161anje, bojanje i styling za sve uzraste',
      'Premium proizvodi za njegu kose',
      'Opustite se u ugodnom ambijentu',
    ],
    en: [
      'Cutting, coloring, and styling for all ages',
      'Premium hair care products',
      'Relax in a comfortable ambiance',
    ],
  },
  stolari: {
    hr: [
      'Izrada namje\u0161taja po mjeri',
      'Popravak i restauracija drvenih predmeta',
      'Kvalitetni materijali i precizna izvedba',
    ],
    en: [
      'Custom-made furniture crafting',
      'Repair and restoration of wooden items',
      'Quality materials and precise workmanship',
    ],
  },
};

const DEFAULT_SELLING_POINTS = {
  hr: [
    'Profesionalna usluga s dugogodi\u0161njim iskustvom',
    'Konkurentne cijene i transparentno poslovanje',
    'Brz odziv i pouzdana realizacija',
  ],
  en: [
    'Professional service with years of experience',
    'Competitive prices and transparent operations',
    'Fast response and reliable delivery',
  ],
};

// ---------------------------------------------------------------------------
// Bilingual label map
// ---------------------------------------------------------------------------

const LABELS = {
  hr: {
    aboutUs: 'O nama',
    openingHours: 'Radno vrijeme',
    contactUs: 'Kontaktiraj nas',
    call: 'Nazovi',
    directions: 'Upute',
    reviews: 'Recenzija',
    googleRating: 'Google ocjena',
    verified: 'Verificirano',
    localBusiness: 'Lokalni biznis',
    services: 'Na\u0161e usluge',
    needWebsite: 'Treba vam profesionalna web stranica?',
    needWebsiteDesc:
      'Izgradite svoju online prisutnost i privucite vi\u0161e klijenata s modernom web stranicom.',
    starter: 'STARTER',
    standard: 'STANDARD',
    premium: 'PREMIUM',
    free: 'Besplatno',
    perMonth: '/mj.',
    starterFeatures: [
      'Preview stranica',
      'Osnovno SEO',
      'Majstori Split branding',
    ],
    standardFeatures: [
      'Profesionalna stranica',
      'Bez na\u0161eg brandinga',
      'Kontakt forma',
      'Google Analytics',
    ],
    premiumFeatures: [
      'Full custom web',
      'Napredno SEO',
      'Odr\u017Eavanje uklju\u010Deno',
      'Prioritetni prikaz',
      'Blog sekcija',
    ],
    choosePackage: 'Odaberi paket',
    poweredBy: 'Powered by',
    allRightsReserved: 'Sva prava pridr\u017Eana.',
    whatsappMsg: 'Pozdrav! Zanima me va\u0161a usluga.',
    closed: 'Zatvoreno',
    day: {
      Monday: 'Ponedjeljak',
      Tuesday: 'Utorak',
      Wednesday: 'Srijeda',
      Thursday: '\u010Cetvrtak',
      Friday: 'Petak',
      Saturday: 'Subota',
      Sunday: 'Nedjelja',
    } as Record<string, string>,
  },
  en: {
    aboutUs: 'About Us',
    openingHours: 'Opening Hours',
    contactUs: 'Contact Us',
    call: 'Call',
    directions: 'Directions',
    reviews: 'Reviews',
    googleRating: 'Google Rating',
    verified: 'Verified',
    localBusiness: 'Local Business',
    services: 'Our Services',
    needWebsite: 'Need a professional website?',
    needWebsiteDesc:
      'Build your online presence and attract more clients with a modern website.',
    starter: 'STARTER',
    standard: 'STANDARD',
    premium: 'PREMIUM',
    free: 'Free',
    perMonth: '/mo.',
    starterFeatures: [
      'Preview page',
      'Basic SEO',
      'Majstori Split branding',
    ],
    standardFeatures: [
      'Professional website',
      'No branding',
      'Contact form',
      'Google Analytics',
    ],
    premiumFeatures: [
      'Full custom website',
      'Advanced SEO',
      'Maintenance included',
      'Priority listing',
      'Blog section',
    ],
    choosePackage: 'Choose package',
    poweredBy: 'Powered by',
    allRightsReserved: 'All rights reserved.',
    whatsappMsg: 'Hello! I am interested in your service.',
    closed: 'Closed',
    day: {
      Monday: 'Monday',
      Tuesday: 'Tuesday',
      Wednesday: 'Wednesday',
      Thursday: 'Thursday',
      Friday: 'Friday',
      Saturday: 'Saturday',
      Sunday: 'Sunday',
    } as Record<string, string>,
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function esc(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getColors(slug: string | null | undefined): ColorScheme {
  if (!slug) return DEFAULT_COLORS;
  return SERVICE_COLORS[slug] ?? DEFAULT_COLORS;
}

function getEmoji(slug: string | null | undefined): string {
  if (!slug) return DEFAULT_EMOJI;
  return CATEGORY_EMOJI[slug] ?? DEFAULT_EMOJI;
}

function getSellingPoints(
  slug: string | null | undefined,
  lang: Language,
): string[] {
  if (!slug) return DEFAULT_SELLING_POINTS[lang];
  const sp = SERVICE_SELLING_POINTS[slug];
  return sp ? sp[lang] : DEFAULT_SELLING_POINTS[lang];
}

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.25 && rating - full < 0.75 ? 1 : 0;
  const fullFromHalf = rating - full >= 0.75 ? 1 : 0;
  const empty = 5 - full - half - fullFromHalf;
  let html = '';
  for (let i = 0; i < full + fullFromHalf; i++)
    html += '<span class="star full">\u2605</span>';
  for (let i = 0; i < half; i++)
    html += '<span class="star half">\u2605</span>';
  for (let i = 0; i < empty; i++)
    html += '<span class="star empty">\u2606</span>';
  return html;
}

function cleanPhone(phone: string): string {
  return phone.replace(/[^+\d]/g, '');
}

interface OpeningHourEntry {
  day?: string;
  hours?: string;
  open?: string;
  close?: string;
}

function parseOpeningHours(raw: string | null | undefined): OpeningHourEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as OpeningHourEntry[];
    return [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function generateMiniSiteHtml(
  business: Business,
  category: Category | null,
  language: Language,
): string {
  const l = LABELS[language];
  const colors = getColors(category?.slug);
  const emoji = getEmoji(category?.slug);
  const sellingPoints = getSellingPoints(category?.slug, language);
  const rating = business.rating ? parseFloat(business.rating) : null;
  const phoneClean = business.phone ? cleanPhone(business.phone) : null;
  const hours = parseOpeningHours(business.openingHours);
  const hasCoords = business.latitude && business.longitude;
  const mapsUrl = hasCoords
    ? `https://www.google.com/maps?q=${business.latitude},${business.longitude}`
    : business.address
      ? `https://www.google.com/maps/search/${encodeURIComponent(business.address)}`
      : null;
  const waUrl =
    phoneClean
      ? `https://wa.me/${phoneClean.replace('+', '')}?text=${encodeURIComponent(l.whatsappMsg)}`
      : null;

  const pageTitle = `${business.name}${category ? ` - ${category.name}` : ''} | Majstori Split`;
  const pageDesc = business.description
    ? business.description.slice(0, 160)
    : `${business.name}${category ? ` - ${category.name}` : ''} - Split, Hrvatska`;

  // Schema.org JSON-LD
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    ...(business.description && { description: business.description }),
    ...(business.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address,
        addressLocality: 'Split',
        addressCountry: 'HR',
      },
    }),
    ...(business.phone && { telephone: business.phone }),
    ...(business.email && { email: business.email }),
    ...(business.website && { url: business.website }),
    ...(business.imageUrl && { image: business.imageUrl }),
    ...(hasCoords && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: business.latitude,
        longitude: business.longitude,
      },
    }),
    ...(rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
        bestRating: 5,
        ...(business.reviewCount && { reviewCount: business.reviewCount }),
      },
    }),
  };

  return `<!DOCTYPE html>
<html lang="${language}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(pageTitle)}</title>
<meta name="description" content="${esc(pageDesc)}">
<meta name="robots" content="index, follow">
<meta property="og:title" content="${esc(pageTitle)}">
<meta property="og:description" content="${esc(pageDesc)}">
<meta property="og:type" content="website">
${business.imageUrl ? `<meta property="og:image" content="${esc(business.imageUrl)}">` : ''}
<meta property="og:locale" content="${language === 'hr' ? 'hr_HR' : 'en_US'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(pageTitle)}">
<meta name="twitter:description" content="${esc(pageDesc)}">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${emoji}</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--primary:${colors.primary};--gradient:${colors.gradient};--light:${colors.light};--text:#1e293b;--text-secondary:#64748b;--bg:#ffffff;--surface:#f8fafc;--border:#e2e8f0;--radius:12px;--shadow:0 1px 3px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.06);--shadow-md:0 4px 6px rgba(0,0,0,.07),0 2px 4px rgba(0,0,0,.06);--shadow-lg:0 10px 15px rgba(0,0,0,.1),0 4px 6px rgba(0,0,0,.05)}
html{scroll-behavior:smooth}
body{font-family:'Inter',system-ui,-apple-system,sans-serif;color:var(--text);background:var(--bg);line-height:1.6;-webkit-font-smoothing:antialiased}
img{max-width:100%;height:auto;display:block}
a{color:var(--primary);text-decoration:none}

/* Hero */
.hero{background:var(--gradient);color:#fff;padding:3rem 1.25rem 2.5rem;text-align:center;position:relative;overflow:hidden}
.hero::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:40px;background:var(--bg);border-radius:50% 50% 0 0 / 100% 100% 0 0}
.hero-badge{display:inline-block;background:rgba(255,255,255,.2);backdrop-filter:blur(4px);padding:.35rem .9rem;border-radius:20px;font-size:.8rem;font-weight:600;margin-bottom:1rem;letter-spacing:.02em}
.hero h1{font-size:1.75rem;font-weight:800;margin-bottom:.5rem;line-height:1.2}
.hero-rating{display:flex;align-items:center;justify-content:center;gap:.4rem;margin:.6rem 0}
.star{font-size:1.1rem}
.star.full{color:#fbbf24}
.star.half{color:#fbbf24;opacity:.6}
.star.empty{color:rgba(255,255,255,.4)}
.hero-rating span.rating-num{font-weight:700;font-size:.95rem}
.hero-rating span.review-count{font-size:.8rem;opacity:.8}
.hero-address{font-size:.9rem;opacity:.9;margin-top:.25rem}
${business.imageUrl ? `.hero-img{width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.4);margin:0 auto 1rem;display:block}` : ''}

/* Sticky bar */
.sticky-bar{position:sticky;top:0;z-index:100;background:var(--bg);border-bottom:1px solid var(--border);padding:.6rem 1.25rem;display:flex;align-items:center;justify-content:space-between;box-shadow:var(--shadow)}
.sticky-bar .biz-name{font-weight:700;font-size:.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:55%}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.4rem;padding:.55rem 1.2rem;border-radius:8px;font-weight:600;font-size:.85rem;border:none;cursor:pointer;transition:transform .15s,box-shadow .15s}
.btn:hover{transform:translateY(-1px);box-shadow:var(--shadow-md)}
.btn-primary{background:var(--gradient);color:#fff}
.btn-outline{border:2px solid var(--primary);color:var(--primary);background:transparent}
.btn-white{background:#fff;color:var(--primary)}

/* Sections */
.container{max-width:640px;margin:0 auto;padding:0 1.25rem}
section{padding:2rem 0}
.section-title{font-size:1.25rem;font-weight:700;margin-bottom:1rem;display:flex;align-items:center;gap:.5rem}
.section-title .icon{font-size:1.3rem}

/* About */
.about-text{color:var(--text-secondary);font-size:.95rem;line-height:1.7}

/* Services */
.services-grid{display:grid;gap:.75rem}
.service-card{background:var(--light);border-radius:var(--radius);padding:1.1rem 1.25rem;display:flex;align-items:flex-start;gap:.75rem}
.service-card .num{width:32px;height:32px;border-radius:50%;background:var(--gradient);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem;flex-shrink:0}
.service-card p{font-size:.9rem;color:var(--text-secondary);line-height:1.5}

/* Trust */
.trust-row{display:grid;grid-template-columns:repeat(2,1fr);gap:.75rem}
.trust-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1rem;text-align:center}
.trust-card .trust-icon{font-size:1.6rem;margin-bottom:.3rem}
.trust-card .trust-label{font-size:.75rem;color:var(--text-secondary);font-weight:500}
.trust-card .trust-value{font-size:1rem;font-weight:700;color:var(--text)}

/* Hours */
.hours-table{width:100%;border-collapse:collapse}
.hours-table tr{border-bottom:1px solid var(--border)}
.hours-table tr:last-child{border-bottom:none}
.hours-table td{padding:.6rem 0;font-size:.9rem}
.hours-table td:first-child{font-weight:600;color:var(--text)}
.hours-table td:last-child{text-align:right;color:var(--text-secondary)}

/* Map link */
.map-link{display:block;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1.1rem;text-align:center;font-weight:600;font-size:.95rem;transition:background .15s}
.map-link:hover{background:var(--light)}

/* CTA */
.cta-section{text-align:center;padding:2.5rem 0}
.cta-phone{display:inline-flex;align-items:center;gap:.5rem;background:var(--gradient);color:#fff;font-size:1.15rem;font-weight:700;padding:.9rem 2rem;border-radius:50px;box-shadow:var(--shadow-lg);transition:transform .15s}
.cta-phone:hover{transform:scale(1.03);color:#fff}

/* Pricing */
.pricing-section{background:var(--surface);padding:2.5rem 0}
.pricing-header{text-align:center;margin-bottom:1.5rem}
.pricing-header h2{font-size:1.35rem;font-weight:800;margin-bottom:.4rem}
.pricing-header p{color:var(--text-secondary);font-size:.9rem}
.pricing-grid{display:grid;gap:1rem}
.price-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem 1.25rem;text-align:center;position:relative;transition:transform .15s,box-shadow .15s}
.price-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg)}
.price-card.featured{border-color:var(--primary);box-shadow:0 0 0 2px var(--primary)}
.price-card .badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--gradient);color:#fff;padding:.2rem .8rem;border-radius:20px;font-size:.7rem;font-weight:700;letter-spacing:.05em}
.price-card h3{font-size:.85rem;font-weight:700;letter-spacing:.1em;color:var(--text-secondary);margin-bottom:.5rem}
.price-card .price{font-size:1.6rem;font-weight:800;color:var(--text)}
.price-card .price small{font-size:.8rem;font-weight:500;color:var(--text-secondary)}
.price-card .price-sub{font-size:.8rem;color:var(--text-secondary);margin-top:.15rem}
.price-card ul{list-style:none;margin:1rem 0;text-align:left}
.price-card ul li{font-size:.85rem;padding:.35rem 0;color:var(--text-secondary);display:flex;align-items:center;gap:.4rem}
.price-card ul li::before{content:'\u2713';color:var(--primary);font-weight:700;font-size:.8rem}
.price-card .btn{width:100%;margin-top:.5rem}

/* WhatsApp float */
.wa-float{position:fixed;bottom:1.25rem;right:1.25rem;width:56px;height:56px;background:#25d366;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(37,211,102,.4);z-index:200;transition:transform .15s}
.wa-float:hover{transform:scale(1.1)}
.wa-float svg{width:28px;height:28px;fill:#fff}

/* Footer */
footer{background:var(--text);color:#94a3b8;padding:1.5rem 1.25rem;text-align:center;font-size:.8rem}
footer a{color:#fff;font-weight:600}

/* Responsive */
@media(min-width:480px){
  .hero h1{font-size:2.1rem}
  .pricing-grid{grid-template-columns:repeat(3,1fr)}
  .trust-row{grid-template-columns:repeat(4,1fr)}
}
@media(min-width:640px){
  .hero{padding:4rem 2rem 3rem}
}
</style>
</head>
<body>

<!-- Hero -->
<header class="hero">
${business.imageUrl ? `<img class="hero-img" src="${esc(business.imageUrl)}" alt="${esc(business.name)}" loading="lazy">` : ''}
${category ? `<div class="hero-badge">${emoji} ${esc(category.name)}</div>` : ''}
<h1>${esc(business.name)}</h1>
${
  rating
    ? `<div class="hero-rating">${renderStars(rating)} <span class="rating-num">${rating.toFixed(1)}</span>${business.reviewCount ? ` <span class="review-count">(${business.reviewCount})</span>` : ''}</div>`
    : ''
}
${business.address ? `<p class="hero-address">\u{1F4CD} ${esc(business.address)}</p>` : ''}
</header>

<!-- Sticky contact bar -->
${
  phoneClean
    ? `<div class="sticky-bar">
  <span class="biz-name">${esc(business.name)}</span>
  <a href="tel:${esc(phoneClean)}" class="btn btn-primary">\u{1F4DE} ${l.call}</a>
</div>`
    : ''
}

<main class="container">

<!-- About -->
${
  business.description
    ? `<section>
  <h2 class="section-title"><span class="icon">\u{1F4CB}</span> ${l.aboutUs}</h2>
  <p class="about-text">${esc(business.description)}</p>
</section>`
    : ''
}

<!-- Services -->
<section>
  <h2 class="section-title"><span class="icon">\u2B50</span> ${l.services}</h2>
  <div class="services-grid">
${sellingPoints
  .map(
    (sp, i) => `    <div class="service-card">
      <div class="num">${i + 1}</div>
      <p>${esc(sp)}</p>
    </div>`,
  )
  .join('\n')}
  </div>
</section>

<!-- Trust signals -->
<section>
  <div class="trust-row">
${
  rating
    ? `    <div class="trust-card">
      <div class="trust-icon">\u2B50</div>
      <div class="trust-value">${rating.toFixed(1)} / 5</div>
      <div class="trust-label">${l.googleRating}</div>
    </div>`
    : ''
}
${
  business.reviewCount
    ? `    <div class="trust-card">
      <div class="trust-icon">\u{1F4AC}</div>
      <div class="trust-value">${business.reviewCount}</div>
      <div class="trust-label">${l.reviews}</div>
    </div>`
    : ''
}
    <div class="trust-card">
      <div class="trust-icon">\u2705</div>
      <div class="trust-value">&mdash;</div>
      <div class="trust-label">${l.verified}</div>
    </div>
    <div class="trust-card">
      <div class="trust-icon">\u{1F3E0}</div>
      <div class="trust-value">Split</div>
      <div class="trust-label">${l.localBusiness}</div>
    </div>
  </div>
</section>

<!-- Opening hours -->
${
  hours.length > 0
    ? `<section>
  <h2 class="section-title"><span class="icon">\u{1F552}</span> ${l.openingHours}</h2>
  <table class="hours-table">
${hours
  .map((h) => {
    const day = h.day ? (l.day[h.day] ?? h.day) : '';
    const time = h.hours
      ? h.hours
      : h.open && h.close
        ? `${h.open} - ${h.close}`
        : l.closed;
    return `    <tr><td>${esc(day)}</td><td>${esc(time)}</td></tr>`;
  })
  .join('\n')}
  </table>
</section>`
    : ''
}

<!-- Map -->
${
  mapsUrl
    ? `<section>
  <a class="map-link" href="${esc(mapsUrl)}" target="_blank" rel="noopener">\u{1F5FA}\uFE0F ${l.directions} &rarr;</a>
</section>`
    : ''
}

<!-- CTA -->
${
  phoneClean
    ? `<section class="cta-section">
  <a class="cta-phone" href="tel:${esc(phoneClean)}">\u{1F4F1} ${l.call} ${esc(business.phone!)}</a>
</section>`
    : ''
}

</main>

<!-- Pricing / sales pitch -->
<section class="pricing-section">
<div class="container">
  <div class="pricing-header">
    <h2>${l.needWebsite}</h2>
    <p>${l.needWebsiteDesc}</p>
  </div>
  <div class="pricing-grid">

    <!-- Starter -->
    <div class="price-card">
      <h3>${l.starter}</h3>
      <div class="price">${l.free}</div>
      <div class="price-sub">&nbsp;</div>
      <ul>
${l.starterFeatures.map((f) => `        <li>${esc(f)}</li>`).join('\n')}
      </ul>
      <a href="https://majstorisplit.com" class="btn btn-outline">${l.choosePackage}</a>
    </div>

    <!-- Standard -->
    <div class="price-card featured">
      <div class="badge">\u2B50 Popular</div>
      <h3>${l.standard}</h3>
      <div class="price">199 &euro;</div>
      <div class="price-sub">+ 29 &euro; ${l.perMonth}</div>
      <ul>
${l.standardFeatures.map((f) => `        <li>${esc(f)}</li>`).join('\n')}
      </ul>
      <a href="https://majstorisplit.com" class="btn btn-primary">${l.choosePackage}</a>
    </div>

    <!-- Premium -->
    <div class="price-card">
      <h3>${l.premium}</h3>
      <div class="price">399 &euro;</div>
      <div class="price-sub">+ 59 &euro; ${l.perMonth}</div>
      <ul>
${l.premiumFeatures.map((f) => `        <li>${esc(f)}</li>`).join('\n')}
      </ul>
      <a href="https://majstorisplit.com" class="btn btn-outline">${l.choosePackage}</a>
    </div>

  </div>
</div>
</section>

<!-- Footer -->
<footer>
  <p>${l.poweredBy} <a href="https://majstorisplit.com">Majstori Split</a></p>
  <p style="margin-top:.3rem">&copy; ${new Date().getFullYear()} ${esc(business.name)}. ${l.allRightsReserved}</p>
</footer>

<!-- WhatsApp floating button -->
${
  waUrl
    ? `<a class="wa-float" href="${esc(waUrl)}" target="_blank" rel="noopener" aria-label="WhatsApp">
  <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>`
    : ''
}

</body>
</html>`;
}
