import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function About() {
  const [, navigate] = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="bg-primary text-primary-foreground py-4 px-4 md:px-6">
        <div className="container mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">O nama</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 md:py-24 px-4">
        <div className="container mx-auto max-w-3xl space-y-12">
          {/* Mission Section */}
          <section className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Naša Misija
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Split Usluge je digitalni puls grada pod Marjanom. Naša misija je povezati sugrađane s najboljim lokalnim obrtnicima i stručnjacima, čuvajući tradiciju kvalitete i povjerenja koja je obilježila Split kroz povijest.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Vjerujemo da je pronalaženje pouzdane usluge trebalo biti jednostavno. Zato smo kreirali prostor gdje su svi obrci dostupni na jednom mjestu - od vulkanizera do vodoinstalatera, od frizerskih salona do automehaničara.
            </p>
          </section>

          {/* Vision Section */}
          <section className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Naša Vizija
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Želimo biti najveća i najpouzdanija platforma za pronalaženje lokalnih usluga u Splitu i okolici. Naš cilj je da svakom sugrađaninu olakšamo pronalaženje točno one usluge koju trebaju, točno kada je trebaju.
            </p>
          </section>

          {/* Coverage Section */}
          <section className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Pokrivanje
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Pokrivamo sve dijelove Splita - od Gripa do Spinuta, od Varoša do Mertojake i Žnjana. Proširujemo se i na okolne gradove kao što su Solin, Kastela, Omis i Dugopolje.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Trenutno imamo više od 1,900 registriranih biznisa u našoj bazi podataka, i taj broj se svakodnevno povećava.
            </p>
          </section>

          {/* Values Section */}
          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Naše Vrijednosti
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-xl font-bold mb-2 text-primary">Transparentnost</h3>
                <p className="text-muted-foreground">
                  Sve informacije o bizniima su dostupne i provjeravane. Nema skrivenih podataka.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-xl font-bold mb-2 text-primary">Pouzdanost</h3>
                <p className="text-muted-foreground">
                  Radimo samo sa obrtnicima koji su provjereni i imaju pozitivne recenzije.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-xl font-bold mb-2 text-primary">Dostupnost</h3>
                <p className="text-muted-foreground">
                  Naša platforma je dostupna 24/7 na svim uređajima - mobilnim, tabletima i računalima.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-xl font-bold mb-2 text-primary">Lokalnost</h3>
                <p className="text-muted-foreground">
                  Podržavamo lokalne obrtnike i male biznise koji čine srce naše zajednice.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-primary text-primary-foreground p-8 rounded-lg text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Imate obrt ili uslugu u Splitu?
            </h2>
            <p className="text-lg opacity-90">
              Pridružite se našoj mreži i dođite do novih klijenata
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/registracija")}
            >
              Besplatna Registracija
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}
