/**
 * Admin Login — pure client-side, no SSR auth checks.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
import { adminLoginAsync, isAdminLoggedIn } from "@/lib/adminStore";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/admin/login")({
  // No beforeLoad — localStorage unavailable on the server.
  component: AdminLogin,
});

function AdminLogin() {
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Step 1: wait for client hydration, then check if already logged in
  useEffect(() => {
    if (isAdminLoggedIn()) {
      window.location.replace("/admin/dashboard");
      return;
    }
    setMounted(true);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const u = username.trim();
    if (!u || !password) {
      setError("Enter both username and password.");
      return;
    }

    setLoading(true);

    // Use setTimeout so React can repaint the spinner before the sync check
    setTimeout(async () => {
      const ok = await adminLoginAsync(u, password);
      if (ok) {
        setDone(true);
        // Give localStorage a tick to persist before navigating
        setTimeout(() => window.location.replace("/admin/dashboard"), 250);
      } else {
        setError("Wrong username or password.");
        setLoading(false);
      }
    }, 300);
  }

  // Blank screen while server-rendering or checking auth — prevents flash
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-royal" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-royal/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-royal/8 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="h-20 w-20 overflow-hidden rounded-full ring-2 ring-royal/50 shadow-royal">
              <img src={logoImg} alt="RM Mobile Shop" className="h-full w-full object-cover" />
            </div>
            <div className="text-center">
              <p className="font-display text-lg font-black text-white">RM MOBILE SHOP</p>
              <p className="mt-0.5 text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>

          {/* Success */}
          {done ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle className="h-10 w-10 text-emerald-400" />
              <p className="font-semibold text-white">Logged in!</p>
              <p className="text-sm text-slate-400">Redirecting to dashboard…</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4" noValidate>

              {/* Username */}
              <div>
                <label htmlFor="rm-username" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Username
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="rm-username"
                    type="text"
                    autoComplete="username"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-royal focus:ring-1 focus:ring-royal/30 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="rm-password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="rm-password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="rmmobile2024"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-10 pr-10 text-sm text-white placeholder:text-slate-600 outline-none focus:border-royal focus:ring-1 focus:ring-royal/30 transition-all"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-royal py-3.5 text-sm font-bold text-white shadow-royal transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
              >
                {loading
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  : <Lock className="h-4 w-4" />
                }
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          )}

          {/* Credential hint */}
          {!done && (
            <p className="mt-6 text-center text-xs text-slate-600">
              <span className="text-slate-500">admin</span>
              {" / "}
              <span className="text-slate-500">rmmobile2024</span>
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} RM MOBILE SHOP
        </p>
      </div>
    </div>
  );
}
