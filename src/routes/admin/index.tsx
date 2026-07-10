/**
 * /admin/ → client-side redirect only (no SSR).
 */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { isAdminLoggedIn } from "@/lib/adminStore";

export const Route = createFileRoute("/admin/")({
  component: AdminRoot,
});

function AdminRoot() {
  useEffect(() => {
    window.location.replace(
      isAdminLoggedIn() ? "/admin/dashboard" : "/admin/login"
    );
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-royal" />
    </div>
  );
}
