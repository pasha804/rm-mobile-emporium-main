import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Plus, Search, Pencil, Trash2, Copy, Download, Upload,
  CheckCircle, XCircle, Star, X, Save, AlertTriangle, ImagePlus,
  Link as LinkIcon, Trash, RefreshCw,
} from "lucide-react";
import {
  getProductsAsync, addProductAsync, updateProductAsync,
  deleteProductAsync, duplicateProductAsync,
  exportProductsAsync, importProductsAsync,
  getCategoriesAsync, type AdminCategory,
} from "@/lib/adminStore";
import type { Product, CategorySlug } from "@/data/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/products")({ component: AdminProducts });

const MAX_IMAGES = 5;

const emptyProduct = (): Product => ({
  id: "", name: "", category: "tempered-glass", price: 0, rating: 4.5,
  reviews: 0, inStock: true, description: "", features: [], specs: {}, images: [],
});

const inp = "w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-royal focus:ring-1 focus:ring-royal/30 transition-all";

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-[200] flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-2xl",
      ok ? "bg-emerald-600" : "bg-red-600",
    )}>
      {ok ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
      {msg}
    </div>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  async function loadData() {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([getProductsAsync(), getCategoriesAsync()]);
      setProducts(prods);
      setCategories(cats);
    } catch {
      showToast("Failed to load data from server.", false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      if (filterCat && p.category !== filterCat) return false;
      if (filterStock === "in" && !p.inStock) return false;
      if (filterStock === "out" && p.inStock) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.category.includes(q);
    });
  }, [products, search, filterCat, filterStock]);

  function openNew() { setEditProduct(emptyProduct()); setIsNew(true); }
  function openEdit(p: Product) { setEditProduct({ ...p, images: p.images ?? [] }); setIsNew(false); }
  function closeModal() { setEditProduct(null); }

  async function handleSave(p: Product) {
    if (!p.id.trim() || !p.name.trim()) { showToast("ID and Name are required.", false); return; }
    if (isNew && products.find((x) => x.id === p.id)) { showToast("Product ID already exists.", false); return; }
    setSaving(true);
    try {
      if (isNew) await addProductAsync(p);
      else await updateProductAsync(p);
      await loadData();
      closeModal();
      showToast(isNew ? "Product added — visible to all browsers!" : "Product saved!");
    } catch {
      showToast("Save failed. Check server connection.", false);
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    setSaving(true);
    try {
      await deleteProductAsync(id);
      await loadData();
      setDeleteConfirm(null);
      showToast("Product deleted.");
    } catch {
      showToast("Delete failed.", false);
    } finally { setSaving(false); }
  }

  async function handleDuplicate(id: string) {
    setSaving(true);
    try {
      await duplicateProductAsync(id);
      await loadData();
      showToast("Product duplicated!");
    } catch {
      showToast("Duplicate failed.", false);
    } finally { setSaving(false); }
  }

  async function handleExport() {
    const json = await exportProductsAsync();
    const blob = new Blob([json], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "rm-products.json"; a.click();
    showToast("Products exported!");
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      setSaving(true);
      const ok = await importProductsAsync(ev.target?.result as string);
      if (ok) { await loadData(); showToast("Products imported to server!"); }
      else showToast("Import failed — invalid JSON.", false);
      setSaving(false);
    };
    reader.readAsText(file); e.target.value = "";
  }

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} />}

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-black text-white">Products</h2>
          <p className="text-sm text-slate-400">
            {loading ? "Loading from server…" : `${products.length} total · ${filtered.length} shown · saved to server`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={loadData} disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50">
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors">
            <Download className="h-3.5 w-3.5" /><span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={() => importRef.current?.click()} className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors">
            <Upload className="h-3.5 w-3.5" /><span className="hidden sm:inline">Import</span>
          </button>
          <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <button onClick={openNew} disabled={loading || saving}
            className="flex items-center gap-2 rounded-xl bg-royal px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50">
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Server sync notice */}
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">
        <CheckCircle className="h-4 w-4 shrink-0" />
        <span>Products are saved on the <strong>server</strong> — all browsers and devices see the same data.</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-3 sm:flex-row sm:flex-wrap">
        <div className="relative flex flex-1 min-w-0 items-center">
          <Search className="absolute left-3 h-4 w-4 text-slate-500 pointer-events-none" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-royal" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
            className="flex-1 min-w-[130px] rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-royal">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)}
            className="flex-1 min-w-[110px] rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-royal">
            <option value="">All Stock</option>
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>
          {(search || filterCat || filterStock) && (
            <button onClick={() => { setSearch(""); setFilterCat(""); setFilterStock(""); }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2 text-xs text-slate-400 hover:text-white shrink-0">
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-royal mb-3" />
          <p className="text-slate-400 text-sm">Loading products from server…</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  {["Product", "Category", "Price", "Rating", "Status", "Flags", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500">No products found.</td></tr>
                )}
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0 border border-slate-700" />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-slate-800 grid place-items-center shrink-0 border border-slate-700">
                            <ImagePlus className="h-4 w-4 text-slate-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-white whitespace-nowrap">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{p.category}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-semibold text-white">Rs. {p.price.toLocaleString()}</p>
                      {p.oldPrice && <p className="text-xs text-slate-500 line-through">Rs. {p.oldPrice.toLocaleString()}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium text-white">{p.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p.inStock
                        ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 whitespace-nowrap"><CheckCircle className="h-3 w-3" /> In Stock</span>
                        : <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-400 whitespace-nowrap"><XCircle className="h-3 w-3" /> Out</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.featured && <span className="rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-400">Featured</span>}
                        {p.bestSeller && <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">Best</span>}
                        {p.newArrival && <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">New</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} disabled={saving} className="h-8 w-8 grid place-items-center rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-40" aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => handleDuplicate(p.id)} disabled={saving} className="h-8 w-8 grid place-items-center rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-40" aria-label="Duplicate"><Copy className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setDeleteConfirm(p.id)} disabled={saving} className="h-8 w-8 grid place-items-center rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-40" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl">
            <AlertTriangle className="mx-auto h-10 w-10 text-red-400 mb-3" />
            <h3 className="font-display text-lg font-bold text-white">Delete Product?</h3>
            <p className="mt-2 text-sm text-slate-400">This will remove it from the server for all users.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} disabled={saving} className="flex-1 rounded-xl border border-slate-700 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-800 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} disabled={saving}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : null} Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {editProduct && (
        <ProductModal product={editProduct} isNew={isNew} categories={categories} onClose={closeModal} onSave={handleSave} saving={saving} />
      )}
    </div>
  );
}

/* ── Image Manager ───────────────────────────────────────────────────── */
function ImageManager({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const remaining = MAX_IMAGES - images.length;
    files.slice(0, remaining).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onChange([...images, ev.target?.result as string].slice(0, MAX_IMAGES));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }

  function addUrl() {
    const url = urlInput.trim();
    if (!url) return;
    if (!url.startsWith("http://") && !url.startsWith("https://")) { setUrlError("Must start with https://"); return; }
    if (images.length >= MAX_IMAGES) { setUrlError(`Max ${MAX_IMAGES} images.`); return; }
    setUrlError(""); onChange([...images, url]); setUrlInput("");
  }

  function remove(i: number) { onChange(images.filter((_, idx) => idx !== i)); }
  function move(i: number, dir: -1 | 1) {
    const next = [...images];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {images.map((src, i) => (
            <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
              <img src={src} alt={`Image ${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-royal/90 py-0.5 text-center text-[9px] font-bold text-white uppercase">Main</span>}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                <button type="button" onClick={() => remove(i)} className="flex items-center gap-1 rounded-lg bg-red-500/90 px-2 py-1 text-[10px] font-bold text-white w-full justify-center">
                  <Trash className="h-3 w-3" /> Remove
                </button>
                <div className="flex gap-1 w-full">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="flex-1 rounded px-1 py-0.5 text-[10px] bg-slate-700 text-white disabled:opacity-30">◀</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="flex-1 rounded px-1 py-0.5 text-[10px] bg-slate-700 text-white disabled:opacity-30">▶</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-20 items-center justify-center rounded-xl border-2 border-dashed border-slate-700 text-xs text-slate-500">
          No images yet
        </div>
      )}
      {images.length < MAX_IMAGES && (
        <>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
          <button type="button" onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-600 py-3 text-sm font-medium text-slate-300 hover:border-royal/60 hover:bg-slate-800 transition-all">
            <ImagePlus className="h-4 w-4" /> Upload from device ({images.length}/{MAX_IMAGES})
          </button>
          <div className="flex gap-2">
            <div className="relative flex flex-1 items-center">
              <LinkIcon className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-500" />
              <input type="url" value={urlInput} onChange={(e) => { setUrlInput(e.target.value); setUrlError(""); }}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addUrl(); } }}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 pl-8 pr-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-royal transition-all" />
            </div>
            <button type="button" onClick={addUrl} className="shrink-0 rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-600 transition-colors">Add</button>
          </div>
        </>
      )}
      {urlError && <p className="text-xs text-red-400">{urlError}</p>}
      <p className="text-[11px] text-slate-500">First image = main display. Hover to reorder or remove. Max {MAX_IMAGES}.</p>
    </div>
  );
}

function Field({ label, children, full, hint }: { label: string; children: React.ReactNode; full?: boolean; hint?: string }) {
  return (
    <div className={full ? "col-span-2" : "col-span-2 sm:col-span-1"}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}

/* ── ProductModal ────────────────────────────────────────────────────── */
function ProductModal({
  product, isNew, categories, onClose, onSave, saving,
}: {
  product: Product; isNew: boolean; categories: AdminCategory[];
  onClose: () => void; onSave: (p: Product) => void; saving: boolean;
}) {
  const [id, setId] = useState(product.id);
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState<CategorySlug>(product.category);
  const [price, setPrice] = useState(String(product.price));
  const [oldPrice, setOldPrice] = useState(product.oldPrice != null ? String(product.oldPrice) : "");
  const [rating, setRating] = useState(String(product.rating));
  const [reviews, setReviews] = useState(String(product.reviews));
  const [inStock, setInStock] = useState(product.inStock);
  const [description, setDescription] = useState(product.description);
  const [featuresText, setFeaturesText] = useState((product.features ?? []).join("\n"));
  const [specsText, setSpecsText] = useState(Object.entries(product.specs ?? {}).map(([k, v]) => `${k}: ${v}`).join("\n"));
  const [featured, setFeatured] = useState(!!product.featured);
  const [bestSeller, setBestSeller] = useState(!!product.bestSeller);
  const [newArrival, setNewArrival] = useState(!!product.newArrival);
  const [images, setImages] = useState<string[]>(product.images ?? []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !saving) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  const handleSave = useCallback(() => {
    const features = featuresText.split("\n").map((s) => s.trim()).filter(Boolean);
    const specs: Record<string, string> = {};
    specsText.split("\n").forEach((line) => {
      const idx = line.indexOf(":");
      if (idx > 0) specs[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    });
    onSave({
      id: id.trim(), name: name.trim(), category,
      price: parseFloat(price) || 0,
      oldPrice: oldPrice.trim() ? parseFloat(oldPrice) : undefined,
      rating: parseFloat(rating) || 0, reviews: parseInt(reviews) || 0,
      inStock, description, features, specs,
      featured: featured || undefined, bestSeller: bestSeller || undefined, newArrival: newArrival || undefined,
      images: images.length > 0 ? images : undefined,
    });
  }, [id, name, category, price, oldPrice, rating, reviews, inStock, description, featuresText, specsText, featured, bestSeller, newArrival, images, onSave]);

  const divider = (label: string) => (
    <div className="col-span-2 pt-1">
      <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-royal">
        <span className="h-px flex-1 bg-royal/30" /> {label} <span className="h-px flex-1 bg-royal/30" />
      </p>
    </div>
  );

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 backdrop-blur-sm">
      <div className="flex min-h-full items-start justify-center px-3 py-8 sm:px-4 sm:py-10">
        <div className="relative w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-slate-800 bg-slate-900 px-4 py-3 sm:px-6">
            <h3 className="font-display text-base font-bold text-white sm:text-lg">
              {isNew ? "Add New Product" : `Edit: ${product.name}`}
            </h3>
            <button onClick={onClose} disabled={saving} aria-label="Close"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-40">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}
          <div className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-6">
            {divider("Basic Info")}
            <Field label="Product ID *" hint={isNew ? "Lowercase, hyphens only. Cannot be changed later." : undefined}>
              <input value={id} onChange={(e) => setId(e.target.value)} readOnly={!isNew}
                placeholder="my-product-id" autoComplete="off" className={cn(inp, !isNew && "cursor-not-allowed opacity-50")} />
            </Field>
            <Field label="Product Name *">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 9H Clear Tempered Glass" autoComplete="off" className={inp} />
            </Field>
            <Field label="Category">
              <select value={category} onChange={(e) => setCategory(e.target.value as CategorySlug)} className={inp}>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Stock Status">
              <select value={inStock ? "1" : "0"} onChange={(e) => setInStock(e.target.value === "1")} className={inp}>
                <option value="1">✓ In Stock</option>
                <option value="0">✗ Out of Stock</option>
              </select>
            </Field>

            {divider("Pricing")}
            <Field label="Price (Rs.) *">
              <input type="number" min="0" step="1" value={price} onChange={(e) => setPrice(e.target.value)} inputMode="numeric" className={inp} />
            </Field>
            <Field label="Sale Price (Rs.) — optional" hint="Leave blank = no discount badge">
              <input type="number" min="0" step="1" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} placeholder="Leave blank" inputMode="numeric" className={inp} />
            </Field>
            <Field label="Rating (0 – 5)">
              <input type="number" min="0" max="5" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} inputMode="decimal" className={inp} />
            </Field>
            <Field label="Reviews Count">
              <input type="number" min="0" step="1" value={reviews} onChange={(e) => setReviews(e.target.value)} inputMode="numeric" className={inp} />
            </Field>

            {divider("Content")}
            <Field label="Description" full>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Short product description…" className={cn(inp, "resize-none")} />
            </Field>
            <Field label="Features — one per line" full hint="Each line = one ✓ bullet on product page">
              <textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={4}
                placeholder={"9H Hardness\nAnti-Fingerprint\nBubble-Free Install"} className={cn(inp, "resize-none")} />
            </Field>
            <Field label="Specifications — Key: Value per line" full hint='e.g.  Thickness: 0.3 mm'>
              <textarea value={specsText} onChange={(e) => setSpecsText(e.target.value)} rows={4}
                placeholder={"Thickness: 0.3 mm\nHardness: 9H\nWarranty: 7 days"} className={cn(inp, "resize-none")} />
            </Field>

            {divider("Product Images")}
            <div className="col-span-2">
              <ImageManager images={images} onChange={setImages} />
            </div>

            {divider("Product Flags")}
            <div className="col-span-2">
              <div className="grid grid-cols-3 gap-2">
                {([
                  { label: "⭐ Featured", val: featured, set: setFeatured, hint: "Home page" },
                  { label: "🔥 Best Seller", val: bestSeller, set: setBestSeller, hint: "Deals page" },
                  { label: "✨ New Arrival", val: newArrival, set: setNewArrival, hint: "New section" },
                ] as const).map(({ label, val, set, hint }) => (
                  <label key={label} className={cn(
                    "flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-center text-xs transition-all select-none",
                    val ? "border-royal bg-royal/10 text-white" : "border-slate-700 text-slate-400 hover:border-slate-600",
                  )}>
                    <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} className="sr-only" />
                    <span className="font-semibold text-sm">{label}</span>
                    <span className="text-[10px] opacity-70">{hint}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex items-center justify-end gap-3 rounded-b-2xl border-t border-slate-800 bg-slate-900/95 px-4 py-3 backdrop-blur sm:px-6">
            <button onClick={onClose} disabled={saving} className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-800 transition-colors disabled:opacity-40">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-royal px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 shadow-royal">
              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving to server…" : isNew ? "Add Product" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
