import { useMemo } from "react";
import { Link } from "wouter";
import { Check, Star, Zap, Crown, ArrowRight, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buildSeoPayload } from "@shared/seo";
import { usePageSeo } from "@/hooks/usePageSeo";

const PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    nameEN: "Starter",
    price: 199,
    priceMonthly: 29,
    description: "Idealno za lokalne biznise koji tek počinju s online prisutnošću.",
    descriptionEN: "Perfect for local businesses starting their online presence.",
    icon: Zap,
    color: "border-blue-200 dark:border-blue-800",
    headerColor: "bg-blue-50 dark:bg-blue-950",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    features: [
      "Moderna web stranica (do 5 stranica)",
      "Mobilna optimizacija",
      "Klikabilan broj telefona",
      "Google Maps embed",
      "Radno vrijeme i kontakt",
      "Hosting 1 godina",
      "SSL certifikat (HTTPS)",
      "Besplatne izmjene 30 dana",
    ],
    featuresEN: [
      "Modern website (up to 5 pages)",
      "Mobile optimization",
      "Clickable phone number",
      "Google Maps embed",
      "Opening hours & contact",
      "1 year hosting",
      "SSL certificate (HTTPS)",
      "Free changes 30 days",
    ],
    highlight: false,
    ctaLabel: "Odaberi Starter",
    ctaLabelEN: "Choose Starter",
    stripeNote: "Jednokratno + 29 EUR/mj",
  },
  {
    id: "growth",
    name: "Growth",
    nameEN: "Growth",
    price: 399,
    priceMonthly: 49,
    description: "Za biznise koji žele dominirati lokalnim pretraživanjem i dobivati više poziva.",
    descriptionEN: "For businesses wanting to dominate local search and get more calls.",
    icon: Star,
    color: "border-orange-400 dark:border-orange-600 ring-2 ring-orange-400/30",
    headerColor: "bg-orange-50 dark:bg-orange-950",
    badgeColor: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    features: [
      "Sve iz Starter paketa",
      "SEO optimizacija (lokalni upiti)",
      "Google My Business postavljanje",
      "Blog/aktualnosti sekcija",
      "Galerija slika",
      "Integracija WhatsApp botuna",
      "Kontakt forma s email notifikacijom",
      "Google Analytics postavljanje",
      "Brzinska optimizacija (90+ PageSpeed)",
      "Prioritetni prikaz na Split Usluge",
      "Mjesečni SEO izvještaji",
    ],
    featuresEN: [
      "Everything in Starter",
      "SEO optimization (local queries)",
      "Google My Business setup",
      "Blog/news section",
      "Image gallery",
      "WhatsApp button integration",
      "Contact form with email notification",
      "Google Analytics setup",
      "Speed optimization (90+ PageSpeed)",
      "Priority listing on Split Usluge",
      "Monthly SEO reports",
    ],
    highlight: true,
    ctaLabel: "Odaberi Growth",
    ctaLabelEN: "Choose Growth",
    stripeNote: "Jednokratno + 49 EUR/mj",
  },
  {
    id: "premium",
    name: "Premium",
    nameEN: "Premium",
    price: 799,
    priceMonthly: 99,
    description: "Kompletno digitalno prisustvo s oglasima, socijalnim mrežama i podrška.",
    descriptionEN: "Complete digital presence with ads, social media and support.",
    icon: Crown,
    color: "border-purple-200 dark:border-purple-800",
    headerColor: "bg-purple-50 dark:bg-purple-950",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    features: [
      "Sve iz Growth paketa",
      "Google Ads upravljanje (do 200 EUR/mj budget)",
      "Facebook/Instagram oglasi",
      "Social media postovi (4x/mj)",
      "Višejezična stranica (HR + EN)",
      "Booking/rezervacija sustav",
      "Chat widget (LiveChat)",
      "Napredna analitika (heatmaps)",
      "A/B testiranje CTAs",
      "Prioritetna podrška 24/7",
      "Kvartalnih strategijskih konzultacija",
    ],
    featuresEN: [
      "Everything in Growth",
      "Google Ads management (up to 200 EUR/mo budget)",
      "Facebook/Instagram ads",
      "Social media posts (4x/mo)",
      "Multilingual site (HR + EN)",
      "Booking/reservation system",
      "Chat widget (LiveChat)",
      "Advanced analytics (heatmaps)",
      "A/B testing CTAs",
      "Priority 24/7 support",
      "Quarterly strategy consultations",
    ],
    highlight: false,
    ctaLabel: "Odaberi Premium",
    ctaLabelEN: "Choose Premium",
    stripeNote: "Jednokratno + 99 EUR/mj",
  },
];

