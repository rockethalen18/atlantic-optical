'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Icons from '@/components/ui/Icons';
import productsData from '../../../catalogos/products.json';

const categories = [
  { name: 'Todos', slug: '', count: 116 },
  { name: 'Equipos Oftálmicos', slug: 'equipos-oftalmologia-optica', count: 55 },
  { name: 'Equipos de Laboratorio', slug: 'equipos-laboratorio', count: 34 },
  { name: 'Mobiliario', slug: 'mobiliario', count: 12 },
  { name: 'Monitores y Optotipos', slug: 'monitores-optotipos', count: 15 },
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

function SkeletonCard() {
  return (
    <div className="bg-white border border-[var(--border)] overflow-hidden animate-pulse">
      <div className="aspect-square bg-[var(--bg-alt)]" />
      <div className="p-4 space-y-2">
        <div className="h-2 bg-[var(--bg-alt)] w-1/3" />
        <div className="h-3 bg-[var(--bg-alt)] w-3/4" />
        <div className="h-2 bg-[var(--bg-alt)] w-full" />
        <div className="h-2 bg-[var(--bg-alt)] w-1/2" />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm, sortBy]);

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
    <div className="min-h-screen bg-[var(--bg-alt)]">
      {/* Hero header */}
      <div className="bg-[var(--text)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-10 md:py-14 relative z-10">
          <span className="text-[10px] font-bold text-[var(--green-status)] uppercase tracking-[0.2em]">Catalogo</span>
          <h1 className="text-[32px] md:text-[42px] font-black text-white tracking-[-0.04em] mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            Productos
          </h1>
          <p className="text-[14px] text-white/50 mt-2">{filtered.length} productos disponibles</p>
        </div>
      </div>

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-60 flex-shrink-0">
            <div className="bg-white border border-[var(--border)] p-5 sticky top-28">
              <h3 className="text-[11px] font-bold text-[var(--text)] uppercase tracking-[0.14em] mb-4">Categorias</h3>
              <div className="space-y-0.5">
                {categories.map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2.5 text-[13px] transition-all duration-200 flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? 'bg-[var(--green)] text-white font-bold'
                        : 'text-[var(--text-muted)] hover:bg-[var(--green-light)] hover:text-[var(--green)]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-[10px] font-mono ${selectedCategory === cat.slug ? 'text-white/70' : 'text-[var(--text-soft)]'}`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="bg-white border border-[var(--border)] p-4 mb-5 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[200px] relative">
                <Icons.Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-soft)]" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, SKU..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-[var(--border)] text-[13px] focus:outline-none focus:border-[var(--green)] transition-colors"
                />
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2.5 border border-[var(--border)] text-[13px] focus:outline-none focus:border-[var(--green)]">
                <option value="name">Nombre A-Z</option>
                <option value="sku">SKU</option>
              </select>
              <div className="hidden md:flex items-center border border-[var(--border)]">
                <button onClick={() => setViewMode('grid')} className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-[var(--green)] text-white' : 'text-[var(--text-muted)] hover:bg-[var(--bg-alt)]'}`}>
                  <Icons.Menu size={15} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-[var(--green)] text-white' : 'text-[var(--text-muted)] hover:bg-[var(--bg-alt)]'}`}>
                  <Icons.FileText size={15} />
                </button>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white p-16 text-center border border-[var(--border)]">
                <Icons.Search size={32} className="text-[var(--text-soft)] mx-auto mb-4" />
                <h3 className="text-[18px] font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Sin resultados</h3>
                <p className="text-[13px] text-[var(--text-muted)]">No se encontraron productos con esos criterios.</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((product, idx) => (
                  <Link
                    key={product.sku}
                    href={`/productos/${product.slug}/`}
                    className="group bg-white border border-[var(--border)] hover:border-[var(--green)]/30 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,101,53,0.06)] hover:-translate-y-0.5"
                    style={{ animationDelay: `${idx * 0.03}s` }}
                  >
                    <div className="relative aspect-square bg-[var(--bg-alt)] overflow-hidden">
                      <img
                        src={`/images/products/${product.sku}.jpg`}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="absolute top-2 left-2 bg-[var(--green)] text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-[0.1em]">
                        {product.category.replace('Equipos de ', '')}
                      </span>
                    </div>
                    <div className="p-4">
                      <span className="text-[9px] font-bold text-[var(--green)] uppercase tracking-[0.14em] block mb-1">{product.subcategory}</span>
                      <h3 className="text-[13px] font-bold text-[var(--text)] group-hover:text-[var(--green)] transition-colors leading-tight line-clamp-2 mb-1">{product.name}</h3>
                      <p className="text-[11px] text-[var(--text-muted)] mb-2 line-clamp-2 leading-relaxed">{product.description}</p>
                      <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border-light)]">
                        <span className="text-[9px] font-mono text-[var(--text-soft)]">{product.sku}</span>
                        <span className="text-[11px] font-bold text-[var(--green)] flex items-center gap-1">
                          Cotizar <Icons.ArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map(product => (
                  <Link
                    key={product.sku}
                    href={`/productos/${product.slug}/`}
                    className="group flex items-center gap-5 bg-white border border-[var(--border)] hover:border-[var(--green)]/30 p-4 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="w-20 h-20 bg-[var(--bg-alt)] overflow-hidden flex-shrink-0">
                      <img src={`/images/products/${product.sku}.jpg`} alt={product.name} className="w-full h-full object-contain p-2" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold text-[var(--green)] uppercase tracking-[0.14em]">{product.subcategory}</span>
                      <h3 className="text-[13px] font-bold text-[var(--text)] group-hover:text-[var(--green)] transition-colors truncate">{product.name}</h3>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">{product.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-[9px] font-mono text-[var(--text-soft)] block">{product.sku}</span>
                      <span className="text-[11px] font-bold text-[var(--green)]">Cotizar</span>
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
