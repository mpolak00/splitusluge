import { useMemo, useState, useEffect } from "react";
import { Link } from "wouter";
import { ALL_BUSINESSES_PATH, getBusinessPath } from "@shared/paths";
import { buildBaseStructuredData, buildSeoPayload, SERVICE_AREAS } from "@shared/seo";
import { CATEGORY_NAMES_EN } from "@shared/i18n";
import { ArrowRight, Globe, MapPin, Phone, Search, Star, Store } from "lucide-react";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { sortBusinessesByWeighted, getAverageRating, getRatingValue } from "@/lib/directory";
import { trpc } from "@/lib/trpc";
import { usePageTracking, useTrackSearch } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HomeEnglish() {
  const [searchTerm, setSearchTerm] = useState("");
  const { setLang } = useLanguage();
  usePageTracking();
  const trackSearch = useTrackSearch();

  useEffect(() => {
    setLang("en");
  }, []);

  const categoriesQuery = trpc.services.getAllCategories.useQuery();
  const businessesQuery = trpc.services.getAllBusinesses.useQuery({ limit: 10000, offset: 0 });

  const categories = categoriesQuery.data || [];
  const allBusinesses = businessesQuery.data || [];

  const categoryCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    allBusinesses.forEach(b => { counts[b.categoryId] = (counts[b.categoryId] || 0) + 1; });
    return counts;
  }, [allBusinesses]);

  const categorySummaries = useMemo(
    () => categories.map(c => ({
      ...c,
      businessCount: categoryCounts[c.id] || 0,
      nameEn: CATEGORY_NAMES_EN[c.slug] || c.name,
    })).sort((a, b) => b.businessCount - a.businessCount),
    [categories, categoryCounts]
  );

  const featuredBusinesses = useMemo(() => sortBusinessesByWeighted(allBusinesses).slice(0, 6), [allBusinesses]);
  const filteredBusinesses = useFuzzySearch(allBusinesses, searchTerm, {
    threshold: 0.4,
    keys: ["name", "address", "phone", "website"],
    includeScore: false,
  });
  const averageRating = useMemo(() => getAverageRating(allBusinesses), [allBusinesses]);

  const seoPayload = useMemo(() => {
    const title = "Split Services | Local Business Directory in Split, Croatia";
    const description = `Find ${allBusinesses.length || ""} local services and businesses in Split, Croatia. Apartment cleaning, boat services, taxi transfers, restaurants, mechanics and more.`;
    const siteUrl = typeof window !== "undefined" ? window.location.origin : undefined;

    return buildSeoPayload({
      title,
      description,
      keywords: [
        "split services", "split croatia services", "local business split",
        "apartment cleaning split", "boat cleaning split", "taxi split",
        "handyman split", "plumber split", "electrician split",
        "tour guide split", "boat rental split", "pool maintenance split",
      ],
      pathname: "/en",
      siteUrl,
      structuredData: [
        ...buildBaseStructuredData(siteUrl || ""),
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description,
          inLanguage: "en",
          areaServed: SERVICE_AREAS,
        },
      ],
    });
  }, [allBusinesses.length]);

  usePageSeo(seoPayload);

  const displayBusinesses = searchTerm ? filteredBusinesses : featuredBusinesses;

  return (
    <div className="min-w-0">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 md:py-24 px-6">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
            <Globe className="h-4 w-4" /> Split, Croatia
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Find Local Services in <span className="text-primary">Split</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your trusted directory for local businesses, craftsmen and services in Split and surrounding areas.
            {allBusinesses.length > 0 && ` ${allBusinesses.length}+ verified businesses.`}
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, address..."
              className="pl-12 h-12 text-base rounded-full border-2"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                if (e.target.value.length >= 3) {
                  trackSearch(e.target.value, filteredBusinesses.length);
                }
              }}
            />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground pt-2">
            <span><strong className="text-foreground">{allBusinesses.length}</strong> businesses</span>
            <span><strong className="text-foreground">{categories.length}</strong> categories</span>
            <span><Star className="h-4 w-4 text-yellow-500 inline" /> <strong className="text-foreground">{averageRating}</strong> avg rating</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Service Categories</h2>
            <Link href={ALL_BUSINESSES_PATH}>
              <Button variant="ghost" className="gap-1">View all <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categorySummaries.map(cat => (
              <Link key={cat.id} href={`/usluga/${cat.slug}`}>
                <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm">{cat.nameEn}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{cat.name}</p>
                    <p className="text-xs text-primary mt-2 font-medium">{cat.businessCount} businesses</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Search Results */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold mb-8">
            {searchTerm ? `Results for "${searchTerm}"` : "Featured Businesses"}
          </h2>
          {businessesQuery.isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
          ) : displayBusinesses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayBusinesses.slice(0, 12).map(business => (
                <Card key={business.id} className="hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <Link href={getBusinessPath({ id: business.id, name: business.name })}>
                          <h3 className="font-semibold text-sm truncate hover:text-primary cursor-pointer">
                            {business.name}
                          </h3>
                        </Link>
                        {business.address && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{business.address}</span>
                          </p>
                        )}
                      </div>
                      {business.rating && (
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium">{business.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      {business.phone && (
                        <a href={`tel:${business.phone}`}>
                          <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
                            <Phone className="h-3 w-3" /> Call
                          </Button>
                        </a>
                      )}
                      {business.website && (
                        <a href={business.website} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
                            <Globe className="h-3 w-3" /> Website
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No results found for "{searchTerm}"</p>
          )}
        </div>
      </section>

      {/* Tourist Services Highlight */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-2xl font-bold">Tourist Season Services</h2>
          <p className="text-muted-foreground">
            Planning your visit to Split? Find everything you need - from apartment cleaning and boat rentals
            to airport transfers and tour guides.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { slug: "ciscenje-apartmana", label: "Apartment Cleaning" },
              { slug: "pranje-brodova", label: "Boat Cleaning" },
              { slug: "taxi-i-transfer", label: "Airport Transfers" },
              { slug: "iznajmljivanje-plovila", label: "Boat Rental" },
              { slug: "turisticki-vodici", label: "Tour Guides" },
              { slug: "bazeni-i-odrzavanje", label: "Pool Service" },
              { slug: "catering", label: "Catering" },
              { slug: "fotografija", label: "Photography" },
            ].map(item => (
              <Link key={item.slug} href={`/usluga/${item.slug}`}>
                <Button variant="outline" className="w-full text-xs h-auto py-3 whitespace-normal">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Switch language */}
      <div className="text-center py-6">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <Globe className="h-4 w-4" /> Pregledaj na hrvatskom
          </Button>
        </Link>
      </div>
    </div>
  );
}
