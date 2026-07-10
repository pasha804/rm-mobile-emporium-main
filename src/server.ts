import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

// ── API Backend URL ──────────────────────────────────────────────────────────
// The Express backend runs on port 4000.
// All /api/* requests are proxied here so the frontend never needs to know
// the backend port — every browser just calls /api/* on the same domain.
const API_BACKEND =
  process.env.API_BACKEND_URL ?? "https://rm-mobile-emporium-main-production-d107.up.railway.app";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// ── Proxy /api/* to Express backend ──────────────────────────────────────────
async function proxyToBackend(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const backendUrl = `${API_BACKEND}${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);
  // Remove hop-by-hop and encoding headers to prevent fetch auto-decompression issues
  headers.delete("host");
  headers.delete("connection");
  headers.delete("accept-encoding");

  try {
    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body: request.method !== "GET" && request.method !== "HEAD"
        ? request.body
        : undefined,
      // @ts-expect-error — duplex needed for streaming body in Node fetch
      duplex: "half",
    });

    // Forward the response back
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("connection");
    responseHeaders.delete("transfer-encoding");
    responseHeaders.delete("content-encoding"); // Important: fetch already decompresses
    responseHeaders.delete("content-length"); // Length might change after decompression
    
    // Allow CORS
    responseHeaders.set("access-control-allow-origin", "*");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("[API Proxy] Failed to reach backend:", err);
    return new Response(
      JSON.stringify({ ok: false, error: "API server unavailable. Please start the backend: cd backend && node server.js" }),
      {
        status: 503,
        headers: { "content-type": "application/json" },
      }
    );
  }
}

// ── H3 error detection ───────────────────────────────────────────────────────
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// ── Main request handler ──────────────────────────────────────────────────────
export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    // Proxy all /api/* requests to the Express backend
    if (url.pathname.startsWith("/api")) {
      return proxyToBackend(request);
    }

    // Handle OPTIONS preflight for CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, POST, OPTIONS",
          "access-control-allow-headers": "Content-Type, Authorization",
        },
      });
    }

    // All other requests → TanStack Start SSR
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
