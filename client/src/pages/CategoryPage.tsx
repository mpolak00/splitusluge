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
import { ArrowLeft, Globe, MapPin, Phone, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MapView } from "@/components/Map";
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
        if (genderFilter === "muski") {
          return business.gender === "muski" || !business.gender;
        }

        if (genderFilter === "zenski") {
          return business.gender === "zenski" || !business.gender;
        }

        return true;
      });
    }

    if (sortBy === "rating") {
      return [...result].sort((a, b) => getRatingValue(b) - getRatingValue(a));
    }

    if (sortBy === "name") {
      return [...result].sort((a, b) => a.name.localeCompare(b.name, "hr"));
    }

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
    if (!categoryQuery.data) {
      return null;
    }

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
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        },
      ],
    });
  }, [businesses.length, categoryCopy, categoryQuery.data, filteredBusinesses, topLocations]);

  usePageSeo(seoPayload);

  if (!match) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <section className="relative overflow-hidden border-b border-border bg-slate-950 text-white">
        {categoryQuery.data?.imageUrl && (
          <img
            src={categoryQuery.data.imageUrl}
            alt={categoryQuery.data.name}
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.30),_transparent_38%),linear-gradient(180deg,_rgba(2,6,23,0.68),_rgba(2,6,23,0.92))]" />
        <div className="container relative z-10 mx-auto px-4 py-14 md:py-20">
          <Link
            href={ALL_BUSINESSES_PATH}
            className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Natrag na imenik
          </Link>

          <div className="mt-6 max-w-4xl space-y-5">
            <div className="flex flex-wrap gap-3 text-sm text-white/75">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5">
                {businesses.length || 0} profila
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5">
                {SERVICE_AREAS.join(", ")}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                {categoryQuery.data?.name || categoryCopy.title} u Splitu i okolici
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-white/80">
                {categoryQuery.data?.description || categoryCopy.intro}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="text-sm text-white/70">Ukupno profila</p>
                <p className="mt-2 text-3xl font-bold">{businesses.length || "0"}</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="text-sm text-white/70">Prosječna ocjena</p>
                <p className="mt-2 text-3xl font-bold">{averageRating > 0 ? averageRating.toFixed(1) : "-"}</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="text-sm text-white/70">Telefon dostupno</p>
                <p className="mt-2 text-3xl font-bold">{contactCoverage.withPhone}</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="text-sm text-white/70">Web dostupno</p>
                <p className="mt-2 text-3xl font-bold">{contactCoverage.withWebsite}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {businesses.length > 0 && (
          <Card className="mb-8 overflow-hidden border-border/70">
            <CardContent className="p-0">
              <div className="p-6 pb-0">
                <h2 className="text-2xl font-bold tracking-tight">Lokacije na karti</h2>
                <p className="mt-2 text-muted-foreground">
                  Pregledaj raspored poslovanja po Splitu i okolici prije nego što kreneš zvati.
                </p>
              </div>
              <div className="mt-6 h-[380px] overflow-hidden rounded-b-3xl">
                <MapView
                  initialCenter={{ lat: 43.5081, lng: 16.4402 }}
                  initialZoom={12}
                  onMapReady={map => {
                    filteredBusinesses.forEach(business => {
                      if (!business.latitude || !business.longitude) {
                        return;
                      }

                      const lat = parseFloat(business.latitude);
                      const lng = parseFloat(business.longitude);

                      if (Number.isNaN(lat) || Number.isNaN(lng)) {
                        return;
                      }

                      new window.google.maps.marker.AdvancedMarkerElement({
                        map,
                        position: { lat, lng },
                        title: business.name,
                      });
                    });
                  }}
                  className="h-full w-full"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8 border-border/70">
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Filtriraj i usporedi profile</h2>
                <p className="mt-2 text-muted-foreground">
                  Pretraga po nazivu i adresi, sortiranje po ocjeni ili preporuci te dodatni filteri po potrebi.
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                Rezultata: <strong>{filteredBusinesses.length}</strong>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Pretraga</label>
                <Input
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                  placeholder="Naziv ili adresa..."
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Sortiranje</label>
                <Select value={sortBy} onValueChange={value => setSortBy(value as typeof sortBy)}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weighted">Preporučeni</SelectItem>
                    <SelectItem value="rating">Ocjena</SelectItem>
                    <SelectItem value="name">Naziv A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isFrizerski && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Filter po usluzi</label>
                  <Select value={genderFilter} onValueChange={value => setGenderFilter(value as typeof genderFilter)}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Svi saloni</SelectItem>
                      <SelectItem value="muski">Muški</SelectItem>
                      <SelectItem value="zenski">Ženski</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {businessesQuery.isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                  <Skeleton className="h-52 w-full" />
                  <CardContent className="space-y-4 p-6">
                    <Skeleton className="h-7 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredBusinesses.length > 0 ? (
          <div className="space-y-4">
            {filteredBusinesses.map(business => {
              const tags = parseBusinessTags(business.tags);
              const ratingValue = getRatingValue(business);

              return (
                <Card key={business.id} className="overflow-hidden border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                    <div className="h-52 bg-muted">
                      {business.imageUrl ? (
                        <img src={business.imageUrl} alt={business.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          Nema fotografije
                        </div>
                      )}
                    </div>

                    <CardContent className="flex flex-col justify-between gap-5 p-6">
                      <div className="space-y-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <Link href={getBusinessPath(business)}>
                              <h3 className="text-2xl font-bold tracking-tight hover:text-primary">{business.name}</h3>
                            </Link>
                            {business.address && (
                              <p className="mt-2 flex items-start gap-2 text-sm leading-7 text-muted-foreground">
                                <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
                                <span>{business.address}</span>
                              </p>
                            )}
                          </div>

                          {ratingValue > 0 && (
                            <div className="inline-flex items-center gap-1 rounded-full bg-yellow-400/15 px-3 py-1.5 text-sm font-semibold text-yellow-700">
                              <Star className="h-4 w-4 fill-current" />
                              {ratingValue.toFixed(1)}
                              {business.reviewCount ? <span className="text-xs">({business.reviewCount})</span> : null}
                            </div>
                          )}
                        </div>

                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {tags.slice(0, 5).map(tag => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                              >
                                <Tag className="h-3.5 w-3.5" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
                          {business.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-primary" />
                              <span>{business.phone}</span>
                            </div>
                          )}
                          {business.website && (
                            <div className="flex items-center gap-2 truncate">
                              <Globe className="h-4 w-4 flex-shrink-0 text-primary" />
                              <span className="truncate">{business.website}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                        <Button asChild size="sm">
                          <Link href={getBusinessPath(business)}>Otvori profil</Link>
                        </Button>

                        {business.phone ? (
                          <Button asChild size="sm" variant="outline">
                            <a href={`tel:${business.phone}`}>
                              <Phone className="mr-2 h-4 w-4" />
                              Pozovi
                            </a>
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            Bez telefona
                          </Button>
                        )}

                        {business.website ? (
                          <Button asChild size="sm" variant="outline">
                            <a href={business.website} target="_blank" rel="noopener noreferrer">
                              <Globe className="mr-2 h-4 w-4" />
                              Web
                            </a>
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            Bez weba
                          </Button>
                        )}

                        <Button size="sm" variant="outline" onClick={() => openGoogleMaps(business.name, business.address)}>
                          <MapPin className="mr-2 h-4 w-4" />
                          Mapa
                        </Button>
                      </div>
                    </CardContent>
                  </div>
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

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-border/70">
            <CardContent className="space-y-5 p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Lokalni kontekst</p>
              <h2 className="text-3xl font-bold tracking-tight">
                Kako odabrati {categoryCopy.title.toLowerCase()} u Splitu
              </h2>
              <p className="leading-8 text-muted-foreground">{categoryCopy.intro}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <p className="font-semibold">Najčešće lokacije</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {topLocations.length > 0
                      ? topLocations.join(", ")
                      : "Lokacije će se prikazati čim kategorija dobije više unosa s potpunim adresama."}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <p className="font-semibold">Što usporediti prije poziva</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Ocjene, broj recenzija, blizinu, dostupnost telefona i weba te dodatne oznake poput hitne usluge,
                    specijalizacije ili radnog vremena.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {categoryCopy.faq.map(item => (
                  <div key={item.question} className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                    <p className="font-semibold">{item.question}</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/70 bg-slate-950 text-white">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-2xl font-bold tracking-tight">Želiš da tvoj profil bude među prvima?</h2>
                <p className="text-sm leading-7 text-white/75">
                  Kad krenemo s prioritetnim pozicijama, najbolje optimizirani profili imat će najveću vidljivost
                  na organskim rezultatima i oglasnim landing stranicama.
                </p>
                <Button asChild className="w-full bg-orange-500 text-white hover:bg-orange-600">
                  <Link href="/promoviranje">Pogledaj planove</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-xl font-bold">Povezane kategorije</h2>
                <div className="flex flex-wrap gap-2">
                  {relatedCategories.map(category => (
                    <Link key={category.id} href={`/usluga/${category.slug}`}>
                      <span className="inline-flex rounded-full border border-border/70 bg-muted/30 px-3 py-1.5 text-sm hover:border-primary/30 hover:text-primary">
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
