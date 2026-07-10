/**
 * Admin layout route.
 * NO beforeLoad / SSR auth checks — localStorage is browser-only.
 * Auth guard is enforced client-side inside AdminShell via useEffect.
 */
import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Package, Tag, Settings, LogOut,
  Menu, X, ChevronRight, ExternalLink, Bell,
} from "lucide-react";
import { isAdminLoggedIn, adminLogout, getSettings } from "@/lib/adminStore";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const navItems = [
  { to: "/admin/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { to: "/admin/products",   label: "Products",   icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/settings",   label: "Settings",   icon: Settings },
] as const;

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLoginOrRoot =
    pathname === "/admin/login" ||
    pathname === "/admin" ||
    pathname === "/admin/";
  if (isLoginOrRoot) return <Outlet />;
  return <AdminShell />;
}

function AdminShell() {
  const [authReady, setAuthReady] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Client-side auth guard — runs only in the browser
  useEffect(() => {
    if (!isAdminLoggedIn()) {
      window.location.replace("/admin/login");
    } else {
      setAuthReady(true);
    }
  }, []);

  useEffect(() => { setSideOpen(false); }, [pathname]);

  function handleLogout() {
    adminLogout();
    window.location.replace("/admin/login");
  }

  const currentPage = navItems.find((n) => pathname.startsWith(n.to))?.label ?? "Admin";

  // Show spinner while checking auth
  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-royal" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sideOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSideOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 border-r border-slate-800 transition-transform duration-300 lg:static lg:translate-x-0",
        sideOpen ? "translate-x-0" : "-translate-x-full",
      )}>
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-4">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-royal/50">
            <img src={logoImg} alt="RM Mobile Shop" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="font-display text-sm font-black leading-tight text-white">RM MOBILE</p>
            <p className="text-[10px] font-semibold leading-tight text-royal-glow">ADMIN PANEL</p>
          </div>
          <button
            type="button"
            onClick={() => setSideOpen(false)}
            className="ml-auto grid h-7 w-7 place-items-center rounded-lg text-slate-500 hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
            Navigation
          </p>
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active ? "bg-royal text-white shadow-royal" : "text-slate-400 hover:bg-slate-800 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
                {active && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="space-y-1 border-t border-slate-800 p-4">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ExternalLink className="h-4 w-4" /> View Store
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 border-b border-slate-800 bg-slate-900/60 px-4 py-3 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setSideOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs text-slate-500">Admin Panel</p>
            <h1 className="font-display text-base font-bold text-white">{currentPage}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-label="Notifications"
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <Bell className="h-4 w-4" />
            </button>
            <div className="h-9 w-9 overflow-hidden rounded-full ring-1 ring-slate-700">
              <img src={logoImg} alt="Admin" className="h-full w-full object-cover" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
