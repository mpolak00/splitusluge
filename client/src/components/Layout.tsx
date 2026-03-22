
import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { services } from "@/lib/data";
import { Menu, X, Search, MapPin, Plus, Info, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
           <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xl">S</span>
           </div>
           <span className="font-display font-bold text-xl tracking-tight uppercase">Split Usluge</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
             <div className="flex flex-col h-full bg-sidebar">
                <div className="p-6 border-b border-sidebar-border">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                        <span className="text-primary-foreground font-display font-bold text-xl">S</span>
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight uppercase">Split Usluge</span>
                  </Link>
                </div>
                <nav className="flex-1 overflow-y-auto py-4">
                  <ul className="space-y-1 px-2">
                    {services.map((service) => (
                      <li key={service.id}>
                        <Link href={`/usluga/${service.slug}`}>
                          <div className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                            location === `/usluga/${service.slug}` 
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                          }`}>
                            <service.icon className="h-5 w-5 opacity-70" />
                            <span>{service.title}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="p-4 border-t border-sidebar-border mt-auto space-y-2">
                  <Link href="/mapa">
                    <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                      <MapPin className="h-4 w-4" />
                      Mapa
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                    <Plus className="h-4 w-4" />
                    Postavi novu uslugu
                  </Button>
                  <Link href="/o-nama">
                    <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                      <Info className="h-4 w-4" />
                      O nama
                    </Button>
                  </Link>
                  <Link href="/uvjeti">
                    <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                      <FileText className="h-4 w-4" />
                      Uvjeti
                    </Button>
                  </Link>
                </div>
             </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-sidebar border-r border-sidebar-border h-screen sticky top-0 overflow-y-auto">
        <div className="p-6 border-b border-sidebar-border sticky top-0 bg-sidebar z-10">
          <Link href="/" className="flex items-center gap-2 group">
             <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-primary-foreground font-display font-bold text-2xl">S</span>
             </div>
             <div className="flex flex-col">
                <span className="font-display font-bold text-xl tracking-tight uppercase leading-none">Split</span>
                <span className="font-display font-bold text-xl tracking-tight uppercase text-primary leading-none">Usluge</span>
             </div>
          </Link>
        </div>
        
        <div className="p-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Pretraži usluge..." className="pl-9 bg-sidebar-accent/50 border-sidebar-border focus:bg-background" />
           </div>
        </div>

        <nav className="flex-1 px-2 pb-6">
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kategorije</div>
          <ul className="space-y-1">
            {services.map((service) => (
              <li key={service.id}>
                <Link href={`/usluga/${service.slug}`}>
                  <div className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all group ${
                    location === `/usluga/${service.slug}` 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:translate-x-1"
                  }`}>
                    <service.icon className={`h-4 w-4 transition-colors ${
                       location === `/usluga/${service.slug}` ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    }`} />
                    <span>{service.title}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Opcije</div>
          <Link href="/mapa">
            <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
              <MapPin className="h-4 w-4" />
              Mapa
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Postavi novu uslugu
          </Button>
          <Link href="/o-nama">
            <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
              <Info className="h-4 w-4" />
              O nama
            </Button>
          </Link>
          <Link href="/uvjeti">
            <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
              <FileText className="h-4 w-4" />
              Uvjeti
            </Button>
          </Link>
        </div>
        
        <div className="p-4 border-t border-sidebar-border mt-auto">
           <div className="bg-sidebar-accent/50 rounded-lg p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                 <MapPin className="h-4 w-4 text-primary" />
                 <span>Lokalno u Splitu</span>
              </div>
              <p className="text-xs text-muted-foreground">Pronađite najbolje lokalne stručnjake u vašem kvartu.</p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {children}
        <footer className="bg-muted/30 border-t border-border py-12 px-6 mt-auto">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Split Usluge. Sva prava zadržana.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
