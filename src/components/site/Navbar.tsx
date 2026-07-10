import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, MessageCircle, Search, ShoppingBag } from "lucide-react";
import { SHOP } from "@/lib/shop";
import { inquiryUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/deals", label: "Deals" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass shadow-soft" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="RM Mobile Shop — Home">
          {/* Circular logo like a profile picture / DP */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-royal/40 shadow-royal transition-all duration-300 group-hover:ring-royal group-hover:scale-105 sm:h-14 sm:w-14">
            <img
              src={logoImg}
              alt="RM Mobile Shop"
              width={56}
              height={56}
              className="h-full w-full object-cover object-center"
            />
          </div>
          {/* Shop name text next to circular logo */}
          <div className="hidden flex-col sm:flex">
            <span className="font-display text-sm font-black leading-tight tracking-tight text-ink">
              RM MOBILE
            </span>
            <span className="font-display text-xs font-bold text-royal leading-tight tracking-[0.05em]">
              SHOP
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {links.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "text-royal" : "text-ink/70 hover:text-ink",
                )}
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full gradient-royal" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/products"
            aria-label="Search products"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-accent hover:text-royal sm:inline-flex"
          >
            <Search className="h-4.5 w-4.5" />
          </Link>
          <Link
            to="/products"
            aria-label="Shop products"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-accent hover:text-royal md:inline-flex lg:hidden"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
          </Link>
          <a
            href={inquiryUrl()}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            className="hidden items-center gap-2 rounded-full gradient-royal px-4 py-2.5 text-sm font-semibold text-royal-foreground shadow-royal transition-all hover:scale-[1.04] hover:shadow-lg sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 text-ink hover:bg-accent lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-[max-height,opacity] duration-300",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="mx-4 mb-4 rounded-2xl glass p-3 shadow-soft">
          <ul className="flex flex-col">
            {links.map((l) => {
              const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
              return (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className={cn(
                      "block rounded-xl px-4 py-3 text-sm font-medium",
                      active ? "bg-accent text-royal" : "text-ink/80 hover:bg-accent/60",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2">
              <a
                href={inquiryUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl gradient-royal px-4 py-3 text-sm font-semibold text-royal-foreground shadow-royal"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
