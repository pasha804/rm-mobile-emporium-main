import {
  Shield, Smartphone, Zap, Cable, Headphones, Watch, BatteryCharging,
  Volume2, Battery, Gamepad2, Ear, Radio, type LucideIcon,
} from "lucide-react";

export type CategorySlug =
  | "tempered-glass" | "mobile-covers" | "chargers" | "data-cables"
  | "neckbands" | "earbuds" | "power-banks" | "smart-watches"
  | "handfrees" | "speakers" | "batteries" | "gaming-thumbs";

export type Category = {
  slug: CategorySlug;
  name: string;
  icon: LucideIcon;
  tint: string;
  image: string;
};

export const categories: Category[] = [
  { slug: "tempered-glass", name: "Tempered Glass", icon: Shield,         tint: "from-sky-500 to-blue-700",       image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=75" },
  { slug: "mobile-covers",  name: "Mobile Covers",  icon: Smartphone,     tint: "from-indigo-500 to-blue-800",    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&q=75" },
  { slug: "chargers",       name: "Chargers",       icon: Zap,            tint: "from-amber-400 to-orange-600",   image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=75" },
  { slug: "data-cables",    name: "Data Cables",    icon: Cable,          tint: "from-emerald-400 to-teal-700",   image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75" },
  { slug: "neckbands",      name: "Neckbands",      icon: Radio,          tint: "from-fuchsia-500 to-purple-700", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=75" },
  { slug: "earbuds",        name: "Earbuds",        icon: Headphones,     tint: "from-blue-500 to-indigo-800",    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=75" },
  { slug: "power-banks",    name: "Power Banks",    icon: BatteryCharging,tint: "from-lime-400 to-green-700",     image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=75" },
  { slug: "smart-watches",  name: "Smart Watches",  icon: Watch,          tint: "from-slate-500 to-slate-900",    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=75" },
  { slug: "handfrees",      name: "Handfrees",      icon: Ear,            tint: "from-rose-400 to-red-700",       image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&q=75" },
  { slug: "speakers",       name: "Speakers",       icon: Volume2,        tint: "from-cyan-400 to-blue-700",      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=75" },
  { slug: "batteries",      name: "Batteries",      icon: Battery,        tint: "from-yellow-400 to-amber-700",   image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=75" },
  { slug: "gaming-thumbs",  name: "Gaming Thumbs",  icon: Gamepad2,       tint: "from-violet-500 to-indigo-800",  image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&q=75" },
];

export type Product = {
  id: string;
  name: string;
  category: CategorySlug;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  description: string;
  features: string[];
  specs: Record<string, string>;
  images?: string[];   // base64 data URLs or https:// URLs — up to 5 per product
};

export const products: Product[] = [];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const productsByCategory = (slug: string) => products.filter((p) => p.category === slug);
