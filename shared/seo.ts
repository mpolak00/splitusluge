import { ALL_BUSINESSES_PATH, LEGACY_ALL_BUSINESSES_PATH } from "./paths.js";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type SeoPayload = {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: "website" | "article";
  twitterTitle: string;
  twitterDescription: string;
  robots: string;
  locale: string;
  siteName: string;
  structuredData: Array<Record<string, unknown>>;
};

export type CategoryPageCopy = {
  title: string;
  intro: string;
  keywords: string[];
  faq: FaqItem[];
};

export type SitemapEntry = {
  path: string;
  changefreq?: string;
  priority?: string;
  lastmod?: string;
};

type SeoBuilderInput = {
  title: string;
  description: string;
  keywords: string[];
  pathname: string;
  siteUrl?: string;
  ogType?: "website" | "article";
  robots?: string;
  structuredData?: Array<Record<string, unknown>>;
  ogImagePath?: string;
};

export const DEFAULT_SITE_URL = "https://splitmajstori.com";
export const DEFAULT_SITE_NAME = "Majstori Split";
export const DEFAULT_OG_IMAGE = "/images/hero-split.jpg";

export const SERVICE_AREAS = [
  "Split",
  "Solin",
  "Kaštela",
  "Trogir",
  "Omiš",
  "Podstrana",
];

const CATEGORY_ALIASES: Record<string, string> = {
  ciscenje: "servisi-za-ciscenje",
  prijevoz: "prijevoz-i-selidbe",
  stomatolog: "stomatolozi",
  "apartmani-ciscenje": "ciscenje-apartmana",
  brodovi: "pranje-brodova",
  taxi: "taxi-i-transfer",
  transfer: "taxi-i-transfer",
  plovila: "iznajmljivanje-plovila",
  charter: "iznajmljivanje-plovila",
  bazeni: "bazeni-i-odrzavanje",
  pool: "bazeni-i-odrzavanje",
  foto: "fotografija",
  fotograf: "fotografija",
  vodic: "turisticki-vodici",
  guide: "turisticki-vodici",
  tepih: "pranje-tepiha",
  security: "sigurnosni-sustavi",
  web: "web-dizajn",
};

