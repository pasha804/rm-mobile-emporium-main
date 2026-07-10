import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Sparkles, TrendingUp, Timer, Tag, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/site/ProductCard";
import type { Product } from "@/data/products";export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Deals & Offers — RM Mobile Shop" },
      {
        name: "description",
        content:
          "Discounted mobile accessories, best sellers and new arrivals. Limited-time offers, updated regularly.",
      },
      { property: "og:title", content: "Deals & Offers — RM Mobile Shop" },
      { property: "og:url", content: "/deals" },
    ],
    links: [{ rel: "canonical", href: "/deals" }],
  }),
  component: DealsPage,
});

// Countdown to end of week (next Sunday midnight)
function useCountdown() {
  const getTarget = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const daysUntilSunday = day === 0 ? 7 : 7 - day;
    const target = new Date(now);
    target.setDate(now.getDate() + daysUntilSunday);
    target.setHours(23, 59, 59, 0);
    return target.getTime();
  };

  const calc = () => {
    const diff = Math.max(0, getTarget() - Date.now());
    return {
      d: Math.floor(diff / 86_400_000),
      h: Math.floor((diff % 86_400_000) / 3_600_000),
      m: Math.floor((diff % 3_600_000) / 60_000),
      s: Math.floor((diff % 60_000) / 1_000),
    };
  };

  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return time;
}

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white/15 px-4 py-3 backdrop-blur min-w-[64px]">
      <span className="font-display text-3xl font-black tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider opacity-70">
        {label}
      </span>
    </div>
  );
}

function DealsPage() {
  const countdown = useCountdown();
  // API-backed: static on SSR, fetches from backend on client — no localStorage
  const products = useProducts();
  const discounted = products.filter((p) => p.oldPrice);
  const featured = products.filter((p) => p.featured);
  const newArrivals = products.filter((p) => p.newArrival);
  const topSelling = products.filter((p) => p.bestSeller);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[2rem] bg-ink p-8 text-white shadow-royal sm:p-14">
        <div className="absolute inset-0 opacity-80 gradient-royal mix-blend-overlay" />
        <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -top-8 -right-8 h-48 w-48 rounded-full bg-white/8 blur-2xl" />
        <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Flame className="h-3.5 w-3.5 text-orange-300" /> Hot right now
            </span>
            <h1 className="mt-4 font-display text-4xl font-black leading-tight sm:text-5xl">
              Deals worth grabbing.
            </h1>
            <p className="mt-4 max-w-lg text-sm text-white/70 sm:text-base">
              Save big on tempered glass, earbuds, power banks and more. Limited stock, unlimited
              value.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-white/90 transition-colors"
            >
              Shop all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Countdown */}
          <div className="flex flex-col items-start lg:items-end gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/90 backdrop-blur">
              <Timer className="h-4 w-4" /> Offer ends in:
            </div>
            <div className="flex items-center gap-2">
              <CountdownBlock value={countdown.d} label="Days" />
              <span className="font-display text-2xl font-black opacity-60">:</span>
              <CountdownBlock value={countdown.h} label="Hours" />
              <span className="font-display text-2xl font-black opacity-60">:</span>
              <CountdownBlock value={countdown.m} label="Mins" />
              <span className="font-display text-2xl font-black opacity-60">:</span>
              <CountdownBlock value={countdown.s} label="Secs" />
            </div>
            <p className="text-xs text-white/50">Offers refresh weekly — check back for new deals</p>
          </div>
        </div>
      </div>

      {/* Saving highlights */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Tag, label: "Up to 30% Off", sub: "On selected items" },
          { icon: Flame, label: `${discounted.length} Deals Live`, sub: "Active discounts" },
          { icon: Sparkles, label: `${newArrivals.length} New Arrivals`, sub: "Just added" },
          { icon: TrendingUp, label: `${topSelling.length} Best Sellers`, sub: "Most popular" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-royal text-royal-foreground shadow-royal">
              <item.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-ink">{item.label}</p>
              <p className="text-[11px] text-muted-foreground">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <Section eyebrow="Discounted" icon={Flame} title="Special discounts" items={discounted} />
      <Section
        eyebrow="Top Selling"
        icon={TrendingUp}
        title="Best selling right now"
        items={topSelling}
      />
      <Section eyebrow="Featured" icon={Sparkles} title="Featured picks" items={featured} />
      <Section eyebrow="Just In" icon={Sparkles} title="New arrivals" items={newArrivals} />

      <div className="mt-16 rounded-3xl border border-border bg-accent/40 p-8 text-center">
        <h3 className="font-display text-2xl font-black text-ink">
          Looking for something specific?
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse the full catalog or message us for personalised recommendations.
        </p>
        <Link
          to="/products"
          className="mt-5 inline-flex items-center gap-2 rounded-full gradient-royal px-5 py-3 text-sm font-semibold text-royal-foreground shadow-royal hover:scale-[1.03] transition-transform"
        >
          Shop all products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  icon: Icon,
  items,
}: {
  eyebrow: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: Product[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="mt-16">
      <div className="flex items-center gap-3 mb-6">
        <span className="grid h-10 w-10 place-items-center rounded-full gradient-royal text-royal-foreground shadow-royal">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-royal">
            {eyebrow}
          </p>
          <h2 className="font-display text-2xl font-black text-ink sm:text-3xl">{title}</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {items.slice(0, 8).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
