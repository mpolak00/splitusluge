import { useMemo } from "react";
import { Link } from "wouter";
import { Check, Star, Zap, Globe, ArrowRight, Phone, Mail, Megaphone, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buildSeoPayload } from "@shared/seo";
import { usePageSeo } from "@/hooks/usePageSeo";

// --- Oglašavanje na imeniku ---
const ADS_PACKAGES = [
  {
    id: "oglas-basic",
    name: "Oglas Basic",
    price: 25,
    period: "mj",
    description: "Vidljivost na Majstori Split imeniku za lokalne kupce koji aktivno traže usluge.",
    icon: Megaphone,
    color: "border-blue-200 dark:border-blue-800",
    headerColor: "bg-blue-50 dark:bg-blue-950",
    highlight: false,
    features: [
      "Profil poslovanja s kontaktima",
      "Prikaz u kategoriji (standardni)",
      "Klikabilan broj telefona",
      "Google Maps lokacija",
      "Radno vrijeme i opis",
      "Mjesečni pregled statistike",
      "Bez ugovora - otkazivanje u bilo kada",
    ],
    ctaLabel: "Počni za 25 EUR/mj",
    badge: null,
  },
  {
    id: "oglas-premium",
    name: "Oglas Premium",
    price: 50,
    period: "mj",
    description: "Istaknuta pozicija na vrhu kategorije + detaljni izvještaji koje šaljemo tvojim klijentima.",
    icon: Star,
    color: "border-orange-400 dark:border-orange-600 ring-2 ring-orange-400/30",
    headerColor: "bg-orange-50 dark:bg-orange-950",
    highlight: true,
    features: [
      "Sve iz Basic paketa",
      "Prioritetni prikaz — vrh kategorije",
      "Istaknuta kartica (vizualno odvojena)",
      "Prošireni opis i galerija slika",
      "Automatski izvještaj za klijenta (PDF)",
      "Praćenje klikova i poziva",
      "Analitika pretrage po ključnim riječima",
      "Prioritetna podrška",
    ],
    ctaLabel: "Počni za 50 EUR/mj",
    badge: "NAJPOPULARNIJE",
  },
];

// --- Web stranice ---
const WEB_PACKAGES = [
  {
    id: "web-starter",
    name: "Web Starter",
    price: 300,
    maintenance: 75,
    description: "Profesionalna web stranica za lokalne biznise — gotova za 48 sati.",
    icon: Zap,
    color: "border-slate-200 dark:border-slate-700",
    headerColor: "bg-slate-50 dark:bg-slate-900",
    highlight: false,
    features: [
      "Moderna, mobilna web stranica (do 5 stranica)",
      "Klikabilan broj telefona",
      "Google Maps integracija",
      "Radno vrijeme i kontakt forma",
      "SSL certifikat (HTTPS) u cijeni",
      "Hosting i domena u cijeni",
      "Besplatne izmjene 30 dana",
      "Gotovo za 48 sati",
    ],
    ctaLabel: "Naruči Web Starter",
    badge: null,
  },
  {
    id: "web-pro",
    name: "Web Pro",
    price: 400,
    maintenance: 75,
    description: "Sve iz Starter paketa + SEO, Google My Business i WhatsApp integracija.",
    icon: Globe,
    color: "border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-400/20",
    headerColor: "bg-emerald-50 dark:bg-emerald-950",
    highlight: true,
    features: [
      "Sve iz Web Starter paketa",
      "SEO optimizacija (lokalni upiti u Splitu)",
      "Google My Business postavljanje",
      "WhatsApp floating button",
      "Blog/aktualnosti sekcija",
      "Galerija slika",
      "Google Analytics postavljanje",
      "Brzinska optimizacija (90+ PageSpeed)",
      "Višejezična podrška (HR + EN)",
    ],
    ctaLabel: "Naruči Web Pro",
    badge: "PREPORUČENO",
  },
];

