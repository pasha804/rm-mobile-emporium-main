<div align="center">

<img src="public/logo.png" alt="RM Mobile Shop" width="280" />

# RM Mobile Shop

### Quality Mobile Accessories at Best Prices

[![Built with React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TanStack Start](https://img.shields.io/badge/TanStack-Start-FF4154?style=flat-square)](https://tanstack.com/start)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![WhatsApp](https://img.shields.io/badge/Orders-WhatsApp-25D366?style=flat-square&logo=whatsapp&logoColor=white)](https://wa.me/923345581147)

**📱 Smart Accessories • Smart Choice**

[🛍 Browse Products](#pages--routes) · [💬 Order on WhatsApp](https://wa.me/923345581147) · [📖 Documentation](detail.txt)

</div>

---

## ✨ What is RM Mobile Shop?

A **production-quality, premium e-commerce website** for a mobile accessories business in Pakistan. Built to look and feel like an Apple-quality storefront — clean, fast, and beautiful on every screen — with a simple ordering flow through WhatsApp.

> No payment gateway. No checkout. No account needed.  
> Just browse → pick → WhatsApp order. Done.

---

## 🌟 Live Features

| Feature | Status |
|---------|--------|
| 🏠 Home page with Hero, Features, Categories, Featured Products | ✅ |
| 🛍 Full Products catalog with real-time search | ✅ |
| 🔍 Filters: Category, Sort, Availability | ✅ |
| 📦 Individual Product Detail Pages | ✅ |
| 📸 3-View Product Gallery (Front / Detail / In Use) | ✅ |
| ➕ Quantity selector with live total price | ✅ |
| 💬 Auto-filled WhatsApp order messages | ✅ |
| 🔥 Deals page with live countdown timer | ✅ |
| 🏢 About Us with story, values & stats | ✅ |
| 📞 Contact with WhatsApp form | ✅ |
| ❤️ Wishlist UI (heart toggle) | ✅ |
| 📱 Fully responsive (mobile → 4K) | ✅ |
| 🔍 SEO optimised (OG tags, canonical, meta) | ✅ |
| ♿ Accessible (ARIA, keyboard navigation, contrast) | ✅ |
| 🚀 SSR with Nitro (Cloudflare-ready) | ✅ |
| 🎨 Royal Blue premium design system | ✅ |
| 🌊 Glassmorphism navbar & floating cards | ✅ |
| 💎 404 & error pages | ✅ |

---

## 📸 Pages & Routes

```
/              → Home          Beautiful hero + categories + featured products
/products      → Shop          Searchable + filterable full product catalog
/products/:id  → Product       Detail page with gallery, qty selector, WhatsApp CTA
/deals         → Deals         Live countdown + discounts + best sellers
/about         → About         Company story, values, stats, why choose us
/contact       → Contact       WhatsApp form + contact info + business hours
*              → 404           Custom not-found page
```

---

## 💬 WhatsApp Order Flow

When a customer clicks **"Order on WhatsApp"**, the system automatically generates:

```
Assalam-o-Alaikum,

I would like to place an order from RM MOBILE SHOP.

Product: AirPro TWS Earbuds
Price: Rs. 2,500
Quantity: 2
Total Price: Rs. 5,000

Please confirm product availability.
Kindly contact me regarding delivery address, payment method,
delivery charges and expected delivery time.

Thank you.
```

The customer just hits **Send** — zero friction, instant order.

---

## 🗂 Project Structure

```
src/
├── assets/          Hero image + logo
├── components/
│   ├── site/        Navbar, Footer, ProductCard, CategoryCard, FloatingActions
│   └── ui/          shadcn/ui components
├── data/
│   └── products.ts  All 24 products + 12 categories (edit to add more)
├── lib/
│   ├── shop.ts      Business config (name, phone, email, hours)
│   └── whatsapp.ts  Order message generator + URL builder
└── routes/
    ├── __root.tsx   Global layout
    ├── index.tsx    Home
    ├── products.tsx Products listing
    ├── products.$id.tsx  Product detail
    ├── deals.tsx    Deals page
    ├── about.tsx    About page
    └── contact.tsx  Contact page
```

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → Opens at http://localhost:3000

# Production build
npm run build

# Preview production build
npx vite preview
```

---

## 🛒 Product Categories (12)

| Icon | Category | Gradient |
|------|----------|----------|
| 🛡️ | Tempered Glass | Sky → Blue |
| 📱 | Mobile Covers | Indigo → Blue |
| ⚡ | Chargers | Amber → Orange |
| 🔌 | Data Cables | Emerald → Teal |
| 📻 | Neckbands | Fuchsia → Purple |
| 🎧 | Earbuds | Blue → Indigo |
| 🔋 | Power Banks | Lime → Green |
| ⌚ | Smart Watches | Slate → Black |
| 👂 | Handfrees | Rose → Red |
| 🔊 | Speakers | Cyan → Blue |
| 🪫 | Batteries | Yellow → Amber |
| 🎮 | Gaming Thumbs | Violet → Indigo |

---

## ➕ Adding Products

Open `src/data/products.ts` and add to the `products` array:

```typescript
{
  id: "my-product-id",       // unique, URL-safe slug
  name: "Product Name",
  category: "earbuds",       // must match a CategorySlug
  price: 1500,               // PKR, no commas
  oldPrice: 2000,            // optional — shows discount badge
  rating: 4.5,
  reviews: 100,
  inStock: true,
  featured: true,            // show on Home featured section
  bestSeller: false,
  newArrival: true,
  description: "Short description of the product.",
  features: ["Feature 1", "Feature 2", "Feature 3"],
  specs: {
    "Spec Label": "Value",
    "Another Spec": "Another Value",
  },
}
```

The product immediately appears across all relevant pages — no extra wiring needed.

---

## ⚙️ Configuration

### Business Info
Edit `src/lib/shop.ts`:
```typescript
export const SHOP = {
  name: "RM MOBILE SHOP",
  phone: "0334 5581147",
  whatsapp: "923345581147",  // wa.me format (no +)
  email: "rbtaggaming@gmail.com",
  hours: "Mon – Sat  •  10:00 AM – 10:00 PM",
  currency: "Rs.",
}
```

### Colors
Edit the `--royal` variable in `src/styles.css` to change the primary brand color. All gradients, shadows, and utilities update automatically.

---

## 🎨 Design System

| Token | Value | Used For |
|-------|-------|----------|
| `--royal` | Royal Blue (oklch) | Primary brand, buttons, links |
| `--ink` | Near-black | Headings, dark backgrounds |
| `--royal-glow` | Lighter blue | Gradient end stops |
| `--whatsapp` | WhatsApp green | WhatsApp CTAs |
| `gradient-royal` | 135° blue gradient | Buttons, icons, headers |
| `glass` | Frosted glass | Navbar, floating cards |
| `shadow-royal` | Blue-tinted shadow | Hero cards, CTA buttons |
| `shadow-soft` | Subtle shadow | Product cards |

**Fonts:** Manrope (headings & prices) + Inter (body text)

---

## 📦 Tech Stack

```
React 19           UI library
TanStack Start     SSR meta-framework
TanStack Router    File-based routing
Tailwind CSS v4    Utility-first styling
TypeScript 5.8     Type safety
Lucide React       Icon library
Radix UI           Accessible primitives
Nitro              Server engine
Vite 8             Build tool
```

---

## 🌐 Deployment

### Cloudflare Workers (default)
```bash
npm run build
npx nitro deploy --prebuilt
```

### Vercel
Change preset in `vite.config.ts` → `preset: "vercel"`, then deploy normally.

### Node / Railway
Change preset to `"node"`, then:
```bash
node .output/server/index.mjs
```

---

## 📋 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier formatter |

---

## 🔐 Admin Panel

A fully integrated admin panel lives inside the same project — no separate app needed.

### Access
```
URL:      /admin/login
Username: admin
Password: rmmobile2024
```

### Admin Pages

| Route | Description |
|-------|-------------|
| `/admin/login` | Secure login with session |
| `/admin/dashboard` | Stats, recent products, category breakdown |
| `/admin/products` | Full CRUD — add, edit, duplicate, delete |
| `/admin/categories` | Manage categories with gradient picker |
| `/admin/settings` | Edit store name, WhatsApp, SEO, hero text |

### Admin Features

**Product Management**
- Add / Edit / Delete / Duplicate products
- Search and filter by category or stock status
- Export products as JSON — Import from JSON
- Reset to default data anytime

**Category Management**
- Add / Edit / Delete categories
- Visual gradient color picker (12 options)
- Product count per category
- Export / Import JSON

**Website Settings**
- Store name, tagline, currency, hours
- WhatsApp number, phone, email, address
- Hero section title and subtitle
- Social media links (Instagram, Facebook)
- SEO title and description
- Export / Import settings

**Data Storage**
All admin changes persist to `localStorage`. The public store falls back to static `src/data/products.ts` when localStorage is empty. To migrate to a real backend, only replace the functions in `src/lib/adminStore.ts`.

---

For full documentation including all component details, data schema, WhatsApp system, design tokens, SEO setup, and customisation guide — see **[detail.txt](detail.txt)**.

---

<div align="center">

**Built with ❤️ for RM Mobile Shop**

📱 **0334 5581147** · 🌐 Nationwide Delivery · ⭐ 4.8 Rating

*Smart Accessories • Smart Choice*

</div>

---

## 📄 Full Documentation

See **[detail.txt](detail.txt)** for complete documentation including admin panel architecture, data storage, customisation guide, and deployment instructions.
