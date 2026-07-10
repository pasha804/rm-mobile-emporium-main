import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="relative mb-8">
        <p className="font-display text-[9rem] font-black leading-none text-gradient-royal sm:text-[12rem]">
          404
        </p>
        <div className="absolute inset-0 -z-10 blur-3xl opacity-20 gradient-royal rounded-full" />
      </div>
      <h1 className="font-display text-2xl font-black text-ink sm:text-3xl">
        Oops! Page not found.
      </h1>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full gradient-royal px-6 py-3 text-sm font-semibold text-royal-foreground shadow-royal transition-transform hover:scale-[1.03]"
        >
          Go Home
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-ink shadow-soft transition-colors hover:border-royal/40"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    console.error("[RM Mobile Shop] Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RM Mobile Shop — Premium Mobile Accessories at Best Prices" },
      { name: "description", content: "Shop premium mobile accessories in Pakistan — tempered glass, covers, chargers, earbuds, power banks, smart watches and more. Order instantly on WhatsApp." },
      { name: "keywords", content: "mobile accessories Pakistan, tempered glass, phone cover, charger, earbuds, power bank, smart watch, WhatsApp order" },
      { property: "og:title", content: "RM Mobile Shop — Premium Mobile Accessories" },
      { property: "og:description", content: "Quality mobile accessories at best prices. Order directly on WhatsApp." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "RM Mobile Shop" },
      { property: "og:image", content: "/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "RM Mobile Shop — Premium Mobile Accessories" },
      { name: "twitter:description", content: "Quality mobile accessories at best prices. Order directly on WhatsApp." },
      { name: "twitter:image", content: "/logo.png" },
      { name: "theme-color", content: "#1a3fd6" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/logo.png", type: "image/png" },
      { rel: "shortcut icon", href: "/logo.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      {isAdmin ? (
        /* Admin pages: no public navbar/footer */
        <Outlet />
      ) : (
        <div className="flex min-h-dvh flex-col bg-background text-foreground">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <FloatingActions />
        </div>
      )}
    </QueryClientProvider>
  );
}
