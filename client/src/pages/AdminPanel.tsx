import { useCallback, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BarChart3, Eye, Globe, Lock, LogOut, MousePointerClick, Search,
  TrendingUp, Users, FileText, Scan, ExternalLink, Phone, MapPin,
  Download, RefreshCw, ChevronLeft, ChevronRight, Filter, Wand2, Copy, CheckCircle
} from "lucide-react";

type AdminTab = "dashboard" | "categories" | "searches" | "clicks" | "reports" | "scanner" | "outreach" | "prompts";

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
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Period:</span>
              <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-36 h-8 text-xs" />
              <span className="text-muted-foreground">-</span>
              <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-36 h-8 text-xs" />
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setIsLoggedIn(false); setAdminPassword(""); }}>
              <LogOut className="h-4 w-4 mr-1" /> Odjava
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {([
            { id: "dashboard", label: "Pregled", icon: BarChart3 },
            { id: "categories", label: "Kategorije", icon: TrendingUp },
            { id: "searches", label: "Pretrage", icon: Search },
            { id: "clicks", label: "Klikovi", icon: MousePointerClick },
            { id: "reports", label: "Izvještaji", icon: FileText },
            { id: "scanner", label: "Scanner", icon: Scan },
            { id: "outreach", label: "Outreach", icon: ExternalLink },
            { id: "prompts", label: "AI Promptovi", icon: Wand2 },
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

function ScannerTab({ adminPassword }: { adminPassword: string }) {
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [page, setPage] = useState(0);
  const pageSize = 30;

  const categoriesQuery = trpc.services.getAllCategories.useQuery();
  const scanQuery = trpc.admin.getBusinessesWithoutWebsite.useQuery({
    adminPassword,
    categoryId,
    limit: pageSize,
    offset: page * pageSize,
  });

  const data = scanQuery.data;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Scan className="h-4 w-4" /> Biznisi bez web stranice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end flex-wrap">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Filtriraj po kategoriji</label>
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
            <div className="text-sm text-muted-foreground">
              Ukupno: <strong>{data?.total || 0}</strong> biznisa bez web stranice
            </div>
          </div>

          {data && data.businesses.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Naziv</th>
                      <th className="text-left py-2 font-medium">Adresa</th>
                      <th className="text-left py-2 font-medium">Telefon</th>
                      <th className="text-left py-2 font-medium">Web</th>
                      <th className="text-left py-2 font-medium">Ocjena</th>
                      <th className="text-left py-2 font-medium">Akcije</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.businesses.map((b) => (
                      <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-2 font-medium">{b.name}</td>
                        <td className="py-2 text-muted-foreground text-xs">{b.address}</td>
                        <td className="py-2">
                          {b.phone ? (
                            <a href={`tel:${b.phone}`} className="text-blue-600 flex items-center gap-1 text-xs">
                              <Phone className="h-3 w-3" /> {b.phone}
                            </a>
                          ) : "-"}
                        </td>
                        <td className="py-2">
                          {b.website ? (
                            <span className="text-xs text-orange-600">
                              {b.website.includes("sites.google") || b.website.includes("business.site")
                                ? "Google Site" : "Parked/Basic"}
                            </span>
                          ) : (
                            <span className="text-xs text-red-500 font-medium">Nema</span>
                          )}
                        </td>
                        <td className="py-2">{b.rating || "-"} ({b.reviewCount || 0})</td>
                        <td className="py-2 flex gap-1">
                          <Button variant="outline" size="sm" className="text-xs h-7"
                            onClick={() => {
                              window.open(`/preview/${b.id}`, "_blank");
                            }}
                          >
                            Preview
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs h-7"
                            onClick={() => {
                              const previewUrl = `${window.location.origin}/preview/${b.id}`;
                              const subject = encodeURIComponent(`Web stranica za ${b.name}`);
                              const body = encodeURIComponent(
                                `Poštovani ${b.name},\n\nPrimijetili smo da nemate web stranicu. Nudimo izradu profesionalne web stranice za lokalne biznise u Splitu.\n\nPripremili smo besplatni preview kako bi Vaša web stranica mogla izgledati:\n${previewUrl}\n\n✅ Moderna, responzivna web stranica\n✅ Google optimizacija (SEO)\n✅ Održavanje i hosting\n✅ Od 199 EUR jednokratno\n\nSrdačan pozdrav,\nSplit Usluge tim`
                              );
                              window.open(`mailto:${b.email || ""}?subject=${subject}&body=${body}`);
                            }}
                          >
                            Pošalji ponudu
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
        </CardContent>
      </Card>
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
  const [copied, setCopied] = useState(false);

  const businessesQuery = trpc.admin.getAllBusinessesAdmin.useQuery(
    { adminPassword, limit: 10000, offset: 0 },
    { enabled: !!adminPassword }
  );

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

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(currentPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentPrompt]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" /> AI Prompt Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Odaberi biznis i generiraj detaljan prompt za AI (ChatGPT/Claude) koji će napraviti kompletnu web stranicu.
          </p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pretraži biznise..."
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="max-h-48 overflow-y-auto border rounded-lg divide-y">
            {filtered.map((b: typeof filtered[number]) => (
              <button
                key={b.id}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-muted/50 transition-colors ${selectedBusiness?.id === b.id ? "bg-primary/10 font-medium" : ""}`}
                onClick={() => setSelectedBusiness(b)}
              >
                <span>{b.name}</span>
                {b.address && <span className="text-muted-foreground ml-2">— {b.address}</span>}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nema rezultata</p>
            )}
          </div>

          {selectedBusiness && (
            <>
              <div className="flex gap-2">
                {([
                  { id: "full", label: "Full Website" },
                  { id: "landing", label: "Landing Page" },
                  { id: "wordpress", label: "WordPress Setup" },
                ] as const).map(t => (
                  <Button
                    key={t.id}
                    variant={promptType === t.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPromptType(t.id)}
                  >
                    {t.label}
                  </Button>
                ))}
              </div>

              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-xs whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {currentPrompt}
                </pre>
                <Button
                  size="sm"
                  className="absolute top-2 right-2 gap-1"
                  onClick={copyToClipboard}
                >
                  {copied ? <><CheckCircle className="h-3 w-3" /> Kopirano!</> : <><Copy className="h-3 w-3" /> Kopiraj</>}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Kopiraj prompt i zalijepi u ChatGPT ili Claude. AI će generirati kompletnu web stranicu spremnu za deploy.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
