import { useMemo } from "react";
import { Link, useRoute } from "wouter";
import { ALL_BUSINESSES_PATH, getBusinessPath } from "@shared/paths";
import {
  buildBaseStructuredData,
  buildBreadcrumbSchema,
  buildSeoPayload,
  SERVICE_AREAS,
} from "@shared/seo";
import { ArrowLeft, Clock, Globe, Mail, MapPin, MessageCircle, Navigation, Phone, Star, Tag, UserCheck } from "lucide-react";
import { usePageSeo } from "@/hooks/usePageSeo";
import { trpc } from "@/lib/trpc";
import {
  getRatingValue,
  parseBusinessTags,
  sortBusinessesByWeighted,
} from "@/lib/directory";
import { getBusinessImage } from "@/lib/category-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function openGoogleMaps(name: string, address?: string | null, latitude?: string | null, longitude?: string | null) {
  if (latitude && longitude) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, "_blank");
    return;
  }

  const query = `${name} ${address || ""}`.trim();
  window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, "_blank");
}

export default function BusinessDetailPage() {
  const [match, params] = useRoute("/poslovanje/:id/:slug");
  const businessId = Number(params?.id);

  const businessQuery = trpc.services.getBusinessById.useQuery(
    { id: businessId },
    { enabled: match && Number.isFinite(businessId) }
  );
  const categoriesQuery = trpc.services.getAllCategories.useQuery();
  const relatedQuery = trpc.services.getAllBusinesses.useQuery(
    {
      categoryId: businessQuery.data?.categoryId || undefined,
      limit: 8,
      offset: 0,
    },
    { enabled: Boolean(businessQuery.data?.categoryId) }
  );

  const business = businessQuery.data;
  const categories = categoriesQuery.data || [];
  const currentCategory = useMemo(
    () => categories.find(category => category.id === business?.categoryId),
    [business?.categoryId, categories]
  );
  const relatedBusinesses = useMemo(() => {
    const candidates = relatedQuery.data || [];
    return sortBusinessesByWeighted(
      candidates.filter(candidate => candidate.id !== business?.id)
    ).slice(0, 4);
  }, [business?.id, relatedQuery.data]);
  const tags = parseBusinessTags(business?.tags);
  const ratingValue = getRatingValue(business || {});

  const seoPayload = useMemo(() => {
    if (!business) {
      return null;
    }

    const categoryName = currentCategory?.name || "lokalna usluga";
    const title = `${business.name} | ${categoryName} u Splitu | Split Usluge`;
    const description =
      business.description?.trim() ||
      `${business.name} je uvršten u Split Usluge kao ${categoryName.toLowerCase()} u Splitu i okolici. Pogledajte kontakt, lokaciju, radno vrijeme i dodatne informacije prije poziva ili dolaska.`;
    const path = getBusinessPath(business);
    const siteUrl = typeof window !== "undefined" ? window.location.origin : undefined;
    const breadcrumbs = [
      { name: "Naslovnica", path: "/" },
      { name: "Svi obrti", path: ALL_BUSINESSES_PATH },
      { name: business.name, path },
    ];

    const localBusinessSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: business.name,
      description,
      areaServed: SERVICE_AREAS,
      url: siteUrl ? `${siteUrl}${path}` : path,
      address: {
        "@type": "PostalAddress",
        streetAddress: business.address || undefined,
        addressLocality: business.city || "Split",
        addressCountry: "HR",
      },
      telephone: business.phone || undefined,
      image: business.imageUrl || undefined,
      sameAs: business.website ? [business.website] : undefined,
    };

    if (business.latitude && business.longitude) {
      localBusinessSchema.geo = {
        "@type": "GeoCoordinates",
        latitude: Number(business.latitude),
        longitude: Number(business.longitude),
      };
    }

    if (ratingValue > 0 && business.reviewCount && business.reviewCount > 0) {
      localBusinessSchema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue,
        reviewCount: business.reviewCount,
      };
    }

    return buildSeoPayload({
      title,
      description,
      keywords: [
        `${business.name.toLowerCase()} split`,
        `${categoryName.toLowerCase()} split`,
        `kontakt ${business.name.toLowerCase()}`,
        "split usluge",
      ],
      pathname: path,
      siteUrl,
      ogType: "article",
      structuredData: [
        ...buildBaseStructuredData(siteUrl || "https://split-usluge.com"),
        buildBreadcrumbSchema(siteUrl || "https://split-usluge.com", breadcrumbs),
        localBusinessSchema,
      ],
    });
  }, [business, currentCategory?.name, ratingValue]);

  usePageSeo(seoPayload);

  if (!match) {
    return null;
  }

  if (businessQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-72 w-full rounded-3xl" />
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <Skeleton className="h-[500px] w-full rounded-3xl" />
            <Skeleton className="h-[360px] w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Poslovanje nije pronađeno</h1>
          <p className="text-muted-foreground mb-8">
            Profil koji tražite više nije aktivan ili nije dostupan u imeniku.
          </p>
          <Link href={ALL_BUSINESSES_PATH}>
            <Button>Pregledaj sva poslovanja</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <section className="relative overflow-hidden border-b border-border bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.32),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.24),_transparent_40%)]" />
        <div className="container relative z-10 mx-auto px-4 py-10 md:py-16">
          <Link
            href={ALL_BUSINESSES_PATH}
            className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Natrag na imenik
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-3 text-sm text-white/75">
                {currentCategory && (
                  <Link
                    href={`/usluga/${currentCategory.slug}`}
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 hover:bg-white/15"
                  >
                    {currentCategory.name}
                  </Link>
                )}
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5">
                  {business.city || "Split i okolica"}
                </span>
                {business.neighborhood && (
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5">
                    {business.neighborhood}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-4xl font-bold tracking-tight md:text-6xl">{business.name}</h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-white/80">
                  {business.description?.trim() ||
                    `${business.name} je dio imenika Split Usluge. Na ovoj stranici možete brzo pronaći kontakt, adresu, kartu i ostale informacije prije poziva ili dolaska.`}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                {ratingValue > 0 && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2">
                    <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                    <span>
                      {ratingValue.toFixed(1)}
                      {business.reviewCount ? ` / ${business.reviewCount} recenzija` : ""}
                    </span>
                  </div>
                )}
                {business.phone && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
                    <Phone className="h-4 w-4" />
                    <span>{business.phone}</span>
                  </div>
                )}
                {business.address && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
                    <MapPin className="h-4 w-4" />
                    <span>{business.address}</span>
                  </div>
                )}
              </div>
            </div>

            <Card className="overflow-hidden border-white/10 bg-white/8 text-white backdrop-blur">
              <CardContent className="p-0">
                <img
                  src={getBusinessImage(business.id, currentCategory?.slug || "", business.imageUrl)}
                  alt={business.name}
                  className="h-72 w-full object-cover"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-8">
          <Card className="border-border/70">
            <CardContent className="space-y-6 p-6 md:p-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Osnovne informacije</h2>
                <p className="mt-2 text-muted-foreground">
                  Brz pregled svih javno dostupnih podataka za ovo poslovanje.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {business.address && (
                  <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      Adresa
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{business.address}</p>
                  </div>
                )}

                {business.phone && (
                  <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Phone className="h-4 w-4 text-primary" />
                      Telefon
                    </div>
                    <a href={`tel:${business.phone}`} className="text-sm text-primary hover:underline">
                      {business.phone}
                    </a>
                  </div>
                )}

                {business.website && (
                  <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Globe className="h-4 w-4 text-primary" />
                      Web stranica
                    </div>
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-sm text-primary hover:underline"
                    >
                      {business.website}
                    </a>
                  </div>
                )}

                {business.openingHours && (
                  <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      Radno vrijeme
                    </div>
                    <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
                      {business.openingHours.replace(/ \| /g, "\n")}
                    </p>
                  </div>
                )}
              </div>

              {tags.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Tag className="h-4 w-4 text-primary" />
                    Istaknute oznake
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardContent className="space-y-5 p-6 md:p-8">
              <h2 className="text-2xl font-bold tracking-tight">Zašto otvoriti ovaj profil prije poziva?</h2>
              <p className="leading-7 text-muted-foreground">
                Profili na Split Uslugama skupljaju osnovne informacije s jednog mjesta kako biste brže
                usporedili više lokalnih opcija. Umjesto da tražite kontakt, lokaciju i ocjene na više strana,
                ovdje možete odmah vidjeti je li poslovanje relevantno za vaš upit.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <p className="text-sm font-semibold">Brži odabir</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Usporedite adresu, telefon, web i recenzije bez dodatnog klikanja.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <p className="text-sm font-semibold">Lokalni fokus</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Svi profili su grupirani po Splitu i okolici, pa je lakše pronaći nekoga u blizini.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <p className="text-sm font-semibold">Bolji pregled ponude</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Povezani profili u istoj kategoriji pomažu vam usporediti više opcija prije odluke.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {relatedBusinesses.length > 0 && (
            <Card className="border-border/70">
              <CardContent className="space-y-5 p-6 md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      Još iz kategorije {currentCategory?.name || "slične usluge"}
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      Ako želite usporediti više opcija, krenite od ovih profila.
                    </p>
                  </div>
                  {currentCategory && (
                    <Link href={`/usluga/${currentCategory.slug}`} className="hidden text-sm text-primary hover:underline md:block">
                      Vidi kategoriju
                    </Link>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {relatedBusinesses.map(item => (
                    <Link key={item.id} href={getBusinessPath(item)}>
                      <div className="h-full rounded-2xl border border-border/70 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            {item.address && (
                              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.address}</p>
                            )}
                          </div>
                          {getRatingValue(item) > 0 && (
                            <div className="inline-flex items-center gap-1 rounded-full bg-yellow-400/15 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                              <Star className="h-3.5 w-3.5 fill-current" />
                              {getRatingValue(item).toFixed(1)}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-border/70">
            <CardContent className="space-y-3 p-6">
              <h2 className="text-xl font-bold">Kontakt i akcije</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Najbrži način za stupiti u kontakt ili otvoriti lokaciju u kartama.
              </p>

              <div className="space-y-2 pt-2">
                {business.phone && (
                  <Button asChild className="w-full">
                    <a href={`tel:${business.phone}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      Pozovi odmah
                    </a>
                  </Button>
                )}

                {business.phone && (
                  <Button asChild variant="outline" className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                    <a href={`https://wa.me/${business.phone.replace(/[^0-9+]/g, "").replace(/^0/, "+385")}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp poruka
                    </a>
                  </Button>
                )}

                {business.email && (
                  <Button asChild variant="outline" className="w-full">
                    <a href={`mailto:${business.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Pošalji email
                    </a>
                  </Button>
                )}

                {business.website && (
                  <Button asChild variant="outline" className="w-full">
                    <a href={business.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Otvori web
                    </a>
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    openGoogleMaps(business.name, business.address, business.latitude, business.longitude)
                  }
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  Otvori u Google Maps
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-slate-950 text-white">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-bold">Želiš istaknuti svoj profil?</h2>
              <p className="text-sm leading-6 text-white/75">
                Prioritetni prikaz, bolja pozicija u kategoriji i više poziva od lokalnih kupaca.
              </p>
              <Button asChild className="w-full bg-orange-500 text-white hover:bg-orange-600">
                <Link href="/promoviranje">Pogledaj planove</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardContent className="space-y-3 p-6">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold">Ovo je vaše poslovanje?</h2>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Preuzmite kontrolu nad profilom, ažurirajte podatke i povećajte vidljivost.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/prijava">Preuzmite djelatnost</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
