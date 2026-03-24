import { useMemo, useState } from "react";
import { Link } from "wouter";
import { buildBaseStructuredData, buildBreadcrumbSchema, buildSeoPayload } from "@shared/seo";
import { Check, ArrowLeft, Zap, Star, Crown, Phone, Mail, ShieldCheck, Users, BarChart3 } from "lucide-react";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

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

function ContactFormSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", businessName: "", planInterest: "", message: "" });
  const submit = trpc.contacts.submitPromoInterest.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setForm({ name: "", email: "", phone: "", businessName: "", planInterest: "", message: "" });
    },
    onError: () => toast.error("Greška pri slanju. Pokušajte ponovo."),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit.mutate(form);
  }

  return (
    <section id="kontakt" className="border-t border-border py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Zainteresirani ste? Javite nam se!</h2>
          <p className="mt-3 text-muted-foreground">
            Ostavite kontakt i javit ćemo vam se unutar 24 sata s ponudom prilagođenom vašem biznisu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Ime i prezime *</label>
              <Input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Vaše ime"
                className="h-12"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email *</label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="vas@email.com"
                className="h-12"
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Telefon</label>
              <Input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+385 ..."
                className="h-12"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Naziv biznisa</label>
              <Input
                value={form.businessName}
                onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                placeholder="Vaš biznis"
                className="h-12"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Plan koji vas zanima</label>
            <Select value={form.planInterest} onValueChange={v => setForm(f => ({ ...f, planInterest: v }))}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Odaberite plan..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard (49 €/mj)</SelectItem>
                <SelectItem value="premium">Premium (99 €/mj)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Poruka</label>
            <Textarea
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Pitanja, posebni zahtjevi..."
              rows={3}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full h-13 text-base bg-orange-500 text-white hover:bg-orange-600"
            disabled={submit.isPending}
          >
            {submit.isPending ? "Šaljem..." : "Pošalji upit"}
          </Button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-center sm:gap-4">
          <a href="mailto:info@split-usluge.com" className="flex items-center gap-1.5 hover:text-foreground">
            <Mail className="h-3.5 w-3.5" /> info@split-usluge.com
          </a>
          <a href="tel:+385000000000" className="flex items-center gap-1.5 hover:text-foreground">
            <Phone className="h-3.5 w-3.5" /> Kontaktirajte nas
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Promoviranje() {
  const seoPayload = useMemo(() => {
    const title = "Promoviranje biznisa | Split Usluge";
    const description =
      "Istaknite vaš biznis u Split Usluge imeniku. Prioritetni prikaz, veća vidljivost u kategoriji i više poziva od lokalnih klijenata. Pogledajte planove.";
    const siteUrl = typeof window !== "undefined" ? window.location.origin : undefined;

    return buildSeoPayload({
      title,
      description,
      keywords: ["promoviranje biznisa split", "oglašavanje split", "lokalni imenik split"],
      pathname: "/promoviranje",
      siteUrl,
      structuredData: [
        ...buildBaseStructuredData(siteUrl || "https://split-usluge.com"),
        buildBreadcrumbSchema(siteUrl || "https://split-usluge.com", [
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
              Split Usluge imenik svakodnevno posjećuju lokalni stanovnici koji traže usluge. Prioritetnim prikazom
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
                    <Button
                      className={`w-full ${plan.highlighted ? "bg-orange-500 text-white hover:bg-orange-600" : ""}`}
                      variant={plan.highlighted ? "default" : "outline"}
                      onClick={() => document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      Zatraži ponudu
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Trust signals */}
      <section className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="flex items-start gap-4 rounded-2xl border border-border/70 p-5">
              <ShieldCheck className="mt-0.5 h-8 w-8 flex-shrink-0 text-green-500" />
              <div>
                <p className="font-bold">Bez ugovora</p>
                <p className="mt-1 text-sm text-muted-foreground">Otkažite u bilo kojem trenutku, bez skrivenih obveza.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-border/70 p-5">
              <Users className="mt-0.5 h-8 w-8 flex-shrink-0 text-blue-500" />
              <div>
                <p className="font-bold">Podrška 1-na-1</p>
                <p className="mt-1 text-sm text-muted-foreground">Osobni kontakt i pomoć pri postavljanju profila.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-border/70 p-5">
              <BarChart3 className="mt-0.5 h-8 w-8 flex-shrink-0 text-orange-500" />
              <div>
                <p className="font-bold">Rezultati ili povrat</p>
                <p className="mt-1 text-sm text-muted-foreground">Ako niste zadovoljni u prvih 30 dana, vraćamo uplaćeno.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="font-semibold">768+ aktivnih profila</span>
            <span>|</span>
            <span className="font-semibold">10 kategorija usluga</span>
            <span>|</span>
            <span className="font-semibold">6 područja pokriveno</span>
          </div>
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
                a: "Prioritetni profili pojavljuju se na vrhu kategorije i na naslovnici Split Usluge imenika, ispred besplatnih profila.",
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

      {/* Contact Form */}
      <ContactFormSection />
    </div>
  );
}