const CATEGORY_CONTENT: Record<string, CategoryPageCopy> = {
  automehanicari: {
    title: "Automehanicari",
    intro: "Pronadite automehanicare u Splitu i okolici za servis, dijagnostiku, pripremu za tehnicki pregled i hitne kvarove.",
    keywords: ["automehanicar split", "auto servis split", "servis auta split", "dijagnostika vozila split"],
    faq: [
      { question: "Kako odabrati automehanicara u Splitu?", answer: "Usporedite ocjene, broj recenzija, lokaciju i ponudu usluga prije nego sto nazovete servis." },
      { question: "Mogu li pronaci servis blizu sebe?", answer: "Da. Popis i karta pomazu da brzo izdvojite najblizu opciju u Splitu i okolici." },
    ],
  },
  "servisi-za-ciscenje": {
    title: "Servisi za ciscenje",
    intro: "Usporedite servise za ciscenje stanova, apartmana, ureda i poslovnih prostora u Splitu i okolici.",
    keywords: ["ciscenje split", "servis za ciscenje split", "ciscenje apartmana split", "dubinsko ciscenje split"],
    faq: [
      { question: "Jesu li dostupni servisi za apartmane?", answer: "Da. Mnogi servisi rade ciscenje apartmana, stanova i poslovnih prostora." },
      { question: "Kako naci servis za hitno ciscenje?", answer: "Najbrze je otvoriti kategoriju, provjeriti telefon i kontaktirati nekoliko opcija." },
    ],
  },
  elektricari: {
    title: "Elektricari",
    intro: "Popis elektricara u Splitu za hitne intervencije, elektroinstalacije, rasvjetu, popravke i adaptacije.",
    keywords: ["elektricar split", "elektroinstalacije split", "majstor za struju split", "hitni elektricar split"],
    faq: [
      { question: "Mogu li pronaci elektricara za hitne intervencije?", answer: "Da. Preporuka je pregledati one s istaknutim telefonom i radnim vremenom." },
      { question: "Rade li i vece adaptacije?", answer: "Da. Mnogi elektricari rade i kompletne instalacije i pripremu za renovacije." },
    ],
  },
  "frizerski-saloni": {
    title: "Frizerski saloni",
    intro: "Pregled frizerskih salona u Splitu za sisanje, bojanje, tretmane i njegu kose.",
    keywords: ["frizer split", "frizerski salon split", "muski frizer split", "zenski frizer split"],
    faq: [
      { question: "Mogu li filtrirati muske i zenske salone?", answer: "Da. Ova kategorija ima dodatni filter za brze izdvajanje salona." },
      { question: "Kako pronaci salon u svom kvartu?", answer: "Pogledajte kartu, adresu i ocjene prije poziva ili dolaska." },
    ],
  },
  hoteli: {
    title: "Hoteli",
    intro: "Pregled hotela u Splitu i okolici s osnovnim informacijama, lokacijom i kontaktima na jednom mjestu.",
    keywords: ["hoteli split", "smjestaj split", "hotel split centar", "hoteli dalmacija"],
    faq: [
      { question: "Jesu li dostupne informacije o lokaciji?", answer: "Da. Svaki unos moze sadrzavati adresu i lokaciju na karti." },
      { question: "Mogu li usporediti vise hotela na jednom mjestu?", answer: "Da. Popis omogucuje brz pregled vise opcija prije rezervacije ili kontakta." },
    ],
  },
  klima: {
    title: "Klima servisi",
    intro: "Pronadite klima servise u Splitu za montazu, punjenje plina, redovni servis i hitne popravke klima uredaja.",
    keywords: ["klima servis split", "montaza klime split", "servis klima uredaja split", "popravak klime split"],
    faq: [
      { question: "Mogu li naci servis za montazu klime?", answer: "Da. Ovdje su objedinjeni izvodaci za montazu, servis i odrzavanje klima uredaja." },
      { question: "Kako odabrati klima servis?", answer: "Provjerite lokaciju, radno vrijeme, broj recenzija i popis usluga." },
    ],
  },
  "prijevoz-i-selidbe": {
    title: "Prijevoz i selidbe",
    intro: "Usporedite lokalne prijevoznike, selidbe i kombi prijevoz u Splitu i okolici.",
    keywords: ["selidbe split", "kombi prijevoz split", "prijevoz stvari split", "odvoz otpada split"],
    faq: [
      { question: "Jesu li ovdje samo selidbe?", answer: "Ne. Mogu se naci i kombi prijevoz, prijevoz robe i slicne usluge." },
      { question: "Kako brzo doci do ponude?", answer: "Najbrze je odabrati nekoliko prijevoznika i javiti im se direktno telefonom." },
    ],
  },
  prozori: {
    title: "Prozori i stolarija",
    intro: "Popis tvrtki za prozore i stolariju u Splitu ukljucuje montazu, servis i zamjenu PVC i ALU stolarije.",
    keywords: ["prozori split", "pvc stolarija split", "alu stolarija split", "zamjena prozora split"],
    faq: [
      { question: "Mogu li naci izvodace za PVC i ALU stolariju?", answer: "Da. Kategorija ukljucuje razlicite vrste prozora, vrata i stolarije." },
      { question: "Jesu li dostupni i servisi postojecih prozora?", answer: "Da. Ovisno o poslovanju, dostupni su i servis, zamjena okova ili popravci." },
    ],
  },
  restorani: {
    title: "Restorani",
    intro: "Pretrazite restorane u Splitu po lokaciji, kontaktu i osnovnim informacijama.",
    keywords: ["restorani split", "gdje jesti split", "konoba split", "restoran split centar"],
    faq: [
      { question: "Mogu li naci restorane po lokaciji?", answer: "Da. Popis ukljucuje adresu i kartu za laksi odabir." },
      { question: "Jesu li dostupni i kontakti restorana?", answer: "Da. Ako su dostupni, vidjet cete telefon i web stranicu." },
    ],
  },
  slikari: {
    title: "Soboslikari i licioci",
    intro: "Pronadite soboslikare u Splitu za bojanje stanova, poslovnih prostora, fasada i adaptacije.",
    keywords: ["soboslikar split", "licilac split", "bojanje stanova split", "farbanje zidova split"],
    faq: [
      { question: "Pokrivaju li i manje i vece radove?", answer: "Da. Ovisno o izvodacu, mogu se naci manji zahvati, adaptacije i fasadni radovi." },
      { question: "Kako odabrati soboslikara?", answer: "Provjerite recenzije, lokaciju i opis usluga prije dogovora." },
    ],
  },
  stolari: {
    title: "Stolari",
    intro: "Usporedite stolare u Splitu za izradu namjestaja po mjeri, kuhinja, ormara i drugih drvenih elemenata.",
    keywords: ["stolar split", "namjestaj po mjeri split", "kuhinje po mjeri split", "drveni namjestaj split"],
    faq: [
      { question: "Jesu li dostupni stolari za namjestaj po mjeri?", answer: "Da. U ovoj kategoriji mozete naci izvodace za kuhinje, ormare i police." },
      { question: "Mogu li naci stolara blizu sebe?", answer: "Da. Adresa, lokacija i kontakti pomazu da brzo izdvojite pravu opciju." },
    ],
  },
  stomatolozi: {
    title: "Stomatoloske ordinacije",
    intro: "Pregled stomatoloskih ordinacija u Splitu za redovne preglede, estetske zahvate, implantate i hitne intervencije.",
    keywords: ["stomatolog split", "zubar split", "dentalna ordinacija split", "implantati split"],
    faq: [
      { question: "Mogu li naci stomatologa prema lokaciji?", answer: "Da. Svaki unos moze sadrzavati adresu i kartu za laksi odabir ordinacije." },
      { question: "Jesu li navedene i estetske dentalne usluge?", answer: "Ovisno o ordinaciji, mogu biti navedeni implantati, protetika i slicne usluge." },
    ],
  },
  vodoinstalateri: {
    title: "Vodoinstalateri",
    intro: "Pronadite vodoinstalatere u Splitu za hitne intervencije, odstopavanje odvoda, zamjenu sanitarija i adaptacije kupaonica.",
    keywords: ["vodoinstalater split", "odstopavanje odvoda split", "hitni vodoinstalater split", "adaptacija kupaonice split"],
    faq: [
      { question: "Mogu li naci vodoinstalatera za hitnu intervenciju?", answer: "Da. Otvorite kategoriju, provjerite telefone i javite se najblizim opcijama." },
      { question: "Jesu li obuhvacene i vece adaptacije?", answer: "Da. Uz manje popravke cesto su dostupni i radovi na zamjeni instalacija i sanitarija." },
    ],
  },
  vrtlari: {
    title: "Vrtlari i odrzavanje okucnice",
    intro: "Popis vrtlara u Splitu za uredenje okucnice, sisanje zivice, navodnjavanje i redovno odrzavanje zelenih povrsina.",
    keywords: ["vrtlar split", "uredenje okucnice split", "odrzavanje vrta split", "navodnjavanje split"],
    faq: [
      { question: "Mogu li naci vrtlara za redovno odrzavanje?", answer: "Da. Ova kategorija ukljucuje i povremene i redovne usluge odrzavanja vrtova i dvorista." },
      { question: "Jesu li dostupne i usluge navodnjavanja?", answer: "Kod pojedinih izvodaca dostupni su i sustavi navodnjavanja i sezonska priprema vrta." },
    ],
  },
  vulkanizeri: {
    title: "Vulkanizeri",
    intro: "Pronadite vulkanizere u Splitu za zamjenu guma, balansiranje, popravak pneumatika i sezonsko skladistenje.",
    keywords: ["vulkanizer split", "zamjena guma split", "balansiranje guma split", "servis guma split"],
    faq: [
      { question: "Kako pronaci vulkanizera blizu sebe?", answer: "Pogledajte lokacije na karti i usporedite telefone servisa prije kontakta." },
      { question: "Jesu li ukljucene i usluge popravka guma?", answer: "Da. U ovoj kategoriji cesto su dostupni i popravci, krpanje i slicne usluge." },
    ],
  },
  zdravstvo: {
    title: "Zdravstvene usluge",
    intro: "Pretrazite zdravstvene usluge u Splitu, od ordinacija do privatnih pruzatelja razlicitih medicinskih usluga.",
    keywords: ["zdravstvo split", "privatna ordinacija split", "medicinske usluge split", "ambulanta split"],
    faq: [
      { question: "Koje vrste usluga mogu naci?", answer: "To ovisi o podacima u bazi, ali kategorija moze ukljucivati razlicite ordinacije i ambulante." },
      { question: "Jesu li dostupni kontakti i adrese?", answer: "Da. Kada su dostupni u bazi, prikazani su telefon, web i lokacija." },
    ],
  },
  zidari: {
    title: "Zidari i gradevinski radovi",
    intro: "Pregled zidara u Splitu za grube radove, adaptacije, zidanje i manje gradevinske zahvate.",
    keywords: ["zidar split", "gradevinski radovi split", "adaptacija stana split", "majstor za zidanje split"],
    faq: [
      { question: "Jesu li dostupni izvodaci za manje i vece radove?", answer: "Da. Ovdje se mogu naci izvodaci za zidanje, adaptacije i slicne gradevinske zahvate." },
      { question: "Kako odabrati zidara za adaptaciju?", answer: "Usporedite ocjene, lokaciju i opis usluga prije trazenja ponude." },
    ],
  },
  "ciscenje-apartmana": {
    title: "Ciscenje apartmana",
    intro: "Profesionalne usluge ciscenja apartmana, kuca za odmor i smjestajnih objekata u Splitu. Idealno za vlasnike koji iznajmljuju turistima.",
    keywords: ["ciscenje apartmana split", "apartment cleaning split", "turnover cleaning split", "ciscenje nakon gostiju split"],
    faq: [
      { question: "Koliko kosta ciscenje apartmana u Splitu?", answer: "Cijene variraju ovisno o velicini apartmana, prosjecno 30-80 EUR po ciscenju." },
      { question: "Nude li servisi ciscenje izmedu gostiju?", answer: "Da. Vecina servisa nudi turnover cleaning - brzo ciscenje izmedu odlaska i dolaska gostiju." },
    ],
  },
  "pranje-brodova": {
    title: "Pranje i ciscenje brodova",
    intro: "Usluge pranja, poliranja i detaljnog ciscenja brodova, jahti i plovila u Splitu i okolici.",
    keywords: ["pranje brodova split", "boat cleaning split", "ciscenje jahti split", "yacht cleaning split", "boat detailing split"],
    faq: [
      { question: "Koje vrste brodova se mogu oprati?", answer: "Servisi nude pranje svih vrsta plovila - od manjih camaca do jahti i jedrilica." },
      { question: "Ukljucuje li usluga i poliranje?", answer: "Da. Vecina servisa nudi kompletnu uslugu ukljucujuci pranje, poliranje i zastitu trupa." },
    ],
  },
  "taxi-i-transfer": {
    title: "Taxi i transfer usluge",
    intro: "Taxi sluzbe, aerodromski transferi i privatni prijevoz za turiste i lokalno stanovnistvo u Splitu.",
    keywords: ["taxi split", "transfer split airport", "airport transfer split", "privatni prijevoz split", "taxi service split"],
    faq: [
      { question: "Koliko kosta transfer do zracne luke?", answer: "Transfer Split centar - zracna luka obicno kosta 30-40 EUR, ovisno o lokaciji polaska." },
      { question: "Mogu li rezervirati transfer unaprijed?", answer: "Da. Vecina prijevoznika omogucuje online ili telefonsku rezervaciju unaprijed." },
    ],
  },
  "iznajmljivanje-plovila": {
    title: "Iznajmljivanje plovila",
    intro: "Najam brodova, jedrilica, glisera i jet ski-eva u Splitu za dnevne izlete i charter.",
    keywords: ["najam broda split", "boat rental split", "charter split", "jet ski split", "rent a boat split"],
    faq: [
      { question: "Trebam li dozvolu za upravljanje brodom?", answer: "Za brodove snage iznad 5 kW potrebna je dozvola. Za manje camce obicno nije." },
      { question: "Mogu li iznajmiti brod sa skipperom?", answer: "Da. Vecina charter kuca nudi opciju s profesionalnim skipperom." },
    ],
  },
  "klima-servis-apartmani": {
    title: "Hitni klima servis za apartmane",
    intro: "Hitne popravke, montaza i servis klima uredaja za apartmane i smjestajne objekte u turistickoj sezoni.",
    keywords: ["hitni klima servis split", "emergency ac repair split", "klima popravka apartman split", "air conditioning split"],
    faq: [
      { question: "Rade li hitni servisi vikendom?", answer: "Da. Vecina hitnih klima servisa radi i vikendom tijekom turisticke sezone." },
      { question: "Koliko brzo mogu doci?", answer: "Hitni servisi obicno dolaze u roku od 2-4 sata, ovisno o lokaciji i dostupnosti." },
    ],
  },
  "pest-control": {
    title: "Dezinsekcija i deratizacija",
    intro: "Usluge dezinsekcije, deratizacije i zastite od stetocina za apartmane, kuce i poslovne prostore u Splitu.",
    keywords: ["dezinsekcija split", "pest control split", "deratizacija split", "zastita od insekata split"],
    faq: [
      { question: "Koje stetocine su najcesce u Splitu?", answer: "Tijekom ljeta najcesci su komarci, mravi i zigavci. Zimi se pojacava problem s misevima." },
      { question: "Je li tretman siguran za djecu i kucne ljubimce?", answer: "Da. Profesionalni servisi koriste ekologicka i sigurna sredstva." },
    ],
  },
  "bazeni-i-odrzavanje": {
    title: "Odrzavanje bazena",
    intro: "Servis, ciscenje i odrzavanje bazena za privatne objekte, apartmane i hotele u Splitu i okolici.",
    keywords: ["odrzavanje bazena split", "pool maintenance split", "ciscenje bazena split", "servis bazena split"],
    faq: [
      { question: "Koliko cesto treba servisirati bazen?", answer: "Tijekom ljetne sezone preporucuje se servis jednom tjedno, a izvan sezone jednom mjesecno." },
      { question: "Sto ukljucuje redovno odrzavanje?", answer: "Ukljucuje kontrolu pH vrijednosti, ciscenje filtera, usisavanje dna i dodavanje kemikalija." },
    ],
  },
  fotografija: {
    title: "Fotografske usluge",
    intro: "Profesionalno fotografiranje nekretnina, apartmana, drone snimanje i turisticka fotografija u Splitu.",
    keywords: ["fotograf split", "photographer split", "drone photography split", "fotografiranje apartmana split", "event photographer split"],
    faq: [
      { question: "Nude li snimanje dronom?", answer: "Da. Mnogi fotografi nude profesionalno drone snimanje za nekretnine i evente." },
      { question: "Koliko kosta fotografiranje apartmana?", answer: "Profesionalno fotografiranje apartmana obicno kosta 100-300 EUR, ovisno o velicini i paketu." },
    ],
  },
  catering: {
    title: "Catering i dostava hrane",
    intro: "Catering usluge za evente, vjencanja, privatne zabave i korporativna okupljanja u Splitu.",
    keywords: ["catering split", "food delivery split", "catering za vjencanja split", "party catering split"],
    faq: [
      { question: "Koji je minimalni broj osoba za catering?", answer: "Ovisi o cateringu, ali vecina radi za grupe od 10+ osoba." },
      { question: "Nude li vegetarijanske opcije?", answer: "Da. Gotovo svi caterings nude vegetarijanske, veganske i posebne dijetne opcije." },
    ],
  },
  "turisticki-vodici": {
    title: "Turisticki vodici",
    intro: "Licencirani turisticki vodici za razgledavanje Splita, Dioklecijanove palace, otoka i okolice.",
    keywords: ["turisticki vodic split", "tour guide split", "split city tour", "guided tour split", "razgledavanje splita"],
    faq: [
      { question: "Jesu li dostupni vodici na engleskom jeziku?", answer: "Da. Vecina vodica govori engleski, a mnogi i talijanski, njemacki ili francuski." },
      { question: "Koje ture su najpopularnije?", answer: "Najpopularnije su tura Dioklecijanove palace, walking tour starog grada i izleti na otoke." },
    ],
  },
  "pranje-tepiha": {
    title: "Pranje tepiha i namjestaja",
    intro: "Dubinsko pranje tepiha, madraca, sofa i namjestaja za apartmane i domove u Splitu.",
    keywords: ["pranje tepiha split", "carpet cleaning split", "dubinsko pranje split", "ciscenje namjestaja split"],
    faq: [
      { question: "Koliko traje pranje tepiha?", answer: "Pranje traje 1-2 sata, a susenje 4-8 sati ovisno o materijalu." },
      { question: "Dolaze li na adresu?", answer: "Da. Vecina servisa nudi mobilnu uslugu na vasoj adresi." },
    ],
  },
  kljucar: {
    title: "Kljucar",
    intro: "Hitne usluge kljucara za otvaranje vrata, izradu kljuceva i zamjenu brava u Splitu.",
    keywords: ["kljucar split", "locksmith split", "otvaranje vrata split", "izrada kljuceva split", "hitni kljucar split"],
    faq: [
      { question: "Rade li kljucari non-stop?", answer: "Da. Vecina kljucara u Splitu nudi hitnu uslugu 0-24, posebno tijekom turisticke sezone." },
      { question: "Koliko kosta otvaranje vrata?", answer: "Cijena ovisi o tipu brave i dobu dana, obicno 50-150 EUR." },
    ],
  },
  "odvoz-otpada": {
    title: "Odvoz otpada i rusenje",
    intro: "Odvoz glomaznog otpada, gradjevinskog suta i rusenje za adaptacije u Splitu i okolici.",
    keywords: ["odvoz otpada split", "waste removal split", "odvoz suta split", "glomazni otpad split"],
    faq: [
      { question: "Sto sve mogu odvesti?", answer: "Servisi obicno odvoze namjestaj, gradjevinski sut, elektricni otpad i glomazni otpad." },
      { question: "Trebam li prijaviti odvoz?", answer: "Za manje kolicine ne, ali za vece kolicine suta potrebna je prijava komunalnom drustvu." },
    ],
  },
  "sigurnosni-sustavi": {
    title: "Sigurnosni sustavi",
    intro: "Ugradnja kamera, alarma i sigurnosnih sustava za apartmane, kuce i poslovne prostore u Splitu.",
    keywords: ["sigurnosni sustavi split", "security cameras split", "alarmi split", "video nadzor split"],
    faq: [
      { question: "Koje sustave je najbolje ugraditi u apartman?", answer: "Za apartmane se najcesce ugraduju pametne brave, kamere i alarmni sustavi s daljinskim pristupom." },
      { question: "Mogu li pratiti kamere preko mobitela?", answer: "Da. Moderni sustavi omogucuju pracenje putem mobilne aplikacije u realnom vremenu." },
    ],
  },
  "web-dizajn": {
    title: "Web dizajn i izrada stranica",
    intro: "Izrada web stranica, web shopova i digitalnog marketinga za lokalne biznise u Splitu.",
    keywords: ["web dizajn split", "izrada web stranica split", "web developer split", "web design split"],
    faq: [
      { question: "Koliko kosta izrada web stranice?", answer: "Jednostavna web stranica kosta od 300-1000 EUR, a web shop od 1000-3000 EUR." },
      { question: "Koliko traje izrada?", answer: "Jednostavna stranica 1-2 tjedna, slozeniji projekti 4-8 tjedana." },
    ],
  },
};

