import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";
import { categories } from "@/data/products";
import { SHOP } from "@/lib/shop";
import { cn } from "@/lib/utils";

// Per-category product image map (Unsplash, consistent IDs)
const categoryImgMap: Record<string, string> = {
  "tempered-glass": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&q=75",
  "mobile-covers":  "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&q=75",
  "chargers":       "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=75",
  "data-cables":    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=75",
  "neckbands":      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=75",
  "earbuds":        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=75",
  "power-banks":    "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=75",
  "smart-watches":  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=75",
  "handfrees":      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=75",
  "speakers":       "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=75",
  "batteries":      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=75",
  "gaming-thumbs":  "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&q=75",
};

export function ProductCard({ product }: { product: Product }) {
  const category = categories.find((c) => c.slug === product.category)!;
  const Icon = category.icon;
  const [imgError, setImgError] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const imgSrc = product.images?.[0] || categoryImgMap[product.category];

  return (
    <Link
      to="/products/$id"
      params={{ id: product.id }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-royal"
    >
      {/* Product image */}
      <div
        className={cn(
          "relative flex aspect-square items-center justify-center overflow-hidden bg-white",
          /* keep the gradient tint only for the icon fallback */
        )}
      >
        {!imgError && imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Gradient + icon fallback */
          <div className={cn("absolute inset-0 flex items-center justify-center bg-gradient-to-br", category.tint)}>
            <Icon
              className="h-24 w-24 text-white/95 drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
              strokeWidth={1.4}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
          </div>
        )}

        {/* Light bottom gradient — subtle depth */}
        {!imgError && (
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-royal shadow-soft">
              −{discount}%
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

        {/* Wishlist button */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); setWishlist((v) => !v); }}
          aria-label={wishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full glass transition-colors",
            wishlist ? "text-rose-500" : "text-white hover:text-rose-400",
          )}
        >
          <Heart className={cn("h-4 w-4", wishlist && "fill-rose-500")} />
        </button>

        {!product.inStock && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/85 py-2 text-center text-xs font-semibold uppercase tracking-widest text-white backdrop-blur">
            Out of stock
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {category.name}
        </span>
        <h3 className="line-clamp-2 font-display text-base font-bold text-ink transition-colors group-hover:text-royal">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-ink">{product.rating.toFixed(1)}</span>
          <span>({product.reviews})</span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <span className="font-display text-lg font-extrabold text-ink">
              {SHOP.currency} {product.price.toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="mt-0.5 block text-xs text-muted-foreground line-through">
                {SHOP.currency} {product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          <span className="rounded-full gradient-royal px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-royal-foreground opacity-0 transition-opacity group-hover:opacity-100">
            View
          </span>
        </div>
      </div>
    </Link>
  );
}
