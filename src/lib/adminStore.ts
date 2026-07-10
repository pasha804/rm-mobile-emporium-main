/**
 * Admin Data Store v3 — API-first with localStorage fallback.
 *
 * Priority order for reads:
 *   1. Backend API  (backend/server.js → data/*.json on server disk)
 *   2. localStorage (fallback when API is unreachable)
 *   3. Static TypeScript data (fallback when localStorage is also empty)
 *
 * Priority order for writes:
 *   1. Backend API  — persists to server disk, visible to ALL browsers
 *   2. localStorage — mirrors the save locally for instant UI
 *
 * Auth:
 *   - Login sends credentials to /api/auth/login (server validates)
 *   - Session flag stored in localStorage (per-device, intentional)
 */
import {
  products as staticProducts,
  categories as staticCategories,
  type Product,
  type Category,
} from "@/data/products";
import {
  apiLogin, apiGetProducts, apiSaveProducts,
  apiGetCategories, apiSaveCategories,
  apiGetSettings, apiSaveSettings,
} from "@/lib/api";

export type { Product };

// ─── SETTINGS TYPE ───────────────────────────────────────────────────────────
export type SiteSettings = {
  name: string; tagline: string; phone: string; whatsapp: string;
  email: string; address: string; hours: string; currency: string;
  heroTitle: string; heroSubtitle: string; footerText: string;
  instagram: string; facebook: string; seoTitle: string; seoDescription: string;
};

const defaultSettings: SiteSettings = {
  name: "RM MOBILE SHOP", tagline: "Quality Mobile Accessories at Best Prices",
  phone: "0334 5581147", whatsapp: "923345581147", email: "rbtaggaming@gmail.com",
  address: "Pakistan", hours: "Mon – Sat  •  10:00 AM – 10:00 PM", currency: "Rs.",
  heroTitle: "Everything your phone deserves.",
  heroSubtitle: "Quality Mobile Accessories at Best Prices",
  footerText: "Smart Accessories • Smart Choice",
  instagram: "", facebook: "",
  seoTitle: "RM Mobile Shop — Premium Mobile Accessories at Best Prices",
  seoDescription: "Shop premium mobile accessories in Pakistan.",
};

// ─── CATEGORY TYPE ───────────────────────────────────────────────────────────
export type AdminCategory = Omit<Category, "icon"> & { iconName: string };

function toAdminCategory(c: Category): AdminCategory {
  return { slug: c.slug, name: c.name, iconName: c.slug, tint: c.tint, image: c.image };
}

const defaultCategories: AdminCategory[] = staticCategories.map(toAdminCategory);

// ─── localStorage helpers ────────────────────────────────────────────────────
function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function lsSet(key: string, val: unknown): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* quota */ }
}

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const ADMIN_CREDENTIALS = { username: "admin", password: "rmmobile2024" };

export async function adminLoginAsync(username: string, password: string): Promise<boolean> {
  // Try the real API first
  const serverOk = await apiLogin(username.trim(), password);
  if (serverOk) {
    lsSet("rm_admin_auth", "1");
    return true;
  }
  // Fallback: check hardcoded credentials (works without backend)
  const localOk =
    username.trim() === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password;
  if (localOk) lsSet("rm_admin_auth", "1");
  return localOk;
}

/** Keep sync version for legacy components */
export function adminLogin(username: string, password: string): boolean {
  const ok =
    username.trim() === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password;
  if (ok) lsSet("rm_admin_auth", "1");
  return ok;
}

