import React, { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Search, Star, ShieldCheck, Clock, Map, Phone, Globe, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { ReviewsWidget } from "@/components/ReviewsWidget";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);

  // Get all categories and businesses
  const { data: categories } = trpc.services.getAllCategories.useQuery();
  const { data: allBusinesses, isLoading } = trpc.services.getAllBusinesses.useQuery({
    limit: 10000,
    offset: 0,
  });

  // Filter businesses by search term using fuzzy search
  const filteredBusinesses = useFuzzySearch(allBusinesses, searchTerm, {
    threshold: 0.4,
    keys: ['name', 'address', 'phone', 'website'],
    includeScore: false,
  });

  // Group businesses by category
  const businessesByCategory = useMemo(() => {
    if (!filteredBusinesses || !categories) return {};

    const grouped: { [key: number]: any[] } = {};
    (filteredBusinesses as any[]).forEach((business: any) => {
      if (!grouped[business.categoryId]) {
        grouped[business.categoryId] = [];
      }
      grouped[business.categoryId].push(business);
    });

    return grouped;
  }, [filteredBusinesses, categories]);

  const handleCallBusiness = (phone: string | null) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleVisitWebsite = (website: string | null) => {
    if (website) {
      window.open(website, "_blank");
    }
  };

  const handleViewOnMaps = (name: string, address: string | null) => {
    const query = `${name} ${address || ""}`;
    window.open(
      `https://www.google.com/maps/search/${encodeURIComponent(query)}`,
      "_blank"
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-split.jpg" 
            alt="Split Panorama" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-10" />
        </div>

        {/* Content */}
        <div className="container relative z-20 text-center px-4 animate-in fade-in zoom-in duration-700 slide-in-from-bottom-4">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white text-xs font-bold tracking-widest uppercase">
            Službeni Poslovni Imenik
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 tracking-tight leading-none drop-shadow-2xl">
            SPLIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-400">USLUGE</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
            Pronađite sve lokalne stručnjake, od vulkanizera do vodoinstalatera, na jednom mjestu.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg p-2 rounded-lg border border-white/20 flex flex-col sm:flex-row gap-2 shadow-2xl">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
                <Input 
                  className="pl-10 bg-transparent border-none text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-base" 
                  placeholder="Što trebate danas? (npr. gume, frizer, voda...)" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <Link href="/mapa">
               <Button size="lg" className="h-12 px-8 font-bold uppercase tracking-wide bg-secondary hover:bg-secondary/90 text-white border-none">
                  <Map className="mr-2" size={20} />
                  Pogledaj mapu
               </Button>
             </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80 text-sm font-medium uppercase tracking-widest">
             <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-secondary" />
                <span>Provjereni partneri</span>
             </div>
             <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-secondary" />
                <span>Lokalne recenzije</span>
             </div>
             <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" />
                <span>Ažurirani podaci</span>
             </div>
          </div>
        </div>
      </section>

      {/* Categories Section with All Businesses */}
      <section className="py-24 bg-background relative">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 uppercase tracking-tight">
                  {searchTerm ? "Rezultati pretrage" : "Sve Kategorije"}
               </h2>
               <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
               <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  {searchTerm 
                    ? `Pronađeno ${(filteredBusinesses as any[])?.length || 0} rezultata (fuzzy search)` 
                    : `Svih ${allBusinesses?.length || 0} biznisa u Splitu i okolici`}
               </p>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="space-y-12">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-8 w-1/4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[...Array(3)].map((_, j) => (
                        <Skeleton key={j} className="h-64" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBusinesses && filteredBusinesses.length > 0 ? (
              <div className="space-y-16">
                {categories?.map((category: any) => {
                  const categoryBusinesses = businessesByCategory[category.id] || [];
                  if (categoryBusinesses.length === 0) return null;

                  return (
                    <div key={category.id} className="space-y-6">
                      {/* Category Header */}
                      <div className="flex items-center justify-between border-b-2 border-primary pb-4">
                        <h3 className="text-2xl font-bold text-foreground uppercase tracking-tight">
                          {category.name} ({categoryBusinesses.length})
                        </h3>
                        <Link href={`/usluga/${category.slug}`}>
                          <Button variant="outline" size="sm">
                            Vidi sve
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>

                      {/* Businesses Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryBusinesses.slice(0, 6).map((business: any) => (
                          <Card
                            key={business.id}
                            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => setSelectedBusiness(business)}
                          >
                            {/* Image */}
                            <div className="relative w-full h-40 bg-muted overflow-hidden">
                              {business.imageUrl ? (
                                <img
                                  src={business.imageUrl}
                                  alt={business.name}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23999' font-size='12'%3ENo image%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                                  <span className="text-muted-foreground text-xs">Nema slike</span>
                                </div>
                              )}

                              {/* Rating Badge */}
                              {business.rating && (
                                <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded flex items-center gap-1 font-semibold text-xs">
                                  <Star size={12} fill="currentColor" />
                                  {business.rating}
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <CardContent className="p-4 space-y-2">
                              {/* Name */}
                              <h4 className="font-bold text-sm line-clamp-2">{business.name}</h4>

                              {/* Address */}
                              {business.address && (
                                <div className="flex gap-1 text-xs text-muted-foreground line-clamp-2">
                                  <MapPin size={12} className="flex-shrink-0 mt-0.5" />
                                  <p>{business.address}</p>
                                </div>
                              )}

                              {/* Phone */}
                              {business.phone && (
                                <div className="flex gap-1 text-xs text-muted-foreground">
                                  <Phone size={12} className="flex-shrink-0 mt-0.5" />
                                  <p>{business.phone}</p>
                                </div>
                              )}

                              {/* Actions */}
                              <div className="grid grid-cols-2 gap-2 pt-2">
                                {business.phone && (
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCallBusiness(business.phone);
                                    }}
                                    size="sm"
                                    className="w-full text-xs"
                                    variant="default"
                                  >
                                    <Phone size={12} className="mr-1" />
                                    Pozovi
                                  </Button>
                                )}
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewOnMaps(business.name, business.address);
                                  }}
                                  size="sm"
                                  className="w-full text-xs"
                                  variant="outline"
                                >
                                  Mape
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Nema pronađenih obrta</p>
              </div>
            )}
         </div>
      </section>

      {/* About Split Section */}
      <section className="py-24 bg-muted/30 border-y border-border">
         <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
               <div className="flex-1 space-y-6">
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground uppercase tracking-tight leading-none">
                     Lokalno. <br/>
                     <span className="text-primary">Pouzdano.</span> <br/>
                     Splitski.
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                     Split Usluge nije samo još jedan oglasnik. Mi smo digitalni puls grada pod Marjanom. 
                     Povezujemo sugrađane s najboljim lokalnim obrtnicima, čuvajući tradiciju kvalitete i povjerenja.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                     Bilo da živite na Gripama, Spinutu ili Visokoj, naši partneri su u vašem susjedstvu.
                  </p>
                  <Button size="lg" variant="outline" className="mt-4 border-primary text-primary hover:bg-primary hover:text-white uppercase font-bold tracking-widest">
                     O nama
                  </Button>
               </div>
               <div className="flex-1 relative">
                  <div className="absolute -inset-4 bg-secondary/10 rounded-full blur-3xl"></div>
                  <img 
                     src="/images/hero-split.jpg" 
                     alt="Split Architecture" 
                     className="relative rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                  />
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
         <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
         
         <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 uppercase tracking-tight">
               Imate obrt u Splitu?
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 font-light">
               Pridružite se najvećoj mreži lokalnih usluga i dođite do novih klijenata u svom gradu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link href="/registracija">
                  <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-bold uppercase tracking-wide">
                     Besplatna registracija
                  </Button>
               </Link>
               <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold uppercase tracking-wide bg-transparent border-white/30 text-white hover:bg-white/10">
                  Saznaj uvjete
               </Button>
            </div>
         </div>
      </section>

      {/* Business Details Dialog */}
      <Dialog open={!!selectedBusiness} onOpenChange={() => setSelectedBusiness(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedBusiness && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedBusiness.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Image */}
                {selectedBusiness.imageUrl && (
                  <img
                    src={selectedBusiness.imageUrl}
                    alt={selectedBusiness.name}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3ENo image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                )}

                {/* Rating */}
                {selectedBusiness.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-400" fill="currentColor" />
                    <span className="font-semibold">{selectedBusiness.rating}</span>
                    {selectedBusiness.reviewCount && (
                      <span className="text-muted-foreground">({selectedBusiness.reviewCount} recenzija)</span>
                    )}
                  </div>
                )}

                {/* Address */}
                {selectedBusiness.address && (
                  <div className="flex gap-2">
                    <MapPin className="flex-shrink-0 text-muted-foreground" />
                    <p>{selectedBusiness.address}</p>
                  </div>
                )}

                {/* Phone */}
                {selectedBusiness.phone && (
                  <div className="flex gap-2">
                    <Phone className="flex-shrink-0 text-muted-foreground" />
                    <p>{selectedBusiness.phone}</p>
                  </div>
                )}

                {/* Website */}
                {selectedBusiness.website && (
                  <div className="flex gap-2">
                    <Globe className="flex-shrink-0 text-muted-foreground" />
                    <a
                      href={selectedBusiness.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {selectedBusiness.website}
                    </a>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                  {selectedBusiness.phone && (
                    <Button
                      onClick={() => handleCallBusiness(selectedBusiness.phone)}
                      className="w-full"
                      size="lg"
                    >
                      <Phone className="mr-2" />
                      Pozovi
                    </Button>
                  )}
                  <Button
                    onClick={() => handleViewOnMaps(selectedBusiness.name, selectedBusiness.address)}
                    className="w-full"
                    variant="outline"
                    size="lg"
                  >
                    Vidi na Google Maps
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reviews Widget */}
      <ReviewsWidget />
    </div>
  );
}
