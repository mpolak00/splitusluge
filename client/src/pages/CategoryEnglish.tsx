import { useMemo, useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { ALL_BUSINESSES_PATH, getBusinessPath } from "@shared/paths";
import {
  buildBaseStructuredData,
  buildBreadcrumbSchema,
  buildSeoPayload,
  getCategoryCopy,
  SERVICE_AREAS,
} from "@shared/seo";
import { CATEGORY_NAMES_EN } from "@shared/i18n";
import { ArrowLeft, Globe, MapPin, Phone, Star, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageSeo } from "@/hooks/usePageSeo";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import {
  calculateWeightedScore,
  getAverageRating,
  getContactCoverage,
  getRatingValue,
  getTopLocations,
} from "@/lib/directory";
import { trpc } from "@/lib/trpc";
import { usePageTracking, useTrackClick } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";

function openGoogleMaps(name: string, address?: string | null) {
  const query = `${name} ${address || ""}`.trim();
  window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, "_blank");
}

// English descriptions for categories for rich SEO content
const CATEGORY_SEO_EN: Record<string, { title: string; h1: string; intro: string; faq: { q: string; a: string }[] }> = {
  automehanicari: {
    title: "Auto Mechanics in Split, Croatia",
    h1: "Find the Best Auto Mechanic in Split",
    intro: "Looking for a reliable car mechanic in Split? Browse our verified directory of auto repair shops, diagnostics centers, and car service providers in Split and surrounding areas including Solin, Kastela, and Podstrana.",
    faq: [
      { q: "How much does a car service cost in Split?", a: "Basic car service in Split costs between 50-150 EUR depending on the type of service. Diagnostics typically cost 20-50 EUR." },
      { q: "Are there English-speaking mechanics in Split?", a: "Yes, many mechanics in Split speak basic English, especially those in tourist areas. Our directory helps you find the right one." },
    ],
  },
  "servisi-za-ciscenje": {
    title: "Cleaning Services in Split, Croatia",
    h1: "Professional Cleaning Services in Split",
    intro: "Find professional cleaning services for apartments, homes, offices and vacation rentals in Split. Perfect for Airbnb hosts, property managers and anyone who needs reliable cleaning in the Split area.",
    faq: [
      { q: "How much does apartment cleaning cost in Split?", a: "Standard apartment cleaning in Split costs 30-80 EUR depending on size. Deep cleaning ranges from 80-200 EUR." },
      { q: "Can I book turnover cleaning for my Airbnb?", a: "Yes, many cleaning services in Split specialize in vacation rental turnover cleaning with same-day service." },
    ],
  },
  elektricari: {
    title: "Electricians in Split, Croatia",
    h1: "Find a Licensed Electrician in Split",
    intro: "Need an electrician in Split? Find licensed electrical contractors for installations, repairs, emergency services and renovations in Split and the surrounding Dalmatian coast area.",
    faq: [
      { q: "How quickly can an electrician come for an emergency?", a: "Most emergency electricians in Split can arrive within 1-3 hours during business hours." },
      { q: "Do electricians in Split handle AC installations?", a: "Many electricians also handle air conditioning installation and maintenance, especially during tourist season." },
    ],
  },
  vodoinstalateri: {
    title: "Plumbers in Split, Croatia",
    h1: "Find a Reliable Plumber in Split",
    intro: "Emergency plumbing, drain cleaning, bathroom renovations - find the best plumbers in Split and surrounding areas. Available for apartments, houses and commercial properties.",
    faq: [
      { q: "Is there 24/7 emergency plumbing in Split?", a: "Yes, several plumbing services in Split offer 24/7 emergency response, especially during summer season." },
      { q: "How much does a plumber charge in Split?", a: "Basic plumbing calls start from 30-50 EUR. Larger jobs like bathroom renovations are quoted individually." },
    ],
  },
  "ciscenje-apartmana": {
    title: "Apartment Cleaning Services in Split, Croatia",
    h1: "Apartment & Vacation Rental Cleaning in Split",
    intro: "Professional apartment cleaning services for vacation rental owners in Split. Turnover cleaning, deep cleaning, and regular maintenance for Airbnb, Booking.com and other rental properties along the Dalmatian coast.",
    faq: [
      { q: "How much does turnover cleaning cost in Split?", a: "Turnover cleaning for a standard apartment costs 30-60 EUR. Larger properties and deep cleans cost 60-120 EUR." },
      { q: "Can I schedule recurring cleaning for my rental?", a: "Yes, most services offer weekly or per-booking scheduling with guaranteed availability during peak season." },
    ],
  },
  "pranje-brodova": {
    title: "Boat Cleaning & Detailing in Split, Croatia",
    h1: "Professional Boat Cleaning in Split",
    intro: "Find boat washing, hull cleaning, polishing and detailing services for yachts, sailboats and motorboats in Split marinas and harbors along the Adriatic coast.",
    faq: [
      { q: "How much does boat cleaning cost in Split?", a: "Exterior wash starts from 50 EUR for small boats. Full detailing for yachts ranges from 200-800 EUR." },
      { q: "Do they come to the marina?", a: "Yes, most boat cleaning services in Split operate directly at ACI Marina Split, Marina Kastela and other local marinas." },
    ],
  },
  "taxi-i-transfer": {
    title: "Taxi & Airport Transfer in Split, Croatia",
    h1: "Taxi & Airport Transfers in Split",
    intro: "Book reliable taxi services and airport transfers in Split. From Split Airport (SPU) transfers to city center rides, ferry port pickups and private tours along the Dalmatian coast.",
    faq: [
      { q: "How much is a taxi from Split Airport to the city center?", a: "A taxi from Split Airport to the city center costs approximately 30-40 EUR (fixed rate). The journey takes about 25 minutes." },
      { q: "Can I pre-book an airport transfer?", a: "Yes, most transfer services allow advance booking online or by phone. This is recommended during summer season." },
    ],
  },
  "iznajmljivanje-plovila": {
    title: "Boat Rental & Charter in Split, Croatia",
    h1: "Rent a Boat in Split",
    intro: "Rent boats, sailboats, motorboats, jet skis and yachts in Split for day trips to islands like Hvar, Brac, Vis and the Blue Cave. Skippered and bareboat charter options available.",
    faq: [
      { q: "Do I need a boat license to rent in Croatia?", a: "For boats over 5 kW engine power, you need a valid boat license. Some rentals offer boats that don't require a license, or you can hire a skipper." },
      { q: "How much does it cost to rent a boat in Split?", a: "Small motorboat: 150-300 EUR/day. Sailboat charter: 200-500 EUR/day. Yacht: 500-2000 EUR/day depending on size and season." },
    ],
  },
  "turisticki-vodici": {
    title: "Tour Guides in Split, Croatia",
    h1: "Licensed Tour Guides in Split",
    intro: "Find professional, English-speaking tour guides for Diocletian's Palace, Split Old Town walking tours, island excursions to Hvar and Brac, Game of Thrones filming locations, and wine tasting tours.",
    faq: [
      { q: "How much does a private tour guide cost in Split?", a: "Private walking tours start from 50-80 EUR per person for group tours, or 150-300 EUR for a private guide (2-3 hours)." },
      { q: "What are the most popular tours in Split?", a: "Diocletian's Palace tour, Old Town walking tour, Game of Thrones locations, day trips to Hvar/Brac islands, and wine tasting in Dalmatian hinterland." },
    ],
  },
  "bazeni-i-odrzavanje": {
    title: "Pool Maintenance & Cleaning in Split, Croatia",
    h1: "Swimming Pool Service in Split",
    intro: "Professional pool maintenance, cleaning and repair services for villa owners, hotels and vacation rental properties in Split and the Dalmatian coast.",
    faq: [
      { q: "How often should a pool be serviced in Split?", a: "During summer season (June-September), weekly service is recommended. Off-season, monthly maintenance is sufficient." },
      { q: "What does regular pool maintenance include?", a: "pH testing, chemical balancing, filter cleaning, skimming, vacuuming, and equipment inspection." },
    ],
  },
  fotografija: {
    title: "Photography Services in Split, Croatia",
    h1: "Professional Photographers in Split",
    intro: "Find professional photographers for real estate, vacation rental listings, weddings, events, and aerial drone photography in Split and the Dalmatian coast.",
    faq: [
      { q: "How much does property photography cost?", a: "Professional real estate/Airbnb photography starts from 100-300 EUR depending on property size and number of photos." },
      { q: "Is drone photography available?", a: "Yes, many photographers in Split offer licensed drone photography and videography for stunning aerial views." },
    ],
  },
  catering: {
    title: "Catering Services in Split, Croatia",
    h1: "Catering & Event Food in Split",
    intro: "Find catering services for weddings, corporate events, private parties and yacht catering in Split. Traditional Dalmatian cuisine, international menus and dietary-specific options available.",
    faq: [
      { q: "What is the minimum order for catering in Split?", a: "Most caterers serve groups of 10+ people. Some offer smaller packages for intimate events or yacht catering." },
      { q: "Do caterers offer traditional Dalmatian food?", a: "Yes, many specialize in traditional peka (under the bell), fresh seafood, and local Dalmatian specialties." },
    ],
  },
  stolari: {
    title: "Carpenters & Woodworkers in Split, Croatia",
    h1: "Find a Carpenter in Split",
    intro: "Custom furniture, kitchen cabinets, woodworking and carpentry services in Split. From bespoke furniture to apartment renovations.",
    faq: [
      { q: "Can I get custom furniture made in Split?", a: "Yes, many carpenters in Split specialize in custom-made kitchens, wardrobes, shelving and furniture." },
      { q: "How long does a custom kitchen take?", a: "Custom kitchen projects typically take 4-8 weeks from measurement to installation." },
    ],
  },
  "frizerski-saloni": {
    title: "Hair Salons & Barbers in Split, Croatia",
    h1: "Hair Salons & Barber Shops in Split",
    intro: "Find hair salons and barber shops in Split for men's and women's haircuts, coloring, treatments, and styling.",
    faq: [
      { q: "How much does a haircut cost in Split?", a: "Men's haircut: 10-25 EUR. Women's cut and style: 25-60 EUR. Color treatments: 50-150 EUR." },
      { q: "Do salons in Split speak English?", a: "Most salons in the city center and tourist areas have English-speaking staff." },
    ],
  },
  kljucar: {
    title: "Locksmith Services in Split, Croatia",
    h1: "Emergency Locksmith in Split",
    intro: "24/7 locksmith services in Split for emergency lockouts, key cutting, lock changes and security upgrades for apartments and rental properties.",
    faq: [
      { q: "Is there a 24-hour locksmith in Split?", a: "Yes, several locksmiths offer 24/7 emergency service, especially during tourist season." },
      { q: "How much does it cost to open a locked door?", a: "Emergency door opening costs 50-150 EUR depending on lock type and time of day." },
    ],
  },
};

