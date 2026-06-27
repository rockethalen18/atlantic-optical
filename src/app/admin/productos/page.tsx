'use client';

import { useState } from 'react';
import Icons from '@/components/ui/Icons';
import productsData from '../../../../catalogos/products.json';

interface ProductRow {
  id: number;
  name: string;
  sku: string;
  base_cost_usd: number;
  weight_kg: number;
  margin: number;
  price_mxn: number;
  stock: number;
  status: string;
  category: string;
}

function mapJsonToProductRow(json: any, index: number): ProductRow {
  return {
    id: index + 1,
    name: json.name,
    sku: json.sku,
    base_cost_usd: 0,
    weight_kg: 0,
    margin: 2.0,
    price_mxn: 0,
    stock: 0,
    status: 'published',
    category: json.category,
  };
}

const initialProducts: ProductRow[] = productsData.map(mapJsonToProductRow);

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductRow[]>(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [form, setForm] = useState({ name: '', sku: '', base_cost_usd: 0, weight_kg: 0, margin: 2.0, stock: 0, status: 'draft', category: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setProducts(products.map(p => p.id === editing.id ? { ...p, ...form, price_mxn: form.base_cost_usd * form.margin * 17.5 * 1.16 } : p));
    } else {
      setProducts([...products, { ...form, id: Date.now(), price_mxn: form.base_cost_usd * form.margin * 17.5 * 1.16 }]);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', sku: '', base_cost_usd: 0, weight_kg: 0, margin: 2.0, stock: 0, status: 'draft', category: '' });
  };

  return (
    <div className="bg-[var(--bg-alt)] min-h-screen">
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>Gestionar Productos</h1>
            <p className="text-[var(--text-muted)] text-sm">{products.length} productos en el catálogo</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); }} className="flex items-center gap-2 px-4 py-2 bg-[var(--green)] text-white hover:bg-[var(--green-hover)] transition-colors text-sm font-medium">
            <Icons.Plus size={16} /> Nuevo Producto
          </button>
        </div>
      </div>

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-8">
        {showForm && (
          <div className="bg-white p-6 shadow-sm mb-6 border border-[var(--border)]">
            <h2 className="font-bold text-lg mb-4 text-[var(--text)]">{editing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1 block">Nombre *</label>
                <input placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--green)]" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1 block">SKU *</label>
                <input placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} className="w-full px-3 py-2 border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--green)]" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1 block">Costo Base USD</label>
                <input placeholder="Costo Base USD" type="number" step="0.01" value={form.base_cost_usd} onChange={e => setForm({ ...form, base_cost_usd: parseFloat(e.target.value) })} className="w-full px-3 py-2 border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--green)]" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1 block">Peso (kg)</label>
                <input placeholder="Peso (kg)" type="number" step="0.01" value={form.weight_kg} onChange={e => setForm({ ...form, weight_kg: parseFloat(e.target.value) })} className="w-full px-3 py-2 border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--green)]" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1 block">Margen</label>
                <input placeholder="Margen" type="number" step="0.1" value={form.margin} onChange={e => setForm({ ...form, margin: parseFloat(e.target.value) })} className="w-full px-3 py-2 border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--green)]" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1 block">Stock</label>
                <input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--green)]" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1 block">Categoría</label>
                <input placeholder="Categoría" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--green)]" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em] mb-1 block">Estado</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-[var(--border)] text-sm focus:outline-none">
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                </select>
              </div>
              <div className="md:col-span-2 lg:col-span-4 flex gap-2">
                <button type="submit" className="px-4 py-2 bg-[var(--green)] text-white text-sm">{editing ? 'Actualizar' : 'Crear'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border border-[var(--border)] text-sm">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {products.length === 0 ? (
          <div className="bg-white p-12 text-center border border-[var(--border)] shadow-sm">
            <div className="w-16 h-16 bg-[var(--bg-alt)] flex items-center justify-center mx-auto mb-4">
              <Icons.Package size={24} className="text-[var(--text-soft)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Sin productos</h3>
            <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto mb-4">
              Aún no hay productos en el catálogo. Importa productos desde Excel o créalos manualmente.
            </p>
            <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 bg-[var(--green)] text-white font-bold text-[12px] uppercase tracking-[0.1em] px-6 py-3 hover:bg-[var(--green-hover)] transition-colors">
              <Icons.Plus size={14} /> Crear Primer Producto
            </button>
          </div>
        ) : (
          <div className="bg-white shadow-sm border border-[var(--border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[var(--bg-alt)] border-b border-[var(--border)]">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Producto</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">SKU</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Costo USD</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Peso</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Precio MXN</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Stock</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Estado</th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-muted)]">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-light)]">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-[var(--bg-alt)]">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[var(--text)]">{p.name}</div>
                        <div className="text-xs text-[var(--text-soft)]">{p.category}</div>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-muted)] font-mono text-xs">{p.sku}</td>
                      <td className="px-4 py-3 text-[var(--text-muted)]">${p.base_cost_usd.toLocaleString()}</td>
                      <td className="px-4 py-3 text-[var(--text-muted)]">{p.weight_kg} kg</td>
                      <td className="px-4 py-3 font-bold text-[var(--text)]">${p.price_mxn.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-medium ${p.stock > 5 ? 'bg-[var(--green-light)] text-[var(--green)]' : p.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-medium ${p.status === 'published' ? 'bg-[var(--green-light)] text-[var(--green)]' : 'bg-[var(--bg-alt)] text-[var(--text-muted)]'}`}>
                          {p.status === 'published' ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setEditing(p); setForm(p); setShowForm(true); }} className="p-1.5 hover:bg-[var(--bg-alt)] rounded" aria-label="Editar producto"><Icons.Pencil size={14} /></button>
                          <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="p-1.5 hover:bg-red-50 text-red-500 rounded" aria-label="Eliminar producto"><Icons.Trash size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
