'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import Icons from '@/components/ui/Icons';
import productsData from '../../../catalogos/products.json';

const stats = [
  { title: 'Productos', value: String(productsData.length), change: 'En catálogo', Icon: Icons.Package, color: 'bg-[var(--green)]' },
  { title: 'Pedidos', value: '—', change: 'Sin pedidos aún', Icon: Icons.ShoppingCart, color: 'bg-[var(--amber)]' },
  { title: 'Ingresos', value: '$0', change: 'Sin datos', Icon: Icons.DollarSign, color: 'bg-[var(--green)]' },
  { title: 'Envíos Activos', value: '0', change: 'Sin envíos', Icon: Icons.Truck, color: 'bg-[var(--amber)]' },
];

const sections = [
  { title: 'Gestionar Productos', desc: 'Crear, editar y eliminar productos del catálogo', href: '/admin/productos', Icon: Icons.Package },
  { title: 'Costos y Envío', desc: 'Configurar costos variables por kg y tipo de cambio', href: '/admin/costos', Icon: Icons.DollarSign },
  { title: 'Importar / Exportar', desc: 'Importar productos desde Excel y exportar catálogo', href: '/admin/importar', Icon: Icons.Package },
  { title: 'Pedidos', desc: 'Ver y gestionar todos los pedidos recibidos', href: '/admin/pedidos', Icon: Icons.ShoppingCart },
  { title: 'Personalizar Página', desc: 'Modificar secciones, colores y contenido del sitio', href: '/admin/personalizar', Icon: Icons.Wrench },
  { title: 'Configuración', desc: 'Ajustes generales del ecommerce', href: '/admin/configuracion', Icon: Icons.Wrench },
];

export default function AdminPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll<HTMLElement>('.admin-card');
    gsap.set(els, { opacity: 0, y: 30 });
    gsap.to(els, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' });
  }, []);

  return (
    <div className="bg-[var(--bg-alt)] min-h-screen" ref={containerRef}>
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>Panel de Administración</h1>
          <p className="text-[var(--text-muted)] text-sm">Gestiona tu ecommerce Atlantic Optical</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="admin-card bg-white p-6 shadow-sm border border-[var(--border)]">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.color} flex items-center justify-center`}>
                  <stat.Icon size={18} className="text-white" />
                </div>
                <span className="text-xs text-[var(--text-soft)]">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</div>
              <div className="text-sm text-[var(--text-muted)]">{stat.title}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((item, i) => (
            <Link key={i} href={item.href} className="admin-card group bg-white p-6 shadow-sm border border-[var(--border)] hover:border-[var(--green)] hover:shadow-md transition-all">
              <item.Icon size={24} className="text-[var(--green)] mb-3" />
              <h3 className="font-bold text-[var(--text)] mb-1 group-hover:text-[var(--green)] transition-colors">{item.title}</h3>
              <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
