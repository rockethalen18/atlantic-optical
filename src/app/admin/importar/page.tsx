'use client';

import { useState, useRef } from 'react';
import Icons from '@/components/ui/Icons';

interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  errors: { row: number; sku: string; error: string }[];
}

export default function AdminImport() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [importMode, setImportMode] = useState('create');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    setTimeout(() => {
      setResult({ total: 0, successful: 0, failed: 0, errors: [] });
      setImporting(false);
    }, 2000);
  };

  const downloadTemplate = () => {
    const headers = ['SKU', 'Nombre', 'Descripción', 'Costo Base (USD)', 'Peso (kg)', 'Margen', 'Categoría', 'Stock', 'Estado'];
    const example = ['AO-EXAMPLE001', 'Producto Ejemplo', 'Descripción del producto', '2800', '12', '2.2', 'Categoría', '5', 'published'];
    const csv = [headers.join(','), example.join(',')].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'atlantic_optical_plantilla_importacion.csv';
    link.click();
  };

  return (
    <div className="bg-[var(--bg-alt)] min-h-screen">
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-6">
          <h1 className="text-2xl font-bold text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>Importar / Exportar Productos</h1>
          <p className="text-[var(--text-muted)] text-sm">Importa productos masivamente desde Excel o exporta tu catálogo</p>
        </div>
      </div>

      <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 shadow-sm border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[var(--blue)] flex items-center justify-center">
                <Icons.Upload size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-[var(--text)]">Importar Productos</h2>
                <p className="text-xs text-[var(--text-muted)]">Sube un archivo CSV o Excel</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Modo de importación</label>
              <select value={importMode} onChange={e => setImportMode(e.target.value)} className="w-full px-3 py-2 border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--green)]">
                <option value="create">Crear nuevos productos</option>
                <option value="update">Actualizar existentes (por SKU)</option>
                <option value="upsert">Crear o actualizar</option>
              </select>
            </div>

            <div className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${file ? 'border-[var(--green)] bg-[var(--green-light)]' : 'border-[var(--border)] hover:border-[var(--green)]'}`} onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" />
              {file ? (
                <>
                  <Icons.FileSpreadsheet size={32} className="text-[var(--green)] mx-auto mb-2" />
                  <p className="font-medium text-[var(--text)]">{file.name}</p>
                  <p className="text-sm text-[var(--text-muted)]">{(file.size / 1024).toFixed(1)} KB</p>
                </>
              ) : (
                <>
                  <Icons.Upload size={32} className="text-[var(--text-soft)] mx-auto mb-2" />
                  <p className="font-medium text-[var(--text-secondary)]">Arrastra un archivo o haz clic para seleccionar</p>
                  <p className="text-sm text-[var(--text-muted)]">CSV, XLSX o XLS (máx. 5MB)</p>
                </>
              )}
            </div>

            <button onClick={handleImport} disabled={!file || importing} className="w-full mt-4 px-4 py-3 bg-[var(--green)] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--green-hover)] transition-colors">
              {importing ? 'Importando...' : 'Importar Productos'}
            </button>

            {result && (
              <div className="mt-4 p-4 bg-[var(--bg-alt)]">
                <div className="flex items-center gap-2 mb-2">
                  <Icons.CheckCircle size={16} className="text-[var(--green-status)]" />
                  <span className="font-medium text-sm text-[var(--text)]">Importación completada</span>
                </div>
                <div className="text-sm text-[var(--text-muted)] space-y-1">
                  <p>Total: {result.total} filas</p>
                  <p className="text-[var(--green-status)]">Exitosos: {result.successful}</p>
                  <p className="text-red-600">Fallidos: {result.failed}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 shadow-sm border border-[var(--border)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[var(--green)] flex items-center justify-center">
                <Icons.Download size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-[var(--text)]">Exportar Catálogo</h2>
                <p className="text-xs text-[var(--text-muted)]">Descarga todos tus productos con precios actuales</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[var(--bg-alt)]">
                <h3 className="font-medium text-sm text-[var(--text)] mb-2">Incluir en la exportación:</h3>
                <div className="space-y-2">
                  {['SKU, Nombre, Descripción', 'Costo base (USD), Peso (kg), Margen', 'Precio actual (MXN)', 'Precios por método de envío', 'Stock y estado'].map((item, i) => (
                    <label key={i} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <input type="checkbox" defaultChecked className="accent-[var(--green)]" />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={downloadTemplate} className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-[var(--green)] text-[var(--green)] font-medium hover:bg-[var(--green-light)] transition-colors">
                  <Icons.FileSpreadsheet size={16} />
                  Descargar Plantilla CSV
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--text)] text-white font-medium hover:bg-[var(--text-secondary)] transition-colors">
                  <Icons.Download size={16} />
                  Exportar Catálogo Completo (CSV)
                </button>
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-50">
                <Icons.AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  La exportación incluye los precios calculados con el tipo de cambio y costos de envío actuales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