const STATIC_ROUTE_CONTENT: Record<string, { title: string; description: string; keywords: string[] }> = {
  "/": {
    title: "Majstori Split | Lokalni imenik obrta i usluga u Splitu",
    description: "Pronadite provjerene obrte, majstore i lokalne usluge u Splitu, Solinu, Kastelima, Podstrani, Dugopolju i Omisu.",
    keywords: ["split usluge", "obrti split", "lokalne usluge split", "majstori split", "imenik obrta split"],
  },
  "/mapa": {
    title: "Mapa lokalnih usluga u Splitu | Majstori Split",
    description: "Pregledajte lokalne usluge i obrte na karti Splita i okolice i brze pronadite najblizu opciju.",
    keywords: ["mapa usluga split", "lokalne usluge karta", "obrti split mapa"],
  },
  [ALL_BUSINESSES_PATH]: {
    title: "Svi obrti i lokalne usluge u Splitu | Majstori Split",
    description: "Popis svih dostupnih obrta i lokalnih usluga u Splitu i okolici na jednoj stranici.",
    keywords: ["svi obrti split", "sve usluge split", "imenik obrta split"],
  },
  "/registracija": {
    title: "Registracija obrta i poslovanja | Majstori Split",
    description: "Dodajte svoj obrt ili poslovanje u lokalni imenik Majstori Split i povecajte vidljivost u Splitu i okolici.",
    keywords: ["registracija obrta split", "dodaj poslovanje split", "oglasavanje obrta split"],
  },
  "/o-nama": {
    title: "O nama | Majstori Split",
    description: "Saznajte kako Majstori Split pomaze gradanima i turistima da lakse pronadu lokalne usluge u Splitu i okolici.",
    keywords: ["o nama split usluge", "lokalni imenik split"],
  },
  "/uvjeti": {
    title: "Uvjeti koristenja | Majstori Split",
    description: "Uvjeti koristenja i osnovne informacije o pravilima koristenja platforme Majstori Split.",
    keywords: ["uvjeti koristenja split usluge"],
  },
};

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function resolveCategorySlug(slug: string): string {
  return CATEGORY_ALIASES[slug] || slug;
}

