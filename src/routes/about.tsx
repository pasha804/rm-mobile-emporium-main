import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  HandHeart,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  CheckCircle2,
  MessageCircle,
  Truck,
  Headphones,
  Star,
} from "lucide-react";
import { inquiryUrl } from "@/lib/whatsapp";
import { SHOP } from "@/lib/shop";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — RM Mobile Shop" },
      {
        name: "description",
        content:
          "RM Mobile Shop delivers premium mobile accessories at fair prices across Pakistan — with honest advice and WhatsApp ordering.",
      },
      { property: "og:title", content: "About Us — RM Mobile Shop" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const values = [
  {
    icon: Target,
    title: "Our Mission",
    text: "To make premium mobile accessories accessible, affordable and effortless for every Pakistani.",
  },
  {
    icon: Rocket,
    title: "Our Vision",
    text: "Become the most trusted mobile accessories destination — the one shop friends recommend without hesitation.",
  },
  {
    icon: Sparkles,
    title: "Our Story",
    text: "Started as a small counter shop and grown by word of mouth into an online-first store loved by hundreds of daily customers.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Commitment",
    text: "Every product is tested before shipping. If it isn't good enough for our own phones, we won't sell it.",
  },
  {
    icon: HandHeart,
    title: "Customer Satisfaction",
    text: "Fast WhatsApp support, honest suggestions and easy replacements — because your trust is everything.",
  },
  {
    icon: Award,
    title: "Why Choose Us",
    text: "Curated selection, fair prices, real humans on WhatsApp and quick delivery across Pakistan.",
  },
];

const whyUs = [
  { icon: CheckCircle2, text: "100% genuine and quality-tested products" },
  { icon: Truck, text: "Fast and secure nationwide delivery" },
  { icon: Headphones, text: "Real human support — no bots, no wait queues" },
  { icon: ShieldCheck, text: "7-day replacement guarantee on eligible items" },
  { icon: Star, text: "4.8★ average rating from 2,000+ satisfied customers" },
  { icon: MessageCircle, text: "Instant WhatsApp ordering — no account needed" },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[2rem] gradient-royal p-10 text-royal-foreground shadow-royal sm:p-16">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
            About {SHOP.name}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-black leading-tight sm:text-5xl">
            A modern mobile accessories store, built on trust.
          </h1>
          <p className="mt-5 max-w-2xl text-white/85">
            {SHOP.tagline}. From tempered glass to smart watches, we bring you dependable products
            at prices that feel fair — with the ease of ordering directly on WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-white/90 transition-colors"
            >
              Browse Products
            </Link>
            <a
              href={inquiryUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-12 grid gap-4 rounded-3xl border border-border bg-accent/40 p-6 sm:grid-cols-4 sm:p-10">
        {[
          { k: "500+", v: "Products in stock" },
          { k: "2,000+", v: "Happy customers" },
          { k: "24 hrs", v: "Order response" },
          { k: "4.8 ★", v: "Average rating" },
        ].map((s) => (
          <div key={s.v} className="text-center">
            <p className="font-display text-3xl font-black text-ink">{s.k}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.v}
            </p>
          </div>
        ))}
      </div>

      {/* Values cards */}
      <div className="mt-16">
        <div className="max-w-2xl mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-royal">Our Values</p>
          <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">
            What drives us forward
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <article
              key={v.title}
              className="group rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-royal"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-royal text-royal-foreground shadow-royal transition-transform group-hover:scale-105">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-extrabold text-ink">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
            </article>
          ))}
        </div>
      </div>

      {/* Why choose us */}
      <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-royal">
            Why Choose RM Mobile Shop
          </p>
          <h2 className="mt-2 font-display text-3xl font-black text-ink sm:text-4xl">
            The difference you'll feel
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            We're not just another accessories reseller. We curate every product, test every batch,
            and stand behind what we sell. When you order from RM Mobile Shop, you're getting
            accessories trusted by thousands of customers across Pakistan.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {whyUs.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2.5 text-sm text-ink">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-royal" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Story panel */}
        <div className="relative overflow-hidden rounded-[2rem] bg-ink p-8 text-white sm:p-10">
          <div className="absolute inset-0 opacity-50 gradient-royal mix-blend-overlay" />
          <div className="absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Our Story
            </p>
            <h3 className="mt-3 font-display text-2xl font-black leading-tight">
              Started small. Growing with every customer.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              RM Mobile Shop began with a single passion — making great phone accessories available
              to everyone at fair prices. From a small local store to a nationally recognized brand,
              our journey has been powered by the trust of thousands of satisfied customers.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              Today, we serve customers from Karachi to Peshawar, Lahore to Quetta — delivering
              genuine products with the same personal touch that started it all.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="font-display text-2xl font-black">2K+</p>
                <p className="text-xs text-white/60">Customers served</p>
              </div>
              <div>
                <p className="font-display text-2xl font-black">500+</p>
                <p className="text-xs text-white/60">Products available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 flex flex-col items-center justify-between gap-5 rounded-3xl bg-ink p-8 text-white shadow-royal sm:flex-row sm:p-10">
        <div>
          <h3 className="font-display text-2xl font-black">Ready to upgrade your gear?</h3>
          <p className="mt-2 text-sm text-white/70">
            Browse our full catalog or chat with us for tailored recommendations.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            to="/products"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-white/90 transition-colors"
          >
            Shop products
          </Link>
          <a
            href={inquiryUrl()}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
