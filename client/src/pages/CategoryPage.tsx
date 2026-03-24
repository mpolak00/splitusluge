import { useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { ALL_BUSINESSES_PATH, getBusinessPath } from "@shared/paths";
import {
  buildBaseStructuredData,
  buildBreadcrumbSchema,
  buildSeoPayload,
  getCategoryCopy,
  SERVICE_AREAS,
} from "@shared/seo";
import { ArrowLeft, Globe, MapPin, Navigation, Phone, Search, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageSeo } from "@/hooks/usePageSeo";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import {
  calculateWeightedScore,
  getAverageRating,
  getContactCoverage,
  getRatingValue,
  getTopLocations,
  parseBusinessTags,
} from "@/lib/directory";
import { getBusinessImage } from "@/lib/category-images";
import { trpc } from "@/lib/trpc";

function openGoogleMaps(name: string, address?: string | null) {
  const query = `${name} ${address || ""}`.trim();
  window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, "_blank");
}

export default function CategoryPage() {
  const [match, params] = useRoute("/usluga/:slug");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"weighted" | "rating" | "name">("weighted");
  const [genderFilter, setGenderFilter] = useState<"all" | "muski" | "zenski">("all");

  const categorySlug = params?.slug || "";
  const categoryCopy = getCategoryCopy(categorySlug);
  const isFrizerski = categorySlug === "frizerski-saloni";

  const categoryQuery = trpc.services.getCategoryBySlug.useQuery(
    { slug: categorySlug },
    { enabled: match && Boolean(categorySlug) }
  );
  const allCategoriesQuery = trpc.services.getAllCategories.useQuery();
  const businessesQuery = trpc.services.getAllBusinesses.useQuery(
    {
      categoryId: categoryQuery.data?.id,
      limit: 10000,
      offset: 0,
    },
    { enabled: Boolean(categoryQuery.data?.id) }
  );

  const allCategories = allCategoriesQuery.data || [];
  const businesses = businessesQuery.data || [];

  const fuzzyFiltered = useFuzzySearch(businesses, searchTerm, {
    threshold: 0.4,
    keys: ["name", "address", "phone"],
    includeScore: false,
  });

  const filteredBusinesses = useMemo(() => {
    let result = searchTerm ? fuzzyFiltered : businesses;

    if (isFrizerski && genderFilter !== "all") {
      result = result.filter(business => {
        if (genderFilter === "muski") return business.gender === "muski" || !business.gender;
        if (genderFilter === "zenski") return business.gender === "zenski" || !business.gender;
        return true;
      });
    }

    if (sortBy === "rating") return [...result].sort((a, b) => getRatingValue(b) - getRatingValue(a));
    if (sortBy === "name") return [...result].sort((a, b) => a.name.localeCompare(b.name, "hr"));
    return [...result].sort((a, b) => calculateWeightedScore(b) - calculateWeightedScore(a));
  }, [businesses, fuzzyFiltered, genderFilter, isFrizerski, searchTerm, sortBy]);

  const topLocations = useMemo(() => getTopLocations(businesses, 5), [businesses]);
  const averageRating = useMemo(() => getAverageRating(businesses), [businesses]);
  const contactCoverage = useMemo(() => getContactCoverage(businesses), [businesses]);
  const relatedCategories = useMemo(
    () => allCategories.filter(category => category.slug !== categorySlug).slice(0, 6),
    [allCategories, categorySlug]
  );

  const seoPayload = useMemo(() => {
    if (!categoryQuery.data) return null;

    const title = `${categoryCopy.title} u Splitu | ${businesses.length} profila | Split Usluge`;
    const description = `${categoryCopy.intro} Trenutno prikazujemo ${businesses.length} profila. ${
      topLocations.length > 0 ? `Najviše unosa pokriva: ${topLocations.join(", ")}.` : ""
    }`;
    const siteUrl = typeof window !== "undefined" ? window.location.origin : undefined;
    const pathname = `/usluga/${categoryQuery.data.slug}`;
    const breadcrumbs = [
      { name: "Naslovnica", path: "/" },
      { name: "Svi obrti", path: ALL_BUSINESSES_PATH },
      { name: categoryCopy.title, path: pathname },
    ];

    return buildSeoPayload({
      title,
      description,
      keywords: [...categoryCopy.keywords, "split usluge", "lokalne usluge split"],
      pathname,
      siteUrl,
      ogType: "article",
      structuredData: [
        ...buildBaseStructuredData(siteUrl || "https://split-usluge.com"),
        buildBreadcrumbSchema(siteUrl || "https://split-usluge.com", breadcrumbs),
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description,
          url: `${siteUrl || "https://split-usluge.com"}${pathname}`,
          inLanguage: "hr-HR",
          about: categoryCopy.title,
          areaServed: SERVICE_AREAS,
        },
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${categoryCopy.title} u Splitu`,
          itemListElement: filteredBusinesses.slice(0, 12).map((business, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: business.name,
            url: `${siteUrl || "https://split-usluge.com"}${getBusinessPath(business)}`,
          })),
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: categoryCopy.faq.map(item => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        },
      ],
    });
  }, [businesses.length, categoryCopy, categoryQuery.data, filteredBusinesses, topLocations]);

  usePageSeo(seoPayload);

  if (!match) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero - compact on mobile */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.30),_transparent_38%),linear-gradient(180deg,_rgba(2,6,23,0.68),_rgba(2,6,23,0.92))]" />
        <div className="container relative z-10 mx-auto px-4 py-10 md:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Naslovnica
          </Link>

          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            {categoryQuery.data?.name || categoryCopy.title}
          </h1>
          <p className="mt-2 text-base leading-7 text-white/70 md:text-lg md:max-w-2xl">
            {categoryQuery.data?.description || categoryCopy.intro}
          </p>

          {/* Stats row - horizontal scroll on mobile */}
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible">
            <div className="flex-shrink-0 rounded-xl border border-white/12 bg-white/8 px-4 py-3 backdrop-blur min-w-[130px]">
              <p className="text-xs text-white/60">Profila</p>
              <p className="mt-1 text-2xl font-bold">{businesses.length}</p>
            </div>
            <div className="flex-shrink-0 rounded-xl border border-white/12 bg-white/8 px-4 py-3 backdrop-blur min-w-[130px]">
              <p className="text-xs text-white/60">Ocjena</p>
              <p className="mt-1 text-2xl font-bold">{averageRating > 0 ? averageRating.toFixed(1) : "-"}</p>
            </div>
            <div className="flex-shrink-0 rounded-xl border border-white/12 bg-white/8 px-4 py-3 backdrop-blur min-w-[130px]">
              <p className="text-xs text-white/60">S telefonom</p>
              <p className="mt-1 text-2xl font-bold">{contactCoverage.withPhone}</p>
            </div>
            <div className="flex-shrink-0 rounded-xl border border-white/12 bg-white/8 px-4 py-3 backdrop-blur min-w-[130px]">
              <p className="text-xs text-white/60">S web stranicom</p>
              <p className="mt-1 text-2xl font-bold">{contactCoverage.withWebsite}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky search/filter bar */}
      <div className="sticky top-14 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder="Pretraži..."
                className="h-10 pl-9 text-sm"
              />
            </div>
            <Select value={sortBy} onValueChange={value => setSortBy(value as typeof sortBy)}>
              <SelectTrigger className="h-10 w-[140px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weighted">Preporučeni</SelectItem>
                <SelectItem value="rating">Ocjena</SelectItem>
                <SelectItem value="name">A-Z</SelectItem>
              </SelectContent>
            </Select>
            {isFrizerski && (
              <Select value={genderFilter} onValueChange={value => setGenderFilter(value as typeof genderFilter)}>
                <SelectTrigger className="h-10 w-[120px] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Svi</SelectItem>
                  <SelectItem value="muski">Muški</SelectItem>
                  <SelectItem value="zenski">Ženski</SelectItem>
                </SelectContent>
              </Select>
            )}
            <span className="hidden text-xs text-muted-foreground sm:block">
              {filteredBusinesses.length} rezultata
            </span>
          </div>
        </div>
      </div>

      {/* Business cards */}
      <div className="container mx-auto px-4 py-6">
        {businessesQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="space-y-3 p-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredBusinesses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBusinesses.map(business => {
              const tags = parseBusinessTags(business.tags);
              const ratingValue = getRatingValue(business);
              const imgSrc = getBusinessImage(business.id, categorySlug, business.imageUrl);

              return (
                <Card key={business.id} className="group overflow-hidden border-border/60 transition-all hover:shadow-xl">
                  {/* Image */}
                  <Link href={getBusinessPath(business)} className="block">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={imgSrc}
                        alt={business.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={e => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      {/* Rating badge */}
                      {ratingValue > 0 && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-black/70 px-2.5 py-1 text-sm font-bold text-white backdrop-blur">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          {ratingValue.toFixed(1)}
                          {business.reviewCount ? (
                            <span className="text-xs font-normal text-white/70">({business.reviewCount})</span>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </Link>

                  <CardContent className="p-4">
                    {/* Name + address */}
                    <Link href={getBusinessPath(business)}>
                      <h3 className="text-base font-bold leading-tight hover:text-primary line-clamp-2">
                        {business.name}
                      </h3>
                    </Link>
                    {business.address && (
                      <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-5 text-muted-foreground line-clamp-2">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary/70" />
                        {business.address}
                      </p>
                    )}

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="rounded-md bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Contact info */}
                    <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                      {business.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-primary/70" />
                          <span>{business.phone}</span>
                        </div>
                      )}
                      {business.website && (
                        <div className="flex items-center gap-1.5 truncate">
                          <Globe className="h-3.5 w-3.5 flex-shrink-0 text-primary/70" />
                          <span className="truncate">{business.website.replace(/^https?:\/\//, "")}</span>
                        </div>
                      )}
                    </div>

                    {/* CTA Buttons - big and touch-friendly */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {business.phone ? (
                        <Button asChild size="sm" className="h-11 text-sm font-bold">
                          <a href={`tel:${business.phone}`}>
                            <Phone className="mr-1.5 h-4 w-4" />
                            Pozovi
                          </a>
                        </Button>
                      ) : (
                        <Button asChild size="sm" variant="default" className="h-11 text-sm font-bold">
                          <Link href={getBusinessPath(business)}>
                            Otvori profil
                          </Link>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-11 text-sm"
                        onClick={() => openGoogleMaps(business.name, business.address)}
                      >
                        <Navigation className="mr-1.5 h-4 w-4" />
                        Navigiraj
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-10 text-center">
              <p className="text-lg font-medium">Nema pronađenih poslovanja u ovoj kategoriji.</p>
              <p className="mt-2 text-muted-foreground">
                Pokušaj promijeniti filtre ili otvori ostale kategorije.
              </p>
            </CardContent>
          </Card>
        )}

        {/* FAQ + CTA section */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-border/70">
            <CardContent className="space-y-5 p-5 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Lokalni kontekst</p>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Kako odabrati {categoryCopy.title.toLowerCase()} u Splitu
              </h2>
              <p className="text-sm leading-7 text-muted-foreground md:text-base md:leading-8">{categoryCopy.intro}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
                  <p className="text-sm font-semibold">Najčešće lokacije</p>
                  <p className="mt-1.5 text-xs leading-6 text-muted-foreground">
                    {topLocations.length > 0
                      ? topLocations.join(", ")
                      : "Lokacije će se prikazati čim kategorija dobije više unosa s potpunim adresama."}
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
                  <p className="text-sm font-semibold">Što usporediti prije poziva</p>
                  <p className="mt-1.5 text-xs leading-6 text-muted-foreground">
                    Ocjene, broj recenzija, blizinu, dostupnost telefona i weba te oznake poput hitne usluge ili specijalizacije.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {categoryCopy.faq.map(item => (
                  <div key={item.question} className="rounded-xl border border-border/70 bg-muted/30 p-4">
                    <p className="text-sm font-semibold">{item.question}</p>
                    <p className="mt-1.5 text-xs leading-6 text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card className="border-border/70 bg-slate-950 text-white">
              <CardContent className="space-y-4 p-5">
                <h2 className="text-xl font-bold">Želiš da tvoj profil bude među prvima?</h2>
                <p className="text-sm leading-6 text-white/70">
                  Prioritetni prikaz, bolja pozicija i više poziva od lokalnih kupaca.
                </p>
                <Button asChild className="w-full bg-orange-500 text-white hover:bg-orange-600">
                  <Link href="/promoviranje">Pogledaj planove</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardContent className="space-y-3 p-5">
                <h2 className="text-base font-bold">Povezane kategorije</h2>
                <div className="flex flex-wrap gap-2">
                  {relatedCategories.map(category => (
                    <Link key={category.id} href={`/usluga/${category.slug}`}>
                      <span className="inline-flex rounded-full border border-border/70 bg-muted/30 px-3 py-1.5 text-xs font-medium hover:border-primary/30 hover:text-primary">
                        {category.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
