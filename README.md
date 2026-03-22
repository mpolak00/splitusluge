# Split Usluge - Lokalni Poslovni Imenik

Kompletna web aplikacija za pronalaženje lokalnih usluga u Splitu i okolici sa interaktivnom Google Maps integracijom.

## Što je uključeno?

- **419 aktivnih biznisa** iz Google Maps (Split, Solin, Kastela, Omis)
- **Interaktivna Google Maps** sa markerima za sve biznise
- **Filtriranje po kategorijama** (vulkanizeri, frizerski saloni, vodoinstalateri, itd.)
- **Prikaz korisnikove lokacije** sa mogućnostima dijeljenja
- **Direktne navigacijske linkove** na Google Maps
- **Prikaz udaljenosti** od korisnika do svakog biznisa
- **Detaljne informacije** o svakom biznisu (telefon, web, radno vrijeme, ocjene)
- **Responsive dizajn** za sve uređaje

## Kako pokrenuti lokalno

### Preduvjeti

- Node.js 18+ i npm/pnpm
- MySQL baza podataka (ili koristite Manus hosting)
- Google Maps API ključ (ili Manus proxy)

### Instalacija

1. **Raspakujte ZIP datoteku:**
```bash
unzip split-usluge-complete.zip
cd split-usluge
```

2. **Instalirajte zavisnosti:**
```bash
pnpm install
```

3. **Postavite okruženje:**
Kreirajte `.env.local` datoteku sa sljedećim:
```env
DATABASE_URL=mysql://korisnik:lozinka@localhost:3306/split_usluge
BUILT_IN_FORGE_API_KEY=vasa_api_kljuc
BUILT_IN_FORGE_API_URL=https://api.manus.im
JWT_SECRET=tajni_kljuc_za_sesije
VITE_APP_TITLE=Split Usluge
VITE_APP_LOGO=/logo.svg
```

4. **Kreirajte bazu podataka:**
```bash
pnpm db:push
```

5. **Popunite biznise (opciono):**
Ako trebate prikupiti podatke iz Google Maps:
```bash
npx tsx scripts/fetch-places-optimized.mjs
```

6. **Pokrenite dev server:**
```bash
pnpm dev
```

Aplikacija će biti dostupna na `http://localhost:3000`

## Struktura projekta

```
split-usluge/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Stranice (Home, BusinessMap, ServicePage)
│   │   ├── components/    # React komponente
│   │   └── lib/           # Utility funkcije i tRPC klijent
│   └── public/            # Statički assets
├── server/                # Express backend sa tRPC
│   ├── routers/          # tRPC procedure
│   └── db.ts             # Database helper funkcije
├── drizzle/              # Database schema i migracije
├── scripts/              # Utility skripte
│   ├── seed-categories.mjs
│   ├── fetch-places-optimized.mjs
│   └── count-businesses.mjs
└── README.md
```

## Glavne stranice

### 1. **Početna stranica** (`/`)
- Herojski banner sa pozivom na akciju
- Pregled kategorija usluga
- Informacije o Split Uslugama
- Poziv za registraciju novih obrtnika

### 2. **Mapa biznisa** (`/mapa`)
- Interaktivna Google Maps sa svim bizniima
- Filtriranje po kategorijama
- Prikaz korisnikove lokacije
- Detaljni prikaz biznisa u sidebaru
- Direktni linkovi na Google Maps navigaciju
- Prikaz udaljenosti od korisnika

### 3. **Stranica usluge** (`/usluga/:slug`)
- Detaljne informacije o kategoriji
- Popis svih biznisa u toj kategoriji
- SEO optimizacija

## Baza podataka

Aplikacija koristi MySQL sa Drizzle ORM. Dostupne su tri glavne tablice:

- **categories** - Kategorije usluga (10 inicijalno)
- **businesses** - Biznisi sa svim informacijama
- **searchKeywords** - Ključne riječi za fuzzy matching

## API (tRPC)

Dostupni su sljedeći API endpointi:

```typescript
// Dohvati sve kategorije
trpc.services.getAllCategories.useQuery()

// Dohvati kategoriju po slug-u
trpc.services.getCategoryBySlug.useQuery({ slug: "vulkanizeri" })

// Dohvati biznise po kategoriji
trpc.services.getBusinessesByCategory.useQuery({ categoryId: 1, limit: 50 })

// Dohvati biznise po gradu
trpc.services.getBusinessesByCity.useQuery({ city: "Split", limit: 100 })

// Pretraži biznise
trpc.services.searchBusinesses.useQuery({ query: "frizer", limit: 20 })

// Dohvati biznis po ID-u
trpc.services.getBusinessById.useQuery({ id: 1 })
```

## Tehnologije

- **Frontend:** React 19, TypeScript, Tailwind CSS 4
- **Backend:** Express, tRPC 11, Node.js
- **Database:** MySQL, Drizzle ORM
- **Maps:** Google Maps JavaScript API (via Manus proxy)
- **Build:** Vite, esbuild
- **Testing:** Vitest

## Razvoj

### Dodavanje novih kategorija

Uredi `drizzle/schema.ts` i pokreni:
```bash
pnpm db:push
```

### Dodavanje novih API procedura

1. Kreiraj novu datoteku u `server/routers/`
2. Definiraj procedure u `server/routers.ts`
3. Koristi u React komponentama sa `trpc.*.useQuery()`

### Prikupljanje podataka iz Google Maps

```bash
npx tsx scripts/fetch-places-optimized.mjs
```

## Deployment

Aplikacija je optimizirana za Manus hosting, ali može se deployati na bilo koji Node.js host:

1. Pokreni `pnpm build`
2. Postavi `DATABASE_URL` i ostale env varijable
3. Pokreni `pnpm start`

## Licenca

MIT

## Podrška

Za pitanja ili probleme, kontaktirajte tim razvoja.
