'use client';

import { useState } from 'react';
import Icons from '@/components/ui/Icons';

const categories = [
  { id: 'todos', label: 'Todos', color: 'var(--blue)' },
  { id: 'equipamiento', label: 'Equipamiento', color: '#0ea5e9' },
  { id: 'guias', label: 'Guías', color: '#10b981' },
  { id: 'mantenimiento', label: 'Mantenimiento', color: '#f59e0b' },
  { id: 'industria', label: 'Industria', color: '#8b5cf6' },
  { id: 'logistica', label: 'Logística', color: '#06b6d4' },
  { id: 'business', label: 'Business', color: '#ec4899' },
];

const posts = [
  {
    id: 1,
    title: 'Cómo elegir el mejor phoróptero para tu consultorio',
    date: '15 Ene 2026',
    category: 'equipamiento',
    categoryColor: '#0ea5e9',
    excerpt: 'Guía completa para seleccionar el phoróptero ideal según las necesidades de tu práctica clínica y presupuesto.',
    gradient: 'from-[#0ea5e9] to-[#0284c7]',
  },
  {
    id: 2,
    title: 'Guía completa de lámparas de hendidura',
    date: '8 Feb 2026',
    category: 'guias',
    categoryColor: '#10b981',
    excerpt: 'Todo lo que necesitas saber sobre tipos, especificaciones y uso correcto de lámparas de hendidura.',
    gradient: 'from-[#10b981] to-[#059669]',
  },
  {
    id: 3,
    title: 'Mantenimiento de auto refractómetros: consejos prácticos',
    date: '22 Feb 2026',
    category: 'mantenimiento',
    categoryColor: '#f59e0b',
    excerpt: 'Protocolos de mantenimiento preventivo para maximizar la vida útil y precisión de tus auto refractómetros.',
    gradient: 'from-[#f59e0b] to-[#d97706]',
  },
  {
    id: 4,
    title: 'Tendencias en tecnología oftálmica 2026',
    date: '5 Mar 2026',
    category: 'industria',
    categoryColor: '#8b5cf6',
    excerpt: 'Las innovaciones más importantes que están transformando el equipamiento oftálmico este año.',
    gradient: 'from-[#8b5cf6] to-[#7c3aed]',
  },
  {
    id: 5,
    title: 'Envío de equipos oftálmicos: qué debes saber',
    date: '18 Mar 2026',
    category: 'logistica',
    categoryColor: '#06b6d4',
    excerpt: 'Guía sobre embalaje, documentación y mejores prácticas para el envío seguro de equipo delicado.',
    gradient: 'from-[#06b6d4] to-[#0891b2]',
  },
  {
    id: 6,
    title: 'OEM vs ODM: diferencias para tu negocio',
    date: '1 Abr 2026',
    category: 'business',
    categoryColor: '#ec4899',
    excerpt: 'Comparativa completa para ayudarte a decidir entre fabricación con tu marca o diseño personalizado.',
    gradient: 'from-[#ec4899] to-[#db2777]',
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('todos');

  const filteredPosts = activeCategory === 'todos'
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-white relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(var(--blue) 1px, transparent 1px), linear-gradient(90deg, var(--blue) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-14 md:py-20 relative z-10 text-center">
          <span className="text-[10px] font-bold text-[var(--blue)] uppercase tracking-[0.2em]">Blog</span>
          <h1 className="text-[36px] md:text-[48px] font-black text-[var(--text)] tracking-[-0.04em] mt-2" style={{ fontFamily: 'var(--font-display)' }}>
            Noticias y Guías
          </h1>
          <p className="text-[14px] text-[var(--text-muted)] mt-3 max-w-[500px] mx-auto">Artículos sobre equipamiento oftálmico y óptica</p>
        </div>
      </div>

      {/* Category filters */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-alt)]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="flex overflow-x-auto gap-1 py-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] whitespace-nowrap transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-[var(--blue)] text-white border-[var(--blue)]'
                    : 'bg-white text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--blue)]/30 hover:text-[var(--blue)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog grid */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-white border border-[var(--border)] hover:border-[var(--blue)]/20 transition-all hover:shadow-lg overflow-hidden"
            >
              {/* Image placeholder */}
              <div className={`h-44 bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-[0.08]" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icons.FileText size={32} className="text-white/30" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Category badge */}
                <span
                  className="inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white mb-3"
                  style={{ backgroundColor: post.categoryColor }}
                >
                  {categories.find((c) => c.id === post.category)?.label}
                </span>

                {/* Title */}
                <h2 className="text-[15px] font-bold text-[var(--text)] leading-[1.4] mb-2 group-hover:text-[var(--blue)] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                  {post.title}
                </h2>

                {/* Date */}
                <p className="text-[11px] text-[var(--text-soft)] mb-3 flex items-center gap-1.5">
                  <Icons.Clock size={11} className="text-[var(--text-soft)]" />
                  {post.date}
                </p>

                {/* Excerpt */}
                <p className="text-[12px] text-[var(--text-muted)] leading-[1.6] mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Read more */}
                <a
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--blue)] uppercase tracking-[0.08em] hover:text-[var(--blue-hover)] transition-colors group/link"
                >
                  Leer más
                  <Icons.ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <Icons.FileText size={40} className="mx-auto text-[var(--border)] mb-4" />
            <p className="text-[14px] text-[var(--text-muted)]">No hay artículos en esta categoría aún.</p>
          </div>
        )}

        {/* Categories sidebar section */}
        <div className="mt-16 p-8 bg-[var(--bg-alt)] border border-[var(--border)]">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-[18px] font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Categorías
              </h3>
              <p className="text-[13px] text-[var(--text-muted)]">Explora nuestros artículos por tema de interés.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 text-[11px] font-bold uppercase tracking-[0.08em] border transition-all ${
                    activeCategory === cat.id
                      ? 'bg-[var(--blue)] text-white border-[var(--blue)]'
                      : 'bg-white text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--blue)]/30 hover:text-[var(--blue)]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-8 p-8 bg-[var(--green)] text-center">
          <h3 className="text-[18px] font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            ¿Quieres recibir nuestras guías?
          </h3>
          <p className="text-[13px] text-white/60 mb-5">
            Suscríbete para recibir artículos sobre equipamiento oftálmico directamente en tu correo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-[400px] mx-auto">
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full sm:flex-1 px-4 py-3 text-[13px] bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-colors"
            />
            <button className="w-full sm:w-auto bg-white text-[var(--green)] font-bold text-[12px] uppercase tracking-[0.08em] px-6 py-3 hover:bg-white/90 transition-colors">
              Suscribirme
            </button>
          </div>
        </div>

        {/* Related pages */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/faq" className="p-6 bg-[var(--bg-alt)] border border-[var(--border)] hover:border-[var(--blue)]/20 transition-colors">
            <Icons.HelpCircle size={20} className="text-[var(--blue)] mb-3" />
            <h4 className="text-[13px] font-bold text-[var(--text)] mb-1">Preguntas Frecuentes</h4>
            <p className="text-[12px] text-[var(--text-muted)]">Respuestas a las preguntas más comunes sobre compra y envío.</p>
          </a>
          <a href="/contacto" className="p-6 bg-[var(--bg-alt)] border border-[var(--border)] hover:border-[var(--blue)]/20 transition-colors">
            <Icons.Phone size={20} className="text-[var(--blue)] mb-3" />
            <h4 className="text-[13px] font-bold text-[var(--text)] mb-1">Contacto</h4>
            <p className="text-[12px] text-[var(--text-muted)]">¿Necesitas asesoría personalizada? Contáctanos.</p>
          </a>
          <a href="/nosotros" className="p-6 bg-[var(--bg-alt)] border border-[var(--border)] hover:border-[var(--blue)]/20 transition-colors">
            <Icons.Award size={20} className="text-[var(--blue)] mb-3" />
            <h4 className="text-[13px] font-bold text-[var(--text)] mb-1">Sobre Nosotros</h4>
            <p className="text-[12px] text-[var(--text-muted)]">Conoce más sobre Atlantic Optical y nuestra experiencia.</p>
          </a>
        </div>
      </section>
    </div>
  );
}
