import { useCallback, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BarChart3, Eye, Globe, Lock, LogOut, MousePointerClick, Search,
  TrendingUp, Users, FileText, Scan, ExternalLink, Phone, MapPin,
  Download, RefreshCw, ChevronLeft, ChevronRight, Filter, Wand2, Copy, CheckCircle,
  MessageCircle, Mail, Star, Clock, Send, PhoneCall, Server, CreditCard, Bot, UserCheck, Mic
} from "lucide-react";

type AdminTab = "dashboard" | "categories" | "searches" | "clicks" | "reports" | "scanner" | "outreach" | "prompts" | "hosting" | "ai-calls" | "clients" | "claims" | "voice-agents";

function getSessionId() {
  let id = sessionStorage.getItem("su_session");
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem("su_session", id);
  }
  return id;
}

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split("T")[0]);
  const [reportCategory, setReportCategory] = useState("");
  const [scannerCategoryId, setScannerCategoryId] = useState<number | undefined>();
  const [scannerPage, setScannerPage] = useState(0);
  const [searchFilter, setSearchFilter] = useState("");

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: () => {
      setAdminPassword(password);
      setIsLoggedIn(true);
      setLoginError("");
    },
    onError: () => {
      setLoginError("Pogrešna lozinka");
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ adminPassword: password });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Panel</CardTitle>
            <p className="text-muted-foreground text-sm mt-1">Split Usluge - Administracija</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Unesite lozinku..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Prijava..." : "Prijavi se"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-lg">Admin</span>
          </div>
          <div className="flex items-center gap-2 order-3 w-full sm:order-2 sm:w-auto">
            <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="flex-1 sm:w-36 h-8 text-xs" />
            <span className="text-muted-foreground text-xs">-</span>
            <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="flex-1 sm:w-36 h-8 text-xs" />
          </div>
          <Button variant="ghost" size="sm" className="order-2 sm:order-3" onClick={() => { setIsLoggedIn(false); setAdminPassword(""); }}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          {([
            { id: "dashboard", label: "Pregled", icon: BarChart3 },
            { id: "categories", label: "Kategorije", icon: TrendingUp },
            { id: "searches", label: "Pretrage", icon: Search },
            { id: "clicks", label: "Klikovi", icon: MousePointerClick },
            { id: "reports", label: "Izvještaji", icon: FileText },
            { id: "scanner", label: "Scanner", icon: Scan },
            { id: "outreach", label: "Outreach", icon: ExternalLink },
            { id: "prompts", label: "AI Promptovi", icon: Wand2 },
            { id: "hosting", label: "Hosting", icon: Server },
            { id: "ai-calls", label: "AI Pozivi", icon: Bot },
            { id: "clients", label: "Klijenti", icon: CreditCard },
            { id: "claims", label: "Zahtjevi", icon: UserCheck },
            { id: "voice-agents", label: "Voice Agenti", icon: Mic },
          ] as { id: AdminTab; label: string; icon: any }[]).map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="gap-1.5 whitespace-nowrap"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === "dashboard" && <DashboardTab adminPassword={adminPassword} dateFrom={dateFrom} dateTo={dateTo} />}
        {activeTab === "categories" && <CategoriesTab adminPassword={adminPassword} dateFrom={dateFrom} dateTo={dateTo} />}
        {activeTab === "searches" && <SearchesTab adminPassword={adminPassword} dateFrom={dateFrom} dateTo={dateTo} />}
        {activeTab === "clicks" && <ClicksTab adminPassword={adminPassword} dateFrom={dateFrom} dateTo={dateTo} />}
        {activeTab === "reports" && <ReportsTab adminPassword={adminPassword} dateFrom={dateFrom} dateTo={dateTo} />}
        {activeTab === "scanner" && <ScannerTab adminPassword={adminPassword} />}
        {activeTab === "outreach" && <OutreachTab adminPassword={adminPassword} />}
        {activeTab === "prompts" && <PromptsTab adminPassword={adminPassword} />}
        {activeTab === "hosting" && <HostingTab />}
        {activeTab === "ai-calls" && <AICallsTab adminPassword={adminPassword} />}
        {activeTab === "clients" && <ClientsTab adminPassword={adminPassword} />}
        {activeTab === "claims" && <ClaimsTab adminPassword={adminPassword} />}
        {activeTab === "voice-agents" && <VoiceAgentsTab adminPassword={adminPassword} />}
      </div>
    </div>
  );
}

