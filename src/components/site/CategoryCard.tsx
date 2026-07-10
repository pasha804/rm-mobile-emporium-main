import { Link } from "@tanstack/react-router";
import type { Category } from "@/data/products";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

export function CategoryCard({ category, count }: { category: Category; count: number }) {
  const Icon = category.icon;
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to="/products"
      search={{ category: category.slug }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl min-h-40 text-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-royal"
    >
      {/* Background: real image or gradient fallback */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", category.tint)} />

      {!imgError && category.image && (
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      )}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_-10%,rgba(255,255,255,0.15),transparent_60%)]" />

      {/* Content */}
      <div className="relative flex items-start justify-between p-4 sm:p-5">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
          <Icon className="h-5 w-5 text-white" strokeWidth={1.6} />
        </div>
        <ArrowUpRight className="h-5 w-5 opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>

      <div className="relative p-4 sm:p-5">
        <h3 className="font-display text-base font-extrabold leading-tight sm:text-lg">{category.name}</h3>
        <p className="mt-0.5 text-xs font-medium text-white/80">{count} product{count === 1 ? "" : "s"}</p>
      </div>
    </Link>
  );
}
