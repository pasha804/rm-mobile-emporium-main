/**
 * RM MOBILE SHOP — Frontend API Client
 *
 * How /api/* routing works in each environment:
 *
 *   LOCAL DEV:   Vite proxy (vite.config.ts) → http://localhost:4000
 *   VERCEL PROD: src/server.ts proxy reads API_BACKEND_URL env var
 *                → https://your-backend.up.railway.app
 *   HOSTINGER:   src/server.ts proxy → http://localhost:4000 (default)
 *
 * The frontend ALWAYS calls /api/* relative paths.
 * The server-side proxy handles routing to the actual backend.
 * No env vars needed in the browser — it all goes through the SSR server.
 */

const API = "/api";

async function request<T>(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok && res.status === 404) {
    throw new Error("Backend not reachable. Check API_BACKEND_URL environment variable.");
  }

  const json = (await res.json()) as { ok: boolean; data?: T; error?: string };
  if (!json.ok) throw new Error(json.error ?? "API error");
  return json.data as T;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export async function apiLogin(username: string, password: string): Promise<boolean> {
  try {
    await request("POST", "/auth/login", { username, password });
    return true;
  } catch {
    return false;
  }
}

// ── Products ─────────────────────────────────────────────────────────────────
import type { Product } from "@/data/products";

export async function apiGetProducts(): Promise<Product[] | null> {
  try {
    return await request<Product[]>("GET", "/products");
  } catch {
    return null;
  }
}

export async function apiSaveProducts(products: Product[]): Promise<void> {
  await request("POST", "/products", products);
}

// ── Categories ────────────────────────────────────────────────────────────────
import type { AdminCategory } from "@/lib/adminStore";

export async function apiGetCategories(): Promise<AdminCategory[] | null> {
  try {
    return await request<AdminCategory[]>("GET", "/categories");
  } catch {
    return null;
  }
}

export async function apiSaveCategories(cats: AdminCategory[]): Promise<void> {
  await request("POST", "/categories", cats);
}

// ── Settings ─────────────────────────────────────────────────────────────────
import type { SiteSettings } from "@/lib/adminStore";

export async function apiGetSettings(): Promise<SiteSettings | null> {
  try {
    return await request<SiteSettings>("GET", "/settings");
  } catch {
    return null;
  }
}

export async function apiSaveSettings(s: SiteSettings): Promise<void> {
  await request("POST", "/settings", s);
}

// ── Health ────────────────────────────────────────────────────────────────────
export async function apiHealth(): Promise<boolean> {
  try {
    await request("GET", "/health");
    return true;
  } catch {
    return false;
  }
}
