'use client';

import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Live product gallery.
 *
 * The static build bakes `products.json` into the bundle, so new photos added
 * through the admin panel would not show up until the next deploy. This hook
 * fetches the gallery from the PHP API at runtime and merges it with the
 * build-time list, so the site always reflects what the admin uploaded.
 *
 * @param sku        Product SKU (e.g. "AO-104")
 * @param fallback   Build-time images from products.json (used until the API replies)
 */
export function useProductImages(sku: string, fallback: string[]): string[] {
  const [images, setImages] = useState<string[]>(
    fallback && fallback.length > 0 ? fallback : []
  );

  useEffect(() => {
    if (!sku) return;
    let cancelled = false;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    fetch(`${API_BASE}/products?sku=${encodeURIComponent(sku)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        clearTimeout(timer);
        if (cancelled) return;
        const live = data?.data?.images;
        if (Array.isArray(live) && live.length > 0) {
          setImages(live);
        }
      })
      .catch(() => {
        clearTimeout(timer);
        // Keep the build-time fallback on network failure
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [sku]);

  return images;
}
