import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  MessageCircle,
  Plus,
  Share2,
  Star,
  Truck,
  ShieldCheck,
  Tag,
  Package,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { categories, getProduct, products as staticProducts, type Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { apiGetProducts } from "@/lib/api";
import { ProductCard } from "@/components/site/ProductCard";
import { SHOP } from "@/lib/shop";
import { orderUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products_/$id")({
  loader: async ({ params }) => {
    // Try the API first (works cross-browser), fall back to static data
    let product: Product | undefined;
    try {
      const apiProducts = await apiGetProducts();
      if (apiProducts) product = apiProducts.find((p) => p.id === params.id);
    } catch { /* ignore */ }
    if (!product) product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Product not found — RM Mobile Shop" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — RM Mobile Shop` },
        { name: "description", content: p.description },
        { property: "og:title", content: `${p.name} — RM Mobile Shop` },
        { property: "og:description", content: p.description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/products/${p.id}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/products/${p.id}` }],
    };
  },
  component: ProductDetail,
});

// Per-category Unsplash image URLs (consistent, no random flicker)
const categoryImages: Record<string, string[]> = {
  "tempered-glass": [
    "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80",
  ],
  "mobile-covers": [
    "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80",
    "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
  ],
  chargers: [
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800&q=80",
  ],
  "data-cables": [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80",
    "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800&q=80",
  ],
  neckbands: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
  ],
  earbuds: [
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  ],
  "power-banks": [
    "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80",
    "https://images.unsplash.com/photo-1585338447937-7082f8fc763d?w=800&q=80",
    "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800&q=80",
  ],
  "smart-watches": [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
    "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80",
  ],
  handfrees: [
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
  ],
  speakers: [
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
    "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  ],
  batteries: [
    "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80",
    "https://images.unsplash.com/photo-1585338447937-7082f8fc763d?w=800&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  ],
  "gaming-thumbs": [
    "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80",
    "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80",
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80",
  ],
};

function getProductImages(category: string): string[] {
  return (
    categoryImages[category] || [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80",
    ]
  );
}

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < Math.floor(rating)
                ? "fill-amber-400 text-amber-400"
                : i < rating
                  ? "fill-amber-200 text-amber-400"
                  : "text-border fill-border",
            )}
          />
        ))}
      </div>
      <span className="font-semibold text-ink text-sm">{rating.toFixed(1)}</span>
      <span className="text-muted-foreground text-sm">({reviews} reviews)</span>
    </div>
  );
}

function ProductDetail() {
  const { product } = Route.useLoaderData() as { product: Product };
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  const category = categories.find((c) => c.slug === product.category)!;
  const Icon = category.icon;
  const total = qty * product.price;
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const images = (product.images && product.images.length > 0)
    ? product.images
    : getProductImages(product.category);

  const allProducts = useProducts();
  const related = useMemo(
    () => allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4),
    [product, allProducts],
  );

  const whatsappOrderUrl = orderUrl({
    productName: product.name,
    price: product.price,
    quantity: qty,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex flex-wrap items-center gap-1.5 text-xs font-medium text-muted-foreground"
      >
        <Link to="/" className="hover:text-royal transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
        <Link to="/products" className="hover:text-royal transition-colors">Products</Link>
        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
        <Link
          to="/products"
          search={{ category: category.slug }}
          className="hover:text-royal transition-colors"
        >
          {category.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
        <span className="line-clamp-1 text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* ── GALLERY ── */}
        <div className="flex flex-col gap-4">
          {/* Main image */}
          <div
            className={cn(
              "group relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-white shadow-royal ring-1 ring-border",
            )}
          >
            {!imgError[activeImg] ? (
              <img
                src={images[activeImg]}
                alt={product.name}
                className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                onError={() => setImgError((prev) => ({ ...prev, [activeImg]: true }))}
              />
            ) : (
              /* Fallback to gradient + icon */
              <div className="flex flex-col items-center gap-4">
                <Icon className="h-40 w-40 text-white drop-shadow-2xl" strokeWidth={1.2} />
                <span className="text-white/70 text-sm font-semibold">{product.name}</span>
              </div>
            )}

            {/* Overlay shimmer */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

            {/* Action buttons */}
            <div className="absolute right-4 top-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setWishlist((v) => !v)}
                aria-label={wishlist ? "Remove from wishlist" : "Add to wishlist"}
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-full glass transition-colors",
                  wishlist ? "text-rose-500" : "text-white hover:text-rose-400",
                )}
              >
                <Heart className={cn("h-4 w-4", wishlist && "fill-rose-500")} />
              </button>
              <button
                type="button"
                aria-label="Share"
                onClick={() =>
                  navigator.share?.({ title: product.name, url: location.href }).catch(() => {})
                }
                className="grid h-10 w-10 place-items-center rounded-full glass text-white hover:text-royal transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-1.5">
              {discount > 0 && (
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-royal shadow-soft">
                  −{discount}% OFF
                </span>
              )}
              {product.newArrival && (
                <span className="rounded-full bg-ink/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                  New
                </span>
              )}
              {product.bestSeller && (
                <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Best Seller
                </span>
              )}
            </div>

            {!product.inStock && (
              <div className="absolute inset-x-0 bottom-0 bg-ink/80 py-3 text-center text-xs font-bold uppercase tracking-widest text-white backdrop-blur">
                Out of Stock
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImg(i)}
                aria-label={`Image ${i + 1}`}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-2xl ring-2 transition-all duration-300 bg-white",
                  activeImg === i
                    ? "ring-royal shadow-royal scale-[1.03]"
                    : "ring-border hover:ring-royal/40",
                )}
              >
                {!imgError[i] ? (
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    onError={() => setImgError((prev) => ({ ...prev, [i]: true }))}
                  />
                ) : (
                  <div className={cn("flex h-full items-center justify-center bg-gradient-to-br", category.tint)}>
                    <Icon className="h-10 w-10 text-white/80" strokeWidth={1.4} />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Truck, label: "Fast Delivery" },
              { icon: ShieldCheck, label: "7-Day Return" },
              { icon: Package, label: "Secure Pack" },
              { icon: Sparkles, label: "Genuine" },
            ].map(({ icon: TIcon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card py-3 text-center shadow-soft"
              >
                <TIcon className="h-4 w-4 text-royal" />
                <span className="text-[10px] font-semibold text-muted-foreground leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── INFO ── */}
        <div className="flex flex-col">
          {/* Category + stock */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-royal">
              <Icon className="h-3.5 w-3.5" />
              {category.name}
            </span>
            {product.inStock ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                <Check className="h-3 w-3" /> In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-600">
                Out of Stock
              </span>
            )}
          </div>

          <h1 className="mt-4 font-display text-3xl font-black leading-tight text-ink sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3">
            <StarRating rating={product.rating} reviews={product.reviews} />
          </div>

          {/* Price */}
          <div className="mt-5 flex flex-wrap items-end gap-3">
            <p className="font-display text-4xl font-black text-ink">
              {SHOP.currency} {product.price.toLocaleString()}
            </p>
            {product.oldPrice && (
              <>
                <p className="text-xl text-muted-foreground line-through">
                  {SHOP.currency} {product.oldPrice.toLocaleString()}
                </p>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  Save {SHOP.currency} {(product.oldPrice - product.price).toLocaleString()}
                </span>
              </>
            )}
          </div>

          <p className="mt-5 border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {/* Features */}
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-3">
              Key Features
            </p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {product.features.map((f: string) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full gradient-royal text-royal-foreground">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Order box */}
          <div className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Quantity
                </p>
                <div className="inline-flex items-center rounded-full border border-border bg-white shadow-soft">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    disabled={qty <= 1}
                    className="grid h-11 w-11 place-items-center rounded-l-full transition-colors hover:bg-accent disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-14 text-center font-display text-lg font-bold text-ink" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="grid h-11 w-11 place-items-center rounded-r-full transition-colors hover:bg-accent"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Total Price
                </p>
                <p className="font-display text-3xl font-black text-ink" aria-live="polite">
                  {SHOP.currency} {total.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {qty} × {SHOP.currency} {product.price.toLocaleString()}
                </p>
              </div>
            </div>

            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noreferrer"
              aria-disabled={!product.inStock}
              onClick={(e) => { if (!product.inStock) e.preventDefault(); }}
              className={cn(
                "mt-5 flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-sm font-bold shadow-royal transition-all duration-300",
                product.inStock
                  ? "bg-[var(--whatsapp)] text-white hover:scale-[1.02]"
                  : "cursor-not-allowed bg-muted text-muted-foreground",
              )}
            >
              <MessageCircle className="h-5 w-5" />
              {product.inStock ? "Order on WhatsApp" : "Out of Stock"}
            </a>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              Order message will be pre-filled automatically
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="h-4 w-4 text-royal shrink-0" /> Nationwide delivery
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-royal shrink-0" /> 7-day replacement
              </div>
            </div>
          </div>

          {/* Specs */}
          <div className="mt-6 rounded-3xl border border-border p-5 sm:p-6">
            <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
              <Tag className="h-4 w-4 text-royal" /> Specifications
            </h3>
            <dl className="mt-4 divide-y divide-border">
              {(Object.entries(product.specs) as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5 text-sm">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-24" aria-label="Related products">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-royal">More like this</p>
              <h2 className="mt-1 font-display text-2xl font-black text-ink sm:text-3xl">
                You may also like
              </h2>
            </div>
            <Link
              to="/products"
              search={{ category: category.slug }}
              className="hidden items-center gap-1.5 text-sm font-semibold text-royal hover:underline sm:inline-flex"
            >
              <ArrowLeft className="h-4 w-4 rotate-180" />
              More in {category.name}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
