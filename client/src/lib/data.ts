
import { Wrench, Car, Droplets, Zap, Sparkles, Hammer, Truck, Scissors, Stethoscope } from "lucide-react";

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
    image: "/images/hero-split.jpg", // Fallback to hero for now
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
  }
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
