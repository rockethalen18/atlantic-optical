import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import products from '../../../../catalogos/products.json';
import { Icons } from '@/components/ui/Icons';
import ProductCard from '@/components/ui/ProductCard';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  return params.then(({ slug }) => {
    const product = products.find((p) => p.slug === slug);
    if (!product) return { title: 'Producto no encontrado' };

    return {
      title: `${product.name} | Atlantic Optical`,
      description: product.description || `${product.name} - ${product.subcategory}. SKU: ${product.sku}.`,
      openGraph: {
        title: product.name,
        description: product.description || `${product.name} - Equipamiento optico profesional`,
        images: [product.image],
        type: 'website',
      },
    };
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const relatedProducts = products
    .filter((p) => p.subcategory_slug === product.subcategory_slug && p.sku !== product.sku)
    .slice(0, 4);

  const hasSpecs = product.specs && Object.keys(product.specs).length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-[var(--bg-alt)] border-b border-[var(--border)]">
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-3">
          <nav className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
            <Link href="/" className="hover:text-[var(--green)] transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/productos" className="hover:text-[var(--green)] transition-colors">Productos</Link>
            <span>/</span>
            <Link href={`/productos?category=${product.category_slug}`} className="hover:text-[var(--green)] transition-colors">{product.category}</Link>
            <span>/</span>
            <span className="text-[var(--text)] font-medium truncate max-w-[180px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product section */}
      <section className="max-w-[1680px] mx-auto px-6 md:px-10 py-8 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Image gallery */}
          <div className="relative">
            <div className="sticky top-28">
              <div className="relative aspect-square bg-[var(--bg-alt)] border border-[var(--border)] overflow-hidden group">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {/* Category badge */}
                <div className="absolute top-4 left-4 bg-[var(--green)] text-white text-[8px] font-bold px-2.5 py-1 uppercase tracking-[0.12em]">
                  {product.subcategory}
                </div>
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-2 mt-3">
                {[product.image].map((img, i) => (
                  <div key={i} className="w-16 h-16 bg-[var(--bg-alt)] border-2 border-[var(--green)] overflow-hidden cursor-pointer">
                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-bold text-[var(--green)] uppercase tracking-[0.14em]">{product.subcategory}</span>
              <span className="text-[10px] text-[var(--text-soft)] font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-[28px] md:text-[34px] font-black text-[var(--text)] leading-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              {product.name}
            </h1>

            {product.description && (
              <p className="text-[14px] text-[var(--text-secondary)] leading-[1.7] mb-6">{product.description}</p>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/contacto" className="inline-flex items-center justify-center gap-2 bg-[var(--green)] text-white font-bold text-[12px] uppercase tracking-[0.08em] px-8 py-4 hover:bg-[var(--green-hover)] transition-all hover:shadow-[0_16px_40px_rgba(0,101,53,0.2)] hover:-translate-y-0.5">
                <Icons.ShoppingCart size={14} />
                Solicitar Cotización
              </Link>
              <a href={`https://wa.me/525512345678?text=Hola, me interesa el producto: ${product.name} (${product.sku})`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[var(--green-light)] text-[var(--green)] font-bold text-[12px] uppercase tracking-[0.08em] px-8 py-4 hover:bg-[var(--green)]/15 transition-all">
                WhatsApp
              </a>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="p-4 bg-[var(--bg-alt)] border border-[var(--border)]">
                <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em]">SKU</span>
                <p className="text-[13px] font-mono font-semibold text-[var(--text)] mt-1">{product.sku}</p>
              </div>
              <div className="p-4 bg-[var(--bg-alt)] border border-[var(--border)]">
                <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em]">Referencia</span>
                <p className="text-[13px] font-semibold text-[var(--text)] mt-1">{product.reference}</p>
              </div>
              <div className="p-4 bg-[var(--bg-alt)] border border-[var(--border)]">
                <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em]">Categoria</span>
                <p className="text-[13px] font-semibold text-[var(--text)] mt-1">{product.category}</p>
              </div>
              <div className="p-4 bg-[var(--bg-alt)] border border-[var(--border)]">
                <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em]">Subcategoria</span>
                <p className="text-[13px] font-semibold text-[var(--text)] mt-1">{product.subcategory}</p>
              </div>
            </div>

            {/* Specs */}
            {hasSpecs && (
              <div className="mb-8">
                <h2 className="text-[16px] font-bold text-[var(--text)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>Especificaciones</h2>
                <div className="border border-[var(--border)] divide-y divide-[var(--border)]">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between px-4 py-3">
                      <span className="text-[12px] text-[var(--text-muted)] uppercase tracking-wide">{key}</span>
                      <span className="text-[12px] font-semibold text-[var(--text)]">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Barcode */}
            {product.barcode && (
              <div className="p-4 bg-[var(--bg-alt)] border border-[var(--border)] mb-8">
                <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.14em]">Codigo de barras</span>
                <p className="text-[12px] font-mono text-[var(--text)] mt-1">{product.barcode}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Shipping info */}
      <section className="bg-[var(--bg-alt)] border-y border-[var(--border)]">
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-10">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 bg-[var(--green)]/10 flex items-center justify-center">
              <Icons.Truck size={16} className="text-[var(--green)]" />
            </div>
            <h2 className="text-[16px] font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>Envio desde China a Mexico</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { method: 'Maritimo', time: '20-40 dias', price: '$4.50 USD/kg', icon: Icons.Shipping, color: '#16a34a' },
              { method: 'Aereo', time: '5-10 dias', price: '$12.00 USD/kg', icon: Icons.Truck, color: '#f59e0b' },
              { method: 'Express', time: '3-7 dias', price: '$20.00 USD/kg', icon: Icons.Package, color: '#0f3460' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-5 bg-white border border-[var(--border)] hover:border-[var(--green)]/20 transition-colors">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}10` }}>
                  <span style={{ color: s.color }}><s.icon size={18} /></span>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[var(--text)]">{s.method}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">{s.time} | {s.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-[1680px] mx-auto px-6 md:px-10 py-12">
          <h2 className="text-[22px] font-bold text-[var(--text)] mb-6" style={{ fontFamily: 'var(--font-display)' }}>Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.sku} product={rp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
