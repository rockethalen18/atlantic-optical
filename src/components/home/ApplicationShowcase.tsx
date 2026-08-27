import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';

interface ApplicationCard {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  count: string;
  href: string;
  gradient: string;
}

const applications: ApplicationCard[] = [
  {
    title: 'Sala de Refracción',
    icon: Icons.Eye,
    count: '45+ productos',
    href: '/productos?category=equipos-oftalmologia-optica',
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))',
  },
  {
    title: 'Consultorio de Oftalmología',
    icon: Icons.Stethoscope,
    count: '38+ productos',
    href: '/productos?category=equipos-oftalmologia-optica',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
  },
  {
    title: 'Laboratorio Óptico',
    icon: Icons.Settings,
    count: '52+ productos',
    href: '/productos?category=equipos-laboratorio',
    gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05))',
  },
  {
    title: 'Mobiliario de Consulta',
    icon: Icons.Armchair,
    count: '30+ productos',
    href: '/productos?category=mobiliario',
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
  },
  {
    title: 'Herramientas y Suministros',
    icon: Icons.Wrench,
    count: '65+ productos',
    href: '/productos?category=equipos-laboratorio',
    gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(219, 39, 119, 0.05))',
  },
  {
    title: 'Configuración Completa',
    icon: Icons.Layout,
    count: '20+ paquetes',
    href: '/productos?category=mobiliario',
    gradient: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(13, 148, 136, 0.05))',
  },
];

export default function ApplicationShowcase() {
  return (
    <section
      style={{
        padding: '80px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '48px',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            color: 'var(--blue)',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            letterSpacing: '0.5px',
          }}
        >
          Por Aplicación
        </span>
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: '700',
            color: 'var(--text)',
            fontFamily: 'var(--font-display)',
            marginBottom: '12px',
            lineHeight: '1.2',
          }}
        >
          Encuentra lo que Necesitas
        </h2>
        <p
          style={{
            fontSize: '18px',
            color: 'var(--text-muted)',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: '1.6',
          }}
        >
          Explora nuestro catálogo por tipo de consulta o uso
        </p>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        {applications.map((app) => {
          const IconComponent = app.icon;
          return (
            <Link key={app.title} href={app.href} style={{ textDecoration: 'none' }}>
              <div
                className="glass-card"
                style={{
                  background: app.gradient,
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '32px 24px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '16px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComponent
                    size={24}
                    className="text-[var(--blue)]"
                  />
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: 'var(--text)',
                      fontFamily: 'var(--font-display)',
                      marginBottom: '4px',
                      lineHeight: '1.3',
                    }}
                  >
                    {app.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--text-muted)',
                      margin: 0,
                    }}
                  >
                    {app.count}
                  </p>
                </div>

                {/* Arrow */}
                <Icons.ArrowRight
                  style={{
                    width: '20px',
                    height: '20px',
                    color: 'var(--text-muted)',
                    alignSelf: 'flex-end',
                  }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
