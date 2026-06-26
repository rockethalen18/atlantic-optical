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
      description: product.description || `${product.name} - ${product.subcategory}. SKU: ${product.sku}. Cotiza con Atlantic Optical.`,
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
      <section className="bg-[var(--bg-alt)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Link href="/" className="hover:text-[var(--green)] transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/productos/" className="hover:text-[var(--green)] transition-colors">Productos</Link>
            <span>/</span>
            <Link href={`/productos/?category=${product.category_slug}`} className="hover:text-[var(--green)] transition-colors">{product.category}</Link>
            <span>/</span>
            <Link href={`/productos/?category=${product.subcategory_slug}`} className="hover:text-[var(--green)] transition-colors">{product.subcategory}</Link>
            <span>/</span>
            <span className="text-[var(--text)] font-medium">{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="wow-fadeUp">
            <div className="relative aspect-square bg-[var(--bg-alt)] border border-[var(--border)] overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-4"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          <div className="wow-fadeUp flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide uppercase bg-[var(--green)] text-white">{product.subcategory}</span>
                <span className="text-xs text-[var(--text-muted)]">SKU: {product.sku}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text)] leading-tight">{product.name}</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-6 py-3 bg-[var(--green)] text-white font-semibold text-lg">
                <Icons.ShoppingCart className="w-5 h-5 inline mr-2" />
                Cotizar
              </div>
              <span className="text-sm text-[var(--text-muted)]">Solicita presupuesto personalizado</span>
            </div>

            {product.description && (
              <div>
                <h2 className="text-lg font-bold text-[var(--text)] mb-2">Descripcion</h2>
                <p className="text-[var(--text-secondary)] leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--bg-alt)] border border-[var(--border)]">
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">SKU</span>
                <p className="text-sm font-semibold text-[var(--text)] mt-1">{product.sku}</p>
              </div>
              <div className="p-4 bg-[var(--bg-alt)] border border-[var(--border)]">
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Referencia</span>
                <p className="text-sm font-semibold text-[var(--text)] mt-1">{product.reference}</p>
              </div>
              <div className="p-4 bg-[var(--bg-alt)] border border-[var(--border)]">
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Categoria</span>
                <p className="text-sm font-semibold text-[var(--text)] mt-1">{product.category}</p>
              </div>
              <div className="p-4 bg-[var(--bg-alt)] border border-[var(--border)]">
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Subcategoria</span>
                <p className="text-sm font-semibold text-[var(--text)] mt-1">{product.subcategory}</p>
              </div>
            </div>

            {hasSpecs && (
              <div>
                <h2 className="text-lg font-bold text-[var(--text)] mb-3">Especificaciones</h2>
                <div className="border border-[var(--border)] divide-y divide-[var(--border)]">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between px-4 py-3">
                      <span className="text-sm text-[var(--text-muted)] capitalize">{key}</span>
                      <span className="text-sm font-medium text-[var(--text)]">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.barcode && (
              <div className="p-4 bg-[var(--bg-alt)] border border-[var(--border)]">
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Codigo de barras</span>
                <p className="text-sm font-mono text-[var(--text)] mt-1">{product.barcode}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[var(--bg-alt)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-6">
            <Icons.Truck className="w-5 h-5 text-[var(--green)]" />
            <h2 className="text-lg font-bold text-[var(--text)]">Envio desde China</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-[var(--border)]">
              <p className="font-semibold text-[var(--text)]">Maritimo</p>
              <p className="text-sm text-[var(--text-muted)]">20-40 dias | $4.50 USD/kg</p>
            </div>
            <div className="p-4 bg-white border border-[var(--border)]">
              <p className="font-semibold text-[var(--text)]">Aereo</p>
              <p className="text-sm text-[var(--text-muted)]">5-10 dias | $12.00 USD/kg</p>
            </div>
            <div className="p-4 bg-white border border-[var(--border)]">
              <p className="font-semibold text-[var(--text)]">Express</p>
              <p className="text-sm text-[var(--text-muted)]">3-7 dias | $20.00 USD/kg</p>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-bold text-[var(--text)] mb-6">Productos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.sku} product={rp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
