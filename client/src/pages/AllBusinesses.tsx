import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ALL_BUSINESSES_PATH, getBusinessPath } from "@shared/paths";
import { buildBaseStructuredData, buildBreadcrumbSchema, buildSeoPayload, SERVICE_AREAS } from "@shared/seo";
import { ArrowLeft, Globe, MapPin, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageSeo } from "@/hooks/usePageSeo";
import { getAverageRating, getRatingValue, sortBusinessesByWeighted } from "@/lib/directory";
import { trpc } from "@/lib/trpc";

function openGoogleMaps(name: string, address?: string | null) {
  const query = `${name} ${address || ""}`.trim();
  window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, "_blank");
}

export default function AllBusinesses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"weighted" | "rating" | "name">("weighted");

  const categoriesQuery = trpc.services.getAllCategories.useQuery();
  const businessesQuery = trpc.services.getAllBusinesses.useQuery({
    categoryId: selectedCategory !== "all" ? Number(selectedCategory) : undefined,
    limit: 10000,
    offset: 0,
  });

  const categories = categoriesQuery.data || [];
  const allBusinesses = businessesQuery.data || [];

  const filteredBusinesses = useMemo(() => {
    let result = allBusinesses;

    if (searchTerm.trim()) {
      const normalized = searchTerm.toLowerCase();
      result = result.filter(
        business =>
          business.name.toLowerCase().includes(normalized) ||
          business.address?.toLowerCase().includes(normalized) ||
          business.city?.toLowerCase().includes(normalized)
      );
    }

    if (sortBy === "rating") {
      return [...result].sort((a, b) => getRatingValue(b) - getRatingValue(a));
    }

    if (sortBy === "name") {
      return [...result].sort((a, b) => a.name.localeCompare(b.name, "hr"));
    }

    return sortBusinessesByWeighted(result);
  }, [allBusinesses, searchTerm, sortBy]);

  const averageRating = useMemo(() => getAverageRating(filteredBusinesses), [filteredBusinesses]);

  const seoPayload = useMemo(() => {
    const title = "Svi obrti i lokalne usluge u Splitu | Split Usluge";
    const description = `Pregledaj ${filteredBusinesses.length || allBusinesses.length} lokalnih poslovanja u Splitu i okolici. Usporedi kategorije, profile, kontakte i lokacije na jednom mjestu.`;
    const siteUrl = typeof window !== "undefined" ? window.location.origin : undefined;
    const breadcrumbs = [
      { name: "Naslovnica", path: "/" },
      { name: "Svi obrti", path: ALL_BUSINESSES_PATH },
    ];

    return buildSeoPayload({
      title,
      description,
      keywords: [
        "svi obrti split",
        "lokalne usluge split",
        "imenik obrta split",
        "firme split",
        "majstori split",
      ],
      pathname: ALL_BUSINESSES_PATH,
      siteUrl,
      structuredData: [
        ...buildBaseStructuredData(siteUrl || "https://split-usluge.com"),
        buildBreadcrumbSchema(siteUrl || "https://split-usluge.com", breadcrumbs),
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description,
          url: `${siteUrl || "https://split-usluge.com"}${ALL_BUSINESSES_PATH}`,
          inLanguage: "hr-HR",
          areaServed: SERVICE_AREAS,
        },
      ],
    });
  }, [allBusinesses.length, filteredBusinesses.length]);

  usePageSeo(seoPayload);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <section className="border-b border-border bg-slate-950 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Natrag na naslovnicu
          </Link>

          <div className="mt-6 max-w-4xl space-y-5">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Svi obrti i lokalne usluge u Splitu na jednom mjestu
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-white/80">
              Ovo je centralni imenik Split Usluge. Ovdje možeš filtrirati kategorije, usporediti profile
              poslovanja i otvoriti detaljne stranice za svaki lokalni biznis.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="text-sm text-white/70">Prikazanih profila</p>
                <p className="mt-2 text-3xl font-bold">{filteredBusinesses.length}</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="text-sm text-white/70">Kategorija</p>
                <p className="mt-2 text-3xl font-bold">{categories.length}</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="text-sm text-white/70">Prosječna ocjena</p>
                <p className="mt-2 text-3xl font-bold">{averageRating > 0 ? averageRating.toFixed(1) : "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <Card className="mb-8 border-border/70">
          <CardContent className="space-y-4 p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Pretraga</label>
                <Input
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                  placeholder="Naziv, adresa ili grad..."
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Kategorija</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Sve kategorije</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            </div>
          </CardContent>
        </Card>

        {businessesQuery.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <Skeleton className="h-48 w-full" />
                <CardContent className="space-y-4 p-5">
                  <Skeleton className="h-6 w-2/3" />
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
                <div className="h-48 bg-muted">
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
                        <h2 className="text-xl font-semibold hover:text-primary">{business.name}</h2>
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

                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button asChild size="sm">
                      <Link href={getBusinessPath(business)}>Otvori profil</Link>
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openGoogleMaps(business.name, business.address)}>
                      <MapPin className="mr-2 h-4 w-4" />
                      Mapa
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-10 text-center">
              <p className="text-lg font-medium">Nema rezultata za odabrane filtre.</p>
              <p className="mt-2 text-muted-foreground">
                Očisti pretragu ili odaberi drugu kategoriju.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
