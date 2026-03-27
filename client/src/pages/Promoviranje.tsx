import { useMemo } from "react";
import { Link } from "wouter";
import { buildBaseStructuredData, buildBreadcrumbSchema, buildSeoPayload } from "@shared/seo";
import { Check, ArrowLeft, Zap, Star, Crown, Phone, Mail } from "lucide-react";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PLANS = [
  {
    id: "basic",
    icon: Star,
    name: "Osnovno",
    price: "Besplatno",
    priceNote: "Uvijek",
    description: "Osnovna prisutnost u imeniku",
    color: "border-border/70",
    highlighted: false,
    features: [
      "Profil u imeniku",
      "Kontakt podaci",
      "Google Maps link",
      "Prikaz u kategoriji",
    ],
    unavailable: ["Prioritetni prikaz", "Istaknuti profil na naslovnici", "Oznaka 'Preporučeno'"],
    cta: "Registriraj se",
    href: "/registracija",
  },
  {
    id: "standard",
    icon: Zap,
    name: "Standard",
    price: "49 €",
    priceNote: "/ mjesec",
    description: "Za biznise koji žele biti viđeniji",
    color: "border-orange-400",
    highlighted: true,
    features: [
      "Sve iz Osnovnog plana",
      "Prioritetni prikaz u kategoriji",
      "Istaknuti profil na naslovnici",
      "Oznaka 'Preporučeno'",
      "Bolji SEO ranking profila",
    ],
    unavailable: ["Ekskluzivna pozicija #1"],
    cta: "Odaberi Standard",
    href: null, // Stripe – aktivirat će se uskoro
  },
  {
    id: "premium",
    icon: Crown,
    name: "Premium",
    price: "99 €",
    priceNote: "/ mjesec",
    description: "Maksimalna vidljivost u vašoj kategoriji",
    color: "border-slate-800",
    highlighted: false,
    features: [
      "Sve iz Standard plana",
      "Ekskluzivna pozicija #1 u kategoriji",
      "Banner u rezultatima pretrage",
      "Prioritetni kontakt od strane korisnika",
      "Tjedni izvještaj o vidljivosti",
    ],
    unavailable: [],
    cta: "Odaberi Premium",
    href: null, // Stripe – aktivirat će se uskoro
  },
];

export default function Promoviranje() {
  const seoPayload = useMemo(() => {
    const title = "Promoviranje biznisa | Majstori Split";
    const description =
      "Istaknite vaš biznis u Majstori Split imeniku. Prioritetni prikaz, veća vidljivost u kategoriji i više poziva od lokalnih klijenata. Pogledajte planove.";
    const siteUrl = typeof window !== "undefined" ? window.location.origin : undefined;

    return buildSeoPayload({
      title,
      description,
      keywords: ["promoviranje biznisa split", "oglašavanje split", "lokalni imenik split"],
      pathname: "/promoviranje",
      siteUrl,
      structuredData: [
        ...buildBaseStructuredData(siteUrl || "https://splitmajstori.com"),
        buildBreadcrumbSchema(siteUrl || "https://splitmajstori.com", [
          { name: "Naslovnica", path: "/" },
          { name: "Promoviranje", path: "/promoviranje" },
        ]),
      ],
    });
  }, []);

  usePageSeo(seoPayload);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.35),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.15),_transparent_40%)]" />
        <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Natrag na naslovnicu
          </Link>

          <div className="mt-8 max-w-3xl">
            <div className="inline-flex rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-orange-300">
              Za vlasnike biznisa
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
              Povećajte vidljivost svog biznisa u Splitu
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
              Majstori Split imenik svakodnevno posjećuju lokalni stanovnici koji traže usluge. Prioritetnim prikazom
              vaš profil dolazi do više korisnika u pravom trenutku.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3 max-w-2xl">
            <div className="rounded-2xl border border-white/12 bg-white/8 p-4 text-center backdrop-blur">
              <p className="text-2xl font-bold text-orange-300">3×</p>
              <p className="mt-1 text-sm text-white/70">više klikova na profil</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/8 p-4 text-center backdrop-blur">
              <p className="text-2xl font-bold text-orange-300">Top 3</p>
              <p className="mt-1 text-sm text-white/70">pozicija u kategoriji</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/8 p-4 text-center backdrop-blur">
              <p className="text-2xl font-bold text-orange-300">SEO</p>
              <p className="mt-1 text-sm text-white/70">optimizirani profil</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Odaberite plan</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Bez skrivenih naknada. Otkazivanje u bilo kojem trenutku.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {PLANS.map(plan => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden border-2 ${plan.color} ${plan.highlighted ? "shadow-xl shadow-orange-100 dark:shadow-orange-900/20" : ""}`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-orange-400 py-1.5 text-center text-xs font-bold uppercase tracking-widest text-white">
                    Najpopularniji
                  </div>
                )}
                <CardContent className={`space-y-6 p-6 ${plan.highlighted ? "pt-10" : ""}`}>
                  <div>
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${plan.highlighted ? "bg-orange-100 dark:bg-orange-900/30" : "bg-muted"}`}>
                      <Icon className={`h-5 w-5 ${plan.highlighted ? "text-orange-600" : "text-muted-foreground"}`} />
                    </div>
                    <h3 className="mt-3 text-xl font-bold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <div>
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="ml-1 text-sm text-muted-foreground">{plan.priceNote}</span>
                  </div>

                  <ul className="space-y-2.5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {plan.unavailable.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground line-through">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-30" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.href ? (
                    <Button asChild className={`w-full ${plan.highlighted ? "bg-orange-500 text-white hover:bg-orange-600" : ""}`} variant={plan.highlighted ? "default" : "outline"}>
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        className="w-full cursor-not-allowed opacity-70"
                        variant={plan.highlighted ? "default" : "outline"}
                        disabled
                      >
                        {plan.cta} — uskoro
                      </Button>
                      <p className="text-center text-xs text-muted-foreground">
                        Plaćanje putem Stripe kartice — dolazi uskoro
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">Česta pitanja</h2>
          <div className="space-y-4">
            {[
              {
                q: "Kada će biti dostupno plaćanje?",
                a: "Stripe plaćanje aktiviramo uskoro. Do tada možete se besplatno registrirati i unaprijed prijaviti interes za prioritetni prikaz.",
              },
              {
                q: "Mogu li otkazati u bilo kojim trenutku?",
                a: "Da. Nema dugoročnih obaveza. Otkazivanje je moguće u svakom trenutku iz korisničkog panela.",
              },
              {
                q: "Što je prioritetni prikaz?",
                a: "Prioritetni profili pojavljuju se na vrhu kategorije i na naslovnici Majstori Split imenika, ispred besplatnih profila.",
              },
              {
                q: "Kako se kontaktirati zbog pitanja?",
                a: "Pišite nam na email ili nazovite — kontakt podaci su ispod.",
              },
            ].map(item => (
              <div key={item.q} className="rounded-2xl border border-border/70 bg-background p-5">
                <p className="font-semibold">{item.q}</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-bold">Imate pitanje ili poseban zahtjev?</h2>
          <p className="mt-3 text-muted-foreground">
            Javite se izravno — rado ćemo vam prilagoditi plan prema vašim potrebama.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline">
              <a href="mailto:info@splitmajstori.com">
                <Mail className="mr-2 h-4 w-4" />
                info@splitmajstori.com
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="tel:+385000000000">
                <Phone className="mr-2 h-4 w-4" />
                Kontaktirajte nas
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
