import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import type { TRPCClientErrorLike } from "@trpc/client";

export default function BusinessRegistration() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    address: "",
    website: "",
    description: "",
  });

  const { data: categories } = trpc.services.getAllCategories.useQuery();
  const registerMutation = trpc.businesses.registerBusiness.useMutation({
    onSuccess: () => {
      toast.success("Hvala! Vaša prijava je primljena. Kontaktirat ćemo vas uskoro.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "",
        address: "",
        website: "",
        description: "",
      });
    },
    onError: (error: TRPCClientErrorLike<any>) => {
      toast.error("Greška pri slanju forme. Pokušajte ponovno.");
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.category) {
      toast.error("Molimo popunite sva obavezna polja");
      return;
    }

    registerMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-8 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Nazad na početnu
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white">
              <CardTitle className="text-3xl">Registrirajte svoj obrt</CardTitle>
              <CardDescription className="text-white/90">
                Postanite dio Majstori Split i dosegnite nove klijente u vašem gradu
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Naziv obrta */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Naziv obrta *
                  </label>
                  <Input
                    placeholder="npr. Vulkanizer Brzi"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="h-12"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="vasa@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-12"
                  />
                </div>

                {/* Telefon */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Telefon *
                  </label>
                  <Input
                    type="tel"
                    placeholder="+385 1 234 5678"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="h-12"
                  />
                </div>

                {/* Kategorija */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Kategorija usluge *
                  </label>
                  <Select value={formData.category} onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Odaberite kategoriju" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Adresa */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Adresa
                  </label>
                  <Input
                    placeholder="npr. Vukovarska 12, Split"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="h-12"
                  />
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Web stranica
                  </label>
                  <Input
                    type="url"
                    placeholder="https://www.primjer.com"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    className="h-12"
                  />
                </div>

                {/* Opis */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Opis usluge
                  </label>
                  <Textarea
                    placeholder="Opišite vašu uslugu i specijalizaciju..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="min-h-[120px] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-lg font-bold uppercase tracking-wide bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Slanje..." : "Registriraj obrt"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  * Obavezna polja. Nakon slanja forme, naš tim će pregledati vašu prijavu i kontaktirati vas.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">Zašto se registrirati?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>✅ Besplatna vidljivost na Google Maps i našoj stranici</p>
              <p>✅ Direktan pristup novim klijentima iz Splita i okolice</p>
              <p>✅ Mogućnost upravljanja vašim profilom</p>
              <p>✅ Povećana kredibilnost i povjerenje klijenata</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