const FAQS = [
  {
    q: "Koliko traje izrada web stranice?",
    a: "Starter paket je gotov za 48 sati. Growth i Premium u roku od 5-7 radnih dana.",
  },
  {
    q: "Što je uključeno u hosting?",
    a: "Hosting, SSL certifikat (HTTPS), domena (.hr ili .com) i tehničko održavanje servera.",
  },
  {
    q: "Mogu li otkazati pretplatu?",
    a: "Da, možeš otkazati u bilo kojem trenutku. Stranica ostaje online do kraja plaćenog perioda.",
  },
  {
    q: "Mogu li vidjeti primjer stranice?",
    a: "Da! Napravili smo besplatne preview stranice za lokalne biznise. Kontaktiraj nas i pošaljemo ti primjer za tvoj tip biznisa.",
  },
  {
    q: "Primate kartice i PayPal?",
    a: "Da, prihvaćamo sve kartice (Visa, Mastercard) putem Stripe-a, te PayPal i bankovski transfer.",
  },
  {
    q: "Što ako nisam zadovoljan?",
    a: "Nudimo 14-dnevno jamstvo povrata novca za jednokratni dio plaćanja. Bez pitanja.",
  },
];

export default function Paketi() {
  const seoPayload = useMemo(() => buildSeoPayload({
    title: "Paketi web stranica za lokalne biznise u Splitu | Split Usluge",
    description: "Profesionalna web stranica za vaš lokalni biznis u Splitu od 199 EUR. SEO optimizacija, hosting, Google My Business. Starter, Growth i Premium paketi.",
    keywords: ["web stranica split", "izrada web stranice split", "web dizajn split", "lokalni biznis web"],
    pathname: "/paketi",
  }), []);

  usePageSeo(seoPayload);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-slate-950 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 mb-6">
            Web stranice za lokalne biznise
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Tvoj biznis zaslužuje<br />
            <span className="text-orange-400">profesionalnu web stranicu</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Turisti i lokalni kupci pretražuju Google svaki dan. Budite tamo gdje vas traže.
            Izrada web stranice od <strong className="text-white">199 EUR</strong> — jedini trošak je domena.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-8">
              <a href="#paketi">Pogledaj pakete</a>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 px-8">
              <a href="tel:+385">
                <Phone className="mr-2 h-4 w-4" /> Nazovi nas
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="paketi" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Odaberi pravi paket za tvoj biznis</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Svi paketi uključuju hosting, SSL i podršku. Plaćanje karticom, PayPal-om ili bankovnim transferom.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PACKAGES.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <Card key={pkg.id} className={`relative overflow-hidden ${pkg.color} transition-all hover:-translate-y-1 hover:shadow-xl`}>
                {pkg.highlight && (
                  <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-xs font-bold text-center py-1 tracking-wider">
                    NAJPOPULARNIJI
                  </div>
                )}
                <CardHeader className={`${pkg.headerColor} ${pkg.highlight ? "pt-8" : "pt-6"} pb-6`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`rounded-xl p-2 ${pkg.badgeColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-lg">{pkg.name}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold">{pkg.price}</span>
                    <span className="text-muted-foreground mb-1">EUR</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    jednokratno + <strong>{pkg.priceMonthly} EUR/mj</strong> hosting
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">{pkg.description}</p>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <ul className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${pkg.highlight ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}`}
                    variant={pkg.highlight ? "default" : "outline"}
                    asChild
                  >
                    <a href="mailto:info@split-usluge.com?subject=Upit za paket web stranice">
                      {pkg.ctaLabel}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">{pkg.stripeNote} · Kartica / PayPal</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Custom */}
        <Card className="mt-6 border-dashed">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Trebaš nešto posebno?</h3>
            <p className="text-muted-foreground mb-4">
              Hoteli, restorani, charter kompanije ili veći biznisi — kontaktiraj nas za individualnu ponudu.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button asChild variant="outline">
                <a href="mailto:info@split-usluge.com">
                  <Mail className="mr-2 h-4 w-4" /> Email ponuda
                </a>
              </Button>
              <Button asChild>
                <a href="tel:+385">
                  <Phone className="mr-2 h-4 w-4" /> Nazovi nas
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-10">Često postavljena pitanja</h2>
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
        <h2 className="text-3xl font-bold mb-4">Spreman za početak?</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Kontaktiraj nas i dobij besplatni preview kako bi tvoja web stranica mogla izgledati — bez obaveza.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-8">
            <a href="mailto:info@split-usluge.com?subject=Besplatni preview web stranice">
              Zatraži besplatni preview
            </a>
          </Button>
          <Button asChild variant="outline" className="h-12 px-8">
            <Link href="/promoviranje">
              Promoviranje na Split Usluge
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
