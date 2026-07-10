import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { categories } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/site/ProductCard";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  category: fallback(z.string(), "").default(""),
  sort: fallback(z.string(), "featured").default("featured"),
  stock: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/products")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Shop All Products — RM Mobile Shop" },
      { name: "description", content: "Browse premium mobile accessories: covers, chargers, earbuds, power banks, smart watches and more. Order on WhatsApp." },
      { property: "og:title", content: "Shop All Products — RM Mobile Shop" },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

const sorts = [
  { v: "featured", l: "Featured" },
  { v: "newest", l: "Newest" },
  { v: "best", l: "Best Selling" },
  { v: "price-asc", l: "Price: Low → High" },
  { v: "price-desc", l: "Price: High → Low" },
  { v: "az", l: "A → Z" },
];

function ProductsPage() {
  const { q, category, sort, stock } = Route.useSearch();
  const navigate = useNavigate({ from: "/products" });
  const [term, setTerm] = useState(q);

  // API-backed: static on SSR, fetches from backend on client — no localStorage
  const products = useProducts();

  useEffect(() => setTerm(q), [q]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (term !== q) navigate({ search: (prev: Record<string, string>) => ({ ...prev, q: term }) });
    }, 220);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (stock === "in" && !p.inStock) return false;
      if (!needle) return true;
      return (
        p.name.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle)
      );
    });
    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "az": list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
      case "newest": list = [...list].sort((a, b) => Number(!!b.newArrival) - Number(!!a.newArrival)); break;
      case "best": list = [...list].sort((a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller) || b.rating - a.rating); break;
      default: list = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
    return list;
  }, [products, q, category, sort, stock]);

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
      <header className="grid gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-royal">All Products</p>
        <h1 className="font-display text-3xl font-black text-ink sm:text-4xl">
          {activeCategory ? activeCategory.name : "Shop everything"}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {filtered.length} product{filtered.length === 1 ? "" : "s"} found. Tap any item to view details and order on WhatsApp.
        </p>
      </header>

      {/* Toolbar */}
      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft sm:flex-row sm:items-center">
        <label className="relative flex flex-1 items-center">
          <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={term}
            placeholder="Search products, categories…"
            aria-label="Search products"
            onChange={(e) => setTerm(e.target.value)}
            className="w-full rounded-xl border border-transparent bg-accent/40 px-10 py-2.5 text-sm text-ink outline-none placeholder:text-muted-foreground focus:border-royal focus:bg-white"
          />
        </label>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs font-medium text-muted-foreground sm:inline-flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Sort
          </span>
          <select
            value={sort}
            onChange={(e) => navigate({ search: (prev: Record<string, string>) => ({ ...prev, sort: e.target.value }) })}
            className="rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-medium text-ink outline-none focus:border-royal"
            aria-label="Sort by"
          >
            {sorts.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
          </select>
          <select
            value={stock}
            onChange={(e) => navigate({ search: (prev: Record<string, string>) => ({ ...prev, stock: e.target.value }) })}
            className="rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-medium text-ink outline-none focus:border-royal"
            aria-label="Availability"
          >
            <option value="">All items</option>
            <option value="in">In stock only</option>
          </select>
        </div>
      </div>

      {/* Category pills */}
      <div className="mt-4 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <PillLink to="/products" search={{ category: "" }} active={!category}>All</PillLink>
        {categories.map((c) => (
          <PillLink key={c.slug} to="/products" search={{ category: c.slug }} active={category === c.slug}>
            {c.name}
          </PillLink>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-lg font-bold text-ink">No products match your search.</p>
          <p className="mt-2 text-sm text-muted-foreground">Try a different keyword or clear the filters.</p>
          <Link to="/products" search={{ q: "", category: "", sort: "featured", stock: "" }} className="mt-6 inline-flex items-center gap-2 rounded-full gradient-royal px-5 py-2.5 text-sm font-semibold text-royal-foreground shadow-royal">
            <X className="h-4 w-4" /> Clear filters
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

function PillLink({ to, search, active, children }: { to: string; search: Record<string, string>; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      search={(prev: Record<string, unknown>) => ({ ...prev, ...search })}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active ? "border-royal bg-royal text-royal-foreground shadow-royal" : "border-border bg-white text-ink/70 hover:border-royal/40 hover:text-royal",
      )}
    >
      {children}
    </Link>
  );
}