function normalizeKnownPath(pathname: string): string {
  if (pathname === LEGACY_ALL_BUSINESSES_PATH) {
    return ALL_BUSINESSES_PATH;
  }

  if (pathname.startsWith("/usluga/")) {
    const slug = pathname.replace("/usluga/", "");
    return `/usluga/${resolveCategorySlug(slug)}`;
  }

  return pathname;
}

function normalizePath(pathname: string): string {
  try {
    const url = pathname.startsWith("http") ? new URL(pathname) : new URL(pathname, DEFAULT_SITE_URL);
    const normalized = url.pathname.replace(/\/+$/, "");
    return normalizeKnownPath(normalized === "" ? "/" : normalized);
  } catch {
    return "/";
  }
}

function getBaseUrl(siteUrl?: string): string {
  return stripTrailingSlash(siteUrl || DEFAULT_SITE_URL);
}

function toTitleCase(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function getFallbackCategorySlugs(): string[] {
  return Object.keys(CATEGORY_CONTENT);
}

export function getCategoryCopy(slug: string, fallbackName?: string | null): CategoryPageCopy {
  const known = CATEGORY_CONTENT[resolveCategorySlug(slug)];
  if (known) {
    return known;
  }

  const name = fallbackName || toTitleCase(slug);
  return {
    title: name,
    intro: `${name} u Splitu i okolici na jednom mjestu. Usporedite lokaciju, kontakt podatke i dostupne informacije prije odabira.`,
    keywords: [`${name.toLowerCase()} split`, `${name.toLowerCase()} split i okolica`, `lokalne usluge ${name.toLowerCase()} split`],
    faq: [
      { question: `Kako odabrati ${name.toLowerCase()} u Splitu?`, answer: "Usporedite lokaciju, kontakte, ocjene i dodatne informacije prije odluke." },
      { question: `Mogu li pronaci ${name.toLowerCase()} blizu sebe?`, answer: "Da. Popis i karta pomazu da brzo izdvojite poslovanja u vasoj blizini." },
    ],
  };
}

function buildBreadcrumbs(pathname: string, categoryTitle?: string, businessTitle?: string): BreadcrumbItem[] {
  const normalized = normalizePath(pathname);

  if (normalized === "/") {
    return [{ name: "Naslovnica", path: "/" }];
  }

  if (normalized.startsWith("/usluga/")) {
    return [
      { name: "Naslovnica", path: "/" },
      { name: "Kategorije", path: ALL_BUSINESSES_PATH },
      { name: categoryTitle || "Usluga", path: normalized },
    ];
  }

  if (normalized.startsWith("/poslovanje/")) {
    return [
      { name: "Naslovnica", path: "/" },
      { name: "Poslovanja", path: ALL_BUSINESSES_PATH },
      { name: businessTitle || "Profil poslovanja", path: normalized },
    ];
  }

  const routeLabel =
    normalized === "/mapa"
      ? "Mapa"
      : normalized === ALL_BUSINESSES_PATH
        ? "Svi obrti"
        : normalized === "/registracija"
          ? "Registracija"
          : normalized === "/o-nama"
            ? "O nama"
            : normalized === "/uvjeti"
              ? "Uvjeti"
              : "Stranica";

  return [
    { name: "Naslovnica", path: "/" },
    { name: routeLabel, path: normalized },
  ];
}

export function buildBreadcrumbSchema(siteUrl: string, breadcrumbs: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function buildBaseStructuredData(siteUrl: string) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: DEFAULT_SITE_NAME,
      url: siteUrl,
      inLanguage: "hr-HR",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: DEFAULT_SITE_NAME,
      url: siteUrl,
      logo: `${siteUrl}${DEFAULT_OG_IMAGE}`,
      areaServed: SERVICE_AREAS,
      sameAs: [],
    },
  ];
}

