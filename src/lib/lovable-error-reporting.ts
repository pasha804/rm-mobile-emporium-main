// Internal error reporting utility
export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  console.error("[RM Mobile Shop] Error:", error, context);
}
