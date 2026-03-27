import { useState } from "react";
import { Link } from "wouter";
import { ALL_BUSINESSES_PATH } from "@shared/paths";
import { SERVICE_AREAS } from "@shared/seo";
import { Mail, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  const newsletter = trpc.contacts.submitNewsletter.useMutation({
    onSuccess: () => {
      toast.success("Prijava uspješna! Hvala.");
      setEmail("");
    },
    onError: () => {
      toast.error("Greška pri prijavi. Pokušajte ponovo.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    newsletter.mutate({ email: email.trim() });
  }

  return (
    <footer>
      {/* Newsletter */}
      <div className="border-t border-orange-200 bg-orange-50 dark:border-orange-900/30 dark:bg-orange-950/20">
        <div className="container mx-auto px-4 py-10">
          <div className="mx-auto max-w-xl text-center">
            <h3 className="text-lg font-bold">Budite u toku s novostima</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Prijavite se za obavijesti o novim kategorijama, promotivnim akcijama i lokalnim uslugama.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Vaš email..."
                className="h-11 flex-1"
                required
              />
              <Button
                type="submit"
                className="h-11 bg-orange-500 text-white hover:bg-orange-600"
                disabled={newsletter.isPending}
              >
                <Send className="mr-1.5 h-4 w-4" />
                {newsletter.isPending ? "..." : "Prijavi se"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="border-t border-border bg-slate-950 text-white">
        <div className="container mx-auto px-4 py-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-widest text-white/50">Imenik</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-white/70 hover:text-white">Naslovnica</Link></li>
                <li><Link href={ALL_BUSINESSES_PATH} className="text-white/70 hover:text-white">Sve kategorije</Link></li>
                <li><Link href="/mapa" className="text-white/70 hover:text-white">Mapa</Link></li>
                <li><Link href="/registracija" className="text-white/70 hover:text-white">Registracija</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-widest text-white/50">Za biznise</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/promoviranje" className="text-white/70 hover:text-white">Promoviranje</Link></li>
                <li><Link href="/prijava" className="text-white/70 hover:text-white">Moja djelatnost</Link></li>
                <li><Link href="/paketi" className="text-white/70 hover:text-white">Web paketi</Link></li>
                <li><Link href="/registracija" className="text-white/70 hover:text-white">Dodaj biznis</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-widest text-white/50">Informacije</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/o-nama" className="text-white/70 hover:text-white">O nama</Link></li>
                <li><Link href="/uvjeti" className="text-white/70 hover:text-white">Uvjeti korištenja</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-bold uppercase tracking-widest text-white/50">Kontakt</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:kondor1413@gmail.com" className="flex items-center gap-2 text-white/70 hover:text-white">
                    <Mail className="h-3.5 w-3.5" /> kondor1413@gmail.com
                  </a>
                </li>
                <li>
                  <a href="mailto:kondor1413@gmail.com" className="flex items-center gap-2 text-white/70 hover:text-white">
                    <Phone className="h-3.5 w-3.5" /> Kontaktirajte nas
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
            <p>&copy; {new Date().getFullYear()} Majstori Split. Sva prava pridržana.</p>
            <p className="mt-1">Pokrivamo: {SERVICE_AREAS.join(", ")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
