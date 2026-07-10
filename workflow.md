# RM MOBILE SHOP — System Workflow

## Architecture

```
                    GitHub Repo
                   (one codebase)
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
  Railway: rm-frontend          Railway: rm-backend
  (or Hostinger frontend)      (or Hostinger backend)
  TanStack Start SSR            Express API
  Port 3000                     Port 4000
  .output/server/index.mjs      backend/server.js
         │                             │
         │  src/server.ts proxy        │
         │  /api/* ──────────────────► │
         │                    backend/data/
         │                    ├── products.json
         │                    ├── categories.json
         │                    └── settings.json
         │
    Browser (any device, any browser)
```

---

## Request Flow

### Any browser visits a product page

```
1. Browser → GET https://yourdomain.com/products

2. TanStack Start SSR (server-side):
   → Renders HTML using staticProducts from src/data/products.ts
   → Sends instant HTML to browser

3. Browser receives HTML → React hydrates

4. useProducts() hook fires (client-side useEffect):
   → GET /api/products
   → src/server.ts intercepts → proxies to Express backend
   → Express reads backend/data/products.json
   → Returns Product[]

5. React setState() → page updates with real server data
   → All admin-added products now visible ✅

Total time: ~100ms for real data to appear after initial render
```

### Admin adds a product

```
1. Admin → /admin/login → enters admin / password

2. Login:
   → POST /api/auth/login
   → src/server.ts proxies to Express
   → Express validates credentials → { ok: true }
   → Browser: localStorage.setItem("rm_admin_auth", "1")

3. Admin fills product form → clicks "Add Product"

4. Save:
   → POST /api/products  (full products array)
   → src/server.ts proxies to Express
   → Express writes backend/data/products.json
   → { ok: true }

5. Any browser anywhere → GET /api/products
   → reads same products.json ✅
```

### Customer orders on WhatsApp

```
1. Customer views /products/[id]
   → Selects quantity (live total = price × qty)

2. Clicks "Order on WhatsApp"
   → Auto-builds message:
      Assalam-o-Alaikum,
      Product: [name]
      Price: Rs. [price]
      Quantity: [qty]
      Total: Rs. [total]
      Please confirm availability...

3. wa.me/923345581147?text=[encoded message]
   → WhatsApp opens with message pre-filled
   → Customer taps Send ✅
```

---

## Why All Browsers See The Same Products

```
BEFORE (localStorage only):
  Opera  → saves to Opera localStorage   ← only in Opera
  Edge   → reads Edge localStorage       ← empty, different browser ✗

AFTER (server file):
  Opera  → POST /api/products → Express → writes products.json on server
  Edge   → GET  /api/products → Express → reads same products.json ✅
  Chrome → GET  /api/products → same file ✅
  Mobile → GET  /api/products → same file ✅
```

---

## API Proxy — How /api Works

The same code runs in all environments — browser always calls `/api/*`:

```
LOCAL DEV:
  Browser → /api/products
  Vite dev server → proxy (vite.config.ts) → http://localhost:4000/api/products

RAILWAY:
  Browser → /api/products
  TanStack Start → src/server.ts proxy → https://rm-backend.up.railway.app/api/products

HOSTINGER:
  Browser → /api/products
  TanStack Start → src/server.ts proxy → http://localhost:4000/api/products
```

---

## Data Storage Layers

```
When public store reads products:
  1. GET /api/products     → backend/data/products.json  (server disk)
  2. Falls back to:          static TypeScript data       (if API down)

When admin writes products:
  1. POST /api/products    → saves to server disk (all browsers)
  2. Also mirrors to:        localStorage               (instant admin UI)

Admin auth:
  • localStorage only: "rm_admin_auth" = "1"
  • Never checked on server — avoids SSR redirect loops
  • Checked in client-side useEffect only
```

---

## Admin Login — No Infinite Redirect Loop

```
Old (broken): beforeLoad() ran on SERVER → no localStorage → always false
              → redirect to /login → page loads → repeat ♾

Fixed: NO beforeLoad on any admin route
       useEffect checks localStorage → client-side only
       Redirects via window.location.replace() → no SSR involvement
```

---

## Image Display

```
ProductCard image priority:
  1. product.images[0]         Admin-uploaded (base64 or HTTPS)
  2. categoryImgMap[category]  Unsplash fallback per category
  3. Gradient + icon           If image 404s

Styling: object-contain + padding + white background
→ Entire image visible — no cropping ✅
```

---

## Running Locally

```bash
# Terminal 1
cd backend && node server.js
# → http://localhost:4000

# Terminal 2
npm run dev
# → http://localhost:8080
# → admin: http://localhost:8080/admin/login
# → login: admin / rmmobile2024
```

---

## Deploying

See `railway-deploy.md` for GitHub + Railway (recommended).
See `hostingerprocess.md` for Hostinger VPS.

---

*RM MOBILE SHOP — Smart Accessories • Smart Choice*
