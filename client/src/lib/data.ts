
import { Wrench, Car, Droplets, Zap, Sparkles, Hammer, Truck, Scissors, Stethoscope, Home, Anchor, Ship, Thermometer, Bug, Waves, Camera, UtensilsCrossed, Compass, Wind, Key, Trash2, Shield, Globe } from "lucide-react";

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  image: string;
  slug: string;
  keywords: string[];
}

export const services: ServiceCategory[] = [
  {
    id: "vulkanizer",
    title: "Vulkanizeri",
    description: "Zamjena guma, balansiranje i popravak pneumatika za sva vozila.",
    icon: Wrench,
    image: "/images/service-mechanic.jpg",
    slug: "vulkanizer-split",
    keywords: ["vulkanizer split", "zamjena guma split", "prodaja guma split", "balansiranje guma split"]
  },
  {
    id: "automehanicar",
    title: "Automehaničari",
    description: "Kompletna dijagnostika i servis za sve marke automobila.",
    icon: Car,
    image: "/images/service-mechanic.jpg",
    slug: "automehanicar-split",
    keywords: ["automehaničar split", "servis automobila split", "popravak auta split", "izmjena ulja split"]
  },
  {
    id: "vodoinstalater",
    title: "Vodoinstalateri",
    description: "Hitne intervencije, odštopavanje odvoda i instalacija sanitarija.",
    icon: Droplets,
    image: "/images/service-plumber.jpg",
    slug: "vodoinstalater-split",
    keywords: ["vodoinstalater split", "odštopavanje odvoda split", "hitne intervencije voda split", "adaptacija kupaonice split"]
  },
  {
    id: "elektricar",
    title: "Električari",
    description: "Popravak instalacija, montaža rasvjete i hitne intervencije.",
    icon: Zap,
    image: "/images/service-electrician.jpg",
    slug: "elektricar-split",
    keywords: ["električar split", "elektroinstalacije split", "popravak struje split", "montaža rasvjete split"]
  },
  {
    id: "ciscenje",
    title: "Servisi za Čišćenje",
    description: "Profesionalno čišćenje stanova, ureda i apartmana.",
    icon: Sparkles,
    image: "/images/service-cleaning.jpg",
    slug: "servis-za-ciscenje-split",
    keywords: ["čišćenje stanova split", "čišćenje apartmana split", "servis za čišćenje split", "dubinsko čišćenje split"]
  },
  {
    id: "stolar",
    title: "Stolari",
    description: "Izrada namještaja po mjeri, kuhinje i popravci drvenarije.",
    icon: Hammer,
    image: "/images/hero-split.jpg",
    slug: "stolar-split",
    keywords: ["stolar split", "namještaj po mjeri split", "kuhinje po mjeri split", "popravak namještaja split"]
  },
  {
    id: "prijevoz",
    title: "Prijevoz i Selidbe",
    description: "Kombi prijevoz, selidbe stanova i ureda te odvoz glomaznog otpada.",
    icon: Truck,
    image: "/images/hero-split.jpg",
    slug: "prijevoz-selidbe-split",
    keywords: ["selidbe split", "kombi prijevoz split", "odvoz otpada split", "taksi prijevoz split"]
  },
  {
    id: "frizerski",
    title: "Frizerski Saloni",
    description: "Muško i žensko šišanje, bojanje i njega kose.",
    icon: Scissors,
    image: "/images/hero-split.jpg",
    slug: "frizerski-salon-split",
    keywords: ["frizer split", "frizerski salon split", "šišanje split", "bojanje kose split"]
  },
  {
    id: "stomatolog",
    title: "Stomatolozi",
    description: "Kompletna dentalna njega, popravci zubi i estetska stomatologija.",
    icon: Stethoscope,
    image: "/images/hero-split.jpg",
    slug: "stomatolog-split",
    keywords: ["zubar split", "stomatolog split", "popravak zuba split", "zubni implantati split"]
  },
  // Tourist season categories
  {
    id: "ciscenje-apartmana",
    title: "Čišćenje apartmana",
    description: "Profesionalno čišćenje apartmana i smještajnih objekata za turističku sezonu.",
    icon: Home,
    image: "/images/hero-split.jpg",
    slug: "ciscenje-apartmana",
    keywords: ["čišćenje apartmana split", "apartment cleaning split", "turnover cleaning split"]
  },
  {
    id: "pranje-brodova",
    title: "Pranje brodova",
    description: "Pranje, poliranje i detaljno čišćenje brodova i jahti.",
    icon: Anchor,
    image: "/images/hero-split.jpg",
    slug: "pranje-brodova",
    keywords: ["pranje brodova split", "boat cleaning split", "yacht cleaning split"]
  },
  {
    id: "taxi-transfer",
    title: "Taxi i transfer",
    description: "Taxi službe, aerodromski transferi i privatni prijevoz.",
    icon: Car,
    image: "/images/hero-split.jpg",
    slug: "taxi-i-transfer",
    keywords: ["taxi split", "airport transfer split", "privatni prijevoz split"]
  },
  {
    id: "iznajmljivanje-plovila",
    title: "Iznajmljivanje plovila",
    description: "Najam brodova, jedrilica, glisera i jet ski-eva.",
    icon: Ship,
    image: "/images/hero-split.jpg",
    slug: "iznajmljivanje-plovila",
    keywords: ["rent a boat split", "charter split", "najam broda split"]
  },
  {
    id: "klima-apartmani",
    title: "Hitni klima servis",
    description: "Hitne popravke klima uređaja u apartmanima tijekom sezone.",
    icon: Thermometer,
    image: "/images/hero-split.jpg",
    slug: "klima-servis-apartmani",
    keywords: ["hitni klima servis split", "ac repair split", "klima popravka split"]
  },
  {
    id: "pest-control",
    title: "Dezinsekcija",
    description: "Dezinsekcija, deratizacija i zaštita od štetočina.",
    icon: Bug,
    image: "/images/hero-split.jpg",
    slug: "pest-control",
    keywords: ["dezinsekcija split", "pest control split", "deratizacija split"]
  },
  {
    id: "bazeni",
    title: "Održavanje bazena",
    description: "Servis, čišćenje i održavanje privatnih i hotelskih bazena.",
    icon: Waves,
    image: "/images/hero-split.jpg",
    slug: "bazeni-i-odrzavanje",
    keywords: ["održavanje bazena split", "pool maintenance split", "čišćenje bazena split"]
  },
  {
    id: "fotografija",
    title: "Fotografske usluge",
    description: "Profesionalno fotografiranje nekretnina, drone snimanje i event fotografija.",
    icon: Camera,
    image: "/images/hero-split.jpg",
    slug: "fotografija",
    keywords: ["fotograf split", "photographer split", "drone photography split"]
  },
  {
    id: "catering",
    title: "Catering",
    description: "Catering za evente, vjenčanja i privatne zabave.",
    icon: UtensilsCrossed,
    image: "/images/hero-split.jpg",
    slug: "catering",
    keywords: ["catering split", "food delivery split", "catering za vjenčanja split"]
  },
  {
    id: "turisticki-vodici",
    title: "Turistički vodiči",
    description: "Licencirani turistički vodiči za razgledavanje Splita i okolice.",
    icon: Compass,
    image: "/images/hero-split.jpg",
    slug: "turisticki-vodici",
    keywords: ["tour guide split", "turistički vodič split", "split city tour"]
  },
  {
    id: "pranje-tepiha",
    title: "Pranje tepiha",
    description: "Dubinsko pranje tepiha, madraca i namještaja.",
    icon: Wind,
    image: "/images/hero-split.jpg",
    slug: "pranje-tepiha",
    keywords: ["pranje tepiha split", "carpet cleaning split", "dubinsko pranje split"]
  },
  {
    id: "kljucar",
    title: "Ključar",
    description: "Hitne usluge ključara, izrada ključeva i zamjena brava.",
    icon: Key,
    image: "/images/hero-split.jpg",
    slug: "kljucar",
    keywords: ["ključar split", "locksmith split", "otvaranje vrata split"]
  },
  {
    id: "odvoz-otpada",
    title: "Odvoz otpada",
    description: "Odvoz glomaznog otpada, građevinskog šuta i rušenje.",
    icon: Trash2,
    image: "/images/hero-split.jpg",
    slug: "odvoz-otpada",
    keywords: ["odvoz otpada split", "waste removal split", "odvoz šuta split"]
  },
  {
    id: "sigurnosni-sustavi",
    title: "Sigurnosni sustavi",
    description: "Ugradnja kamera, alarma i sigurnosnih sustava.",
    icon: Shield,
    image: "/images/hero-split.jpg",
    slug: "sigurnosni-sustavi",
    keywords: ["sigurnosni sustavi split", "security cameras split", "alarmi split"]
  },
  {
    id: "web-dizajn",
    title: "Web dizajn",
    description: "Izrada web stranica i digitalnog marketinga za lokalne biznise.",
    icon: Globe,
    image: "/images/hero-split.jpg",
    slug: "web-dizajn",
    keywords: ["web dizajn split", "izrada web stranica split", "web design split"]
  },
];

export interface Business {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  category_id: string;
}

// Mock data for businesses
export const businesses: Business[] = [
  { id: "1", name: "Vulkanizer Brzi", address: "Vukovarska 12, Split", phone: "021 123 456", rating: 4.8, category_id: "vulkanizer" },
  { id: "2", name: "Auto Gume Centar", address: "Poljička cesta 55, Split", phone: "021 987 654", rating: 4.5, category_id: "vulkanizer" },
  { id: "3", name: "Auto Servis Marić", address: "Domovinskog rata 10, Split", phone: "021 555 333", rating: 4.9, category_id: "automehanicar" },
  { id: "4", name: "Vodoinstalater Jure", address: "Velebitska 22, Split", phone: "098 765 4321", rating: 4.7, category_id: "vodoinstalater" },
  { id: "5", name: "Elektro Split", address: "Hercegovačka 40, Split", phone: "021 222 111", rating: 4.6, category_id: "elektricar" },
  { id: "6", name: "Blistavi Dom", address: "Put Brodarice 6, Split", phone: "091 112 2334", rating: 4.8, category_id: "ciscenje" },
];