const FAQS = [
  {
    q: "Koliko traje izrada web stranice?",
    a: "Web Starter je gotov za 48 sati. Web Pro u roku 5-7 radnih dana.",
  },
  {
    q: "Što je uključeno u 75 EUR/mj održavanje?",
    a: "Hosting, domena, SSL certifikat, tehničko održavanje servera i do 2 manje izmjene sadržaja mjesečno.",
  },
  {
    q: "Mogu li otkazati oglašavanje?",
    a: "Da, bez ugovora i bez penala. Otkaži email-om ili porukom 7 dana prije obnove.",
  },
  {
    q: "Mogu li vidjeti kako bi moja stranica izgledala prije plaćanja?",
    a: "Da! Napravimo ti besplatni preview za 24 sata bez ikakve obaveze. Pošalji nam ime i telefon biznisa.",
  },
  {
    q: "Koje načine plaćanja primate?",
    a: "Kartice (Visa, Mastercard) putem Stripe-a, PayPal, bankovski transfer (R1 račun dostupan).",
  },
  {
    q: "Mogu li imati i oglas i web stranicu?",
    a: "Da, i preporučamo kombinaciju. Web Pro + Oglas Premium = maksimalna vidljivost za ~125 EUR/mj.",
  },
];

export default function Paketi() {
  const seoPayload = useMemo(() => buildSeoPayload({
    title: "Paketi - Oglašavanje i Web stranice za biznise u Splitu | Majstori Split",
    description: "Oglašavaj se na Majstori Split od 25 EUR/mj ili naruči profesionalnu web stranicu od 300 EUR. Bez ugovora, bez skrivenih troškova.",
    keywords: ["oglašavanje split", "web stranica split", "izrada web stranice split", "oglas lokalni biznis split"],
    pathname: "/paketi",
  }), []);

  usePageSeo(seoPayload);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-slate-950 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 mb-6">
            Za lokalne biznise u Splitu
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Više kupaca.<br />
            <span className="text-orange-400">Manje troškova.</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Oglašavaj se na Majstori Split od <strong className="text-white">25 EUR/mj</strong> ili naruči
            profesionalnu web stranicu od <strong className="text-white">300 EUR</strong>.
            Turisti i lokalni kupci traže tvoje usluge — budi tamo gdje te mogu naći.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-8">
              <a href="#oglasavanje">Oglašavanje</a>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 px-8">
              <a href="#web-stranice">Web stranice</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-orange-500 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-center text-sm font-medium">
            <span>✓ Bez ugovora — otkaži kad hoćeš</span>
            <span>✓ Besplatni preview stranice</span>
            <span>✓ Plaćanje karticom ili virmanom</span>
            <span>✓ R1 račun dostupan</span>
          </div>
        </div>
      </div>

      {/* Advertising section */}
      <section id="oglasavanje" className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 px-4 py-1.5 text-sm font-semibold mb-4">
            <Megaphone className="h-4 w-4" /> Oglašavanje na Majstori Split imeniku
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-3">Tvoj biznis na prvom mjestu u pretrazi</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Kupci u Splitu koji traže tvoje usluge — vide te prvi. Plaćaš samo dok ti je potrebno.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {ADS_PACKAGES.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <Card key={pkg.id} className={`relative overflow-hidden ${pkg.color} transition-all hover:-translate-y-1 hover:shadow-xl`}>
                {pkg.badge && (
                  <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-xs font-bold text-center py-1 tracking-wider">
                    {pkg.badge}
                  </div>
                )}
                <CardHeader className={`${pkg.headerColor} ${pkg.badge ? "pt-8" : "pt-6"} pb-6`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-xl p-2 bg-white/80 dark:bg-white/10">
                      <Icon className="h-5 w-5 text-orange-500" />
                    </div>
                    <span className="font-bold text-lg">{pkg.name}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold">{pkg.price}</span>
                    <span className="text-muted-foreground mb-1">EUR/mj</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{pkg.description}</p>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <ul className="space-y-2">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${pkg.highlight ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}`}
                    variant={pkg.highlight ? "default" : "outline"}
                    asChild
                  >
                    <a href={`mailto:info@majstorisplit.com?subject=Oglas paket ${pkg.name}&body=Zainteresiran/a sam za ${pkg.name} paket (${pkg.price} EUR/mj). Ime biznisa: `}>
                      {pkg.ctaLabel}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">Bez ugovora · Otkazivanje bilo kada</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Web sites section */}
      <section id="web-stranice" className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-4 py-1.5 text-sm font-semibold mb-4">
            <Monitor className="h-4 w-4" /> Izrada web stranica
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-3">Vlastita web stranica u 48 sati</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Jednokratna izrada + 75 EUR/mj za hosting, domenu i održavanje.
            Možeš vidjeti besplatni preview <strong>prije nego što platiš</strong>.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {WEB_PACKAGES.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <Card key={pkg.id} className={`relative overflow-hidden ${pkg.color} transition-all hover:-translate-y-1 hover:shadow-xl`}>
                {pkg.badge && (
                  <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white text-xs font-bold text-center py-1 tracking-wider">
                    {pkg.badge}
                  </div>
                )}
                <CardHeader className={`${pkg.headerColor} ${pkg.badge ? "pt-8" : "pt-6"} pb-6`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="rounded-xl p-2 bg-white/80 dark:bg-white/10">
                      <Icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="font-bold text-lg">{pkg.name}</span>
                  </div>
                  <div>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold">{pkg.price}</span>
                      <span className="text-muted-foreground mb-1">EUR jednokratno</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      + <strong>{pkg.maintenance} EUR/mj</strong> hosting, domena i održavanje
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{pkg.description}</p>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <ul className="space-y-2">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${pkg.highlight ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
                    variant={pkg.highlight ? "default" : "outline"}
                    asChild
                  >
                    <a href={`mailto:info@majstorisplit.com?subject=${pkg.name} - Narudžba web stranice&body=Zainteresiran/a sam za ${pkg.name} (${pkg.price} EUR). Ime biznisa: `}>
                      {pkg.ctaLabel}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Besplatni preview bez obaveze · 14-dnevno jamstvo povrata
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Preview CTA */}
        <Card className="mt-8 max-w-3xl mx-auto border-dashed border-2">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Vidi kako bi tvoja stranica izgledala — besplatno</h3>
            <p className="text-muted-foreground mb-5 max-w-md mx-auto">
              Pošalji nam ime i broj telefona biznisa. Za 24 sata šaljemo ti preview stranicu.
              Bez obaveze, bez plaćanja.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                <a href="mailto:info@majstorisplit.com?subject=Zahtjev za besplatni preview web stranice&body=Ime biznisa: %0ATelefon: %0AAdresa: %0AKategorija usluge: ">
                  <Mail className="mr-2 h-4 w-4" /> Zatraži besplatni preview
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="https://wa.me/385" target="_blank" rel="noreferrer">
                  WhatsApp upit
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Combo deal */}
      <section className="bg-slate-950 text-white py-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Kombiniraj i uštedi</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8">
            Web Pro + Oglas Premium = maksimalna vidljivost za turiste i lokalne kupce.
          </p>
          <div className="inline-flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl px-8 py-6 flex-wrap justify-center">
            <div className="text-center">
              <p className="text-sm text-white/60">Web Pro</p>
              <p className="text-2xl font-bold">400 EUR</p>
              <p className="text-xs text-white/50">jednokratno</p>
            </div>
            <span className="text-2xl text-orange-400 font-bold">+</span>
            <div className="text-center">
              <p className="text-sm text-white/60">Oglas Premium</p>
              <p className="text-2xl font-bold">50 EUR/mj</p>
            </div>
            <span className="text-2xl text-orange-400 font-bold">+</span>
            <div className="text-center">
              <p className="text-sm text-white/60">Održavanje</p>
              <p className="text-2xl font-bold">75 EUR/mj</p>
            </div>
            <span className="text-2xl text-white/30">=</span>
            <div className="text-center bg-orange-500 rounded-xl px-5 py-3">
              <p className="text-sm font-medium">Ukupno</p>
              <p className="text-2xl font-bold">125 EUR/mj</p>
              <p className="text-xs opacity-80">+ 400 EUR izrada</p>
            </div>
          </div>
          <p className="text-white/50 text-sm mt-4">Za usporedbu: Google Ads u Splitu može koštati 500+ EUR/mj za isti doseg.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-10">Često postavljana pitanja</h2>
          <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
            {FAQS.map((faq, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <p className="font-semibold mb-2">{faq.q}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Spreman za više kupaca?</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Počni s oglašavanjem od 25 EUR/mj ili naruči web stranicu. Kontaktiraj nas — odgovaramo u roku 2 sata.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-8">
            <a href="mailto:info@majstorisplit.com">
              <Mail className="mr-2 h-4 w-4" /> Kontaktiraj nas
            </a>
          </Button>
          <Button asChild variant="outline" className="h-12 px-8">
            <a href="tel:+385">
              <Phone className="mr-2 h-4 w-4" /> Nazovi nas
            </a>
          </Button>
          <Button asChild variant="outline" className="h-12 px-8">
            <Link href="/promoviranje">Promoviranje info</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
