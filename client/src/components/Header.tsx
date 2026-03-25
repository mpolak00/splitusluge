import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Map, Plus, Info, Megaphone, List, Package, Globe } from "lucide-react";
import { ALL_BUSINESSES_PATH } from "@shared/paths";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: ALL_BUSINESSES_PATH, label: "Kategorije", icon: List },
  { href: "/mapa", label: "Mapa", icon: Map },
  { href: "/paketi", label: "Web paketi", icon: Package },
  { href: "/en", label: "EN", icon: Globe },
  { href: "/o-nama", label: "O nama", icon: Info },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950 text-white">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-sm font-black">
            SU
          </div>
          <span className="text-base font-bold tracking-tight">Split Usluge</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href}>
              <button
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  location === link.href
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            </Link>
          ))}
          <Button asChild size="sm" className="ml-2 bg-orange-500 text-white hover:bg-orange-600">
            <Link href="/promoviranje">
              <Megaphone className="mr-1.5 h-3.5 w-3.5" />
              Promoviraj se
            </Link>
          </Button>
        </nav>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="rounded-lg p-2 text-white/80 hover:bg-white/10 md:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-slate-950 text-white border-white/10">
            <SheetHeader>
              <SheetTitle className="text-white">Meni</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-1">
              {NAV_LINKS.map(link => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href}>
                    <button
                      onClick={() => setOpen(false)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                        location === link.href
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </button>
                  </Link>
                );
              })}
              <div className="pt-3">
                <Button asChild className="w-full bg-orange-500 text-white hover:bg-orange-600">
                  <Link href="/promoviranje" onClick={() => setOpen(false)}>
                    <Megaphone className="mr-2 h-4 w-4" />
                    Promoviraj se
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
