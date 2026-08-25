'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Icons from '@/components/ui/Icons';
import productsData from '../../../catalogos/products.json';

const allProducts = productsData as Array<{
  sku: string; name: string; slug: string; category: string; category_slug: string;
  subcategory: string; subcategory_slug: string; image: string;
}>;

const suggestions = [
  'Phoropter', 'Lentes de Prueba', 'Slit Lamp', 'Auto Refractometer',
  'Lensmeter', 'Tonometer', 'OCT', 'Edger', 'Monturas', 'Accesorios',
];

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof allProducts>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const term = query.toLowerCase();
    setResults(
      allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term) ||
          p.subcategory.toLowerCase().includes(term)
      ).slice(0, 8)
    );
  }, [query]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col transition-all duration-300 ${
        open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
      style={{
        backgroundColor: 'var(--glass, rgba(255,255,255,0.85))',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
      }}
    >
      {/* Close button */}
      <div className="flex justify-end p-6 md:p-10">
        <button
          onClick={onClose}
          className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-[var(--text-muted)] hover:text-[var(--text)]"
          aria-label="Cerrar búsqueda"
        >
          <Icons.X size={24} />
        </button>
      </div>

      {/* Search content */}
      <div className="flex-1 flex flex-col items-center px-6 md:px-10 -mt-8">
        {/* Search input */}
        <div className="w-full max-w-2xl relative">
          <Icons.Search
            size={22}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-14 pr-14 py-5 bg-white/80 border border-[var(--border)] rounded-2xl text-lg text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/10 transition-all shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              <Icons.X size={18} />
            </button>
          )}
        </div>

        {/* Suggestions */}
        {query.length < 2 && (
          <div className="mt-8 w-full max-w-2xl">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.12em] mb-4">
              Sugerencias
            </h3>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSuggestionClick(term)}
                  className="px-4 py-2.5 bg-white/70 border border-[var(--border)] rounded-xl text-sm text-[var(--text)] hover:border-[var(--blue)] hover:text-[var(--blue)] hover:bg-[var(--blue)]/5 transition-all duration-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search results */}
        {results.length > 0 && (
          <div className="mt-6 w-full max-w-2xl border border-[var(--border)] bg-white/90 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] rounded-2xl max-h-[50vh] overflow-y-auto">
            {results.map((p) => (
              <Link
                key={p.sku}
                href={`/productos/${p.slug}/`}
                onClick={() => { onClose(); setQuery(''); }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--blue)]/5 transition-colors border-b border-[var(--border)] last:border-0 first:rounded-t-2xl last:rounded-b-2xl group"
              >
                <div className="w-14 h-14 bg-[var(--bg)] flex-shrink-0 overflow-hidden rounded-xl border border-[var(--border)]">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-contain p-1.5 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[var(--text)] truncate group-hover:text-[var(--blue)] transition-colors">
                    {p.name}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">
                    {p.sku} · {p.subcategory}
                  </div>
                </div>
                <Icons.ArrowRight size={14} className="text-[var(--text-muted)] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        )}

        {/* No results */}
        {query.length >= 2 && results.length === 0 && (
          <div className="mt-12 text-center">
            <Icons.Search size={40} className="mx-auto text-[var(--border)] mb-4" />
            <p className="text-[var(--text-muted)] text-sm">
              No se encontraron resultados para &ldquo;{query}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
