# Split Usluge — Deploy na Vercel (5 minuta)

> **Važno:** Aplikacija radi BEZ baze podataka — koristi statičke podatke kao fallback.
> Možeš deployati odmah, bazu dodati kasnije.

---

## 🚀 VERCEL DEPLOY (bez baze — odmah online)

### Korak 1: Vercel račun
1. Idi na **vercel.com** → "Sign Up" → **Continue with GitHub**
2. Autorizi Vercel da pristupi tvojim repozitorijima

### Korak 2: Importaj projekt
1. Klikni **"Add New Project"**
2. Nadi `mpolak00/splitusluge` u listi i klikni **Import**
3. Vercel automatski detektira postavke iz `vercel.json`

### Korak 3: Environment Variables
Klikni **"Environment Variables"** i dodaj:

| Key | Value | Napomena |
|-----|-------|----------|
| `NODE_ENV` | `production` | Obavezno |
| `DATABASE_URL` | *(ostavi prazno za sad)* | Dodaj kasnije |
| `JWT_SECRET` | `neki-random-string-30-znakova` | Generiraj nasumično |
| `SITE_URL` | `https://tvoj-projekt.vercel.app` | Tvoj Vercel URL |

### Korak 4: Deploy
Klikni **"Deploy"** — čekaj ~2 minute. Gotovo!

✅ Stranica radi na: `https://splitusluge.vercel.app` (ili slično)

---

## 🗄️ DODAVANJE BAZE PODATAKA (za admin analitiku)

Bez baze, admin panel prikazuje 0 za statistike, ali sve ostalo radi.
Za pravu analitiku potrebna je MySQL baza.

### Opcija A: Railway (besplatno, najlakše)

1. Idi na **railway.app** → New Project
2. Klikni **"Add a Service"** → **"Database"** → **"MySQL"**
3. Klikni na bazu → tab **"Connect"** → kopiraj **"MySQL URL"**
4. Idi na Vercel → projekt → **Settings → Environment Variables**
5. Dodaj `DATABASE_URL` = *zalijepljeni URL*
6. Klikni **Redeploy**

### Opcija B: TiDB Serverless (MySQL compatible, potpuno besplatno)

1. Idi na **tidbcloud.com** → Create Free Cluster → **Serverless**
2. Region: Europe (Frankfurt)
3. Connect → zatraži "Connection String for MySQL"
4. Kopiraj URL, dodaj u Vercel kao `DATABASE_URL`
5. Redeploy

### Inicijalizacija baze (jednom)

Nakon što postaviš `DATABASE_URL`, pokreni lokalno:
```bash
pnpm db:push
node scripts/seed-categories.mjs
```

Ili ako nemaš lokalni setup, ovo će automatski raditi pri prvom deployu.

---

## 🌐 CUSTOM DOMENA

### Kupnja domene
- **split-usluge.hr** → carnet.hr (~20 EUR/god) — **preporučeno za lokalni SEO**
- **splitusluge.com** → namecheap.com (~8 USD/god)
- **splitusluge.eu** → eurid.eu (~15 EUR/god)

### Postavljanje na Vercel
1. Vercel → projekt → **Settings → Domains**
2. Unesi `split-usluge.hr` → Add
3. Vercel ti da DNS record (npr. `A 76.76.21.21` ili CNAME)
4. Idi na registrar (CARNET/Namecheap) → DNS management
5. Dodaj record koji ti Vercel dao
6. Čekaj 10-60 minuta → domena aktiva

**SSL certifikat**: Vercel automatski generira HTTPS, ništa ne trebaš raditi.

---

## ⚡ LOKALNI RAZVOJ

```bash
# 1. Instaliraj zavisnosti
pnpm install

# 2. Kreiraj .env.local
cp .env.example .env.local
# Uredi .env.local po potrebi

# 3. Pokretanje
pnpm dev
# → http://localhost:3000
```

### S bazom lokalno (Docker):
```bash
docker run --name mysql-split \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=split_usluge \
  -p 3306:3306 -d mysql:8

# U .env.local:
# DATABASE_URL=mysql://root:root@localhost:3306/split_usluge

pnpm db:push
node scripts/seed-categories.mjs
pnpm dev
```

---

## 🔐 ADMIN PANEL

URL: `/admin`
Lozinka: `white1413`

Tabovi:
- **Pregled** — statistike (pregledi, klikovi, pretrage)
- **Kategorije** — najpopularnije kategorije
- **Pretrage** — što korisnici traže
- **Klikovi** — klikovi na telefon/web/mapu
- **Izvještaji** — generiraj PDF izvještaj za klijente
- **Scanner** — biznisi bez web stranice (Email/WhatsApp/SMS outreach)
- **AI Poziv** — personalizirane skripte za prodajni poziv
- **AI Promptovi** — prompts za ChatGPT/Claude za izradu web stranica
- **Hosting & Deploy** — ove upute + troškovi

---

## 📦 PAKETI ZA KLIJENTE

URL: `/paketi`

| Paket | Cijena |
|-------|--------|
| Oglas Basic | 25 EUR/mj |
| Oglas Premium | 50 EUR/mj |
| Web Starter | 300 EUR + 75 EUR/mj |
| Web Pro | 400 EUR + 75 EUR/mj |

---

## 🛠️ DOSTUPNE SKRIPTE

```bash
pnpm dev          # Razvoj (localhost:3000)
pnpm build        # Build za produkciju
pnpm start        # Pokreni produkciju
pnpm db:push      # Kreiraj/ažuriraj tablice u bazi
pnpm check        # TypeScript provjera
pnpm test         # Testovi
pnpm format       # Prettier formatiranje
```

---

## 🆘 ČESTI PROBLEMI

**"Build failed" na Vercel**
→ Provjeri da su sve ENV varijable postavljene (barem `NODE_ENV=production`)

**"Cannot connect to database"**
→ Provjeri `DATABASE_URL` format: `mysql://user:pass@host:3306/dbname`
→ Aplikacija radi i bez baze (statički podaci)

**Admin panel prikazuje 0 za statistike**
→ Normalno bez baze. Postavi `DATABASE_URL` za prave podatke.

**"Port 3000 already in use"**
```bash
PORT=3001 pnpm dev
```

**Vite nije pronađen**
```bash
pnpm install
```