function DashboardTab({ adminPassword, dateFrom, dateTo }: { adminPassword: string; dateFrom: string; dateTo: string }) {
  const statsQuery = trpc.admin.getDashboardStats.useQuery({ adminPassword, dateFrom, dateTo });
  const viewsOverTime = trpc.admin.getViewsOverTime.useQuery({ adminPassword, dateFrom, dateTo });
  const languages = trpc.admin.getVisitorLanguages.useQuery({ adminPassword, dateFrom, dateTo });

  const stats = statsQuery.data;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Pregledi", value: stats?.totalViews || 0, icon: Eye, color: "text-blue-500" },
          { label: "Klikovi", value: stats?.totalClicks || 0, icon: MousePointerClick, color: "text-green-500" },
          { label: "Pretrage", value: stats?.totalSearches || 0, icon: Search, color: "text-purple-500" },
          { label: "Biznisi", value: stats?.totalBusinesses || 0, icon: Users, color: "text-orange-500" },
          { label: "Kategorije", value: stats?.totalCategories || 0, icon: BarChart3, color: "text-red-500" },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-2xl font-bold">{stat.value.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Views Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Pregledi po danu</CardTitle>
        </CardHeader>
        <CardContent>
          {viewsOverTime.data && viewsOverTime.data.length > 0 ? (
            <div className="h-48 flex items-end gap-1">
              {viewsOverTime.data.map((day, i) => {
                const maxViews = Math.max(...viewsOverTime.data!.map(d => d.views));
                const height = maxViews > 0 ? (day.views / maxViews) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">{day.views}</span>
                    <div
                      className="w-full bg-primary/80 rounded-t min-h-[2px]"
                      style={{ height: `${Math.max(height, 2)}%` }}
                      title={`${day.date}: ${day.views} pregleda`}
                    />
                    {i % Math.ceil(viewsOverTime.data!.length / 7) === 0 && (
                      <span className="text-[9px] text-muted-foreground">{day.date?.slice(5)}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">Nema podataka za odabrani period</p>
          )}
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Globe className="h-4 w-4" /> Jezici posjetitelja
          </CardTitle>
        </CardHeader>
        <CardContent>
          {languages.data && languages.data.length > 0 ? (
            <div className="space-y-2">
              {languages.data.slice(0, 10).map((lang, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="font-mono">{lang.language || "nepoznato"}</span>
                  <span className="text-muted-foreground">{lang.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-4">Nema podataka</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CategoriesTab({ adminPassword, dateFrom, dateTo }: { adminPassword: string; dateFrom: string; dateTo: string }) {
  const topCategories = trpc.admin.getTopCategories.useQuery({ adminPassword, dateFrom, dateTo, limit: 30 });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Najpopularnije kategorije po pregledima</CardTitle>
      </CardHeader>
      <CardContent>
        {topCategories.data && topCategories.data.length > 0 ? (
          <div className="space-y-3">
            {topCategories.data.map((cat, i) => {
              const maxViews = topCategories.data![0]?.views || 1;
              const width = (cat.views / maxViews) * 100;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{cat.categorySlug || "ostalo"}</span>
                    <span className="text-muted-foreground">{cat.views} pregleda</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-8">Nema podataka za odabrani period</p>
        )}
      </CardContent>
    </Card>
  );
}

function SearchesTab({ adminPassword, dateFrom, dateTo }: { adminPassword: string; dateFrom: string; dateTo: string }) {
  const topSearches = trpc.admin.getTopSearches.useQuery({ adminPassword, dateFrom, dateTo, limit: 50 });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Najpretrazivani pojmovi</CardTitle>
      </CardHeader>
      <CardContent>
        {topSearches.data && topSearches.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">#</th>
                  <th className="text-left py-2 font-medium">Pojam</th>
                  <th className="text-right py-2 font-medium">Pretrage</th>
                  <th className="text-right py-2 font-medium">Prosj. rezultata</th>
                </tr>
              </thead>
              <tbody>
                {topSearches.data.map((s, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-2 text-muted-foreground">{i + 1}</td>
                    <td className="py-2 font-mono">{s.query}</td>
                    <td className="py-2 text-right font-bold">{s.searchCount}</td>
                    <td className="py-2 text-right text-muted-foreground">{Math.round(Number(s.avgResults) || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-8">Nema podataka</p>
        )}
      </CardContent>
    </Card>
  );
}

function ClicksTab({ adminPassword, dateFrom, dateTo }: { adminPassword: string; dateFrom: string; dateTo: string }) {
  const [eventFilter, setEventFilter] = useState<string | undefined>();
  const clicks = trpc.admin.getClickAnalytics.useQuery({
    adminPassword, dateFrom, dateTo, limit: 50, eventType: eventFilter,
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["all", "phone_click", "website_click", "map_click", "directions_click"].map(type => (
          <Button
            key={type}
            variant={eventFilter === (type === "all" ? undefined : type) ? "default" : "outline"}
            size="sm"
            onClick={() => setEventFilter(type === "all" ? undefined : type)}
          >
            {type === "all" ? "Svi" : type.replace("_", " ")}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          {clicks.data && clicks.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Biznis</th>
                    <th className="text-left py-2 font-medium">Tip</th>
                    <th className="text-right py-2 font-medium">Klikovi</th>
                  </tr>
                </thead>
                <tbody>
                  {clicks.data.map((c, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2">{c.businessName || `ID: ${c.businessId}`}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          c.eventType === "phone_click" ? "bg-green-100 text-green-800" :
                          c.eventType === "website_click" ? "bg-blue-100 text-blue-800" :
                          c.eventType === "map_click" ? "bg-orange-100 text-orange-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {c.eventType}
                        </span>
                      </td>
                      <td className="py-2 text-right font-bold">{c.clickCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">Nema podataka</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ReportsTab({ adminPassword, dateFrom, dateTo }: { adminPassword: string; dateFrom: string; dateTo: string }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | undefined>();

  const categoriesQuery = trpc.services.getAllCategories.useQuery();
  const reportQuery = trpc.admin.generateReport.useQuery({
    adminPassword,
    dateFrom,
    dateTo,
    categorySlug: selectedCategory || undefined,
    businessId: selectedBusinessId,
  }, {
    enabled: !!(selectedCategory || selectedBusinessId),
  });

  const report = reportQuery.data;

  const handleExportCSV = useCallback(() => {
    if (!report) return;
    const lines = [
      "Split Usluge - Izvjestaj",
      `Period: ${dateFrom} - ${dateTo}`,
      `Kategorija: ${selectedCategory || "Sve"}`,
      "",
      `Ukupno pregleda: ${report.totalViews}`,
      `Ukupno klikova: ${report.totalClicks}`,
      "",
      "Klikovi po tipu:",
      ...report.clicksByType.map((c: any) => `  ${c.eventType}: ${c.count}`),
      "",
      "Dnevni pregledi:",
      "Datum,Pregledi",
      ...report.dailyViews.map((d: any) => `${d.date},${d.views}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `izvjestaj-${selectedCategory || "all"}-${dateFrom}-${dateTo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [report, dateFrom, dateTo, selectedCategory]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Generiraj izvještaj</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end flex-wrap">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Kategorija</label>
              <select
                className="border rounded px-3 py-2 text-sm bg-background"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="">Odaberi kategoriju...</option>
                {categoriesQuery.data?.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            {report && (
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-1" /> Izvoz CSV
              </Button>
            )}
          </div>

          {report && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950 rounded p-3">
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{report.totalViews}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Pregledi</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded p-3">
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{report.totalClicks}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Klikovi</p>
                </div>
                {report.clicksByType.map((ct: any, i: number) => (
                  <div key={i} className="bg-muted rounded p-3">
                    <p className="text-2xl font-bold">{ct.count}</p>
                    <p className="text-xs text-muted-foreground">{ct.eventType}</p>
                  </div>
                ))}
              </div>

              {/* Report text for sending to businesses */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm">Tekst za slanje biznisima:</h4>
                <div className="bg-background rounded p-3 text-sm whitespace-pre-wrap font-mono text-xs">
{`Poštovani,

Šaljemo Vam izvještaj o vidljivosti Vaše kategorije "${selectedCategory}" na platformi Split Usluge za period ${dateFrom} - ${dateTo}.

📊 Statistika:
- Ukupno pregleda stranice: ${report.totalViews}
- Ukupno klikova (telefon, web, mapa): ${report.totalClicks}
${report.clicksByType.map((ct: any) => `- ${ct.eventType}: ${ct.count}`).join("\n")}

Vaša kategorija privlači pozornost korisnika koji aktivno traže usluge poput Vaše.

Želite li povećati svoju vidljivost? Nudimo promotivne pakete koji uključuju:
✅ Istaknuti profil na vrhu kategorije
✅ Prošireni profil s fotografijama i opisom
✅ Mjesečni izvještaji s analitikom

Za više informacija, odgovorite na ovaj email ili nas kontaktirajte.

Srdačan pozdrav,
Split Usluge tim`}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Poštovani,\n\nŠaljemo Vam izvještaj o vidljivosti Vaše kategorije "${selectedCategory}" na platformi Split Usluge za period ${dateFrom} - ${dateTo}.\n\n📊 Statistika:\n- Ukupno pregleda stranice: ${report.totalViews}\n- Ukupno klikova: ${report.totalClicks}\n${report.clicksByType.map((ct: any) => `- ${ct.eventType}: ${ct.count}`).join("\n")}\n\nVaša kategorija privlači pozornost korisnika.\n\nŽelite li povećati svoju vidljivost? Nudimo promotivne pakete.\n\nSrdačan pozdrav,\nSplit Usluge tim`
                    );
                  }}
                >
                  Kopiraj tekst
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function normalizePhone(phone: string): string {
  let clean = phone.replace(/[\s\-\(\)]/g, "");
  if (clean.startsWith("0")) clean = "+385" + clean.slice(1);
  if (!clean.startsWith("+")) clean = "+385" + clean;
  return clean;
}

function buildWhatsAppMsg(name: string, previewUrl: string, hasWebsite: boolean): string {
  if (hasWebsite) {
    return `Poštovani,\n\njavljam se iz Split Usluge, lokalnog imenika za Split.\n\nVaš biznis "${name}" je uvršten u naš imenik. Nudimo:\n\n🌐 Profesionalna web stranica — od 199€\n📱 Prilagođena za mobitele\n🔍 SEO optimizacija za Google\n📞 AI agent koji odgovara na pozive 24/7\n\nPogledajte preview:\n${previewUrl}\n\nBesplatna izrada + hosting. Jedini trošak je domena (~12€/god).\n\nZainteresirani? Javite se!\nkondor1413@gmail.com`;
  }
  return `Poštovani,\n\njavljam se iz Split Usluge. Primijetili smo da "${name}" nema web stranicu.\n\nDanas 70% ljudi traži usluge na Google-u. Bez web stranice gubite klijente.\n\nNapravili smo Vam besplatni preview:\n${previewUrl}\n\n✅ Izrada BESPLATNA\n✅ Hosting BESPLATAN\n✅ Jedini trošak: domena ~12€/god\n✅ Gotovo za 24h\n\nIli nadogradite:\n📦 Standard — 199€ (SEO + Google Ads priprema)\n📦 Premium — 399€ (sve + AI telefonski agent)\n\nJavite se za info!\nkondor1413@gmail.com`;
}

function buildEmailBody(name: string, previewUrl: string, hasWebsite: boolean): string {
  if (hasWebsite) {
    return `Poštovani,\n\nJavljam se iz Split Usluge — lokalnog online imenika za Split i okolicu.\n\nVaš biznis "${name}" je dio našeg imenika, i pripremili smo personalizirani preview moderne web stranice za Vas:\n${previewUrl}\n\nŠto nudimo:\n✅ Profesionalna, mobilno prilagođena stranica\n✅ SEO optimizacija (da Vas klijenti nađu na Google-u)\n✅ Hosting i održavanje uključeno\n\nPaketi:\n🟢 Starter — BESPLATAN (izrada + hosting, samo domena ~12€/god)\n🟡 Standard — 199€ jednokratno + 29€/mj (SEO, Google Ads priprema, analytics)\n🔴 Premium — 399€ + 49€/mj (sve + AI telefonski agent na hrvatskom)\n\nPogledajte preview i javite nam se!\n\nSrdačan pozdrav,\nSplit Usluge tim\nkondor1413@gmail.com`;
  }
  return `Poštovani,\n\nJavljam se iz Split Usluge. Primijetili smo da "${name}" trenutno nema web stranicu.\n\n📊 70% korisnika traži lokalne usluge na Google-u\n📊 Biznisi sa web stranicom dobivaju 3x više poziva\n📊 Bez web prisutnosti, gubite klijente konkurenciji\n\nNapravili smo Vam besplatni preview stranice:\n${previewUrl}\n\nPaketi:\n🟢 Starter — BESPLATAN (izrada + hosting, samo domena ~12€/god)\n🟡 Standard — 199€ + 29€/mj (SEO, Google priprema, analytics)\n🔴 Premium — 399€ + 49€/mj (sve + AI telefonski agent 24/7)\n\nPogledajte preview — stranica može biti online za 24h!\n\nSrdačan pozdrav,\nSplit Usluge tim\nkondor1413@gmail.com`;
}

function buildSmsMsg(name: string, previewUrl: string): string {
  return `${name} — napravili smo besplatni preview web stranice za Vaš biznis: ${previewUrl} Javite se na kondor1413@gmail.com — Split Usluge`;
}

function ScannerTab({ adminPassword }: { adminPassword: string }) {
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [noWebsiteOnly, setNoWebsiteOnly] = useState(false);
  const [searchFilter, setScanSearch] = useState("");
  const [page, setPage] = useState(0);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const pageSize = 12;

  const categoriesQuery = trpc.services.getAllCategories.useQuery();
  const scanQuery = trpc.admin.getBusinessesForOutreach.useQuery({
    adminPassword,
    categoryId,
    hasPhone: true,
    noWebsiteOnly,
    search: searchFilter || undefined,
    limit: pageSize,
    offset: page * pageSize,
  });
  const logOutreach = trpc.admin.logOutreach.useMutation();

  const data = scanQuery.data;

  const handleOutreach = useCallback((businessId: number, channel: string, url: string) => {
    logOutreach.mutate({
      adminPassword,
      businessId,
      channel,
      previewUrl: `${window.location.origin}/preview/${businessId}`,
    });
    setSentIds(prev => new Set(prev).add(`${businessId}-${channel}`));
    window.open(url, "_blank");
  }, [adminPassword, logOutreach]);

  return (
    <div className="space-y-4">
      {/* Pricing reminder */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div><span className="font-bold text-green-700">🟢 Starter:</span> BESPLATNO <span className="text-muted-foreground">(domena ~12€/god)</span></div>
            <div><span className="font-bold text-yellow-700">🟡 Standard:</span> 199€ + 29€/mj <span className="text-muted-foreground">(SEO, Analytics)</span></div>
            <div><span className="font-bold text-red-700">🔴 Premium:</span> 399€ + 49€/mj <span className="text-muted-foreground">(+ AI agent)</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-3 items-end flex-wrap">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Kategorija</label>
          <select
            className="border rounded px-3 py-2 text-sm bg-background"
            value={categoryId || ""}
            onChange={e => { setCategoryId(e.target.value ? Number(e.target.value) : undefined); setPage(0); }}
          >
            <option value="">Sve kategorije</option>
            {categoriesQuery.data?.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Pretraži</label>
          <Input
            placeholder="Naziv biznisa..."
            className="h-9 w-48"
            value={searchFilter}
            onChange={e => { setScanSearch(e.target.value); setPage(0); }}
          />
        </div>
        <Button
          size="sm"
          variant={noWebsiteOnly ? "default" : "outline"}
          onClick={() => { setNoWebsiteOnly(!noWebsiteOnly); setPage(0); }}
          className="h-9"
        >
          <Globe className="h-4 w-4 mr-1" />
          {noWebsiteOnly ? "Samo bez weba ✓" : "Svi biznisi"}
        </Button>
        <div className="text-sm text-muted-foreground ml-auto">
          <strong>{data?.total || 0}</strong> biznisa {noWebsiteOnly ? "bez web stranice" : "ukupno"} (s telefonom)
        </div>
      </div>

      {data && data.businesses.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.businesses.map((b) => {
              const previewUrl = `${window.location.origin}/preview/${b.id}`;
              const phone = b.phone ? normalizePhone(b.phone) : "";
              const hasWeb = !!(b.website && b.website.length > 0 && !b.website.includes("sites.google") && !b.website.includes("business.site"));
              const waUrl = phone ? `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(buildWhatsAppMsg(b.name, previewUrl, hasWeb))}` : "";
              const emailUrl = b.email ? `mailto:${b.email}?subject=${encodeURIComponent(`Profesionalna web stranica za ${b.name} — besplatni preview`)}&body=${encodeURIComponent(buildEmailBody(b.name, previewUrl, hasWeb))}` : "";
              const smsUrl = phone ? `sms:${phone}?body=${encodeURIComponent(buildSmsMsg(b.name, previewUrl))}` : "";

              let hours: string[] = [];
              try { if (b.openingHours) { const p = JSON.parse(b.openingHours); if (Array.isArray(p)) hours = p; } } catch {}

              return (
                <Card key={b.id} className="overflow-hidden border-border/70">
                  <CardContent className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm truncate">{b.name}</h3>
                        <span className="text-xs text-primary font-medium">{b.categoryName}</span>
                      </div>
                      {b.rating && (
                        <div className="flex items-center gap-1 shrink-0 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-bold">
                          <Star className="h-3 w-3 fill-current" /> {b.rating}
                          {(b.reviewCount ?? 0) > 0 && <span className="font-normal">({b.reviewCount})</span>}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-1 text-xs text-muted-foreground">
                      {b.address && (
                        <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-primary shrink-0" /> {b.address}</p>
                      )}
                      {b.phone && (
                        <p className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-green-600 shrink-0" /> {b.phone}</p>
                      )}
                      {b.email && (
                        <p className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-blue-600 shrink-0" /> {b.email}</p>
                      )}
                      {hours.length > 0 && (
                        <p className="flex items-center gap-1.5"><Clock className="h-3 w-3 shrink-0" /> {hours[0]}</p>
                      )}
                      <p className="flex items-center gap-1.5">
                        <Globe className="h-3 w-3 text-red-500 shrink-0" />
                        {b.website ? (
                          <span className="text-orange-600">{b.website.includes("sites.google") ? "Google Site" : "Basic/Parked"}</span>
                        ) : (
                          <span className="text-red-500 font-medium">Nema web stranice</span>
                        )}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" className="text-xs h-8"
                        onClick={() => window.open(`/preview/${b.id}`, "_blank")}
                      >
                        <Eye className="h-3 w-3 mr-1" /> Preview
                      </Button>
                      {waUrl && (
                        <Button size="sm" className="text-xs h-8 bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleOutreach(b.id, "whatsapp", waUrl)}
                        >
                          {sentIds.has(`${b.id}-whatsapp`) ? <><CheckCircle className="h-3 w-3 mr-1" /> Poslano</> : <><MessageCircle className="h-3 w-3 mr-1" /> WhatsApp</>}
                        </Button>
                      )}
                      {emailUrl && (
                        <Button size="sm" variant="outline" className="text-xs h-8"
                          onClick={() => handleOutreach(b.id, "email", emailUrl)}
                        >
                          {sentIds.has(`${b.id}-email`) ? <><CheckCircle className="h-3 w-3 mr-1" /> Poslano</> : <><Mail className="h-3 w-3 mr-1" /> Email</>}
                        </Button>
                      )}
                      {smsUrl && (
                        <Button size="sm" variant="outline" className="text-xs h-8"
                          onClick={() => handleOutreach(b.id, "sms", smsUrl)}
                        >
                          {sentIds.has(`${b.id}-sms`) ? <><CheckCircle className="h-3 w-3 mr-1" /> Poslano</> : <><Send className="h-3 w-3 mr-1" /> SMS</>}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" /> Prethodna
            </Button>
            <span className="text-sm text-muted-foreground">
              Stranica {page + 1} od {Math.ceil((data.total || 1) / pageSize)}
            </span>
            <Button variant="outline" size="sm" disabled={(page + 1) * pageSize >= (data.total || 0)} onClick={() => setPage(p => p + 1)}>
              Sljedeća <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <p className="text-muted-foreground text-sm text-center py-8">
          {scanQuery.isLoading ? "Učitavanje..." : "Nema rezultata"}
        </p>
      )}
    </div>
  );
}

function OutreachTab({ adminPassword }: { adminPassword: string }) {
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const scansQuery = trpc.admin.getScans.useQuery({
    adminPassword,
    outreachStatus: statusFilter,
    limit: 50,
  });

  const updateMutation = trpc.admin.updateOutreachStatus.useMutation({
    onSuccess: () => scansQuery.refetch(),
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["all", "none", "sent", "responded", "converted"].map(status => (
          <Button
            key={status}
            variant={statusFilter === (status === "all" ? undefined : status) ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status === "all" ? undefined : status)}
          >
            {status === "all" ? "Svi" : status}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          {scansQuery.data && scansQuery.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Business ID</th>
                    <th className="text-left py-2 font-medium">Web</th>
                    <th className="text-left py-2 font-medium">Status</th>
                    <th className="text-left py-2 font-medium">Mini-site</th>
                    <th className="text-left py-2 font-medium">Poslano</th>
                    <th className="text-left py-2 font-medium">Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {scansQuery.data.map((scan) => (
                    <tr key={scan.id} className="border-b border-border/50">
                      <td className="py-2">{scan.businessId}</td>
                      <td className="py-2">
                        {scan.hasWebsite ? "Da" : <span className="text-red-500">Ne</span>}
                        {scan.hasGoogleSite ? " (Google)" : ""}
                      </td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          scan.outreachStatus === "converted" ? "bg-green-100 text-green-800" :
                          scan.outreachStatus === "sent" ? "bg-blue-100 text-blue-800" :
                          scan.outreachStatus === "responded" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {scan.outreachStatus}
                        </span>
                      </td>
                      <td className="py-2">{scan.miniSiteGenerated ? "Da" : "Ne"}</td>
                      <td className="py-2 text-xs text-muted-foreground">
                        {scan.outreachSentAt ? new Date(scan.outreachSentAt).toLocaleDateString("hr") : "-"}
                      </td>
                      <td className="py-2 flex gap-1">
                        <Button variant="outline" size="sm" className="text-xs h-7"
                          onClick={() => updateMutation.mutate({ adminPassword, scanId: scan.id, status: "sent" })}
                        >
                          Označi poslano
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-7"
                          onClick={() => updateMutation.mutate({ adminPassword, scanId: scan.id, status: "converted" })}
                        >
                          Konvertirano
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">Nema skeniranih biznisa</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PromptsTab({ adminPassword }: { adminPassword: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [promptType, setPromptType] = useState<"full" | "landing" | "wordpress">("full");
  const [htmlLang, setHtmlLang] = useState<"hr" | "en">("hr");
  const [copied, setCopied] = useState("");

  const businessesQuery = trpc.admin.getAllBusinessesAdmin.useQuery(
    { adminPassword, limit: 10000, offset: 0 },
    { enabled: !!adminPassword }
  );

  const htmlQuery = trpc.admin.generateMiniSiteHtml.useQuery(
    { adminPassword, businessId: selectedBusiness?.id || 0, language: htmlLang },
    { enabled: !!selectedBusiness }
  );

  const logOutreach = trpc.admin.logOutreach.useMutation();

  const allBusinesses = businessesQuery.data?.businesses || [];
  const filtered = useMemo(() => {
    if (!searchTerm) return allBusinesses.slice(0, 20);
    const q = searchTerm.toLowerCase();
    return allBusinesses.filter((b: typeof allBusinesses[number]) =>
      b.name.toLowerCase().includes(q) || (b.address || "").toLowerCase().includes(q)
    ).slice(0, 20);
  }, [allBusinesses, searchTerm]);

  const generatePrompt = useCallback((business: any, type: string) => {
    const base = `Business: ${business.name}
Category: ${business.categorySlug || "general"}
Address: ${business.address || "Split, Croatia"}
Phone: ${business.phone || "N/A"}
Website: ${business.website || "None"}
Rating: ${business.rating || "N/A"} (${business.reviewCount || 0} reviews)
Opening Hours: ${business.openingHours || "Not specified"}
Coordinates: ${business.latitude ? `${business.latitude}, ${business.longitude}` : "N/A"}
Description: ${business.description || "Local business in Split, Croatia"}`;

    if (type === "full") {
      return `Create a complete, professional single-page website for the following local business in Split, Croatia.

${base}

Requirements:
- Modern, responsive HTML5 + CSS3 + vanilla JS (single file, no frameworks)
- Hero section with business name, tagline, and call-to-action button (phone link)
- About section describing their services based on the category
- Services/pricing section with 4-6 relevant services for their category
- Reviews/testimonials section (use the rating data, generate realistic testimonials)
- Contact section with phone, address, map embed (use coordinates if available)
- Sticky header with phone button
- WhatsApp floating button if phone is available
- Color scheme matching their industry (e.g., blue for plumbing, green for cleaning)
- SEO meta tags, Open Graph tags, Schema.org LocalBusiness structured data
- Croatian language for content, with proper č, ć, š, ž, đ characters
- Mobile-first design with smooth scroll navigation
- Google Fonts (Inter or similar)
- Total file size under 50KB
- Include a favicon using emoji relevant to the business type

Output the complete HTML file ready to deploy.`;
    }

    if (type === "landing") {
      return `Create a minimal, high-converting landing page for this local business in Split, Croatia.

${base}

Requirements:
- Single HTML file, under 20KB
- Hero with business name + big phone CTA button
- 3 trust signals (rating, years in business, number of clients)
- 3-4 key services listed
- One testimonial
- Contact info with click-to-call
- Mobile-optimized, loads instantly
- Croatian language
- Clean, modern design with one accent color
- No JavaScript required (pure HTML + CSS)

Output the complete HTML file.`;
    }

    return `Create a WordPress setup guide and content package for this local business:

${base}

Provide:
1. Recommended WordPress theme (free) for their business type
2. Essential plugins list (SEO, contact form, maps, speed)
3. Homepage content in Croatian (hero text, about, services)
4. 5 blog post titles relevant to their category for SEO
5. Google My Business optimization tips
6. Social media bio texts (Instagram, Facebook) in Croatian
7. Complete wp-config.php security recommendations
8. .htaccess rules for speed optimization

Format everything clearly with headers and copy-paste ready content.`;
  }, []);

  const currentPrompt = selectedBusiness ? generatePrompt(selectedBusiness, promptType) : "";

  const copyText = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  }, []);

  const downloadHtml = useCallback(() => {
    if (!htmlQuery.data?.html) return;
    const blob = new Blob([htmlQuery.data.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedBusiness?.name?.replace(/\s+/g, "-").toLowerCase() || "site"}-${htmlLang}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [htmlQuery.data, selectedBusiness, htmlLang]);

  // Pre-built outreach messages
  const whatsAppOffer = selectedBusiness ? `Poštovani ${selectedBusiness.name},

Primijetili smo da nemate web stranicu. Napravili smo besplatnu probnu stranicu za Vas — pogledajte:
${window.location.origin}/preview/${selectedBusiness.id}

Nudimo:
✅ BESPLATNO - Probna stranica (ova koju vidite)
✅ STANDARD - 199 EUR jednokratno + 29 EUR/mj (profesionalna stranica, bez našeg brenda, kontakt forma, Google Analytics)
✅ PREMIUM - 399 EUR + 59 EUR/mj (full custom + SEO + blog + prioritetni prikaz)

Hosting je besplatan za sve pakete! Jedini trošak za Vas je domena (~10 EUR/god).

Javite nam se za više info!
Split Usluge tim` : "";

  const emailOffer = selectedBusiness ? `Poštovani,

Pišemo Vam u ime Split Usluge, lokalnog imenika usluga za Split i okolicu.

Primijetili smo da ${selectedBusiness.name} trenutno nema web stranicu, a mi smo pripremili besplatnu probnu verziju:
${window.location.origin}/preview/${selectedBusiness.id}

Ova stranica uključuje Vaše podatke, radno vrijeme, kontakt, Google ocjenu (${selectedBusiness.rating || "N/A"}) i lokaciju.

NAŠI PAKETI:
🆓 STARTER (besplatno) — Probna stranica s našim brendom
📋 STANDARD (199 EUR + 29 EUR/mj) — Profesionalna stranica, kontakt forma, Google Analytics, bez našeg brenda
⭐ PREMIUM (399 EUR + 59 EUR/mj) — Full custom dizajn + SEO optimizacija + blog + održavanje + prioritetni prikaz

Hosting je besplatan. Jedini dodatni trošak: domena (~10 EUR/godišnje).

Možemo početi odmah — javite nam se na ovaj mail ili pozovite nas.

Srdačan pozdrav,
Split Usluge tim
${window.location.origin}` : "";

  return (
    <div className="space-y-6">
      {/* Business selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" /> AI Prompt Generator + Generiranje stranice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pretraži biznise..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>

          <div className="max-h-48 overflow-y-auto border rounded-lg divide-y">
            {filtered.map((b: typeof filtered[number]) => (
              <button key={b.id} className={`w-full text-left px-4 py-2 text-sm hover:bg-muted/50 transition-colors ${selectedBusiness?.id === b.id ? "bg-primary/10 font-medium" : ""}`} onClick={() => setSelectedBusiness(b)}>
                <span>{b.name}</span>
                {b.phone && <span className="text-green-600 ml-2 text-xs">{b.phone}</span>}
                {b.address && <span className="text-muted-foreground ml-2 text-xs">— {b.address}</span>}
              </button>
            ))}
            {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nema rezultata</p>}
          </div>
        </CardContent>
      </Card>

      {selectedBusiness && (
        <>
          {/* Business info card */}
          <Card className="border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg">{selectedBusiness.name}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                    {selectedBusiness.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-green-600" /> {selectedBusiness.phone}</span>}
                    {selectedBusiness.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-blue-600" /> {selectedBusiness.email}</span>}
                    {selectedBusiness.address && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {selectedBusiness.address}</span>}
                    {selectedBusiness.rating && <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500" /> {selectedBusiness.rating} ({selectedBusiness.reviewCount || 0})</span>}
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => window.open(`/preview/${selectedBusiness.id}`, "_blank")}>
                  <Eye className="h-3 w-3 mr-1" /> Preview
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick outreach - one click send */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Send className="h-4 w-4" /> Pošalji ponudu — samo klikni
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-3">
                {selectedBusiness.phone && (
                  <Button className="bg-green-600 hover:bg-green-700 text-white h-auto py-3 flex-col gap-1"
                    onClick={() => {
                      const phone = normalizePhone(selectedBusiness.phone!).replace("+", "");
                      logOutreach.mutate({ adminPassword, businessId: selectedBusiness.id, channel: "whatsapp", previewUrl: `${window.location.origin}/preview/${selectedBusiness.id}` });
                      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(whatsAppOffer)}`, "_blank");
                    }}>
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-xs">WhatsApp ponuda</span>
                    <span className="text-[10px] opacity-70">{selectedBusiness.phone}</span>
                  </Button>
                )}
                {selectedBusiness.email && (
                  <Button variant="outline" className="h-auto py-3 flex-col gap-1"
                    onClick={() => {
                      logOutreach.mutate({ adminPassword, businessId: selectedBusiness.id, channel: "email", previewUrl: `${window.location.origin}/preview/${selectedBusiness.id}` });
                      window.open(`mailto:${selectedBusiness.email}?subject=${encodeURIComponent(`Besplatna web stranica za ${selectedBusiness.name}`)}&body=${encodeURIComponent(emailOffer)}`, "_blank");
                    }}>
                    <Mail className="h-5 w-5" />
                    <span className="text-xs">Email ponuda</span>
                    <span className="text-[10px] text-muted-foreground">{selectedBusiness.email}</span>
                  </Button>
                )}
                {selectedBusiness.phone && (
                  <Button variant="outline" className="h-auto py-3 flex-col gap-1"
                    onClick={() => {
                      const phone = normalizePhone(selectedBusiness.phone!);
                      logOutreach.mutate({ adminPassword, businessId: selectedBusiness.id, channel: "sms" });
                      window.open(`sms:${phone}?body=${encodeURIComponent(`${selectedBusiness.name}, napravili smo besplatnu web stranicu za Vas: ${window.location.origin}/preview/${selectedBusiness.id} - Split Usluge`)}`, "_blank");
                    }}>
                    <Send className="h-5 w-5" />
                    <span className="text-xs">SMS ponuda</span>
                  </Button>
                )}
              </div>

              {/* Copy messages */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">WhatsApp/SMS poruka:</span>
                  <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => copyText(whatsAppOffer, "wa")}>
                    {copied === "wa" ? <><CheckCircle className="h-3 w-3 mr-1" /> Kopirano</> : <><Copy className="h-3 w-3 mr-1" /> Kopiraj</>}
                  </Button>
                </div>
                <pre className="bg-muted p-3 rounded text-[11px] whitespace-pre-wrap max-h-32 overflow-y-auto">{whatsAppOffer}</pre>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Email poruka:</span>
                  <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => copyText(emailOffer, "email")}>
                    {copied === "email" ? <><CheckCircle className="h-3 w-3 mr-1" /> Kopirano</> : <><Copy className="h-3 w-3 mr-1" /> Kopiraj</>}
                  </Button>
                </div>
                <pre className="bg-muted p-3 rounded text-[11px] whitespace-pre-wrap max-h-32 overflow-y-auto">{emailOffer}</pre>
              </div>
            </CardContent>
          </Card>

          {/* HTML Generator - download ready site */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Download className="h-4 w-4" /> Generiraj HTML stranicu — spremno za deploy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Generiraj kompletnu HTML stranicu personaliziranu za ovaj biznis. Samo preuzmi i uploadaj na besplatni hosting.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant={htmlLang === "hr" ? "default" : "outline"} onClick={() => setHtmlLang("hr")}>Hrvatski</Button>
                <Button size="sm" variant={htmlLang === "en" ? "default" : "outline"} onClick={() => setHtmlLang("en")}>English</Button>
              </div>
              <div className="flex gap-2">
                <Button onClick={downloadHtml} disabled={!htmlQuery.data?.html || htmlQuery.isLoading}>
                  <Download className="h-4 w-4 mr-2" />
                  {htmlQuery.isLoading ? "Generiranje..." : `Preuzmi ${selectedBusiness.name}.html`}
                </Button>
                <Button variant="outline" onClick={() => { if (htmlQuery.data?.html) copyText(htmlQuery.data.html, "html"); }} disabled={!htmlQuery.data?.html}>
                  {copied === "html" ? <><CheckCircle className="h-3 w-3 mr-1" /> Kopirano</> : <><Copy className="h-3 w-3 mr-1" /> Kopiraj HTML</>}
                </Button>
              </div>
              {htmlQuery.data?.html && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Prikaži HTML ({Math.round(htmlQuery.data.html.length / 1024)} KB)</summary>
                  <pre className="bg-muted p-3 rounded mt-2 max-h-64 overflow-auto whitespace-pre-wrap">{htmlQuery.data.html.slice(0, 5000)}...</pre>
                </details>
              )}
            </CardContent>
          </Card>

          {/* AI Prompt */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">AI Prompt za ChatGPT/Claude</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                {([
                  { id: "full", label: "Full Website" },
                  { id: "landing", label: "Landing Page" },
                  { id: "wordpress", label: "WordPress Setup" },
                ] as const).map(t => (
                  <Button key={t.id} variant={promptType === t.id ? "default" : "outline"} size="sm" onClick={() => setPromptType(t.id)}>{t.label}</Button>
                ))}
              </div>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-xs whitespace-pre-wrap max-h-96 overflow-y-auto">{currentPrompt}</pre>
                <Button size="sm" className="absolute top-2 right-2 gap-1" onClick={() => copyText(currentPrompt, "prompt")}>
                  {copied === "prompt" ? <><CheckCircle className="h-3 w-3" /> Kopirano!</> : <><Copy className="h-3 w-3" /> Kopiraj</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function HostingTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" /> Besplatni Hosting — Upute
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generirana HTML stranica se može besplatno hostati. Jedini trošak za klijenta je domena (~10 EUR/godišnje).
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 space-y-3">
            <h3 className="font-bold flex items-center gap-2">1. Netlify (Preporučeno)</h3>
            <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
              <li>Idi na <strong>netlify.com</strong> i registriraj se besplatno</li>
              <li>Klikni <strong>"Add new site" → "Deploy manually"</strong></li>
              <li>Drag & drop generiranu HTML datoteku</li>
              <li>Stranica je online za 10 sekundi!</li>
              <li>Za custom domenu: <strong>Domain settings → Add domain</strong></li>
              <li>SSL/HTTPS automatski besplatno</li>
            </ol>
            <div className="bg-muted p-3 rounded text-xs font-mono">
              # Ili putem CLI:<br/>
              npm i -g netlify-cli<br/>
              netlify deploy --prod --dir=./
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-3">
            <h3 className="font-bold flex items-center gap-2">2. Vercel</h3>
            <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
              <li>Idi na <strong>vercel.com</strong> i registriraj se</li>
              <li>Klikni <strong>"Add New" → "Project"</strong></li>
              <li>Uploadaj HTML datoteku u novi Git repo</li>
              <li>Vercel automatski deploya</li>
              <li>Custom domena: <strong>Settings → Domains</strong></li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-3">
            <h3 className="font-bold flex items-center gap-2">3. Cloudflare Pages</h3>
            <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
              <li>Idi na <strong>pages.cloudflare.com</strong></li>
              <li>Klikni <strong>"Create a project" → "Direct upload"</strong></li>
              <li>Uploadaj HTML datoteku</li>
              <li>Besplatan SSL + globalni CDN</li>
              <li>Najbrži od svih opcija</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-3">
            <h3 className="font-bold flex items-center gap-2">4. GitHub Pages</h3>
            <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
              <li>Kreiraj novi GitHub repo</li>
              <li>Uploadaj HTML kao <strong>index.html</strong></li>
              <li><strong>Settings → Pages → Source: main branch</strong></li>
              <li>Stranica dostupna na github.io</li>
              <li>Za domenu: dodaj CNAME datoteku</li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/30">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-bold">Kupovina domene</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">.hr domene (za lokalne biznise):</p>
              <ul className="text-muted-foreground space-y-1 mt-1">
                <li>• <strong>plus.hr</strong> — od 79 HRK/god (~10 EUR)</li>
                <li>• <strong>avalon.hr</strong> — od 89 HRK/god</li>
                <li>• Treba OIB vlasnika za .hr</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">.com domene:</p>
              <ul className="text-muted-foreground space-y-1 mt-1">
                <li>• <strong>Namecheap</strong> — od $8.88/god</li>
                <li>• <strong>Cloudflare</strong> — po nabavnoj cijeni (~$9/god)</li>
                <li>• <strong>Porkbun</strong> — od $9.73/god</li>
              </ul>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 mt-3">
            <p className="text-sm font-bold text-green-800 dark:text-green-200">Ukupan trošak za klijenta:</p>
            <p className="text-sm text-green-700 dark:text-green-300">Hosting: 0 EUR | Domena: ~10 EUR/god | Izrada: BESPLATNO (starter) ili od 199 EUR</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AICallsTab({ adminPassword }: { adminPassword: string }) {
  const [copiedScript, setCopiedScript] = useState("");

  const copyScript = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(key);
    setTimeout(() => setCopiedScript(""), 2000);
  }, []);

  const introScript = `Dobar dan! Zovem u ime Split Usluge, lokalnog imenika usluga za Split i okolicu.

Primijetili smo da [IME_BIZNISA] trenutno nema web stranicu, a mi smo pripremili besplatnu probnu verziju stranice s Vašim podacima — ocjenom, radnim vremenom, kontaktom i lokacijom.

Želite li da Vam pošaljemo link na WhatsApp da pogledate?`;

  const offerScript = `Odlično! Evo što nudimo:

BESPLATNO — Probna stranica koju ste vidjeli, s našim brendom. Možete je koristiti odmah.

STANDARD paket — 199 EUR jednokratno + 29 EUR mjesečno:
- Profesionalna stranica bez našeg brenda
- Kontakt forma za upite
- Google Analytics praćenje
- Hosting i SSL uključeni

PREMIUM paket — 399 EUR + 59 EUR mjesečno:
- Potpuno prilagođen dizajn
- SEO optimizacija za Google
- Blog sekcija
- Prioritetni prikaz u našem imeniku
- Mjesečno održavanje

Hosting je besplatan za sve pakete. Jedini dodatni trošak je domena, oko 10 eura godišnje.`;

  const closingScript = `Mogu Vam odmah aktivirati starter paket — potpuno besplatno. Ako Vam se svidi, možemo nadograditi na standard ili premium kad god želite.

Što kažete? Mogu Vam poslati link na WhatsApp odmah.`;

  const businessesQuery = trpc.admin.getBusinessesForOutreach.useQuery({
    adminPassword,
    hasPhone: true,
    limit: 100,
    offset: 0,
  });

  const exportCSV = useCallback(() => {
    const businesses = businessesQuery.data?.businesses || [];
    const csv = [
      "Ime,Telefon,Kategorija,Ocjena,Preview URL",
      ...businesses.map(b => `"${b.name}","${b.phone}","${b.categoryName}","${b.rating || ""}","${window.location.origin}/preview/${b.id}"`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "biznisi-za-pozive.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [businessesQuery.data]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" /> AI Agent pozivi — Skripta i upute
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Koristi AI voice agente za automatske pozive biznisima. Skripta na hrvatskom jeziku za prodaju web stranica.
          </p>

          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 space-y-2">
            <h4 className="font-bold text-sm">Preporučeni AI Voice platforme:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• <strong>Bland.ai</strong> — Najbolji za custom voice agente, podrška za više jezika</li>
              <li>• <strong>Vapi.ai</strong> — Open-source friendly, dobra integracija</li>
              <li>• <strong>Retell.ai</strong> — Jednostavan setup, dobar za početnike</li>
              <li>• <strong>ElevenLabs</strong> — Za kloniranje glasa + Conversational AI</li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-4 space-y-2">
            <h4 className="font-bold text-sm">Kako postaviti (Bland.ai primjer):</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
              <li>Registriraj se na bland.ai (free trial dostupan)</li>
              <li>Kreiraj novog agenta → Odaberi jezik: <strong>Croatian</strong></li>
              <li>Zalijepi donju skriptu kao "System Prompt"</li>
              <li>Postavi <strong>voice: "female"</strong> ili <strong>"male"</strong></li>
              <li>Exportaj CSV listu brojeva (gumb dolje) i importaj u Bland</li>
              <li>Pokreni kampanju — agent zove automatski!</li>
              <li>Rezultate (zainteresiran/nije) prati u Bland dashboardu</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Scripts */}
      {[
        { key: "intro", title: "1. Uvod", script: introScript },
        { key: "offer", title: "2. Ponuda paketa", script: offerScript },
        { key: "closing", title: "3. Zaključivanje", script: closingScript },
      ].map(s => (
        <Card key={s.key}>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm">{s.title}</h4>
              <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => copyScript(s.script, s.key)}>
                {copiedScript === s.key ? <><CheckCircle className="h-3 w-3 mr-1" /> Kopirano</> : <><Copy className="h-3 w-3 mr-1" /> Kopiraj</>}
              </Button>
            </div>
            <pre className="bg-muted p-3 rounded text-xs whitespace-pre-wrap">{s.script}</pre>
          </CardContent>
        </Card>
      ))}

      {/* Export */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm">Lista brojeva za pozive</h4>
              <p className="text-xs text-muted-foreground">{businessesQuery.data?.total || 0} biznisa bez web stranice s telefonskim brojem</p>
            </div>
            <Button onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" /> Exportaj CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Full system prompt */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm">Kompletni System Prompt za AI agenta</h4>
            <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => copyScript(
              `Ti si ljubazni prodajni agent za Split Usluge, lokalni imenik usluga u Splitu, Hrvatska. Zoveš lokalne biznise koji nemaju web stranicu da im ponudiš besplatnu izradu probne web stranice.\n\nPRAVILA:\n- Govori na hrvatskom jeziku, ljubazno i profesionalno\n- Predstavi se i objasni zašto zoveš\n- Spomeni da si primijetio da nemaju web stranicu\n- Ponudi besplatnu probnu stranicu (STARTER paket)\n- Ako su zainteresirani, pitaj za WhatsApp broj da im pošalješ link\n- Ako pitaju za cijenu: STANDARD 199 EUR + 29 EUR/mj, PREMIUM 399 EUR + 59 EUR/mj\n- Naglasi da je hosting besplatan, jedini trošak je domena ~10 EUR/god\n- Budi kratak, ne duži poziv preko 2 minute\n- Ako kažu "ne hvala" — zahvali se i završi ljubazno\n\nINFORMACIJE O BIZNISU (zamijeni za svaki poziv):\n[IME]: {business_name}\n[KATEGORIJA]: {category}\n[PREVIEW_LINK]: {preview_url}`,
              "system"
            )}>
              {copiedScript === "system" ? <><CheckCircle className="h-3 w-3 mr-1" /> Kopirano</> : <><Copy className="h-3 w-3 mr-1" /> Kopiraj</>}
            </Button>
          </div>
          <pre className="bg-muted p-3 rounded text-[11px] whitespace-pre-wrap max-h-48 overflow-y-auto">
{`Ti si ljubazni prodajni agent za Split Usluge, lokalni imenik usluga u Splitu, Hrvatska. Zoveš lokalne biznise koji nemaju web stranicu da im ponudiš besplatnu izradu probne web stranice.

PRAVILA:
- Govori na hrvatskom jeziku, ljubazno i profesionalno
- Predstavi se i objasni zašto zoveš
- Spomeni da si primijetio da nemaju web stranicu
- Ponudi besplatnu probnu stranicu (STARTER paket)
- Ako su zainteresirani, pitaj za WhatsApp broj da im pošalješ link
- Ako pitaju za cijenu: STANDARD 199 EUR + 29 EUR/mj, PREMIUM 399 EUR + 59 EUR/mj
- Naglasi da je hosting besplatan, jedini trošak je domena ~10 EUR/god
- Budi kratak, ne duži poziv preko 2 minute
- Ako kažu "ne hvala" — zahvali se i završi ljubazno

INFORMACIJE O BIZNISU (zamijeni za svaki poziv):
[IME]: {business_name}
[KATEGORIJA]: {category}
[PREVIEW_LINK]: {preview_url}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

function ClientsTab({ adminPassword }: { adminPassword: string }) {
  const outreachStats = trpc.admin.getOutreachStats.useQuery({ adminPassword });
  const outreachHistory = trpc.admin.getOutreachHistory.useQuery({ adminPassword, limit: 50 });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{outreachStats.data?.total || 0}</p>
            <p className="text-xs text-muted-foreground">Ukupno kontakata</p>
          </CardContent>
        </Card>
        {outreachStats.data?.byChannel.map((ch, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{ch.count}</p>
              <p className="text-xs text-muted-foreground">{ch.channel}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Packages info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Paketi za klijente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 space-y-2 bg-green-50 dark:bg-green-950">
              <h4 className="font-bold text-green-800 dark:text-green-200">STARTER — Besplatno</h4>
              <ul className="text-xs space-y-1 text-green-700 dark:text-green-300">
                <li>• Generirana probna stranica</li>
                <li>• Split Usluge branding</li>
                <li>• Besplatan hosting</li>
                <li>• Osnovno SEO</li>
              </ul>
              <p className="text-xs font-bold">Cijena: 0 EUR</p>
              <p className="text-[10px] text-muted-foreground">Trošak: domena ~10 EUR/god (opcionalno)</p>
            </div>
            <div className="border-2 border-primary rounded-lg p-4 space-y-2 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-bold text-blue-800 dark:text-blue-200">STANDARD — Popularan</h4>
              <ul className="text-xs space-y-1 text-blue-700 dark:text-blue-300">
                <li>• Profesionalna web stranica</li>
                <li>• Bez Split Usluge brenda</li>
                <li>• Kontakt forma</li>
                <li>• Google Analytics</li>
                <li>• SSL + hosting uključen</li>
              </ul>
              <p className="text-xs font-bold">199 EUR jednokratno + 29 EUR/mj</p>
            </div>
            <div className="border rounded-lg p-4 space-y-2 bg-purple-50 dark:bg-purple-950">
              <h4 className="font-bold text-purple-800 dark:text-purple-200">PREMIUM</h4>
              <ul className="text-xs space-y-1 text-purple-700 dark:text-purple-300">
                <li>• Full custom dizajn</li>
                <li>• SEO optimizacija</li>
                <li>• Blog sekcija</li>
                <li>• Prioritetni prikaz u imeniku</li>
                <li>• Mjesečno održavanje</li>
                <li>• Social media setup</li>
              </ul>
              <p className="text-xs font-bold">399 EUR jednokratno + 59 EUR/mj</p>
            </div>
          </div>

          <div className="mt-4 bg-muted rounded-lg p-4 space-y-2">
            <h4 className="font-bold text-sm">Stripe integracija — priprema:</h4>
            <ol className="text-xs space-y-1 list-decimal list-inside text-muted-foreground">
              <li>Registriraj se na <strong>stripe.com</strong></li>
              <li>Kreiraj 2 Products: "Standard Web Paket" i "Premium Web Paket"</li>
              <li>Za svaki dodaj recurring price (29 EUR/mj i 59 EUR/mj)</li>
              <li>Kopiraj API ključeve u <strong>.env</strong>: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET</li>
              <li>Kopiraj Price ID-eve: STRIPE_PRICE_STANDARD, STRIPE_PRICE_PREMIUM</li>
              <li>Webhook endpoint: <strong>/api/stripe/webhook</strong></li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Outreach history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Povijest kontaktiranja</CardTitle>
        </CardHeader>
        <CardContent>
          {outreachHistory.data && outreachHistory.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Business ID</th>
                    <th className="text-left py-2 font-medium">Kanal</th>
                    <th className="text-left py-2 font-medium">Status</th>
                    <th className="text-left py-2 font-medium">Datum</th>
                  </tr>
                </thead>
                <tbody>
                  {outreachHistory.data.map(entry => (
                    <tr key={entry.id} className="border-b border-border/50">
                      <td className="py-2">{entry.businessId}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          entry.channel === "whatsapp" ? "bg-green-100 text-green-800" :
                          entry.channel === "email" ? "bg-blue-100 text-blue-800" :
                          entry.channel === "sms" ? "bg-purple-100 text-purple-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>{entry.channel}</span>
                      </td>
                      <td className="py-2 text-xs">{entry.status}</td>
                      <td className="py-2 text-xs text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleDateString("hr")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">Još nema kontakata — koristi Scanner tab za slanje ponuda</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Claims Tab ─── */
function ClaimsTab({ adminPassword }: { adminPassword: string }) {
  const claimsQuery = trpc.owners.getPendingClaims.useQuery({ adminPassword });
  const verifyMutation = trpc.owners.verifyClaim.useMutation({
    onSuccess: () => claimsQuery.refetch(),
  });

  const pending = (claimsQuery.data || []).filter((c: any) => !c.isVerified);
  const verified = (claimsQuery.data || []).filter((c: any) => c.isVerified);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" /> Zahtjevi za preuzimanje djelatnosti
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">Nema novih zahtjeva za odobrenje</p>
          ) : (
            <div className="space-y-3">
              {pending.map((claim: any) => (
                <div key={claim.claimId} className="flex items-center justify-between p-4 rounded-lg border border-orange-200 bg-orange-50">
                  <div>
                    <p className="font-semibold">{claim.businessName || `Biznis #${claim.businessId}`}</p>
                    <p className="text-sm text-muted-foreground">
                      {claim.ownerName} &bull; {claim.ownerEmail} {claim.ownerPhone && `• ${claim.ownerPhone}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Telefon biznisa: {claim.businessPhone || "N/A"} &bull; Prijavljeno: {new Date(claim.createdAt).toLocaleDateString("hr")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={verifyMutation.isPending}
                      onClick={() => verifyMutation.mutate({ adminPassword, claimId: claim.claimId, approved: true })}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Odobri
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={verifyMutation.isPending}
                      onClick={() => verifyMutation.mutate({ adminPassword, claimId: claim.claimId, approved: false })}
                    >
                      Odbij
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Potvrđeni vlasnici ({verified.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {verified.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">Nema potvrđenih vlasnika</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Biznis</th>
                    <th className="py-2">Vlasnik</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Telefon</th>
                    <th className="py-2">Datum</th>
                  </tr>
                </thead>
                <tbody>
                  {verified.map((c: any) => (
                    <tr key={c.claimId} className="border-b border-border/50">
                      <td className="py-2 font-medium">{c.businessName || `#${c.businessId}`}</td>
                      <td className="py-2">{c.ownerName}</td>
                      <td className="py-2">{c.ownerEmail}</td>
                      <td className="py-2">{c.ownerPhone || "-"}</td>
                      <td className="py-2 text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString("hr")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Voice Agents Tab ─── */
function VoiceAgentsTab({ adminPassword }: { adminPassword: string }) {
  const [copied, setCopied] = useState("");

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const setupScript = `# AI Voice Agent - Postavljanje za biznis

## Platforme za voice agente (odaberi jednu):

### 1. Bland.ai (Preporučeno - najjednostavnije)
- Registracija: https://bland.ai
- Cijena: ~$0.09/min
- Podrška za hrvatski: DA (Custom voice cloning)

### 2. Vapi.ai
- Registracija: https://vapi.ai
- Cijena: ~$0.05/min + provider costs
- Podrška za hrvatski: DA (preko ElevenLabs)

### 3. Retell.ai
- Registracija: https://retell.ai
- Cijena: ~$0.10/min
- Podrška za hrvatski: DA

## Koraci za postavljanje:
1. Registriraj se na odabranu platformu
2. Kreiraj novog agenta s hrvatskim jezikom
3. Kopiraj System Prompt odozdo
4. Postavi broj telefona (Twilio ili platforma)
5. Testiraj poziv
6. Dodaj webhook za rezervacije`;

  const systemPrompt = `Ti si ljubazni AI asistent za [IME BIZNISA] u Splitu.

PRAVILA:
- Govori SAMO na hrvatskom jeziku
- Budi profesionalan ali prijateljski
- Cilj: rezervacija termina ili prikupljanje kontakt podataka

POZDRAV: "Dobar dan! Hvala što ste nazvali [IME BIZNISA]. Ja sam virtualni asistent. Kako Vam mogu pomoći?"

USLUGE:
[LISTA USLUGA S CIJENAMA]

RADNO VRIJEME:
[RADNO VRIJEME]

REZERVACIJA:
- Pitaj za ime i prezime
- Pitaj za željeni datum i vrijeme
- Pitaj za broj telefona
- Potvrdi sve podatke
- Reci: "Vaš termin je rezerviran. Poslat ćemo Vam SMS potvrdu. Hvala i vidimo se!"

AKO NE MOŽE REZERVIRATI:
- Ponudi alternativni termin
- Ako nema slobodnih termina, zapiši kontakt podatke
- Reci: "Javit ćemo Vam se čim se oslobodi termin. Hvala na strpljenju!"

CIJENA INFO:
Ako pitaju za cijene, daj informacije. Ako nisi siguran, reci: "Za točnu cijenu, naš tim će Vas kontaktirati."`;

  const pricingPlans = [
    { name: "Basic", price: "99€/mj", minutes: 100, features: ["100 minuta/mj", "1 agent", "Hrvatski jezik", "Osnovni pozdrav", "Email izvještaji"] },
    { name: "Pro", price: "199€/mj", minutes: 300, features: ["300 minuta/mj", "2 agenta", "HR + EN", "Prilagođeni promptovi", "SMS potvrde", "Webhook integracije"] },
    { name: "Enterprise", price: "399€/mj", minutes: 1000, features: ["1000 minuta/mj", "Neograničeni agenti", "Svi jezici", "Custom voice cloning", "API pristup", "Prioritetna podrška", "CRM integracija"] },
  ];

  return (
    <div className="space-y-6">
      {/* Pricing Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" /> AI Voice Agent - Paketi za prodaju
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {pricingPlans.map(plan => (
              <div key={plan.name} className={`p-4 rounded-lg border-2 ${plan.name === "Pro" ? "border-orange-500 bg-orange-50" : "border-border"}`}>
                {plan.name === "Pro" && <span className="text-xs font-bold text-orange-600 uppercase">Najpopularniji</span>}
                <h3 className="text-lg font-bold mt-1">{plan.name}</h3>
                <p className="text-2xl font-black text-orange-600">{plan.price}</p>
                <ul className="mt-3 space-y-1.5">
                  {plan.features.map(f => (
                    <li key={f} className="text-sm flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Upute za postavljanje</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-xs whitespace-pre-wrap overflow-x-auto">{setupScript}</pre>
          <Button
            size="sm"
            className="mt-3"
            onClick={() => copyText(setupScript, "setup")}
          >
            <Copy className="h-4 w-4 mr-1" /> {copied === "setup" ? "Kopirano!" : "Kopiraj upute"}
          </Button>
        </CardContent>
      </Card>

      {/* System Prompt */}
      <Card>
        <CardHeader>
          <CardTitle>System Prompt za Voice Agenta (HR)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-xs whitespace-pre-wrap overflow-x-auto">{systemPrompt}</pre>
          <Button
            size="sm"
            className="mt-3"
            onClick={() => copyText(systemPrompt, "prompt")}
          >
            <Copy className="h-4 w-4 mr-1" /> {copied === "prompt" ? "Kopirano!" : "Kopiraj prompt"}
          </Button>
        </CardContent>
      </Card>

      {/* WhatsApp Sales Pitch */}
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp poruka za prodaju Voice Agenta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-4 rounded-lg text-sm">
            <p>Dobar dan! 👋</p>
            <p className="mt-2">Javljam se iz Split Usluge. Imamo AI asistenta koji može odgovarati na pozive Vašeg biznisa 24/7 - na hrvatskom jeziku!</p>
            <p className="mt-2">✅ Automatsko rezerviranje termina</p>
            <p>✅ Odgovara na pitanja o cijenama i uslugama</p>
            <p>✅ Nikad ne propušta poziv</p>
            <p>✅ Šalje SMS potvrde klijentima</p>
            <p className="mt-2">Paketi od 99€/mj. Želite li besplatnu probnu demonstraciju?</p>
            <p className="mt-2">Info: kondor1413@gmail.com</p>
          </div>
          <Button
            size="sm"
            className="mt-3"
            onClick={() => copyText("Dobar dan! 👋\n\nJavljam se iz Split Usluge. Imamo AI asistenta koji može odgovarati na pozive Vašeg biznisa 24/7 - na hrvatskom jeziku!\n\n✅ Automatsko rezerviranje termina\n✅ Odgovara na pitanja o cijenama i uslugama\n✅ Nikad ne propušta poziv\n✅ Šalje SMS potvrde klijentima\n\nPaketi od 99€/mj. Želite li besplatnu probnu demonstraciju?\n\nInfo: kondor1413@gmail.com", "wa-voice")}
          >
            <Copy className="h-4 w-4 mr-1" /> {copied === "wa-voice" ? "Kopirano!" : "Kopiraj poruku"}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Integration Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Brza integracija - Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">1</span>
              <div><strong>Registracija na Bland.ai</strong> — Napravi account, dodaj payment method</div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">2</span>
              <div><strong>Kupi Twilio broj</strong> — Hrvatski broj (+385) za $1/mj na twilio.com</div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">3</span>
              <div><strong>Kreiraj agenta</strong> — Zalijepi System Prompt gore, odaberi glas i jezik</div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">4</span>
              <div><strong>Poveži broj</strong> — Forwarding sa biznisovog broja na Twilio → Bland</div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">5</span>
              <div><strong>Testiraj</strong> — Nazovi i provjeri da sve radi, prilagodi prompt po potrebi</div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">6</span>
              <div><strong>Webhook</strong> — Postavi webhook za primanje rezervacija u email/Sheets/CRM</div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
