'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

export default function PerfilPage() {
  const { user, loading, updateUser, logout } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/cuenta');
    }
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user, loading, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const data: any = {};
      if (name !== user?.name) data.name = name;
      if (email !== user?.email) data.email = email;
      if (phone) data.phone = phone;
      if (password) data.password = password;

      if (Object.keys(data).length === 0) {
        setError('Sin cambios para guardar');
        setSaving(false);
        return;
      }

      await updateUser(data);
      setSuccess('Perfil actualizado correctamente');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[var(--navy)]">Mi Perfil</h1>
        <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium">
          Cerrar sesión
        </button>
      </div>

      <div className="flex gap-2 mb-8">
        <Link href="/cuenta/perfil" className="px-4 py-2 bg-[var(--blue)] text-white text-sm font-semibold rounded-lg">
          Perfil
        </Link>
        <Link href="/cuenta/pedidos" className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-200">
          Mis Pedidos
        </Link>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-200">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
            placeholder="+52 (614) 000-0000"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña (dejar vacío para no cambiar)</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--blue)]"
            placeholder="Mínimo 6 caracteres"
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-[var(--blue)] text-white font-bold rounded-lg hover:bg-[var(--navy)] transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
}
