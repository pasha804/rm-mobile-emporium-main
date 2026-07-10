import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, Download, Upload, CheckCircle, AlertTriangle, RotateCcw } from "lucide-react";
import { getSettings, saveSettings, exportSettings, importSettings, type SiteSettings } from "@/lib/adminStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={cn("fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-2xl animate-slide-up", ok ? "bg-emerald-600" : "bg-red-600")}>
      {ok ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />} {msg}
    </div>
  );
}

function AdminSettings() {
  const [form, setForm] = useState<SiteSettings>(getSettings);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  function showToast(msg: string, ok = true) { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); }

  function handleSave() {
    saveSettings(form);
    showToast("Settings saved! Reload the store to see changes.");
  }

  function handleExport() {
    const blob = new Blob([exportSettings()], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "rm-settings.json"; a.click();
    showToast("Settings exported!");
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = importSettings(ev.target?.result as string);
      if (ok) { setForm(getSettings()); showToast("Settings imported!"); } else showToast("Import failed.", false);
    };
    reader.readAsText(file); e.target.value = "";
  }

  function handleReset() {
    if (!confirm("Reset settings to defaults?")) return;
    localStorage.removeItem("rm_admin_settings");
    setForm(getSettings());
    showToast("Settings reset.");
  }

  const inp = "w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-royal transition-colors";

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="border-b border-slate-800 px-6 py-4">
          <h3 className="font-display font-bold text-white">{title}</h3>
        </div>
        <div className="p-6 grid gap-4 sm:grid-cols-2">{children}</div>
      </div>
    );
  }

  function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
    return (
      <div className={full ? "sm:col-span-2" : ""}>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">{label}</label>
        {children}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} />}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-black text-white">Website Settings</h2>
          <p className="text-sm text-slate-400">Control your store's branding, contact info and SEO.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExport} className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors">
            <Upload className="h-3.5 w-3.5" /> Import
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
          <button onClick={handleReset} className="flex items-center gap-2 rounded-xl border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 rounded-xl bg-royal px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
            <Save className="h-4 w-4" /> Save Settings
          </button>
        </div>
      </div>

      <Section title="Store Information">
        <Field label="Store Name">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} />
        </Field>
        <Field label="Tagline">
          <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inp} />
        </Field>
        <Field label="Currency Symbol">
          <input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className={inp} placeholder="Rs." />
        </Field>
        <Field label="Business Hours">
          <input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} className={inp} />
        </Field>
        <Field label="Footer Text" full>
          <input value={form.footerText} onChange={(e) => setForm({ ...form, footerText: e.target.value })} className={inp} />
        </Field>
      </Section>

      <Section title="Contact & WhatsApp">
        <Field label="Phone Number">
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inp} placeholder="0334 5581147" />
        </Field>
        <Field label="WhatsApp (wa.me format, no +)">
          <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className={inp} placeholder="923345581147" />
        </Field>
        <Field label="Email">
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inp} />
        </Field>
        <Field label="Address / Location">
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inp} />
        </Field>
      </Section>

      <Section title="Hero Section">
        <Field label="Hero Title" full>
          <input value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} className={inp} />
        </Field>
        <Field label="Hero Subtitle" full>
          <input value={form.heroSubtitle} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} className={inp} />
        </Field>
      </Section>

      <Section title="Social Media">
        <Field label="Instagram URL">
          <input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className={inp} placeholder="https://instagram.com/…" />
        </Field>
        <Field label="Facebook URL">
          <input value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} className={inp} placeholder="https://facebook.com/…" />
        </Field>
      </Section>

      <Section title="SEO Settings">
        <Field label="SEO Title" full>
          <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className={inp} />
        </Field>
        <Field label="SEO Description" full>
          <textarea value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
            rows={3} className={cn(inp, "resize-none")} />
        </Field>
      </Section>

      {/* Note */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
        <p className="text-sm font-semibold text-amber-400 mb-1">Note on Settings</p>
        <p className="text-xs text-amber-400/70">
          Settings are saved to localStorage. The public store reads from <code className="font-mono bg-slate-800 px-1 rounded">src/lib/shop.ts</code> by default.
          To make changes live permanently, copy the saved values into that file before deploying.
          Future backend integration will auto-sync these settings.
        </p>
      </div>

      {/* Save again at bottom */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="flex items-center gap-2 rounded-xl bg-royal px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-royal">
          <Save className="h-4 w-4" /> Save All Settings
        </button>
      </div>
    </div>
  );
}
