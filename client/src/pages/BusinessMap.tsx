import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { getBusinessPath } from "@shared/paths";
import { buildBaseStructuredData, buildBreadcrumbSchema, buildSeoPayload, SERVICE_AREAS } from "@shared/seo";
import { ArrowLeft, Globe, MapPin, Navigation, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/Map";
import { usePageSeo } from "@/hooks/usePageSeo";
import { getRatingValue } from "@/lib/directory";
import { getBusinessImage, getCategoryFallbackImage } from "@/lib/category-images";
import { trpc } from "@/lib/trpc";

export default function BusinessMap() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const categoriesQuery = trpc.services.getAllCategories.useQuery();
  const businessesQuery = trpc.services.getAllBusinesses.useQuery({
    limit: 10000,
    offset: 0,
  });

  const categories = categoriesQuery.data || [];
  const businesses = businessesQuery.data || [];

  const categorySlugMap = useMemo(() => {
    const map: Record<number, string> = {};
    categories.forEach(c => { map[c.id] = c.slug; });
    return map;
  }, [categories]);

  const filteredBusinesses = useMemo(
    () =>
      selectedCategory
        ? businesses.filter(business => business.categoryId === selectedCategory)
        : businesses,
    [businesses, selectedCategory]
  );

  const seoPayload = useMemo(() => {
    const siteUrl = typeof window !== "undefined" ? window.location.origin : undefined;
    const title = "Mapa lokalnih usluga u Splitu | Majstori Split";
    const description = `Interaktivna karta za ${businesses.length} lokalnih poslovanja u Splitu i okolici. Filtriraj kategorije i otvori profil svakog biznisa.`;
    const breadcrumbs = [
      { name: "Naslovnica", path: "/" },
      { name: "Mapa", path: "/mapa" },
    ];

    return buildSeoPayload({
      title,
      description,
      keywords: ["mapa usluga split", "lokalne usluge split karta", "obrti split mapa"],
      pathname: "/mapa",
      siteUrl,
      structuredData: [
        ...buildBaseStructuredData(siteUrl || "https://majstorisplit.com"),
        buildBreadcrumbSchema(siteUrl || "https://majstorisplit.com", breadcrumbs),
        {
          "@context": "https://schema.org",
          "@type": "Map",
          name: title,
          description,
          url: `${siteUrl || "https://majstorisplit.com"}/mapa`,
          areaServed: SERVICE_AREAS,
        },
      ],
    });
  }, [businesses.length]);

  usePageSeo(seoPayload);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setUserLocation(null);
      }
    );
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    markersRef.current.forEach(marker => marker.map = null);
    markersRef.current = [];

    filteredBusinesses.forEach(business => {
      if (!business.latitude || !business.longitude) {
        return;
      }

      const lat = parseFloat(business.latitude);
      const lng = parseFloat(business.longitude);

      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return;
      }

      const markerNode = document.createElement("div");
      markerNode.className =
        "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-sm font-bold text-white shadow-lg";
      markerNode.textContent = "•";

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: { lat, lng },
        title: business.name,
        content: markerNode,
      });

      marker.addListener("click", () => {
        setSelectedBusiness(business);
        mapRef.current?.panTo({ lat, lng });
        mapRef.current?.setZoom(15);
      });

      markersRef.current.push(marker);
    });

    if (userLocation) {
      const userMarkerNode = document.createElement("div");
      userMarkerNode.className =
        "flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-sky-500 text-xs text-white shadow-lg";
      userMarkerNode.textContent = "•";

      markersRef.current.push(
        new google.maps.marker.AdvancedMarkerElement({
          map: mapRef.current,
          position: userLocation,
          title: "Vaša lokacija",
          content: userMarkerNode,
        })
      );
    }
  }, [filteredBusinesses, userLocation]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="border-b border-border bg-white/95 p-4 shadow-sm backdrop-blur">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Natrag na naslovnicu
            </Link>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Mapa lokalnih usluga</h1>
            <p className="mt-2 text-muted-foreground">
              Filtriraj kategorije i klikni marker za brzi pregled profila poslovanja.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Prikazano: <strong>{filteredBusinesses.length}</strong> poslovanja
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <Button
            size="sm"
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            Sve kategorije
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              size="sm"
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <MapView
            initialCenter={{ lat: 43.5081, lng: 16.4402 }}
            initialZoom={12}
            onMapReady={map => {
              mapRef.current = map;
            }}
            className="h-full w-full"
          />
        </div>

        {selectedBusiness && (
          <aside className="w-full max-w-md overflow-y-auto border-l border-border bg-white shadow-lg">
            <div className="space-y-5 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{selectedBusiness.name}</h2>
                  {selectedBusiness.address && (
                    <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>{selectedBusiness.address}</span>
                    </p>
                  )}
                </div>
                <Button size="sm" variant="outline" onClick={() => setSelectedBusiness(null)}>
                  Zatvori
                </Button>
              </div>

              <img
                src={getBusinessImage(selectedBusiness.id, categorySlugMap[selectedBusiness.categoryId] || "", selectedBusiness.imageUrl)}
                alt={selectedBusiness.name}
                className="h-52 w-full rounded-2xl object-cover"
                onError={e => {
                  const img = e.target as HTMLImageElement;
                  const fallback = getCategoryFallbackImage(selectedBusiness.id, categorySlugMap[selectedBusiness.categoryId] || "");
                  if (img.src !== fallback) img.src = fallback;
                }}
              />

              {getRatingValue(selectedBusiness) > 0 && (
                <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400/15 px-3 py-1.5 text-sm font-semibold text-yellow-700">
                  <Star className="h-4 w-4 fill-current" />
                  {getRatingValue(selectedBusiness).toFixed(1)}
                  {selectedBusiness.reviewCount ? ` / ${selectedBusiness.reviewCount} recenzija` : ""}
                </div>
              )}

              <div className="space-y-3 text-sm">
                {selectedBusiness.phone && (
                  <a href={`tel:${selectedBusiness.phone}`} className="flex items-center gap-2 text-primary hover:underline">
                    <Phone className="h-4 w-4" />
                    {selectedBusiness.phone}
                  </a>
                )}

                {selectedBusiness.website && (
                  <a
                    href={selectedBusiness.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 break-all text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    {selectedBusiness.website}
                  </a>
                )}
              </div>

              <div className="grid gap-2">
                <Button asChild>
                  <Link href={getBusinessPath(selectedBusiness)}>Otvori profil</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/${encodeURIComponent(
                        `${selectedBusiness.name} ${selectedBusiness.address || ""}`.trim()
                      )}`,
                      "_blank"
                    )
                  }
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  Otvori u Google Maps
                </Button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
