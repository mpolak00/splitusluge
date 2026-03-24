import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X, Megaphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "promo-banner-dismissed";

export function PromoBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="relative overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-2xl dark:border-orange-900/40 dark:bg-slate-900">
        {/* Orange accent top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-orange-400 to-orange-600" />

        <button
          onClick={dismiss}
          aria-label="Zatvori"
          className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
              <Megaphone className="h-4 w-4 text-orange-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
              Za vlasnike biznisa
            </span>
          </div>

          <h3 className="text-base font-bold leading-snug text-foreground">
            Istaknite vaš biznis u Split Usluge imeniku
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            Prioritetni prikaz, bolja pozicija u kategoriji i više poziva od lokalnih kupaca.
          </p>

          <div className="mt-4 flex gap-2">
            <Button asChild size="sm" className="flex-1 bg-orange-500 text-white hover:bg-orange-600">
              <Link href="/promoviranje" onClick={dismiss}>
                Saznaj više
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button size="sm" variant="ghost" onClick={dismiss} className="text-muted-foreground">
              Zatvori
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