export function adminLogout(): void {
  if (typeof window !== "undefined") localStorage.removeItem("rm_admin_auth");
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  const auth = localStorage.getItem("rm_admin_auth");
  return auth === "1" || auth === '"1"';
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
/** Sync — used for SSR / initial render */
export function getAdminProducts(): Product[] {
  const raw = lsGet<Product[]>("rm_admin_products", [...staticProducts]);
  // Filter out any mock products from old local storage
  const mockPrefixes = ["tg-", "cov-", "chr-", "cab-", "nb-", "eb-", "pb-", "sw-", "hf-", "sp-", "bt-", "gt-"];
  return raw.filter((p) => !mockPrefixes.some(prefix => p.id.startsWith(prefix)));
}

export async function getProductsAsync(): Promise<Product[]> {
  const serverData = await apiGetProducts();
  if (serverData !== null && serverData.length > 0) {
    // Mirror to localStorage so offline works
    lsSet("rm_admin_products", serverData);
    return serverData;
  }
  // Server is empty (e.g. Railway wiped the ephemeral disk).
  // Auto-restore from localStorage!
  const localData = getAdminProducts();
  if (localData && localData.length > 0) {
    apiSaveProducts(localData).catch((e) => console.warn("Auto-restore failed:", e));
  }
  return localData;
}

async function persistProducts(list: Product[]): Promise<void> {
  lsSet("rm_admin_products", list);
  await apiSaveProducts(list).catch((e) => console.warn("API save failed, localStorage only:", e));
}

export async function addProductAsync(p: Product): Promise<void> {
  const list = await getProductsAsync();
  list.unshift(p);
  await persistProducts(list);
}

export async function updateProductAsync(p: Product): Promise<void> {
  const list = await getProductsAsync();
  const idx = list.findIndex((x) => x.id === p.id);
  if (idx >= 0) list[idx] = p; else list.unshift(p);
  await persistProducts(list);
}

export async function deleteProductAsync(id: string): Promise<void> {
  const list = (await getProductsAsync()).filter((p) => p.id !== id);
  await persistProducts(list);
}

export async function duplicateProductAsync(id: string): Promise<void> {
  const list = await getProductsAsync();
  const p = list.find((x) => x.id === id);
  if (!p) return;
  list.unshift({ ...p, id: `${p.id}-copy-${Date.now()}`, name: `${p.name} (Copy)` });
  await persistProducts(list);
}

export async function exportProductsAsync(): Promise<string> {
  return JSON.stringify(await getProductsAsync(), null, 2);
}

export async function importProductsAsync(json: string): Promise<boolean> {
  try { await persistProducts(JSON.parse(json)); return true; }
  catch { return false; }
}

// Keep sync versions
export function addProduct(p: Product): void { const l = getAdminProducts(); l.unshift(p); lsSet("rm_admin_products", l); }
export function updateProduct(p: Product): void { lsSet("rm_admin_products", getAdminProducts().map((x) => x.id === p.id ? p : x)); }
export function deleteProduct(id: string): void { lsSet("rm_admin_products", getAdminProducts().filter((p) => p.id !== id)); }
export function duplicateProduct(id: string): void { const p = getAdminProducts().find((x) => x.id === id); if (p) addProduct({ ...p, id: `${p.id}-copy-${Date.now()}`, name: `${p.name} (Copy)` }); }
export function exportProducts(): string { return JSON.stringify(getAdminProducts(), null, 2); }
export function importProducts(json: string): boolean { try { lsSet("rm_admin_products", JSON.parse(json)); return true; } catch { return false; } }
export function saveAdminProducts(list: Product[]): void { lsSet("rm_admin_products", list); }

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
export function getAdminCategories(): AdminCategory[] {
  return lsGet<AdminCategory[]>("rm_admin_categories", defaultCategories);
}

export async function getCategoriesAsync(): Promise<AdminCategory[]> {
  const serverData = await apiGetCategories();
  if (serverData !== null) {
    lsSet("rm_admin_categories", serverData);
    return serverData;
  }
  const localData = getAdminCategories();
  if (localData && localData.length > 0) {
    apiSaveCategories(localData).catch((e) => console.warn("Auto-restore failed:", e));
  }
  return localData;
}

async function persistCategories(cats: AdminCategory[]): Promise<void> {
  lsSet("rm_admin_categories", cats);
  await apiSaveCategories(cats).catch((e) => console.warn("API save failed:", e));
}

export async function saveCategoriesAsync(cats: AdminCategory[]): Promise<void> {
  await persistCategories(cats);
}

export function saveAdminCategories(cats: AdminCategory[]): void { lsSet("rm_admin_categories", cats); }
export function exportCategories(): string { return JSON.stringify(getAdminCategories(), null, 2); }
export async function exportCategoriesAsync(): Promise<string> { return JSON.stringify(await getCategoriesAsync(), null, 2); }
export function importCategories(json: string): boolean { try { lsSet("rm_admin_categories", JSON.parse(json)); return true; } catch { return false; } }
export async function importCategoriesAsync(json: string): Promise<boolean> {
  try { await persistCategories(JSON.parse(json)); return true; } catch { return false; }
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
export function getSettings(): SiteSettings {
  return lsGet<SiteSettings>("rm_admin_settings", { ...defaultSettings });
}

export async function getSettingsAsync(): Promise<SiteSettings> {
  const serverData = await apiGetSettings();
  if (serverData !== null) {
    lsSet("rm_admin_settings", serverData);
    return serverData;
  }
  const localData = getSettings();
  if (localData) {
    apiSaveSettings(localData).catch((e) => console.warn("Auto-restore failed:", e));
  }
  return localData;
}

export async function saveSettingsAsync(s: SiteSettings): Promise<void> {
  lsSet("rm_admin_settings", s);
  await apiSaveSettings(s).catch((e) => console.warn("API save failed:", e));
}

export function saveSettings(s: SiteSettings): void { lsSet("rm_admin_settings", s); }
export function exportSettings(): string { return JSON.stringify(getSettings(), null, 2); }
export function importSettings(json: string): boolean {
  try { saveSettings({ ...defaultSettings, ...JSON.parse(json) }); return true; } catch { return false; }
}
