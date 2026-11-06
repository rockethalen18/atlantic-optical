'use client';

import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export type GalleryMap = Record<string, string[]>;

const PAGE_SIZE = 100;

// Module-level cache: one request per page load, shared by every component.
let cache: GalleryMap | null = null;
let pending: Promise<GalleryMap> | null = null;

async function fetchAllGalleries(): Promise<GalleryMap> {
  const map: GalleryMap = {};
  let page = 1;
  let pages = 1;

  do {
    const res = await fetch(`${API_BASE}/products?limit=${PAGE_SIZE}&page=${page}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();

    const list = data?.data?.products ?? [];
    for (const p of list) {
      if (!p?.sku) continue;
      const images = Array.isArray(p.images) ? p.images.filter((i: unknown) => typeof i === 'string' && i) : [];
      if (images.length > 0) map[String(p.sku).toUpperCase()] = images;
    }

    pages = Number(data?.data?.pagination?.pages) || 1;
    page += 1;
  } while (page <= pages);

  return map;
}

/**
 * Live gallery for every product, fetched once and shared across the page.
 *
 * The static build bakes `products.json` into the bundle, so photos added
 * through the admin panel would otherwise not appear until the next deploy.
 * This hook pulls the current galleries from the PHP API at runtime.
 *
 * Components fall back to their build-time image when a SKU is missing.
 */
export function useProductGalleryMap(): GalleryMap {
  const [map, setMap] = useState<GalleryMap>(cache ?? {});

  useEffect(() => {
    if (cache) return;
    let cancelled = false;

    if (!pending) {
      pending = fetchAllGalleries()
        .then((m) => {
          cache = m;
          return m;
        })
        .catch(() => ({}) as GalleryMap)
        .finally(() => {
          pending = null;
        });
    }

    pending.then((m) => {
      if (!cancelled) setMap(m);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return map;
}