export function buildSeoPayload({ title, description, keywords, pathname, siteUrl, ogType = "website", robots = "index, follow", structuredData = [], ogImagePath = DEFAULT_OG_IMAGE }: SeoBuilderInput): SeoPayload {
  const baseUrl = getBaseUrl(siteUrl);
  const normalized = normalizePath(pathname);
  const canonicalPath = normalized === "/" ? "" : normalized;
  const canonicalUrl = `${baseUrl}${canonicalPath}`;
  const ogImage = `${baseUrl}${ogImagePath}`;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    canonicalUrl,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogType,
    twitterTitle: title,
    twitterDescription: description,
    robots,
    locale: "hr_HR",
    siteName: DEFAULT_SITE_NAME,
    structuredData: structuredData.length > 0 ? structuredData : buildBaseStructuredData(baseUrl),
  };
}

export function serializeStructuredData(data: Array<Record<string, unknown>>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function getSeoForPath(pathname: string, siteUrl?: string): SeoPayload {
  const baseUrl = getBaseUrl(siteUrl);
  const normalized = normalizePath(pathname);
  const ogImage = `${baseUrl}${DEFAULT_OG_IMAGE}`;

  if (normalized.startsWith("/usluga/")) {
    const slug = normalized.replace("/usluga/", "");
    const category = getCategoryCopy(slug);
    const breadcrumbs = buildBreadcrumbs(normalized, category.title);
    const title = `${category.title} u Splitu | ${DEFAULT_SITE_NAME}`;
    const description = `${category.intro} Pokrivamo podrucje: ${SERVICE_AREAS.join(", ")}.`;

    return {
      title,
      description,
      keywords: [...category.keywords, "split usluge", "lokalne usluge split"].join(", "),
      canonicalUrl: `${baseUrl}${normalized}`,
      ogTitle: title,
      ogDescription: description,
      ogImage,
      ogType: "article",
      twitterTitle: title,
      twitterDescription: description,
      robots: "index, follow",
      locale: "hr_HR",
      siteName: DEFAULT_SITE_NAME,
      structuredData: [
        ...buildBaseStructuredData(baseUrl),
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description,
          url: `${baseUrl}${normalized}`,
          inLanguage: "hr-HR",
          about: category.title,
          areaServed: SERVICE_AREAS,
        },
        buildBreadcrumbSchema(baseUrl, breadcrumbs),
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: category.faq.map(item => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        },
      ],
    };
  }

  if (normalized.startsWith("/poslovanje/")) {
    const parts = normalized.split("/").filter(Boolean);
    const businessSlug = parts[2] || "profil-poslovanja";
    const businessName = toTitleCase(businessSlug);
    const breadcrumbs = buildBreadcrumbs(normalized, undefined, businessName);
    const title = `${businessName} | ${DEFAULT_SITE_NAME}`;
    const description = `${businessName} u Splitu i okolici. Kontakt, lokacija i osnovne informacije o poslovanju dostupne su na Split Uslugama.`;

    return {
      title,
      description,
      keywords: [`${businessName.toLowerCase()} split`, `kontakt ${businessName.toLowerCase()}`, "lokalne usluge split", "split usluge"].join(", "),
      canonicalUrl: `${baseUrl}${normalized}`,
      ogTitle: title,
      ogDescription: description,
      ogImage,
      ogType: "article",
      twitterTitle: title,
      twitterDescription: description,
      robots: "index, follow",
      locale: "hr_HR",
      siteName: DEFAULT_SITE_NAME,
      structuredData: [
        ...buildBaseStructuredData(baseUrl),
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: title,
          description,
          url: `${baseUrl}${normalized}`,
          inLanguage: "hr-HR",
        },
        buildBreadcrumbSchema(baseUrl, breadcrumbs),
      ],
    };
  }

  const routeContent = STATIC_ROUTE_CONTENT[normalized] || STATIC_ROUTE_CONTENT["/"];
  const breadcrumbs = buildBreadcrumbs(normalized);
  const title = routeContent.title;
  const description = routeContent.description;

  return {
    title,
    description,
    keywords: routeContent.keywords.join(", "),
    canonicalUrl: `${baseUrl}${normalized === "/" ? "" : normalized}`,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogType: "website",
    twitterTitle: title,
    twitterDescription: description,
    robots: "index, follow",
    locale: "hr_HR",
    siteName: DEFAULT_SITE_NAME,
    structuredData: [
      ...buildBaseStructuredData(baseUrl),
      {
        "@context": "https://schema.org",
        "@type": normalized === "/" ? "CollectionPage" : "WebPage",
        name: title,
        description,
        url: `${baseUrl}${normalized === "/" ? "" : normalized}`,
        inLanguage: "hr-HR",
        areaServed: SERVICE_AREAS,
      },
      buildBreadcrumbSchema(baseUrl, breadcrumbs),
    ],
  };
}

