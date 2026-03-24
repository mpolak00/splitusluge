import { Link } from "wouter";
import { ArrowLeft, Check, Crown, MapPin, Phone, Rocket, Star, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePageSeo } from "@/hooks/usePageSeo";
import { buildBaseStructuredData, buildSeoPayload } from "@shared/seo";
import { useMemo } from "react";

export default function Promocija() {
  const seoPayload = useMemo(() => {
    const siteUrl = typeof window !== "undefined" ? window.location.origin : undefined;
    return buildSeoPayload({
      title: "Promoviraj svoje poslovanje | Split Usluge",
      description: "Istaknite svoje poslovanje na vrh kategorije i privucite više klijenata u Splitu i okolici.",
      keywords: ["promocija biznisa split", "oglašavanje split", "istaknuti poslovanje split"],
      pathname: "/promocija",
      siteUrl,
      structuredData: buildBaseStructuredData(siteUrl || "https://split-usluge.com"),
    });
  }, []);

  usePageSeo(seoPayload);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <section className="relative overflow-hidden border-b border-border bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.30),_transparent_35%),linear-gradient(180deg,_rgba(2,6,23,0.70),_rgba(2,6,23,0.92))]" />
        <div className="container relative z-10 mx-auto px-4 py-14 md:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Natrag na naslovnicu
          </Link>

          <div className="mt-6 max-w-3xl space-y-5">
            <div className="inline-flex rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-1.5 text-sm font-semibold text-orange-300">
              <Zap className="mr-2 h-4 w-4" /> Za vlasnike biznisa
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Promoviraj svoje poslovanje u Splitu
            </h1>
            <p className="text-lg leading-8 text-white/80">
              Budi prvi rezultat koji korisnici vide kad traže uslugu u tvojoj kategoriji.
              Više vidljivosti = više poziva = više klijenata.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* How it works */}
        <div className="mb-16 space-y-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Kako funkcionira</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              3 koraka do više klijenata
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-border/70">
              <CardContent className="space-y-3 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                  <Crown className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">1. Odaberi paket</h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  Odaberi paket koji odgovara tvojim potrebama - od osnovnog isticanja do premium pozicije.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/70">
              <CardContent className="space-y-3 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                  <Rocket className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">2. Aktiviraj profil</h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  Tvoj profil se odmah ističe na vrhu kategorije s posebnom oznakom i većom vidljivošću.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/70">
              <CardContent className="space-y-3 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">3. Dobij više poziva</h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  Korisnici tebe vide prve. Istaknuti telefon i lokacija znače direktne pozive bez posrednika.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-16 space-y-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Paketi</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Odaberi svoj plan
            </h2>
            <p className="mt-3 text-muted-foreground">
              Svi paketi uključuju profil s kontaktima, lokacijom na karti i SEO optimizaciju.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Basic */}
            <Card className="border-border/70">
              <CardContent className="space-y-6 p-6 md:p-8">
                <div>
                  <h3 className="text-xl font-bold">Osnovni</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Za one koji žele biti vidljivi</p>
                </div>
                <div>
                  <span className="text-4xl font-bold">Besplatno</span>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                    Profil poslovanja s kontaktima
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                    Lokacija na karti
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                    Sortiranje po ocjenama
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                    SEO optimizirana stranica
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/registracija">Dodaj poslovanje</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="relative border-2 border-orange-500 shadow-xl shadow-orange-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-orange-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  Najpopularnije
                </span>
              </div>
              <CardContent className="space-y-6 p-6 md:p-8">
                <div>
                  <h3 className="text-xl font-bold">Pro</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Za ozbiljne biznise</p>
                </div>
                <div>
                  <span className="text-4xl font-bold">29</span>
                  <span className="text-lg text-muted-foreground">&euro;/mj</span>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                    Sve iz Osnovnog paketa
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
                    <strong>Prioritetna pozicija</strong> u kategoriji
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
                    <strong>Istaknuta oznaka</strong> "Preporučeno"
                  </li>
                  <li className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
                    <strong>Veliki CTA gumb</strong> za pozive
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
                    Istaknuti marker na karti
                  </li>
                </ul>
                <Button className="w-full bg-orange-500 text-white hover:bg-orange-600">
                  Uskoro dostupno
                </Button>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card className="border-border/70 bg-slate-950 text-white">
              <CardContent className="space-y-6 p-6 md:p-8">
                <div>
                  <h3 className="text-xl font-bold">Premium</h3>
                  <p className="mt-1 text-sm text-white/60">Za maksimalnu vidljivost</p>
                </div>
                <div>
                  <span className="text-4xl font-bold">79</span>
                  <span className="text-lg text-white/60">&euro;/mj</span>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                    Sve iz Pro paketa
                  </li>
                  <li className="flex items-start gap-2">
                    <Crown className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                    <strong>Prvo mjesto</strong> u kategoriji
                  </li>
                  <li className="flex items-start gap-2">
                    <Crown className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                    Prikaz na <strong>naslovnici</strong>
                  </li>
                  <li className="flex items-start gap-2">
                    <Crown className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                    <strong>Zlatna oznaka</strong> Premium
                  </li>
                  <li className="flex items-start gap-2">
                    <Crown className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                    Prioritet u Google Ads kampanjama
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Uskoro dostupno
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-center text-3xl font-bold tracking-tight">Česta pitanja</h2>
          <div className="space-y-4">
            <Card className="border-border/70">
              <CardContent className="p-6">
                <h3 className="font-semibold">Kada će plaćanje biti dostupno?</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Trenutno gradimo korisničku bazu i organski sadržaj. Plaćeni paketi bit će dostupni uskoro.
                  Registrirajte se besplatno već sada da budete među prvima.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/70">
              <CardContent className="p-6">
                <h3 className="font-semibold">Kako funkcionira prioritetna pozicija?</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Pro i Premium korisnici se prikazuju na vrhu svoje kategorije, ispred besplatnih profila.
                  Također dobivaju istaknute oznake i veće gumbe za kontakt.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/70">
              <CardContent className="p-6">
                <h3 className="font-semibold">Mogu li otkazati pretplatu?</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Da, pretplatu možete otkazati bilo kada. Nema ugovora ni skrivenih troškova.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
