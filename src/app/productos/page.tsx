'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Icons from '@/components/ui/Icons';
import productsData from '../../../catalogos/products.json';

const categories = [
  { name: 'Todos', slug: '' },
  { name: 'Equipos de Oftalmología', slug: 'equipos-oftalmologia-optica' },
  { name: 'Equipos de Laboratorio', slug: 'equipos-laboratorio' },
  { name: 'Mobiliario', slug: 'mobiliario' },
  { name: 'Monitores y Optotipos', slug: 'monitores-optotipos' },
];

interface Product {
  sku: string;
  name: string;
  slug: string;
  category: string;
  category_slug: string;
  subcategory: string;
  subcategory_slug: string;
  description: string;
  barcode: string;
  reference: string;
}

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const products = productsData as Product[];

  const filtered = useMemo(() => {
    let result = products;
    if (selectedCategory) {
      result = result.filter(p => p.category_slug === selectedCategory);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }
    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'sku') result.sort((a, b) => a.sku.localeCompare(b.sku));
    return result;
  }, [products, selectedCategory, searchTerm, sortBy]);

  return (
    <div className="bg-[var(--bg-alt)] min-h-screen">
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>Catálogo de Productos</h1>
          <p className="text-[var(--text-muted)]">{filtered.length} productos disponibles</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white p-5 border border-[var(--border)] shadow-sm">
              <h3 className="font-bold text-[var(--text)] mb-4 text-sm" style={{ fontFamily: 'var(--font-display)' }}>Categorías</h3>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      selectedCategory === cat.slug
                        ? 'bg-[var(--green)] text-white font-medium'
                        : 'text-[var(--text-muted)] hover:bg-[var(--bg-alt)] hover:text-[var(--text)]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="bg-white p-4 border border-[var(--border)] shadow-sm mb-6 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px] relative">
                <Icons.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-soft)]" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, SKU..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--green)] transition-colors"
                />
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2.5 border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--green)]">
                <option value="name">Nombre A-Z</option>
                <option value="sku">SKU</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white p-12 text-center border border-[var(--border)] shadow-sm">
                <Icons.Search size={24} className="text-[var(--text-soft)] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Sin resultados</h3>
                <p className="text-sm text-[var(--text-muted)]">No se encontraron productos con esos criterios.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filtered.map(product => (
                  <Link
                    key={product.sku}
                    href={`/productos/${product.slug}/`}
                    className="group bg-white border border-[var(--border)] hover:border-[var(--green)]/30 transition-all overflow-hidden"
                  >
                    <div className="relative h-[160px] bg-[var(--bg-alt)] overflow-hidden">
                      <img
                        src={`/images/products/${product.sku}.jpg`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.img-fallback')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'img-fallback';
                            fallback.style.cssText = 'width:100%;height:100%;background:linear-gradient(135deg,#e0e0e0,#c0c0c0);display:flex;align-items:center;justify-content:center;';
                            fallback.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-[var(--green)] text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
                        {product.category.replace('Equipos de ', '')}
                      </span>
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-semibold text-[var(--green)] uppercase tracking-wider block mb-1">{product.subcategory}</span>
                      <h3 className="text-[13px] font-bold text-[var(--text)] group-hover:text-[var(--green)] transition-colors leading-tight line-clamp-2 mb-1">{product.name}</h3>
                      <p className="text-[11px] text-[var(--text-muted)] mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-light)]">
                        <span className="text-[11px] font-mono text-[var(--text-soft)]">{product.sku}</span>
                        <span className="text-[11px] font-bold text-[var(--green)]">Cotizar</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