export function buildRobotsTxt(siteUrl?: string): string {
  const baseUrl = getBaseUrl(siteUrl);
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    "User-agent: Googlebot",
    "Allow: /",
    "",
    "User-agent: Bingbot",
    "Allow: /",
    "",
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ].join("\n");
}

export function buildSitemapXml(categorySlugs: string[], dynamicEntries: SitemapEntry[] = [], siteUrl?: string): string {
  const baseUrl = getBaseUrl(siteUrl);
  const today = new Date().toISOString().slice(0, 10);
  const staticRoutes: SitemapEntry[] = [
    { path: "", changefreq: "weekly", priority: "1.0" },
    { path: "/en", changefreq: "weekly", priority: "0.9" },
    { path: "/mapa", changefreq: "weekly", priority: "0.8" },
    { path: ALL_BUSINESSES_PATH, changefreq: "daily", priority: "0.9" },
    { path: "/registracija", changefreq: "monthly", priority: "0.7" },
    { path: "/o-nama", changefreq: "monthly", priority: "0.6" },
    { path: "/uvjeti", changefreq: "monthly", priority: "0.4" },
  ];

  const resolvedSlugs = Array.from(new Set(categorySlugs.map(resolveCategorySlug)))
    .filter(Boolean)
    .sort();

  const categoryRoutes: SitemapEntry[] = [
    ...resolvedSlugs.map(slug => ({ path: `/usluga/${slug}`, changefreq: "weekly" as const, priority: "0.8" })),
    ...resolvedSlugs.map(slug => ({ path: `/en/${slug}`, changefreq: "weekly" as const, priority: "0.7" })),
  ];

  const urls = [...staticRoutes, ...categoryRoutes, ...dynamicEntries]
    .map(route => [
      "  <url>",
      `    <loc>${baseUrl}${route.path}</loc>`,
      `    <lastmod>${route.lastmod || today}</lastmod>`,
      `    <changefreq>${route.changefreq || "weekly"}</changefreq>`,
      `    <priority>${route.priority || "0.6"}</priority>`,
      "  </url>",
    ].join("\n"))
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}
