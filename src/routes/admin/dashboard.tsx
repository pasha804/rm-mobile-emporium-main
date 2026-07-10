import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Tag, Star, TrendingUp, ArrowRight, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { getAdminProducts, getAdminCategories, getSettings } from "@/lib/adminStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/dashboard")({ component: Dashboard });

function Dashboard() {
  const products = getAdminProducts();
  const categories = getAdminCategories();
  const settings = getSettings();

  const inStock = products.filter((p) => p.inStock).length;
  const onSale = products.filter((p) => p.oldPrice).length;
  const featured = products.filter((p) => p.featured).length;
  const bestSellers = products.filter((p) => p.bestSeller).length;
  const newArrivals = products.filter((p) => p.newArrival).length;
  const recent = [...products].slice(0, 6);
  const avgRating = (products.reduce((a, p) => a + p.rating, 0) / (products.length || 1)).toFixed(1);

  const stats = [
    { label: "Total Products",    value: products.length, icon: Package,    color: "from-blue-500 to-royal",    sub: `${inStock} in stock` },
    { label: "Categories",        value: categories.length, icon: Tag,      color: "from-violet-500 to-purple-700", sub: "All active" },
    { label: "On Sale",           value: onSale,          icon: TrendingUp, color: "from-emerald-400 to-teal-600", sub: "With discounts" },
    { label: "Avg. Rating",       value: avgRating,       icon: Star,       color: "from-amber-400 to-orange-500", sub: "Customer score" },
    { label: "Featured",          value: featured,        icon: DollarSign, color: "from-pink-500 to-rose-600",    sub: "On homepage" },
    { label: "Best Sellers",      value: bestSellers,     icon: TrendingUp, color: "from-cyan-400 to-blue-600",    sub: "Top products" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-800 to-slate-900 p-6">
        <p className="text-sm text-slate-400">Welcome back 👋</p>
        <h2 className="mt-1 font-display text-2xl font-black text-white">{settings.name}</h2>
        <p className="mt-1 text-sm text-slate-400">Admin Panel — Manage your store from here.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/admin/products" className="inline-flex items-center gap-2 rounded-xl bg-royal px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
            <Package className="h-4 w-4" /> Manage Products
          </Link>
          <Link to="/" target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors">
            View Store <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">{s.label}</p>
              <div className={cn("grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br text-white", s.color)}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 font-display text-3xl font-black text-white">{s.value}</p>
            <p className="mt-0.5 text-xs text-slate-500">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick inventory */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent products */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <h3 className="font-display font-bold text-white">Recent Products</h3>
            <Link to="/admin/products" className="text-xs text-royal hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-800">
            {recent.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                <div className="h-10 w-10 rounded-xl bg-slate-800 grid place-items-center shrink-0">
                  <Package className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.category} · Rs. {p.price.toLocaleString()}</p>
                </div>
                {p.inStock
                  ? <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  : <XCircle className="h-4 w-4 text-red-400 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <h3 className="font-display font-bold text-white">Category Breakdown</h3>
            <Link to="/admin/categories" className="text-xs text-royal hover:underline">Manage</Link>
          </div>
          <div className="divide-y divide-slate-800">
            {categories.slice(0, 6).map((c) => {
              const count = products.filter((p) => p.category === c.slug).length;
              const pct = Math.round((count / (products.length || 1)) * 100);
              return (
                <div key={c.slug} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm text-white">{c.name}</p>
                    <p className="text-xs text-slate-400">{count} products</p>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-royal transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="font-display font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { to: "/admin/products", label: "Add Product",    icon: Package,    color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
            { to: "/admin/categories", label: "Categories",   icon: Tag,        color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
            { to: "/admin/settings",  label: "Settings",      icon: ArrowRight, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
            { to: "/",               label: "View Store",     icon: TrendingUp, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
          ].map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              target={to === "/" ? "_blank" : undefined}
              className={cn("flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-opacity hover:opacity-80", color)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-semibold">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
