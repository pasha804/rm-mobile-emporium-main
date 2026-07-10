/**
 * useProducts — SSR-safe hook for the public store.
 *
 * Server (SSR): returns static products immediately (no localStorage, no fetch)
 * Client:       starts with static data, then fetches API in background and updates
 *
 * Result: page renders instantly on server, and on the client the latest
 * server-side products replace the static ones within ~100ms after load.
 */
import { useState, useEffect } from "react";
import { products as staticProducts } from "@/data/products";
import { apiGetProducts } from "@/lib/api";
import type { Product } from "@/data/products";

export function useProducts(): Product[] {
  // SSR-safe initial state: always use static products (no window/localStorage)
  const [products, setProducts] = useState<Product[]>(staticProducts);

  useEffect(() => {
    // Client only: fetch the real data from the backend API
    apiGetProducts()
      .then((fresh) => {
        if (fresh && fresh.length > 0) setProducts(fresh);
      })
      .catch(() => {
        // API down — keep showing static products, no error shown to customer
      });
  }, []);

  return products;
}
