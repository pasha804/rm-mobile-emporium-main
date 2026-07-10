/**
 * RM MOBILE SHOP — Backend API Server
 * Express + JSON file storage
 * Port: 4000 (proxied as /api on the frontend via Nginx/Apache)
 *
 * Routes:
 *   GET  /api/health
 *   GET  /api/products
 *   POST /api/products        body: Product[]
 *   GET  /api/categories
 *   POST /api/categories      body: AdminCategory[]
 *   GET  /api/settings
 *   POST /api/settings        body: SiteSettings
 *   POST /api/auth/login      body: { username, password }
 *   POST /api/auth/logout
 */

import express from "express";
import cors from "cors";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "data");
const PORT = process.env.PORT || 4000;

// ── Credentials (change before deploying) ────────────────────────────────────
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "rmmobile2024";

// ── Default data ─────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  name: "RM MOBILE SHOP",
  tagline: "Quality Mobile Accessories at Best Prices",
  phone: "0334 5581147",
  whatsapp: "923345581147",
  email: "rbtaggaming@gmail.com",
  address: "Pakistan",
  hours: "Mon – Sat  •  10:00 AM – 10:00 PM",
  currency: "Rs.",
  heroTitle: "Everything your phone deserves.",
  heroSubtitle: "Quality Mobile Accessories at Best Prices",
  footerText: "Smart Accessories • Smart Choice",
  instagram: "",
  facebook: "",
  seoTitle: "RM Mobile Shop — Premium Mobile Accessories at Best Prices",
  seoDescription: "Shop premium mobile accessories in Pakistan.",
};

// ── File helpers ─────────────────────────────────────────────────────────────
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
}

async function readJson(filename, fallback) {
  try {
    const raw = await readFile(join(DATA_DIR, filename), "utf-8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function writeJson(filename, data) {
  await ensureDataDir();
  await writeFile(join(DATA_DIR, filename), JSON.stringify(data, null, 2), "utf-8");
}

// ── Express setup ─────────────────────────────────────────────────────────────
const app = express();

// Allow requests from any origin in dev; tighten in production if needed
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "50mb" })); // 50MB for base64 images

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "RM MOBILE SHOP API", time: new Date().toISOString() });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "RM MOBILE SHOP API", time: new Date().toISOString() });
});

// ── AUTH ─────────────────────────────────────────────────────────────────────
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body ?? {};
  if (
    typeof username === "string" &&
    typeof password === "string" &&
    username.trim() === ADMIN_USERNAME &&
    password === ADMIN_PASSWORD
  ) {
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: "Invalid credentials" });
});

app.post("/api/auth/logout", (_req, res) => {
  res.json({ ok: true });
});

// ── PRODUCTS ─────────────────────────────────────────────────────────────────
app.get("/api/products", async (_req, res) => {
  const data = await readJson("products.json", null);
  res.json({ ok: true, data });
});

app.post("/api/products", async (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products)) return res.status(400).json({ ok: false, error: "Expected array" });
    await writeJson("products.json", products);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Write failed" });
  }
});

// ── CATEGORIES ───────────────────────────────────────────────────────────────
app.get("/api/categories", async (_req, res) => {
  const data = await readJson("categories.json", null);
  res.json({ ok: true, data });
});

app.post("/api/categories", async (req, res) => {
  try {
    const cats = req.body;
    if (!Array.isArray(cats)) return res.status(400).json({ ok: false, error: "Expected array" });
    await writeJson("categories.json", cats);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Write failed" });
  }
});

// ── SETTINGS ─────────────────────────────────────────────────────────────────
app.get("/api/settings", async (_req, res) => {
  const data = await readJson("settings.json", { ...DEFAULT_SETTINGS });
  res.json({ ok: true, data });
});

app.post("/api/settings", async (req, res) => {
  try {
    const settings = { ...DEFAULT_SETTINGS, ...req.body };
    await writeJson("settings.json", settings);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Write failed" });
  }
});

// ── 404 fallback ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ ok: false, error: "Not found" });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  RM MOBILE SHOP API running on http://localhost:${PORT}`);
  console.log(`📁  Data directory: ${DATA_DIR}`);
});
