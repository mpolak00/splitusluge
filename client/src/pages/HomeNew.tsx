import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ALL_BUSINESSES_PATH, getBusinessPath } from "@shared/paths";
import { buildBaseStructuredData, buildSeoPayload, SERVICE_AREAS } from "@shared/seo";
import { ArrowRight, Globe, Map, MapPin, Phone, Search, ShieldCheck, Star, Store } from "lucide-react";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { calculateWeightedScore, getAverageRating, getRatingValue, sortBusinessesByWeighted } from "@/lib/directory";
import { trpc } from "@/lib/trpc";

function openGoogleMaps(name: string, address?: string | null) {
  const query = `${name} ${address || ""}`.trim();
  window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, "_blank");
}

export default function HomeNew() {
  const [searchTerm, setSearchTerm] = useState("");

  const categoriesQuery = trpc.services.getAllCategories.useQuery();
  const businessesQuery = trpc.services.getAllBusinesses.useQuery({
    limit: 10000,
    offset: 0,
  });

  const categories = categoriesQuery.data || [];
  const allBusinesses = businessesQuery.data || [];

  const categoryCounts = useMemo(() => {
    const counts: Record<number, number> = {};

    allBusinesses.forEach(business => {
      counts[business.categoryId] = (counts[business.categoryId] || 0) + 1;
    });

    return counts;
  }, [allBusinesses]);

  const categorySummaries = useMemo(
    () =>
      categories
        .map(category => ({
          ...category,
          businessCount: categoryCounts[category.id] || 0,
        }))
        .sort((a, b) => b.businessCount - a.businessCount),
    [categories, categoryCounts]
  );

  const featuredBusinesses = useMemo(
    () => sortBusinessesByWeighted(allBusinesses).slice(0, 6),
    [allBusinesses]
  );

  const filteredBusinesses = useFuzzySearch(allBusinesses, searchTerm, {
    threshold: 0.4,
    keys: ["name", "address", "phone", "website"],
    includeScore: false,
  });

  const averageRating = useMemo(() => getAverageRating(allBusinesses), [allBusinesses]);

  const seoPayload = useMemo(() => {
    const title = "Split Usluge | Lokalni imenik usluga, obrta i firmi u Splitu";
    const description = `Pronaite ${allBusinesses.length || "provjerene"} lokalne usluge, obrte i firme u Splitu i okolici. Kategorije, kontakti, karta i profilna poslovanja na jednom mjestu.`;
    const siteUrl = typeof window !== "undefined" ? window.location.origin : undefined;

    return buildSeoPayload({
      title,
      description,
      keywords: [
        "split usluge",
        "imenik obrta split",
        "lokalne usluge split",
        "majstori split",
        "firme split",
        "google karte split usluge",
      ],
      pathname: "/",
      siteUrl,
      structuredData: [
        ...buildBaseStructuredData(siteUrl || "https://split-usluge.com"),
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description,
          url: siteUrl || "https://split-usluge.com",
          inLanguage: "hr-HR",
          areaServed: SERVICE_AREAS,
        },
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Najtra~enije kategorije u Splitu",
          itemListElement: categorySummaries.slice(0, 8).map((category, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: category.name,
            url: `${siteUrl || "https://split-usluge.com"}/usluga/${category.slug}`,
          })),
        },
      ],
    });
  }, [allBusinesses.length, categorySummaries]);

  usePageSeo(seoPayload);

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <img src="/images/hero-split.jpg" alt="Panorama Splita" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.30),_transparent_35%),linear-gradient(180deg,_rgba(2,6,23,0.70),_rgba(2,6,23,0.92))]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
              Lokalni imenik za Split i okolicu
            </div>
            <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-7xl">
              Sve lokalne usluge u Splitu na jednom mjestu
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">
              Od vulkanizera i frizera do vodoinstalatera, stomatologa i selidbi. Split Usluge
              okuplja lokalne biznise, kontakte i profile poslovanja kako bi ih korisnici lakae naali,
              usporedili i kontaktirali.
            </p>

            <div className="mt-10 max-w-3xl rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/55" />
                  <Input
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                    placeholder="Pretra~i po nazivu, usluzi ili adresi..."
                    className="h-14 border-white/0 bg-transparent pl-12 text-base text-white placeholder:text-white/55 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="flex gap-3">
                  <Button asChild size="lg" className="h-14 flex-1 bg-orange-500 text-white hover:bg-orange-600">
                    <Link href="/mapa">
                      <Map className="mr-2 h-4 w-4" />
                      Karta
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-14 flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10">
                    <Link href={ALL_BUSINESSES_PATH}>Imenik</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur">
                <p className="text-sm text-white/70">Aktivnih poslovanja</p>
                <p className="mt-2 text-3xl font-bold">{allBusinesses.length || "..."}</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur">
                <p className="text-sm text-white/70">Kategorija</p>
                <p className="mt-2 text-3xl font-bold">{categories.length || "..."}</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur">
                <p className="text-sm text-white/70">Prosjena ocjena</p>
                <p className="mt-2 text-3xl font-bold">{averageRating > 0 ? averageRating.toFixed(1) : "-"}</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur">
                <p className="text-sm text-white/70">Pokrivena podruja</p>
                <p className="mt-2 text-lg font-semibold">{SERVICE_AREAS.join(", ")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        {searchTerm ? (
          <div className="space-y-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Rezultati pretrage</h2>
                <p className="mt-2 text-muted-foreground">
                  Pronadjeno {filteredBusinesses.length} rezultata za upit "{searchTerm}".
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href={ALL_BUSINESSES_PATH}>Otvori cijeli imenik</Link>
              </Button>
            </div>

            {businessesQuery.isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index}>
                    <Skeleton className="h-44 w-full" />
                    <CardContent className="space-y-3 p-5">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredBusinesses.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredBusinesses.map(business => (
                  <Card key={business.id} className="overflow-hidden border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="h-44 bg-muted">
                      {business.imageUrl ? (
                        <img src={business.imageUrl} alt={business.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          Nema fotografije
                        </div>
                      )}
                    </div>
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link href={getBusinessPath(business)}>
                            <h3 className="text-lg font-semibold hover:text-primary">{business.name}</h3>
                          </Link>
                          {business.address && (
                            <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                              <span>{business.address}</span>
                            </p>
                          )}
                        </div>
                        {getRatingValue(business) > 0 && (
                          <div className="inline-flex items-center gap-1 rounded-full bg-yellow-400/15 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            {getRatingValue(business).toFixed(1)}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {business.phone ? (
                          <Button asChild size="sm">
                            <a href={`tel:${business.phone}`}>
                              <Phone className="mr-2 h-4 w-4" />
                              Pozovi
                            </a>
                          </Button>
                        ) : (
                          <Button asChild size="sm" variant="outline">
                            <Link href={getBusinessPath(business)}>Profil</Link>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openGoogleMaps(business.name, business.address)}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          Mapa
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-10 text-center">
                  <p className="text-lg font-medium">Nema rezultata za ovaj upit.</p>
                  <p className="mt-2 text-muted-foreground">
                    Pokuaaj s nazivom usluge, kvartom ili otvori cijeli imenik.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-16">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                    Najtra~enije kategorije
                  </p>
                  <h2 className="mt-3 text-4xl font-bold tracking-tight">
                    Kategorije koje najcesce traze ljudi u Splitu
                  </h2>
                  <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                    Kreni od najjaih kategorija s najviae unosa i najviae lokalnih upita. Svaka kategorija
                    vodi na vlastitu optimiziranu stranicu s kartom, FAQ sadr~ajem i profilima poslovanja.
                  </p>
                </div>

                {businessesQuery.isLoading ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Skeleton key={index} className="h-36 rounded-3xl" />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {categorySummaries.slice(0, 8).map(category => (
                      <Link key={category.id} href={`/usluga/${category.slug}`}>
                        <div className="group h-full rounded-3xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-semibold group-hover:text-primary">{category.name}</h3>
                              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                {category.description || `${category.name} u Splitu i okolici na jednom mjestu.`}
                              </p>
                            </div>
                            <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                              {category.businessCount}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Card className="overflow-hidden border-border/70 bg-slate-950 text-white">
                <CardContent className="p-0">
                  <div className="border-b border-white/10 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">Za biznise</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight">Zelis vise poziva i bolju poziciju na Googleu?</h2>
                    <p className="mt-4 text-white/75">
                      Split Usluge gradimo kao lokalni imenik koji spaja organski SEO, Google Ads i
                      prioritetne pozicije unutar kategorija. To znaci vise vidljivosti za one koji zele biti
                      ispred konkurencije.
                    </p>
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="font-semibold">Profil poslovanja</p>
                      <p className="mt-2 text-sm leading-6 text-white/70">
                        Vlastita landing stranica s kontaktima, lokacijom i SEO sadr~ajem.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="font-semibold">Prioritetni prikaz</p>
                      <p className="mt-2 text-sm leading-6 text-white/70">
                        Mogucnost isticanja u kategoriji i kampanjama kad krenemo s oglasima.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="font-semibold">Lokalni doseg</p>
                      <p className="mt-2 text-sm leading-6 text-white/70">
                        Fokus na Split, Solin, Kaatela, Podstranu, Dugopolje i Omia.
                      </p>
                    </div>
                    <Button asChild className="mt-2 w-full bg-orange-500 text-white hover:bg-orange-600">
                      <Link href="/registracija">Dodaj poslovanje</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Istaknuti profili</p>
                  <h2 className="mt-3 text-4xl font-bold tracking-tight">Poslovanja s najjaim signalima povjerenja</h2>
                  <p className="mt-3 max-w-2xl text-lg leading-8 text-muted-foreground">
                    Kombiniramo broj recenzija i ocjene kako bismo korisniku odmah pokazali najrelevantnije profile.
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href={ALL_BUSINESSES_PATH}>
                    Pogledaj cijeli imenik
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {businessesQuery.isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-72 rounded-3xl" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {featuredBusinesses.map(business => (
                    <Card key={business.id} className="overflow-hidden border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                      <div className="h-44 bg-muted">
                        {business.imageUrl ? (
                          <img src={business.imageUrl} alt={business.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground">
                            Nema fotografije
                          </div>
                        )}
                      </div>
                      <CardContent className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link href={getBusinessPath(business)}>
                              <h3 className="text-lg font-semibold hover:text-primary">{business.name}</h3>
                            </Link>
                            {business.address && (
                              <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                <span>{business.address}</span>
                              </p>
                            )}
                          </div>
                          {getRatingValue(business) > 0 && (
                            <div className="inline-flex items-center gap-1 rounded-full bg-yellow-400/15 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                              <Star className="h-3.5 w-3.5 fill-current" />
                              {getRatingValue(business).toFixed(1)}
                            </div>
                          )}
                        </div>

                        <div className="text-sm text-muted-foreground">
                          Score povjerenja: {Math.round(calculateWeightedScore(business) * 100)} / 100
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Button asChild size="sm">
                            <Link href={getBusinessPath(business)}>
                              <Store className="mr-2 h-4 w-4" />
                              Profil
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openGoogleMaps(business.name, business.address)}
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            Mapa
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="border-border/70">
                <CardContent className="space-y-3 p-6">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold">SEO-orijentiran imenik</h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Kategorijske i profilne stranice gradimo tako da svaka mo~e rankati za lokalne upite
                    poput "vodoinstalater Split", "frizer Split" ili "selidbe Split".
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/70">
                <CardContent className="space-y-3 p-6">
                  <MapPin className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold">Lokalni fokus</h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Ne ciljamo generiki cijelu Hrvatsku, nego gradimo autoritet za Split i okolicu gdje su
                    pretrage i namjera korisnika najjae.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/70">
                <CardContent className="space-y-3 p-6">
                  <Globe className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold">Spremno za oglase</h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    Kad krenes s Google Ads kampanjama, svaka kategorija i svaki profil vec ce imati jasnu
                    landing strukturu za bolje rezultate i veci broj upita.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
              <Card className="border-border/70">
                <CardContent className="space-y-5 p-6 md:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Podruja</p>
                  <h2 className="text-3xl font-bold tracking-tight">Gdje trenutno gradimo lokalni autoritet</h2>
                  <p className="leading-8 text-muted-foreground">
                    Split Usluge nije samo za strogi centar grada. Imenik je postavljen tako da pokriva i
                    airu okolicu u kojoj ljudi svakodnevno tra~e lokalne usluge.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {SERVICE_AREAS.map(area => (
                      <div key={area} className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-3 text-sm font-medium">
                        {area}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/70">
                <CardContent className="space-y-5 p-6 md:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">FAQ</p>
                  <h2 className="text-3xl font-bold tracking-tight">Cesta pitanja o imeniku</h2>
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                      <p className="font-semibold">Kako odabiremo profile koji su prikazani?</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        Bazu gradimo iz javno dostupnih lokalnih izvora i profila koje vlasnici poslovanja sami
                        prijave. Zatim ih grupiramo po kategorijama i lokacijama.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                      <p className="font-semibold">Hoce li biti moguce platiti prioritetnu poziciju?</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        Da. Plan je ponuditi prioritetne pozicije i isticanje unutar kategorija, ali prvo gradimo
                        kvalitetan organski temelj i dobru korisniku bazu.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                      <p className="font-semibold">Zaato su profilne stranice va~ne za Google?</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        Zato ato svako poslovanje dobiva svoju indexabilnu stranicu s kontaktima, lokacijom,
                        povezanim kategorijama i lokalnim kontekstom koji poma~e organskom rankingu.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
