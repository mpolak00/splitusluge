import { useCallback, useMemo, useState } from "react";
import { Link } from "wouter";
import { getBusinessPath } from "@shared/paths";
import { Lock, LogOut, Search, Store, Phone, Mail, MapPin, Star, Globe, Clock, Edit2, Save, CheckCircle, AlertCircle, Bot, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";

export default function BusinessLogin() {
  const [mode, setMode] = useState<"login" | "claim">("login");
  const [token, setToken] = useState(() => sessionStorage.getItem("owner_token") || "");
  const [businessId, setBusinessId] = useState(() => Number(sessionStorage.getItem("owner_business_id")) || 0);

  if (token && businessId) {
    return <OwnerDashboard token={token} onLogout={() => { setToken(""); setBusinessId(0); sessionStorage.removeItem("owner_token"); sessionStorage.removeItem("owner_business_id"); }} />;
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Store className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Moja djelatnost</h1>
          <p className="text-muted-foreground text-sm">Prijavite se ili preuzmite svoju djelatnost na Majstori Split</p>
        </div>

        <div className="flex gap-2">
          <Button variant={mode === "login" ? "default" : "outline"} className="flex-1" onClick={() => setMode("login")}>Prijava</Button>
          <Button variant={mode === "claim" ? "default" : "outline"} className="flex-1" onClick={() => setMode("claim")}>Preuzmi djelatnost</Button>
        </div>

        {mode === "login" ? (
          <LoginForm onSuccess={(t, bid) => { setToken(t); setBusinessId(bid); sessionStorage.setItem("owner_token", t); sessionStorage.setItem("owner_business_id", String(bid)); }} />
        ) : (
          <ClaimForm onSuccess={() => setMode("login")} />
        )}

        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>Pitanja? Kontaktirajte nas:</p>
          <a href="mailto:kondor1413@gmail.com" className="text-primary font-medium hover:underline">kondor1413@gmail.com</a>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: (token: string, businessId: number) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.owners.login.useMutation({
    onSuccess: (data) => {
      onSuccess(data.token, data.businessId);
    },
    onError: (err) => setError(err.message),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2"><Lock className="h-5 w-5" /> Prijava</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); setError(""); loginMutation.mutate({ email, password }); }} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vas@email.com" required />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Lozinka</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" required />
          </div>
          {error && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {error}</p>}
          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Prijava..." : "Prijavi se"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ClaimForm({ onSuccess }: { onSuccess: () => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [formData, setFormData] = useState({ email: "", password: "", name: "", phone: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const businessesQuery = trpc.services.getAllBusinesses.useQuery({ limit: 10000, offset: 0 });
  const allBusinesses = businessesQuery.data || [];

  const filtered = useFuzzySearch(allBusinesses, searchTerm, {
    threshold: 0.4,
    keys: ["name", "address", "phone"],
    includeScore: false,
  });

  const displayBusinesses = searchTerm.length >= 2 ? filtered.slice(0, 10) : [];

  const claimMutation = trpc.owners.claimBusiness.useMutation({
    onSuccess: (data) => {
      setSuccess(data.message);
      setError("");
    },
    onError: (err) => { setError(err.message); setSuccess(""); },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2"><Search className="h-5 w-5" /> Pronađi svoju djelatnost</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {success ? (
          <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" /> {success}
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              Dobit ćete potvrdu na <strong>{formData.email}</strong>. Za pitanja: kondor1413@gmail.com
            </p>
            <Button variant="outline" size="sm" onClick={onSuccess}>Idi na prijavu</Button>
          </div>
        ) : (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Upišite naziv djelatnosti..." className="pl-10" value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setSelectedBusiness(null); }} />
            </div>

            {displayBusinesses.length > 0 && !selectedBusiness && (
              <div className="max-h-48 overflow-y-auto border rounded-lg divide-y">
                {displayBusinesses.map(b => (
                  <button key={b.id} className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors" onClick={() => setSelectedBusiness(b)}>
                    <span className="font-medium">{b.name}</span>
                    {b.address && <span className="text-muted-foreground ml-2 text-xs">— {b.address}</span>}
                  </button>
                ))}
              </div>
            )}

            {selectedBusiness && (
              <>
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <p className="font-bold text-sm">{selectedBusiness.name}</p>
                  {selectedBusiness.address && <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {selectedBusiness.address}</p>}
                  {selectedBusiness.phone && <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedBusiness.phone}</p>}
                  <Button variant="ghost" size="sm" className="text-xs h-6 mt-1" onClick={() => setSelectedBusiness(null)}>Promijeni</Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Vaše ime i prezime *</label>
                    <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Ivan Horvat" required />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Email *</label>
                    <Input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="vas@email.com" required />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Lozinka * (min 6 znakova)</label>
                    <Input type="password" value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} placeholder="••••••" required />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Telefon (opcionalno)</label>
                    <Input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="+385 91 123 4567" />
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {error}</p>}

                <Button className="w-full" disabled={claimMutation.isPending || !formData.email || !formData.password || !formData.name}
                  onClick={() => claimMutation.mutate({ businessId: selectedBusiness.id, ...formData })}>
                  {claimMutation.isPending ? "Slanje..." : "Preuzmi djelatnost"}
                </Button>

                <p className="text-xs text-muted-foreground">
                  Nakon zahtjeva, potvrditi ćemo Vašu djelatnost putem emaila. To obično traje do 24 sata.
                </p>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function OwnerDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const dashboardQuery = trpc.owners.getDashboard.useQuery({ token });
  const updateMutation = trpc.owners.updateBusiness.useMutation({
    onSuccess: () => { setSaved(true); setEditing(false); dashboardQuery.refetch(); setTimeout(() => setSaved(false), 3000); },
  });

  const data = dashboardQuery.data;
  const business = data?.business;
  const category = data?.category;

  if (dashboardQuery.isLoading) return <div className="min-h-screen flex items-center justify-center"><p>Učitavanje...</p></div>;
  if (!business) return <div className="min-h-screen flex items-center justify-center"><p>Greška pri učitavanju</p></div>;

  let hours: string[] = [];
  try { if (business.openingHours) { const p = JSON.parse(business.openingHours); if (Array.isArray(p)) hours = p; } } catch {}

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Store className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="font-bold truncate">Moja djelatnost</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm text-muted-foreground hidden sm:inline">{data?.owner.name}</span>
            <Button variant="ghost" size="sm" onClick={onLogout}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {saved && (
          <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3 flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
            <CheckCircle className="h-4 w-4" /> Promjene su spremljene!
          </div>
        )}

        {/* Business Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-xl">{business.name}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.open(`/preview/${business.id}`, "_blank")}>
                  <Globe className="h-4 w-4 mr-1" /> Preview
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setEditing(!editing); if (!editing) { setEditData({ description: business.description || "", phone: business.phone || "", email: business.email || "", address: business.address || "", openingHours: business.openingHours || "", website: business.website || "" }); } }}>
                  <Edit2 className="h-4 w-4 mr-1" /> {editing ? "Odustani" : "Uredi"}
                </Button>
              </div>
            </div>
            {category && <p className="text-sm text-primary">{category.name}</p>}
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Opis</label>
                  <textarea className="w-full border rounded p-2 text-sm min-h-[80px] bg-background" value={editData.description} onChange={e => setEditData(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><label className="text-xs text-muted-foreground">Telefon</label><Input value={editData.phone} onChange={e => setEditData(p => ({ ...p, phone: e.target.value }))} /></div>
                  <div><label className="text-xs text-muted-foreground">Email</label><Input value={editData.email} onChange={e => setEditData(p => ({ ...p, email: e.target.value }))} /></div>
                  <div><label className="text-xs text-muted-foreground">Adresa</label><Input value={editData.address} onChange={e => setEditData(p => ({ ...p, address: e.target.value }))} /></div>
                  <div><label className="text-xs text-muted-foreground">Web stranica</label><Input value={editData.website} onChange={e => setEditData(p => ({ ...p, website: e.target.value }))} /></div>
                </div>
                <Button onClick={() => updateMutation.mutate({ token, ...editData })} disabled={updateMutation.isPending}>
                  <Save className="h-4 w-4 mr-1" /> {updateMutation.isPending ? "Spremanje..." : "Spremi promjene"}
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 text-sm">
                  {business.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-green-600" /> {business.phone}</p>}
                  {business.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-600" /> {business.email}</p>}
                  {business.address && <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {business.address}</p>}
                  {business.website && <p className="flex items-center gap-2"><Globe className="h-4 w-4" /> <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{business.website}</a></p>}
                  {business.rating && <p className="flex items-center gap-2"><Star className="h-4 w-4 text-yellow-500" /> {business.rating} ({business.reviewCount || 0} recenzija)</p>}
                </div>
                {hours.length > 0 && (
                  <div className="space-y-1 text-sm">
                    <p className="font-medium flex items-center gap-1"><Clock className="h-4 w-4" /> Radno vrijeme:</p>
                    {hours.map((h, i) => <p key={i} className="text-muted-foreground text-xs">{h}</p>)}
                  </div>
                )}
                {business.description && <p className="text-sm text-muted-foreground col-span-full">{business.description}</p>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Links */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-5 space-y-3">
              <h3 className="font-bold flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> Vaša stranica</h3>
              <p className="text-sm text-muted-foreground">Pogledajte kako Vaša djelatnost izgleda na Majstori Split:</p>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={getBusinessPath(business)}>Profil na imeniku</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.open(`/preview/${business.id}`, "_blank")}>
                  Mini-site preview
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/30">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-bold flex items-center gap-2"><Bot className="h-5 w-5 text-purple-600" /> AI Glasovni Agent</h3>
              <p className="text-sm text-muted-foreground">
                Automatski agent koji odgovara na pozive, rezervira termine i pruža informacije na hrvatskom jeziku — 24/7.
              </p>
              {data?.voiceAgent ? (
                <div className="bg-green-50 dark:bg-green-950 rounded p-2 text-xs">
                  <p className="font-medium text-green-800 dark:text-green-200">Status: {data.voiceAgent.status}</p>
                  <p className="text-green-700 dark:text-green-300">Iskorišteno: {data.voiceAgent.usedMinutes}/{data.voiceAgent.monthlyMinutes} min</p>
                </div>
              ) : (
                <Button asChild size="sm">
                  <a href="mailto:kondor1413@gmail.com?subject=AI%20glasovni%20agent%20za%20moju%20djelatnost">
                    <Headphones className="h-4 w-4 mr-1" /> Zatraži ponudu
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact info */}
        <Card>
          <CardContent className="p-5 text-center space-y-2">
            <p className="text-sm text-muted-foreground">Trebate pomoć ili imate pitanja?</p>
            <a href="mailto:kondor1413@gmail.com" className="text-primary font-medium hover:underline">kondor1413@gmail.com</a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
