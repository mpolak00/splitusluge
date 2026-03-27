import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
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
          <h1 className="text-2xl md:text-3xl font-bold">Uvjeti korištenja</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 md:py-24 px-4">
        <div className="container mx-auto max-w-3xl space-y-8">
          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-muted-foreground text-lg">
              Dobrodošli na Majstori Split. Ovi uvjeti korištenja reguliraju vašu upotrebu naše platforme. Korištenjem ove web stranice, prihvaćate sve uvjete navedene u nastavku.
            </p>
          </section>

          {/* Terms Sections */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">1. Korištenje Platforme</h2>
            <p className="text-muted-foreground">
              Majstori Split je besplatna platforma za pronalaženje lokalnih usluga u Splitu i okolici. Korisnici mogu pregledavati biznise, čitati recenzije i kontaktirati pružatelje usluga.
            </p>
            <p className="text-muted-foreground">
              Korisnici se slažu da će koristiti platformu samo za legalne svrhe i na način koji ne narušava prava drugih korisnika.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">2. Registracija Biznisa</h2>
            <p className="text-muted-foreground">
              Obrtnike koji žele biti navedeni na platformi trebaju registrirati se putem obrasca za registraciju. Sve informacije trebaju biti točne i ažurirane.
            </p>
            <p className="text-muted-foreground">
              Zadržavamo pravo da odbijemo registraciju ili uklonimo biznis koji ne ispunjava naše standarde kvalitete.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">3. Recenzije i Komentari</h2>
            <p className="text-muted-foreground">
              Korisnici mogu ostavljati recenzije i komentare o bizniima. Sve recenzije trebaju biti iskrene i temeljene na stvarnom iskustvu.
            </p>
            <p className="text-muted-foreground">
              Zadržavamo pravo da uklonimo recenzije koje su lažne, uvredljive ili neprikladno napisane.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">4. Odgovornost</h2>
            <p className="text-muted-foreground">
              Majstori Split nije odgovorna za kvalitetu usluga pruženih od strane registriranih biznisa. Korisnici koriste usluge na vlastitu odgovornost.
            </p>
            <p className="text-muted-foreground">
              Svi podaci na platformi se pružaju "kako su" bez ikakvih jamstava. Nismo odgovorni za bilo kakve štete ili gubitke koji mogu nastati korištenjem platforme.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">5. Zaštita Podataka</h2>
            <p className="text-muted-foreground">
              Vaši osobni podaci se čuvaju sigurno i koriste se samo za potrebe platforme. Nećemo dijeliti vaše podatke s trećim stranama bez vašeg pristanka.
            </p>
            <p className="text-muted-foreground">
              Više informacija o zaštiti podataka dostupno je u našoj Politici privatnosti.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">6. Zabrana Aktivnosti</h2>
            <p className="text-muted-foreground">
              Zabranjeno je:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Postavljanje lažnih ili uvredljivih sadržaja</li>
              <li>Spam ili harasiranje drugih korisnika</li>
              <li>Pokušaj hakovanja ili neovlaštenog pristupa platformi</li>
              <li>Kopiranje ili reprodukcija sadržaja bez dozvole</li>
              <li>Korištenje platforme za ilegalne aktivnosti</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">7. Izmjene Uvjeta</h2>
            <p className="text-muted-foreground">
              Zadržavamo pravo da izmijenjemo ove uvjete korištenja u bilo kojem trenutku. Korisnici će biti obaviješteni o značajnim izmjenama.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">8. Kontakt</h2>
            <p className="text-muted-foreground">
              Ako imate pitanja o ovim uvjetima, molimo kontaktirajte nas putem email obrasca na platformi.
            </p>
          </section>

          <section className="bg-muted p-6 rounded-lg space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Zadnja ažuriranja:</strong> 29. siječnja 2026.
            </p>
            <p className="text-sm text-muted-foreground">
              Korištenjem ove platforme, potvrđujete da ste pročitali i prihvatili sve uvjete navedene gore.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