export default function CategoryEnglish() {
  const [, params] = useRoute("/en/:slug");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"weighted" | "rating" | "name">("weighted");
  const { setLang } = useLanguage();
  const categorySlug = params?.slug || "";
  const categoryCopy = getCategoryCopy(categorySlug);
  usePageTracking(categorySlug);
  const trackClick = useTrackClick();

  useEffect(() => { setLang("en"); }, []);

  const enSeo = CATEGORY_SEO_EN[categorySlug];
  const categoryNameEn = CATEGORY_NAMES_EN[categorySlug] || categoryCopy.title;

  const categoryQuery = trpc.services.getCategoryBySlug.useQuery(
    { slug: categorySlug },
    { enabled: Boolean(categorySlug) }
  );
  const allCategoriesQuery = trpc.services.getAllCategories.useQuery();
  const businessesQuery = trpc.services.getAllBusinesses.useQuery(
    { categoryId: categoryQuery.data?.id, limit: 10000, offset: 0 },
    { enabled: Boolean(categoryQuery.data?.id) }
  );

  const allCategories = allCategoriesQuery.data || [];
  const businesses = businessesQuery.data || [];

  const fuzzyFiltered = useFuzzySearch(businesses, searchTerm, {
    threshold: 0.4,
    keys: ["name", "address", "phone"],
  });

  const filteredBusinesses = useMemo(() => {
    const result = searchTerm ? fuzzyFiltered : businesses;
    if (sortBy === "rating") return [...result].sort((a, b) => getRatingValue(b) - getRatingValue(a));
    if (sortBy === "name") return [...result].sort((a, b) => a.name.localeCompare(b.name));
    return [...result].sort((a, b) => calculateWeightedScore(b) - calculateWeightedScore(a));
  }, [businesses, fuzzyFiltered, searchTerm, sortBy]);

  const averageRating = useMemo(() => getAverageRating(businesses), [businesses]);
  const contactCoverage = useMemo(() => getContactCoverage(businesses), [businesses]);
  const topLocations = useMemo(() => getTopLocations(businesses, 5), [businesses]);

  const relatedCategories = useMemo(
    () => allCategories.filter(c => c.slug !== categorySlug).slice(0, 8),
    [allCategories, categorySlug]
  );

  const seoTitle = enSeo?.title || `${categoryNameEn} in Split, Croatia`;
  const seoH1 = enSeo?.h1 || `Find ${categoryNameEn} in Split`;
  const seoIntro = enSeo?.intro || `Find the best ${categoryNameEn.toLowerCase()} services in Split, Croatia. Browse ${businesses.length} verified local businesses with ratings, reviews and contact information.`;
  const seoFaq = enSeo?.faq || [
    { q: `How do I find a good ${categoryNameEn.toLowerCase()} in Split?`, a: "Compare ratings, reviews, location and contact information before making your choice. Our directory makes it easy to find and compare options." },
    { q: `Are services available in English?`, a: "Many service providers in Split speak English, especially those in tourist areas and the city center." },
  ];

  const seoPayload = useMemo(() => {
    if (!categoryQuery.data) return null;
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://majstorisplit.com";
    const pathname = `/en/${categorySlug}`;
    const breadcrumbs = [
      { name: "Home", path: "/en" },
      { name: "Services", path: "/en" },
      { name: categoryNameEn, path: pathname },
    ];

    return buildSeoPayload({
      title: `${seoTitle} | ${businesses.length} Verified | Split Services`,
      description: seoIntro,
      keywords: [
        ...categoryCopy.keywords,
        `${categoryNameEn.toLowerCase()} split`,
        `${categoryNameEn.toLowerCase()} split croatia`,
        `best ${categoryNameEn.toLowerCase()} split`,
        `${categoryNameEn.toLowerCase()} near me split`,
        "split croatia services",
      ],
      pathname,
      siteUrl,
      ogType: "article",
      structuredData: [
        ...buildBaseStructuredData(siteUrl),
        buildBreadcrumbSchema(siteUrl, breadcrumbs),
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: seoTitle,
          description: seoIntro,
          url: `${siteUrl}${pathname}`,
          inLanguage: "en",
          about: categoryNameEn,
          areaServed: SERVICE_AREAS.map(area => ({
            "@type": "City",
            name: area,
            containedInPlace: { "@type": "Country", name: "Croatia" },
          })),
        },
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Best ${categoryNameEn} in Split`,
          numberOfItems: businesses.length,
          itemListElement: filteredBusinesses.slice(0, 20).map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "LocalBusiness",
              name: b.name,
              address: b.address || "Split, Croatia",
              ...(b.rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: b.rating, reviewCount: b.reviewCount || 1, bestRating: 5 } } : {}),
              ...(b.phone ? { telephone: b.phone } : {}),
              ...(b.website ? { url: b.website } : {}),
              ...(b.latitude && b.longitude ? { geo: { "@type": "GeoCoordinates", latitude: b.latitude, longitude: b.longitude } } : {}),
            },
          })),
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: seoFaq.map(item => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        },
      ],
    });
  }, [businesses.length, categoryCopy, categoryQuery.data, categorySlug, categoryNameEn, filteredBusinesses, seoTitle, seoIntro, seoFaq, topLocations]);

  usePageSeo(seoPayload);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-slate-950 text-white">
        {categoryQuery.data?.imageUrl && (
          <img src={categoryQuery.data.imageUrl} alt={categoryNameEn} className="absolute inset-0 h-full w-full object-cover opacity-20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 to-slate-950/95" />
        <div className="container relative z-10 mx-auto px-4 py-14 md:py-20">
          <Link href="/en" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to all services
          </Link>
          <div className="mt-6 max-w-4xl space-y-5">
            <div className="flex flex-wrap gap-3 text-sm text-white/75">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5">
                {businesses.length} businesses
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5">
                Split & surrounding areas
              </span>
              {averageRating > 0 && (
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> {averageRating.toFixed(1)} avg
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">{seoH1}</h1>
            <p className="max-w-3xl text-lg leading-8 text-white/80">{seoIntro}</p>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="text-sm text-white/70">Total listings</p>
                <p className="mt-2 text-3xl font-bold">{businesses.length || "0"}</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="text-sm text-white/70">Average rating</p>
                <p className="mt-2 text-3xl font-bold">{averageRating > 0 ? averageRating.toFixed(1) : "-"}</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="text-sm text-white/70">With phone</p>
                <p className="mt-2 text-3xl font-bold">{contactCoverage.withPhone}</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="text-sm text-white/70">With website</p>
                <p className="mt-2 text-3xl font-bold">{contactCoverage.withWebsite}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {/* Search & Sort */}
        <Card className="mb-8 border-border/70">
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Browse & Compare</h2>
                <p className="mt-1 text-muted-foreground">Search by name or address, sort by rating or recommendation.</p>
              </div>
              <p className="text-sm text-muted-foreground">Showing <strong>{filteredBusinesses.length}</strong> results</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by name or address..." className="h-11" />
              <select className="border rounded px-3 py-2 text-sm bg-background h-11" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
                <option value="weighted">Recommended</option>
                <option value="rating">Highest rated</option>
                <option value="name">A-Z</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Business Listings */}
        {businessesQuery.isLoading ? (
          <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)}</div>
        ) : filteredBusinesses.length > 0 ? (
          <div className="space-y-4">
            {filteredBusinesses.map(business => {
              const ratingValue = getRatingValue(business);
              return (
                <Card key={business.id} className="overflow-hidden border-border/70 hover:shadow-lg transition-all">
                  <div className="grid gap-0 md:grid-cols-[200px_1fr]">
                    <div className="h-48 md:h-auto bg-muted">
                      {business.imageUrl ? (
                        <img src={business.imageUrl} alt={business.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No photo</div>
                      )}
                    </div>
                    <CardContent className="flex flex-col justify-between gap-4 p-6">
                      <div className="space-y-3">
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                          <div>
                            <Link href={getBusinessPath(business)}>
                              <h3 className="text-xl font-bold hover:text-primary">{business.name}</h3>
                            </Link>
                            {business.address && (
                              <p className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                {business.address}
                              </p>
                            )}
                          </div>
                          {ratingValue > 0 && (
                            <div className="inline-flex items-center gap-1 rounded-full bg-yellow-400/15 px-3 py-1.5 text-sm font-semibold text-yellow-700">
                              <Star className="h-4 w-4 fill-current" /> {ratingValue.toFixed(1)}
                              {business.reviewCount ? <span className="text-xs">({business.reviewCount})</span> : null}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          {business.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-primary" /> {business.phone}</span>}
                          {business.website && <span className="flex items-center gap-1 truncate"><Globe className="h-3.5 w-3.5 text-primary" /> {business.website}</span>}
                        </div>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                        <Button asChild size="sm"><Link href={getBusinessPath(business)}>View profile</Link></Button>
                        {business.phone ? (
                          <Button asChild size="sm" variant="outline" onClick={() => trackClick("phone_click", business.id, business.name, categorySlug)}>
                            <a href={`tel:${business.phone}`}><Phone className="mr-2 h-4 w-4" />Call</a>
                          </Button>
                        ) : <Button size="sm" variant="outline" disabled>No phone</Button>}
                        {business.website ? (
                          <Button asChild size="sm" variant="outline" onClick={() => trackClick("website_click", business.id, business.name, categorySlug)}>
                            <a href={business.website} target="_blank" rel="noopener noreferrer"><Globe className="mr-2 h-4 w-4" />Website</a>
                          </Button>
                        ) : <Button size="sm" variant="outline" disabled>No website</Button>}
                        <Button size="sm" variant="outline" onClick={() => { openGoogleMaps(business.name, business.address); trackClick("map_click", business.id, business.name, categorySlug); }}>
                          <MapPin className="mr-2 h-4 w-4" />Directions
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-dashed"><CardContent className="p-10 text-center"><p className="text-lg font-medium">No businesses found in this category.</p></CardContent></Card>
        )}

        {/* FAQ Section - Critical for SEO */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-border/70">
            <CardContent className="space-y-5 p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Frequently Asked Questions</p>
              <h2 className="text-3xl font-bold">{categoryNameEn} in Split - What You Need to Know</h2>
              <p className="leading-8 text-muted-foreground">{seoIntro}</p>
              <div className="space-y-4">
                {seoFaq.map(item => (
                  <div key={item.q} className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                    <h3 className="font-semibold">{item.q}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.a}</p>
                  </div>
                ))}
              </div>
              {topLocations.length > 0 && (
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <h3 className="font-semibold">Most common locations</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{topLocations.join(", ")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/70">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-xl font-bold">Related Services</h2>
                <div className="flex flex-wrap gap-2">
                  {relatedCategories.map(c => (
                    <Link key={c.id} href={`/en/${c.slug}`}>
                      <span className="inline-flex rounded-full border border-border/70 bg-muted/30 px-3 py-1.5 text-sm hover:border-primary/30 hover:text-primary">
                        {CATEGORY_NAMES_EN[c.slug] || c.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardContent className="p-6 space-y-3">
                <h2 className="font-bold">About Split, Croatia</h2>
                <p className="text-sm text-muted-foreground leading-7">
                  Split is the second-largest city in Croatia, located on the eastern shore of the Adriatic Sea.
                  Home to the UNESCO World Heritage Site Diocletian's Palace, Split is a major tourist destination
                  and a hub for local services along the Dalmatian coast. The city and surrounding areas
                  (Solin, Kastela, Podstrana, Omis) have a thriving local economy with thousands of
                  small businesses serving both residents and millions of annual visitors.
                </p>
              </CardContent>
            </Card>

            {/* Croatian version link */}
            <Link href={`/usluga/${categorySlug}`}>
              <Button variant="outline" className="w-full gap-2">
                <Globe className="h-4 w-4" /> Pogledaj na hrvatskom
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
