import { useCallback, useMemo } from "react";
import { useRoute } from "wouter";
import { MapPin, Phone, Globe, Star, Clock, Navigation, Mail, CheckCircle, Shield, Award, Users, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";

// Service-specific templates with colors, icons, and selling points
const SERVICE_TEMPLATES: Record<string, {
  gradient: string;
  accentColor: string;
  heroPattern: string;
  tagline: string;
  sellingPoints: string[];
  ctaText: string;
}> = {
  automehanicari: {
    gradient: "from-slate-800 to-slate-950",
    accentColor: "text-orange-500",
    heroPattern: "bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.15),transparent)]",
    tagline: "Pouzdani auto servis u Splitu",
    sellingPoints: ["Kompletna dijagnostika", "Sve marke automobila", "Garancija na rad"],
    ctaText: "Rezerviraj termin",
  },
  "servisi-za-ciscenje": {
    gradient: "from-cyan-600 to-blue-800",
    accentColor: "text-cyan-500",
    heroPattern: "bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.15),transparent)]",
    tagline: "Profesionalno ciscenje u Splitu",
    sellingPoints: ["Dubinsko ciscenje", "Ciscenje apartmana", "Ekspresna usluga"],
    ctaText: "Zatrazi ponudu",
  },
  "ciscenje-apartmana": {
    gradient: "from-teal-600 to-emerald-800",
    accentColor: "text-teal-500",
    heroPattern: "bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.15),transparent)]",
    tagline: "Apartmani uvijek spremni za goste",
    sellingPoints: ["Turnover cleaning", "Ciscenje izmedu gostiju", "Pranje rublja ukljuceno"],
    ctaText: "Zatrazi ponudu",
  },
  "pranje-brodova": {
    gradient: "from-blue-700 to-indigo-900",
    accentColor: "text-blue-400",
    heroPattern: "bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent)]",
    tagline: "Profesionalna njega Vaseg plovila",
    sellingPoints: ["Pranje i poliranje", "Antifouling zastita", "Dolazimo u marinu"],
    ctaText: "Kontaktiraj nas",
  },
  "taxi-i-transfer": {
    gradient: "from-yellow-600 to-amber-800",
    accentColor: "text-yellow-500",
    heroPattern: "bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.15),transparent)]",
    tagline: "Pouzdan prijevoz u Splitu",
    sellingPoints: ["Aerodromski transfer", "Fiksne cijene", "24/7 dostupnost"],
    ctaText: "Rezerviraj transfer",
  },
  elektricari: {
    gradient: "from-amber-600 to-orange-800",
    accentColor: "text-amber-500",
    heroPattern: "bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.15),transparent)]",
    tagline: "Strucan elektroinstalerski servis",
    sellingPoints: ["Hitne intervencije", "Montaza i popravci", "Licencirani majstori"],
    ctaText: "Nazovi odmah",
  },
  vodoinstalateri: {
    gradient: "from-blue-600 to-blue-900",
    accentColor: "text-blue-400",
    heroPattern: "bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.15),transparent)]",
    tagline: "Hitni vodoinstalater u Splitu",
    sellingPoints: ["Dostopavanje odvoda", "Adaptacija kupaonice", "Hitne intervencije 0-24"],
    ctaText: "Hitna intervencija",
  },
  stomatolozi: {
    gradient: "from-sky-500 to-blue-700",
    accentColor: "text-sky-400",
    heroPattern: "bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.15),transparent)]",
    tagline: "Kvalitetna dentalna njega",
    sellingPoints: ["Preventivni pregledi", "Estetska stomatologija", "Moderni uredaji"],
    ctaText: "Zakazi pregled",
  },
  "turisticki-vodici": {
    gradient: "from-emerald-600 to-green-800",
    accentColor: "text-emerald-400",
    heroPattern: "bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent)]",
    tagline: "Discover Split with a local guide",
    sellingPoints: ["Licensed guides", "Multiple languages", "Custom tours available"],
    ctaText: "Book a tour",
  },
  fotografija: {
    gradient: "from-purple-600 to-violet-800",
    accentColor: "text-purple-400",
    heroPattern: "bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.15),transparent)]",
    tagline: "Profesionalna fotografija u Splitu",
    sellingPoints: ["Drone snimanje", "Fotografije nekretnina", "Event fotografija"],
    ctaText: "Zatrazi ponudu",
  },
};

const DEFAULT_TEMPLATE = {
  gradient: "from-blue-600 to-blue-800",
  accentColor: "text-blue-500",
  heroPattern: "bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent)]",
  tagline: "Lokalna usluga u Splitu",
  sellingPoints: ["Profesionalna usluga", "Lokalni strucnjaci", "Dostupni kontakt podaci"],
  ctaText: "Kontaktiraj nas",
};

export default function MiniSite() {
  const [, params] = useRoute("/preview/:id");
  const businessId = Number(params?.id || 0);

  const businessQuery = trpc.services.getBusinessById.useQuery(
    { id: businessId },
    { enabled: businessId > 0 }
  );
  const categoriesQuery = trpc.services.getAllCategories.useQuery();

  const business = businessQuery.data;
  const category = useMemo(() => {
    if (!business || !categoriesQuery.data) return null;
    return categoriesQuery.data.find(c => c.id === business.categoryId);
  }, [business, categoriesQuery.data]);

  const template = useMemo(() => {
    if (!category) return DEFAULT_TEMPLATE;
    return SERVICE_TEMPLATES[category.slug] || DEFAULT_TEMPLATE;
  }, [category]);

  if (businessQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Biznis nije pronadjen</p>
      </div>
    );
  }

  let openingHours: string[] = [];
  try {
    if (business.openingHours) {
      const parsed = JSON.parse(business.openingHours);
      if (Array.isArray(parsed)) openingHours = parsed;
    }
  } catch {}

  const downloadHtml = useCallback(() => {
    const phone = business.phone || "";
    const categoryName = category?.name || "Lokalna usluga";
    const html = `<!DOCTYPE html>
<html lang="hr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${business.name} - ${categoryName} Split</title>
<meta name="description" content="${business.name} - ${categoryName} u Splitu. ${business.address || ""}. Kontakt: ${phone}.">
<meta property="og:title" content="${business.name}">
<meta property="og:description" content="${categoryName} u Splitu - ${business.address || ""}">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:system-ui,sans-serif;color:#1e293b;background:#f8fafc}
  .hero{background:linear-gradient(135deg,#1e293b,#0f172a);color:#fff;padding:60px 20px;text-align:center}
  .hero h1{font-size:2.2rem;font-weight:800;margin-bottom:12px}
  .hero .tagline{color:rgba(255,255,255,.7);font-size:1.1rem;margin-bottom:24px}
  .badge{display:inline-block;background:rgba(255,255,255,.15);padding:6px 16px;border-radius:20px;font-size:.8rem;margin-bottom:20px;text-transform:uppercase;letter-spacing:.1em}
  .cta-btn{display:inline-block;background:#f97316;color:#fff;padding:16px 36px;border-radius:12px;text-decoration:none;font-size:1.1rem;font-weight:700;margin:8px}
  .cta-btn.secondary{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3)}
  section{max-width:700px;margin:0 auto;padding:40px 20px}
  .card{background:#fff;border-radius:16px;padding:28px;box-shadow:0 2px 12px rgba(0,0,0,.06);margin-bottom:20px}
  h2{font-size:1.6rem;font-weight:700;margin-bottom:16px;color:#0f172a}
  .info-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f1f5f9}
  .info-row:last-child{border:none}
  .info-icon{width:20px;text-align:center;color:#f97316;font-size:1.1rem}
  .info-label{font-weight:600;min-width:100px;color:#475569;font-size:.9rem}
  .services{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
  .service-item{background:#f8fafc;border-radius:10px;padding:16px;text-align:center;border:1px solid #e2e8f0}
  .service-item::before{content:"✓";display:block;font-size:1.4rem;color:#22c55e;margin-bottom:8px}
  .footer{background:#0f172a;color:rgba(255,255,255,.5);text-align:center;padding:24px;font-size:.85rem}
  .footer a{color:#f97316;text-decoration:none}
  @media(max-width:600px){.hero h1{font-size:1.6rem}}
</style>
</head>
<body>
<div class="hero">
  <div class="badge">${categoryName}</div>
  <h1>${business.name}</h1>
  <div class="tagline">${template.tagline}</div>
  ${phone ? `<a href="tel:${phone}" class="cta-btn">📞 ${phone}</a>` : ""}
  ${business.address ? `<a href="https://maps.google.com/?q=${encodeURIComponent(business.address)}" target="_blank" class="cta-btn secondary">📍 Lokacija</a>` : ""}
</div>

<section>
  <div class="card">
    <h2>Kontakt informacije</h2>
    ${phone ? `<div class="info-row"><span class="info-icon">📞</span><span class="info-label">Telefon</span><a href="tel:${phone}">${phone}</a></div>` : ""}
    ${business.email ? `<div class="info-row"><span class="info-icon">✉️</span><span class="info-label">Email</span><a href="mailto:${business.email}">${business.email}</a></div>` : ""}
    ${business.address ? `<div class="info-row"><span class="info-icon">📍</span><span class="info-label">Adresa</span>${business.address}</div>` : ""}
    ${business.website ? `<div class="info-row"><span class="info-icon">🌐</span><span class="info-label">Web</span><a href="${business.website}" target="_blank">${business.website}</a></div>` : ""}
  </div>

  <div class="card">
    <h2>Naše usluge</h2>
    <div class="services">
      ${template.sellingPoints.map(p => `<div class="service-item">${p}</div>`).join("")}
    </div>
  </div>

  ${openingHours.length > 0 ? `<div class="card"><h2>Radno vrijeme</h2>${openingHours.map(h => `<div class="info-row"><span class="info-icon">🕐</span>${h}</div>`).join("")}</div>` : ""}

  ${business.latitude && business.longitude ? `
  <div class="card">
    <h2>Lokacija</h2>
    <a href="https://www.google.com/maps/@${business.latitude},${business.longitude},17z" target="_blank" style="display:block;background:#dbeafe;border-radius:10px;padding:32px;text-align:center;text-decoration:none;color:#1d4ed8">
      <div style="font-size:2rem;margin-bottom:8px">📍</div>
      <strong>Otvori na Google Maps</strong><br>
      <span style="font-size:.9rem;opacity:.7">${business.address || ""}</span>
    </a>
  </div>` : ""}
</section>

<div class="footer">
  <p>&copy; ${new Date().getFullYear()} ${business.name} · Sva prava pridržana</p>
  <p style="margin-top:8px">Web stranica izrada: <a href="https://split-usluge.hr" target="_blank">Split Usluge</a></p>
</div>

${phone ? `<a href="tel:${phone}" style="position:fixed;bottom:20px;right:20px;background:#22c55e;color:#fff;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:1.5rem;box-shadow:0 4px 16px rgba(34,197,94,.4);z-index:999">📞</a>` : ""}
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${business.name.toLowerCase().replace(/\s+/g, "-")}-web.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [business, category, template, openingHours]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Admin download bar */}
      <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-sm">
        <span className="text-white/60">Preview: <span className="text-white font-medium">{business.name}</span></span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-7 text-xs gap-1"
            onClick={downloadHtml}>
            <Download className="h-3.5 w-3.5" /> Preuzmi HTML
          </Button>
          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-7 text-xs gap-1"
            onClick={() => {
              const previewUrl = window.location.href;
              if (business.phone) {
                const phone = business.phone.replace(/\D/g, "");
                const msg = encodeURIComponent(`Pozdrav! Napravili smo preview vaše web stranice: ${previewUrl}\n\nZanima li vas profesionalna web stranica od 199 EUR? - Split Usluge`);
                window.open(`https://wa.me/385${phone.replace(/^0/, "")}?text=${msg}`);
              }
            }}>
            WhatsApp ponuda
          </Button>
        </div>
      </div>

      {/* Hero - Template specific */}
      <div className={`bg-gradient-to-br ${template.gradient} text-white relative overflow-hidden`}>
        <div className={`absolute inset-0 ${template.heroPattern}`} />
        <div className="max-w-3xl mx-auto px-6 py-16 relative z-10">
          <div className="text-center space-y-5">
            {business.imageUrl && (
              <img
                src={business.imageUrl}
                alt={business.name}
                className="w-28 h-28 rounded-2xl mx-auto object-cover border-4 border-white/20 shadow-2xl"
              />
            )}
            {category && (
              <span className="inline-block bg-white/15 backdrop-blur text-white/90 text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wider">
                {category.name}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{business.name}</h1>
            <p className="text-lg text-white/70">{template.tagline}</p>
            {business.address && (
              <p className="flex items-center justify-center gap-2 text-white/80">
                <MapPin className="h-4 w-4" /> {business.address}
              </p>
            )}
            {business.rating && (
              <div className="flex items-center justify-center gap-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.round(Number(business.rating)) ? "text-yellow-300 fill-yellow-300" : "text-white/30"}`} />
                  ))}
                </div>
                <span className="font-bold text-lg">{business.rating}</span>
                {(business.reviewCount ?? 0) > 0 && (
                  <span className="text-white/60 text-sm">({business.reviewCount} recenzija na Google)</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions - Sticky on mobile */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-3 flex gap-3 justify-center flex-wrap">
          {business.phone && (
            <a href={`tel:${business.phone}`}>
              <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg">
                <Phone className="h-4 w-4" /> {business.phone}
              </Button>
            </a>
          )}
          {business.email && (
            <a href={`mailto:${business.email}`}>
              <Button variant="outline" className="gap-2 shadow">
                <Mail className="h-4 w-4" /> Email
              </Button>
            </a>
          )}
          {business.address && (
            <a href={`https://www.google.com/maps/search/${encodeURIComponent(business.name + " " + business.address)}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2 shadow">
                <Navigation className="h-4 w-4" /> Upute
              </Button>
            </a>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Selling Points */}
        <div className="grid grid-cols-3 gap-4">
          {template.sellingPoints.map((point, i) => (
            <div key={i} className="text-center p-4 rounded-xl bg-slate-50 border">
              <CheckCircle className={`h-6 w-6 mx-auto mb-2 ${template.accentColor}`} />
              <p className="text-sm font-medium">{point}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        {business.description && (
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h2 className="font-bold text-lg mb-3">O nama</h2>
              <p className="text-muted-foreground leading-7">{business.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Trust Signals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {business.rating && (
            <div className="text-center p-3 rounded-xl bg-yellow-50 border border-yellow-200">
              <Award className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
              <p className="text-lg font-bold text-yellow-700">{business.rating}</p>
              <p className="text-xs text-yellow-600">Google ocjena</p>
            </div>
          )}
          {(business.reviewCount ?? 0) > 0 && (
            <div className="text-center p-3 rounded-xl bg-blue-50 border border-blue-200">
              <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
              <p className="text-lg font-bold text-blue-700">{business.reviewCount}</p>
              <p className="text-xs text-blue-600">Recenzija</p>
            </div>
          )}
          <div className="text-center p-3 rounded-xl bg-green-50 border border-green-200">
            <Shield className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold text-green-700">Verificirano</p>
            <p className="text-xs text-green-600">Google profil</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-purple-50 border border-purple-200">
            <MapPin className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-lg font-bold text-purple-700">Split</p>
            <p className="text-xs text-purple-600">Lokalni biznis</p>
          </div>
        </div>

        {/* Opening Hours */}
        {openingHours.length > 0 && (
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5" /> Radno vrijeme
              </h2>
              <div className="space-y-2 text-sm">
                {openingHours.map((line, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
                    <span className="text-muted-foreground">{line}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Map */}
        {business.latitude && business.longitude && (
          <Card className="shadow-md overflow-hidden">
            <a
              href={`https://www.google.com/maps/@${business.latitude},${business.longitude},17z`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-gradient-to-br from-blue-50 to-sky-100 h-56 flex items-center justify-center hover:from-blue-100 hover:to-sky-200 transition-colors cursor-pointer">
                <div className="text-center">
                  <MapPin className="h-10 w-10 mx-auto mb-3 text-blue-600" />
                  <p className="font-bold text-blue-800">Otvori na Google Maps</p>
                  <p className="text-sm text-blue-600 mt-1">{business.address}</p>
                </div>
              </div>
            </a>
          </Card>
        )}

        {/* Big CTA - Call to action */}
        {business.phone && (
          <a href={`tel:${business.phone}`} className="block">
            <div className={`bg-gradient-to-r ${template.gradient} rounded-2xl p-8 text-center text-white shadow-xl hover:shadow-2xl transition-shadow`}>
              <Phone className="h-8 w-8 mx-auto mb-3" />
              <h2 className="text-2xl font-bold">{template.ctaText}</h2>
              <p className="text-3xl font-bold mt-2">{business.phone}</p>
              <p className="text-white/60 mt-2 text-sm">Klikni za poziv</p>
            </div>
          </a>
        )}

        {/* Sales pitch - Website offer */}
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 shadow-xl">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-bold text-2xl">Zelite profesionalnu web stranicu?</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Ovo je automatski generiran preview. Mozemo vam napraviti profesionalnu web stranicu
              sa vasim brendom, logom, SEO optimizacijom i kompletnim kontakt informacijama.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left text-sm pt-2">
              <div className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />Moderna web stranica</div>
              <div className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />Google SEO optimizacija</div>
              <div className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />Mobilni prilagodjena</div>
              <div className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />Hosting i odrzavanje</div>
              <div className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />Kontakt forma</div>
              <div className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />Google Maps integracija</div>
            </div>
            <div className="flex flex-col gap-2 max-w-xs mx-auto pt-4">
              <Button size="lg" className="w-full text-base">Kontaktirajte nas za ponudu</Button>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span className="font-bold text-foreground">Od 199 EUR</span>
                <span>jednokratno + 29 EUR/mj odrzavanje</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-4 pb-8 space-y-2">
          <p>Automatski generirano putem <a href="/" className="text-primary hover:underline font-medium">Split Usluge</a></p>
          <p>Splitski imenik lokalnih usluga i biznisa</p>
        </div>
      </div>
    </div>
  );
}
