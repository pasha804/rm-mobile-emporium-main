import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, BadgeCheck, Headphones, MessageCircle,
  ShieldCheck, Sparkles, Truck, Star, Flame, Clock, CheckCircle2,
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { categories } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { CategoryCard } from "@/components/site/CategoryCard";
import { ProductCard } from "@/components/site/ProductCard";
import { SHOP } from "@/lib/shop";
import { inquiryUrl } from "@/lib/whatsapp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RM Mobile Shop — Quality Mobile Accessories at Best Prices" },
      { name: "description", content: "Shop premium mobile accessories in Pakistan — tempered glass, covers, chargers, earbuds, power banks, smart watches and more. Order instantly on WhatsApp." },
      { property: "og:title", content: "RM Mobile Shop — Premium Mobile Accessories" },
      { property: "og:description", content: "Quality mobile accessories at best prices. Order directly on WhatsApp." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const features = [
  { icon: BadgeCheck, title: "Premium Quality", desc: "Hand-picked accessories from trusted brands." },
  { icon: Sparkles, title: "Best Prices", desc: "Fair, wholesale-friendly prices every day." },
  { icon: Headphones, title: "Friendly Support", desc: "Real humans on WhatsApp — fast replies." },
  { icon: Truck, title: "Nationwide Delivery", desc: "Shipped across Pakistan with tracking." },
  { icon: ShieldCheck, title: "Warranty Backed", desc: "7-day replacement on eligible items." },
];

const testimonials = [
  { name: "Ahmed Raza", city: "Lahore", rating: 5, text: "Amazing quality tempered glass! Fits perfectly on my Samsung. Fast delivery too." },
  { name: "Fatima Khan", city: "Karachi", rating: 5, text: "Ordered earbuds and they arrived in 2 days. Sound quality is fantastic for the price!" },
  { name: "Usman Ali", city: "Islamabad", rating: 5, text: "Best mobile accessories shop. WhatsApp ordering is so easy and the owner is very helpful." },
];

function Home() {
  // useProducts: static on SSR, fetches from API on client — no localStorage
  const products = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const bestsellers = products.filter((p) => p.bestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);
  const productsByCategory = (slug: string) => products.filter((p) => p.category === slug);

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden" aria-label="Hero banner">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-royal/10 blur-3xl" />
        <div className="absolute top-1/2 -left-24 h-72 w-72 rounded-full bg-royal/8 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pt-16 lg:pb-28">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-royal/25 bg-white/70 px-3 py-1.5 text-xs font-semibold text-royal shadow-soft backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Pakistan's trusted mobile accessories store
            </span>
            <h1 className="mt-5 font-display text-4xl font-black leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem] xl:text-6xl">
              Everything your phone <span className="text-gradient-royal">deserves.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              {SHOP.tagline}. Discover a curated collection of chargers, earbuds, smart watches and more — order instantly on WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/products" className="group inline-flex items-center gap-2 rounded-full gradient-royal px-6 py-3.5 text-sm font-semibold text-royal-foreground shadow-royal transition-all hover:scale-[1.04] hover:shadow-lg">
                Shop Now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href={inquiryUrl()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-6 py-3.5 text-sm font-semibold text-ink backdrop-blur transition-all hover:bg-white hover:border-royal/30">
                <MessageCircle className="h-4 w-4 text-[var(--whatsapp)]" /> WhatsApp Us
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-6">
              <Stat k="500+" v="Products" />
              <Stat k="2K+" v="Happy Buyers" />
              <Stat k="4.8★" v="Avg. Rating" />
            </div>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-royal ring-1 ring-white/40 animate-float">
              <img src={heroImg} alt="Premium mobile accessories" width={1600} height={1200} className="h-full w-full object-cover" loading="eager" />
              <div className="absolute inset-0 bg-gradient-to-tr from-royal/20 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-2xl glass p-4 shadow-soft sm:block animate-float" style={{ animationDelay: "1.5s" }}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Today's Pick</p>
              <p className="mt-1 font-display text-sm font-extrabold text-ink">AirPro TWS — 29% Off</p>
            </div>
            <div className="absolute -right-3 top-8 hidden rounded-2xl gradient-royal p-4 text-royal-foreground shadow-royal sm:block animate-float" style={{ animationDelay: "3s" }}>
              <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">Fast Delivery</p>
              <p className="mt-1 font-display text-sm font-extrabold">Across Pakistan</p>
            </div>
            <div className="absolute right-8 -bottom-6 hidden rounded-2xl bg-white shadow-soft p-3 sm:block animate-float" style={{ animationDelay: "2s" }}>
              <div className="flex items-center gap-2">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}</div>
                <span className="text-xs font-bold text-ink">4.8 Rating</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">2,000+ happy buyers</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Store highlights">
        <div className="grid gap-3 rounded-3xl border border-border bg-card p-3 shadow-soft sm:grid-cols-2 sm:p-5 lg:grid-cols-5">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-accent">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-royal text-royal-foreground shadow-royal">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-sm font-bold text-ink">{f.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Product categories">
        <SectionHeading eyebrow="Browse" title="Shop by category" subtitle="Find exactly what your phone needs — from screen protection to premium audio." />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
          {categories.map((c) => <CategoryCard key={c.slug} category={c} count={productsByCategory(c.slug).length} />)}
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Featured products">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Handpicked" title="Featured products" subtitle="Our team's favourites right now." />
          <Link to="/products" className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-royal hover:underline sm:inline-flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="mt-6 flex justify-center sm:hidden">
          <Link to="/products" className="inline-flex items-center gap-2 rounded-full border border-royal/30 px-5 py-2.5 text-sm font-semibold text-royal">
            View all products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Promotion">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-white shadow-royal sm:px-12 sm:py-16">
          <div className="absolute inset-0 opacity-70 gradient-royal mix-blend-overlay" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <Flame className="h-3.5 w-3.5 text-orange-300" /> Limited Time Offer
              </div>
              <h3 className="mt-4 font-display text-3xl font-black leading-tight sm:text-4xl">Up to 30% off on bestselling accessories</h3>
              <p className="mt-4 max-w-lg text-sm text-white/70">Grab premium tempered glass, earbuds and smart watches at unbeatable prices.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/deals" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-white/90">
                  See all deals <ArrowRight className="h-4 w-4" />
                </Link>
                <a href={inquiryUrl()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                  <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {bestsellers.map((p) => (
                <Link key={p.id} to="/products/$id" params={{ id: p.id }} className="group rounded-2xl bg-white/8 p-4 backdrop-blur transition-colors hover:bg-white/15 border border-white/10">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">{categories.find((c) => c.slug === p.category)?.name}</p>
                  <p className="mt-1 line-clamp-2 font-display text-sm font-bold">{p.name}</p>
                  <p className="mt-3 font-display text-lg font-extrabold">{SHOP.currency} {p.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      {newArrivals.length > 0 && (
        <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="New arrivals">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading eyebrow="Just In" title="New arrivals" subtitle="Fresh stock just added to the store." />
            <Link to="/products" search={{ sort: "newest" }} className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-royal hover:underline sm:inline-flex">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Customer reviews">
        <SectionHeading eyebrow="Reviews" title="What customers say" subtitle="Real feedback from buyers across Pakistan." />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {testimonials.map((t) => (
            <article key={t.name} className="rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-royal">
              <div className="flex items-center gap-0.5">{[...Array(t.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
              <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                <div className="grid h-9 w-9 place-items-center rounded-full gradient-royal text-royal-foreground text-sm font-bold shrink-0">{t.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-bold text-ink">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.city}</p>
                </div>
                <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-500" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="How to order">
        <SectionHeading eyebrow="How It Works" title="Order in 3 easy steps" subtitle="No account needed. No checkout. Just WhatsApp." />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { step: "01", title: "Browse Products", desc: "Explore our full catalog. Use search or filter by category.", icon: Sparkles },
            { step: "02", title: "Choose & Confirm", desc: "Pick your product, select quantity, and click 'Order on WhatsApp'.", icon: CheckCircle2 },
            { step: "03", title: "Delivered to You", desc: "Confirm on WhatsApp. We ship nationwide — fast and safely packed.", icon: Truck },
          ].map((s) => (
            <div key={s.step} className="relative rounded-3xl border border-border bg-card p-6 shadow-soft overflow-hidden">
              <span className="absolute -right-2 -top-4 font-display text-8xl font-black text-border/40 select-none">{s.step}</span>
              <div className="relative">
                <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-royal text-royal-foreground shadow-royal"><s.icon className="h-5 w-5" /></div>
                <h3 className="mt-5 font-display text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BUSINESS HOURS ── */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-3xl border border-border bg-accent/40 p-6 sm:grid-cols-3 sm:p-10">
          {[
            { icon: Clock, label: "Business Hours", value: SHOP.hours },
            { icon: MessageCircle, label: "WhatsApp", value: SHOP.phone },
            { icon: Truck, label: "Delivery", value: "Nationwide · Pakistan" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl gradient-royal text-royal-foreground shadow-royal"><item.icon className="h-5 w-5" /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                <p className="mt-0.5 font-display font-bold text-ink">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto mt-16 mb-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-white to-accent/60 p-8 text-center shadow-soft sm:p-12">
          <h3 className="font-display text-2xl font-black text-ink sm:text-3xl">Not sure what to buy?</h3>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">Message us your phone model and we'll suggest the perfect accessories — no obligation.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href={inquiryUrl()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--whatsapp)] px-6 py-3.5 text-sm font-semibold text-white shadow-royal hover:scale-[1.03] transition-transform">
              <MessageCircle className="h-4 w-4" /> Chat with an expert
            </a>
            <Link to="/products" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-ink hover:border-royal/40 transition-colors">
              Browse all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-black text-ink sm:text-3xl">{k}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{v}</p>
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-royal">{eyebrow}</p>}
      <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
    </div>
  );
}
