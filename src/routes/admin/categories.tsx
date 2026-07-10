import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Download, Upload, Save, X, CheckCircle, AlertTriangle } from "lucide-react";
import { getAdminCategories, saveAdminCategories, exportCategories, importCategories, type AdminCategory } from "@/lib/adminStore";
import { getAdminProducts } from "@/lib/adminStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/categories")({ component: AdminCategories });

const TINTS = [
  "from-sky-500 to-blue-700", "from-indigo-500 to-blue-800", "from-amber-400 to-orange-600",
  "from-emerald-400 to-teal-700", "from-fuchsia-500 to-purple-700", "from-blue-500 to-indigo-800",
  "from-lime-400 to-green-700", "from-slate-500 to-slate-900", "from-rose-400 to-red-700",
  "from-cyan-400 to-blue-700", "from-yellow-400 to-amber-700", "from-violet-500 to-indigo-800",
];

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={cn("fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-2xl animate-slide-up", ok ? "bg-emerald-600" : "bg-red-600")}>
      {ok ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />} {msg}
    </div>
  );
}

function AdminCategories() {
  const [cats, setCats] = useState<AdminCategory[]>(getAdminCategories);
  const [edit, setEdit] = useState<AdminCategory | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const products = getAdminProducts();

  function showToast(msg: string, ok = true) { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); }
  function refresh() { setCats(getAdminCategories()); }

  function handleSave(c: AdminCategory) {
    if (!c.slug || !c.name) { showToast("Slug and name are required.", false); return; }
    const list = getAdminCategories();
    if (isNew) {
      if (list.find((x) => x.slug === c.slug)) { showToast("Slug already exists.", false); return; }
      list.unshift(c);
    } else {
      const i = list.findIndex((x) => x.slug === c.slug);
      if (i >= 0) list[i] = c;
    }
    saveAdminCategories(list);
    refresh();
    setEdit(null);
    showToast(isNew ? "Category added!" : "Category saved!");
  }

  function handleDelete(slug: string) {
    const count = products.filter((p) => p.category === slug).length;
    if (count > 0 && !confirm(`This category has ${count} products. Delete anyway?`)) return;
    saveAdminCategories(getAdminCategories().filter((c) => c.slug !== slug));
    refresh();
    setDeleteId(null);
    showToast("Category deleted.");
  }

  function handleExport() {
    const blob = new Blob([exportCategories()], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "rm-categories.json"; a.click();
    showToast("Categories exported!");
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = importCategories(ev.target?.result as string);
      if (ok) { refresh(); showToast("Categories imported!"); } else showToast("Import failed.", false);
    };
    reader.readAsText(file); e.target.value = "";
  }

  const inp = "w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-royal transition-colors";

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-black text-white">Categories</h2>
          <p className="text-sm text-slate-400">{cats.length} categories</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExport} className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors">
            <Upload className="h-3.5 w-3.5" /> Import
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
          <button onClick={() => { setEdit({ slug: "", name: "", iconName: "", tint: TINTS[0], image: "" }); setIsNew(true); }}
            className="flex items-center gap-2 rounded-xl bg-royal px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            <Plus className="h-4 w-4" /> Add Category
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cats.map((c) => {
          const count = products.filter((p) => p.category === c.slug).length;
          return (
            <div key={c.slug} className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
              <div className={cn("h-20 bg-gradient-to-br", c.tint)} />
              <div className="p-4">
                <p className="font-display font-bold text-white">{c.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{c.slug} · {count} products</p>
                {c.image && <p className="text-[10px] text-slate-600 mt-1 truncate">{c.image}</p>}
                <div className="mt-3 flex gap-2">
                  <button onClick={() => { setEdit({ ...c }); setIsNew(false); }}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button onClick={() => setDeleteId(c.slug)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center shadow-2xl sm:rounded-3xl">
            <AlertTriangle className="mx-auto h-10 w-10 text-red-400 mb-3" />
            <h3 className="font-display text-lg font-bold text-white">Delete Category?</h3>
            <p className="mt-1 text-sm text-slate-400">Products in this category won't be deleted.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 rounded-xl border border-slate-700 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-800 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {edit && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setEdit(null); }}
        >
          <div className="flex min-h-full items-start justify-center px-3 py-6 sm:items-center sm:px-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl sm:rounded-3xl">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 sm:px-6 sm:py-4">
                <h3 className="font-display text-base font-bold text-white sm:text-lg">{isNew ? "Add Category" : "Edit Category"}</h3>
                <button onClick={() => setEdit(null)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white transition-colors" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4 p-4 sm:p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Slug *</label>
                  <input value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} readOnly={!isNew}
                    className={cn(inp, !isNew && "cursor-not-allowed opacity-50")} placeholder="tempered-glass" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Name *</label>
                  <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} className={inp} placeholder="Tempered Glass" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Image URL (optional)</label>
                  <input value={edit.image} onChange={(e) => setEdit({ ...edit, image: e.target.value })} className={inp} placeholder="https://images.unsplash.com/…" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Gradient Colour</label>
                  <div className="grid grid-cols-6 gap-2">
                    {TINTS.map((t) => (
                      <button key={t} type="button" onClick={() => setEdit({ ...edit, tint: t })}
                        className={cn("h-8 rounded-lg bg-gradient-to-br transition-all", t, edit.tint === t ? "ring-2 ring-white scale-105" : "opacity-60 hover:opacity-100")}
                        aria-label={t} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-slate-800 px-4 py-3 sm:px-6 sm:py-4">
                <button onClick={() => setEdit(null)} className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-800 transition-colors">Cancel</button>
                <button onClick={() => handleSave(edit)} className="flex items-center gap-2 rounded-xl bg-royal px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                  <Save className="h-4 w-4" /> {isNew ? "Add" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
