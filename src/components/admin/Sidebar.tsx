'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Icons from '@/components/ui/Icons';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Dashboard', href: '/admin', Icon: Icons.Home },
  { label: 'Productos', href: '/admin/productos', Icon: Icons.Package },
  { label: 'Costos y Envío', href: '/admin/costos', Icon: Icons.DollarSign },
  { label: 'Importar / Exportar', href: '/admin/importar', Icon: Icons.Upload },
  { label: 'Pedidos', href: '/admin/pedidos', Icon: Icons.ShoppingCart },
  { label: 'Personalizar', href: '/admin/personalizar', Icon: Icons.Wrench },
  { label: 'Configuración', href: '/admin/configuracion', Icon: Icons.Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${collapsed ? 'w-[68px]' : 'w-[260px]'} bg-[#0b1120] text-white flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300`}>
      {/* Header */}
      <div className="px-4 py-5 flex items-center justify-between border-b border-white/10">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#10b981] flex items-center justify-center flex-shrink-0">
              <Icons.Eye size={16} className="text-white" />
            </div>
            <div>
              <div className="text-[13px] font-bold tracking-wide">ATLANTIC</div>
              <div className="text-[9px] text-white/50 uppercase tracking-[0.15em]">Admin Panel</div>
            </div>
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 hover:bg-white/10 transition-colors" aria-label="Toggle sidebar">
          {collapsed ? <Icons.ArrowRight size={16} /> : <Icons.ArrowLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-colors ${active ? 'bg-[#10b981]/20 text-[#10b981]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              <item.Icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2.5 mb-3 px-1">
            <div className="w-8 h-8 bg-[#10b981]/20 flex items-center justify-center flex-shrink-0">
              <Icons.User size={14} className="text-[#10b981]" />
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-medium text-white truncate">{user?.name || 'Admin'}</div>
              <div className="text-[10px] text-white/40 truncate">{user?.email}</div>
            </div>
          </div>
        )}
        <button onClick={logout} className={`flex items-center gap-2 w-full px-3 py-2 text-[12px] text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors ${collapsed ? 'justify-center' : ''}`}>
          <Icons.LogOut size={16} />
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}
