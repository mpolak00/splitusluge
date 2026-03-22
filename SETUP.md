# Split Usluge - Lokalna Instalacija

## Brzi start (3 koraka)

### 1. Instalacija zavisnosti
```bash
pnpm install
```

### 2. Postavljanje baze podataka
Trebate MySQL bazu. Ako nemate lokalnu MySQL instalaciju, možete koristiti Docker:

```bash
docker run --name mysql-split -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=split_usluge -p 3306:3306 -d mysql:8
```

Zatim postavite `DATABASE_URL` u `.env.local`:
```
DATABASE_URL=mysql://root:root@localhost:3306/split_usluge
```

### 3. Pokretanje
```bash
pnpm dev
```

Aplikacija će biti dostupna na `http://localhost:3000`

---

## Detaljne upute

### Okruženje (.env.local)

Kreirajte `.env.local` datoteku sa sljedećim varijablama:

```env
# OBAVEZNO
DATABASE_URL=mysql://korisnik:lozinka@localhost:3306/split_usluge
JWT_SECRET=tajni-kljuc-za-sesije

# Za Google Maps (koristite Manus proxy ili vašu API ključ)
BUILT_IN_FORGE_API_KEY=vasa-api-kljuc
BUILT_IN_FORGE_API_URL=https://api.manus.im

# Opciono - za OAuth
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
OAUTH_SERVER_URL=https://api.manus.im
VITE_APP_ID=vasa-app-id
OWNER_NAME=Vase Ime
OWNER_OPEN_ID=vasa-open-id

# Opciono - za frontend
VITE_APP_TITLE=Split Usluge
VITE_APP_LOGO=/logo.svg
VITE_FRONTEND_FORGE_API_KEY=vasa-frontend-kljuc
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

### Inicijalizacija baze

```bash
# Kreiraj tablice
pnpm db:push

# Popuni kategorije
npx tsx scripts/seed-categories.mjs

# (Opciono) Prikupi biznise iz Google Maps
npx tsx scripts/fetch-places-optimized.mjs
```

### Pokretanje u dev modu

```bash
pnpm dev
```

Server će biti dostupan na `http://localhost:3000`

### Build za produkciju

```bash
pnpm build
pnpm start
```

---

## Struktura projekta

```
split-usluge/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Stranice
│   │   │   ├── Home.tsx       # Početna stranica
│   │   │   ├── BusinessMap.tsx # Mapa sa bizniima
│   │   │   └── ServicePage.tsx # Detalji usluge
│   │   ├── components/        # React komponente
│   │   │   ├── Map.tsx        # Google Maps komponenta
│   │   │   ├── Layout.tsx     # Layout wrapper
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── trpc.ts        # tRPC klijent
│   │   │   └── data.ts        # Statički podaci
│   │   ├── App.tsx            # Glavna aplikacija
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Globalni stilovi
│   ├── public/                # Statički assets
│   └── index.html             # HTML template
├── server/                    # Express backend
│   ├── routers/              # tRPC routeri
│   │   └── services.ts       # Services router
│   ├── db.ts                 # Database helpers
│   ├── routers.ts            # Glavni router
│   └── _core/                # Framework kod
├── drizzle/                  # Database
│   ├── schema.ts             # Database schema
│   ├── migrations/           # SQL migracije
│   └── relations.ts          # Drizzle relacije
├── scripts/                  # Utility skripte
│   ├── seed-categories.mjs
│   ├── fetch-places-optimized.mjs
│   └── count-businesses.mjs
├── package.json
├── tsconfig.json
├── vite.config.ts
├── drizzle.config.ts
├── README.md                 # Dokumentacija
└── SETUP.md                  # Ova datoteka
```

---

## Dostupne skripte

```bash
# Development
pnpm dev              # Pokreni dev server

# Build
pnpm build            # Build za produkciju
pnpm start            # Pokreni produkciju

# Database
pnpm db:push          # Kreiraj/ažuriraj bazu

# Testing
pnpm test             # Pokreni testove

# Formatting
pnpm format           # Format koda sa Prettier

# Type checking
pnpm check            # TypeScript check
```

---

## API Endpointi (tRPC)

Dostupni su sljedeći API endpointi:

```typescript
// Kategorije
trpc.services.getAllCategories.useQuery()
trpc.services.getCategoryBySlug.useQuery({ slug: "vulkanizeri" })

// Biznisi
trpc.services.getBusinessesByCategory.useQuery({ categoryId: 1, limit: 50 })
trpc.services.getBusinessesByCity.useQuery({ city: "Split", limit: 100 })
trpc.services.searchBusinesses.useQuery({ query: "frizer", limit: 20 })
trpc.services.getBusinessById.useQuery({ id: 1 })

// Autentifikacija
trpc.auth.me.useQuery()
trpc.auth.logout.useMutation()
```

---

## Troubleshooting

### "Cannot connect to database"
- Provjerite da je MySQL pokrenut
- Provjerite `DATABASE_URL` u `.env.local`
- Provjerite kredencijale (korisnik/lozinka)

### "Google Maps nije učitan"
- Provjerite `BUILT_IN_FORGE_API_KEY`
- Provjerite `VITE_FRONTEND_FORGE_API_KEY`
- Provjerite da su URLs ispravni

### "Port 3000 je već u upotrebi"
```bash
# Koristite drugi port
PORT=3001 pnpm dev
```

### "node_modules problemi"
```bash
# Očistite i reinstalirajte
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## Sljedeći koraci

1. **Prikupite biznise** - Pokreni `scripts/fetch-places-optimized.mjs`
2. **Testirajte mapu** - Idi na `/mapa` i provjeri da li se biznisi prikazuju
3. **Prilagodite dizajn** - Uredi `client/src/index.css` za boje i stilove
4. **Dodajte nove stranice** - Kreiraj nove datoteke u `client/src/pages/`
5. **Deployajte** - Koristite `pnpm build` i `pnpm start`

---

## Podrška

Za pitanja ili probleme, provjerite:
- `README.md` - Opća dokumentacija
- `drizzle/schema.ts` - Struktura baze
- `server/routers.ts` - API procedure
- `client/src/App.tsx` - Rute aplikacije
