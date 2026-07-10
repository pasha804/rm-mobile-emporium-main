import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send, CheckCircle2 } from "lucide-react";
import { SHOP } from "@/lib/shop";
import { inquiryUrl, whatsappUrl } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — RM Mobile Shop" },
      {
        name: "description",
        content:
          "Reach RM Mobile Shop via WhatsApp, phone or email. Fast replies during business hours.",
      },
      { property: "og:title", content: "Contact Us — RM Mobile Shop" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [sent, setSent] = useState(false);
  const disabled = !form.name.trim() || !form.message.trim();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    const msg = [
      `Assalam-o-Alaikum, this is ${form.name}.`,
      form.contact ? `You can reach me at: ${form.contact}` : "",
      "",
      form.message,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappUrl(msg), "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-royal">Get in touch</p>
        <h1 className="mt-2 font-display text-4xl font-black text-ink sm:text-5xl">
          We'd love to help.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Questions about a product, delivery or bulk order? Reach out — we usually reply within an
          hour during business hours.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        {/* Contact info cards */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <InfoCard
            icon={MessageCircle}
            label="WhatsApp (Fastest)"
            value={SHOP.phone}
            href={inquiryUrl()}
            accent
          />
          <InfoCard
            icon={Phone}
            label="Call us"
            value={SHOP.phone}
            href={`tel:${SHOP.phoneRaw}`}
          />
          <InfoCard
            icon={Mail}
            label="Email"
            value={SHOP.email}
            href={`mailto:${SHOP.email}`}
          />

          {/* Delivery */}
          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl gradient-royal text-royal-foreground shadow-royal">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Delivery Area
                </p>
                <p className="mt-1 font-display font-bold text-ink">
                  Nationwide across {SHOP.address}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Karachi • Lahore • Islamabad • All cities
                </p>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl gradient-royal text-royal-foreground shadow-royal">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Business Hours
                </p>
                <p className="mt-1 font-display font-bold text-ink">{SHOP.hours}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  WhatsApp available 7 days a week
                </p>
              </div>
            </div>
          </div>

          {/* Quick tips */}
          <div className="rounded-3xl border border-royal/20 bg-royal/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-royal mb-3">
              Quick Tips
            </p>
            <ul className="space-y-2">
              {[
                "Share your phone model for best recommendations",
                "Ask about bulk order discounts",
                "Mention your city for delivery estimate",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-royal" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact form */}
        <form
          onSubmit={submit}
          className="rounded-3xl border border-border bg-card p-6 shadow-soft lg:col-span-3 sm:p-8"
        >
          <h2 className="font-display text-2xl font-black text-ink">Send a message</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your message will open in WhatsApp so we can chat directly.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Your name" required>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-muted-foreground/60 focus:border-royal focus:ring-1 focus:ring-royal/20 transition-colors"
                placeholder="Ali Ahmed"
              />
            </Field>
            <Field label="Phone / email (optional)">
              <input
                type="text"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-muted-foreground/60 focus:border-royal focus:ring-1 focus:ring-royal/20 transition-colors"
                placeholder="03xx xxxxxxx"
              />
            </Field>
          </div>

          <Field label="Message" required className="mt-4">
            <textarea
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={6}
              className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-muted-foreground/60 focus:border-royal focus:ring-1 focus:ring-royal/20 transition-colors"
              placeholder="Tell us about your phone model and what you're looking for…"
            />
          </Field>

          <button
            type="submit"
            disabled={disabled}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full gradient-royal py-3.5 text-sm font-bold text-royal-foreground shadow-royal transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {sent ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> Message Opened in WhatsApp!
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Send via WhatsApp
              </>
            )}
          </button>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Clicking sends will open WhatsApp with your message pre-filled.
          </p>
        </form>
      </div>

      {/* Map placeholder */}
      <div className="mt-12 overflow-hidden rounded-3xl border border-border shadow-soft">
        <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 h-72 flex items-center justify-center">
          <div className="text-center">
            <div className="grid h-16 w-16 mx-auto place-items-center rounded-full gradient-royal text-royal-foreground shadow-royal">
              <MapPin className="h-7 w-7" />
            </div>
            <p className="mt-4 font-display text-xl font-bold text-ink">RM Mobile Shop</p>
            <p className="mt-1 text-sm text-muted-foreground">Nationwide delivery across Pakistan</p>
            <a
              href={inquiryUrl("Hi RM MOBILE SHOP, I'd like to know your exact location.")}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full gradient-royal px-5 py-2.5 text-sm font-semibold text-royal-foreground shadow-royal"
            >
              <MessageCircle className="h-4 w-4" /> Ask for location on WhatsApp
            </a>
          </div>
          {/* Decorative grid */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  href,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className={`group flex items-center justify-between gap-4 rounded-3xl border p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-royal ${
        accent
          ? "border-transparent gradient-royal text-royal-foreground shadow-royal"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`grid h-11 w-11 place-items-center rounded-2xl ${
            accent ? "bg-white/20 text-white" : "gradient-royal text-royal-foreground shadow-royal"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p
            className={`text-xs font-semibold uppercase tracking-wider ${
              accent ? "text-white/70" : "text-muted-foreground"
            }`}
          >
            {label}
          </p>
          <p className={`mt-0.5 font-display font-bold ${accent ? "text-white" : "text-ink"}`}>
            {value}
          </p>
        </div>
      </div>
    </a>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-royal">*</span>}
      </span>
      {children}
    </label>
  );
}
