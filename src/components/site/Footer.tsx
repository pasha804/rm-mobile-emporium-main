import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SHOP } from "@/lib/shop";
import { inquiryUrl } from "@/lib/whatsapp";
import { categories } from "@/data/products";
import logoImg from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white/80" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" aria-label="RM Mobile Shop — Home" className="flex items-center gap-3 group">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-white/20 shadow-royal transition-all duration-300 group-hover:ring-white/40">
                <img
                  src={logoImg}
                  alt="RM Mobile Shop Logo"
                  className="h-full w-full object-cover object-center brightness-110"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-base font-black text-white leading-tight">RM MOBILE</span>
                <span className="font-display text-sm font-bold text-royal-glow leading-tight tracking-wider">SHOP</span>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {SHOP.tagline}. Trusted mobile accessories delivered across Pakistan with WhatsApp ordering.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href={inquiryUrl()}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white transition-colors hover:bg-[var(--whatsapp)]"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white transition-colors hover:bg-pink-600"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white transition-colors hover:bg-blue-600"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { to: "/", l: "Home" },
                { to: "/products", l: "All Products" },
                { to: "/deals", l: "Deals & Offers" },
                { to: "/about", l: "About Us" },
                { to: "/contact", l: "Contact" },
              ].map((i) => (
                <li key={i.to}>
                  <Link to={i.to} className="text-white/60 transition-colors hover:text-white">{i.l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Categories</h4>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {categories.slice(0, 8).map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/products"
                    search={{ category: c.slug }}
                    className="text-white/60 transition-colors hover:text-white"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Get in Touch</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-royal-glow" />
                <span>{SHOP.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-royal-glow" />
                <a href={inquiryUrl()} target="_blank" rel="noreferrer" className="hover:text-white">
                  WhatsApp Us
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-royal-glow" />
                <a href={`mailto:${SHOP.email}`} className="hover:text-white break-all">{SHOP.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-royal-glow" />
                <span>Nationwide delivery across {SHOP.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {SHOP.name}. All rights reserved.</p>
          <p>Smart Accessories • Smart Choice  •  {SHOP.hours}</p>
        </div>
      </div>
    </footer>
  );
}
