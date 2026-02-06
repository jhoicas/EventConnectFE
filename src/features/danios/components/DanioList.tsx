import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useDanioList } from '../hooks/useDanio';
import type { DanioFiltros, EstadoDanio, TipoDanio } from '../types';

interface DanioDetailProps {
  id: number;
}

function DanioDetailComponent({ id }: DanioDetailProps) {
  return <div>Detail view for damage {id}</div>;
}

const estados: EstadoDanio[] = [
  'Reportado', 'En_Evaluacion', 'Confirmado', 'En_Reparacion',
  'Reparado', 'Perdida_Total', 'Rechazado'
];

const tipos: TipoDanio[] = ['Fisico', 'Funcional', 'Estetico', 'Faltante', 'Excedente'];

interface DanioListProps {
  // Props vacíos por ahora
}

export function DanioList({}: DanioListProps) {
  const [filtros, setFiltros] = useState<DanioFiltros>({
    estado: undefined,
    tipo: undefined,
    page: 1,
    pageSize: 10,
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useDanioList(filtros);

  const handleEstadoChange = (estado: string) => {
    setFiltros({
      ...filtros,
      estado: estado as EstadoDanio | undefined,
      page: 1,
    });
  };

  const handleTipoChange = (tipo: string) => {
    setFiltros({
      ...filtros,
      tipo: tipo as TipoDanio | undefined,
      page: 1,
    });
  };

  const handleReservaIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFiltros({
      ...filtros,
      reservaId: val ? parseInt(val) : undefined,
      page: 1,
    });
  };

  const handleActivoIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFiltros({
      ...filtros,
      activoId: val ? parseInt(val) : undefined,
      page: 1,
    });
  };

  const resetFiltros = () => {
    setFiltros({
      estado: undefined,
      tipo: undefined,
      page: 1,
      pageSize: 10,
    });
  };

  if (selectedId && data?.items.find(d => d.id === selectedId)) {
    return (
      <div>
        <button
          onClick={() => setSelectedId(null)}
          className="mb-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Volver a la lista
        </button>
        <DanioDetailComponent id={selectedId} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Gestión de Daños</h2>

      {/* Filtros */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          Filtros
        </button>

        {showFilters && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Estado
                </label>
                <select
                  value={filtros.estado || ''}
                  onChange={(e) => handleEstadoChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="">Todos</option>
                  {estados.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tipo
                </label>
                <select
                  value={filtros.tipo || ''}
                  onChange={(e) => handleTipoChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="">Todos</option>
                  {tipos.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  ID Reserva
                </label>
                <input
                  type="number"
                  placeholder="Ej: 123"
                  value={filtros.reservaId || ''}
                  onChange={handleReservaIdChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  ID Activo
                </label>
                <input
                  type="number"
                  placeholder="Ej: 456"
                  value={filtros.activoId || ''}
                  onChange={handleActivoIdChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <button
              onClick={resetFiltros}
              className="text-sm text-slate-600 hover:text-slate-700"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Tabla */}
      {isLoading && <p className="text-center text-slate-600">Cargando...</p>}

      {error && (
        <p className="text-center text-red-600">Error al cargar daños</p>
      )}

      {!isLoading && !error && (!data?.items || data.items.length === 0) && (
        <p className="text-center text-slate-600 py-8">No hay daños registrados</p>
      )}

      {data && data.items.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 border-b border-slate-300">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Activo</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Tipo</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Estado</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Monto Est.</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Usuario</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Fecha</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.items.map(danio => (
                  <tr key={danio.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-900 font-medium">#{danio.id}</td>
                    <td className="px-4 py-3 text-slate-900">{danio.activo_nombre || `Activo ${danio.activoId}`}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {danio.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        danio.estado === 'Reportado' ? 'bg-yellow-100 text-yellow-700' :
                        danio.estado === 'En_Evaluacion' ? 'bg-orange-100 text-orange-700' :
                        danio.estado === 'Confirmado' ? 'bg-blue-100 text-blue-700' :
                        danio.estado === 'En_Reparacion' ? 'bg-purple-100 text-purple-700' :
                        danio.estado === 'Reparado' ? 'bg-green-100 text-green-700' :
                        danio.estado === 'Perdida_Total' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {danio.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-900">${danio.monto_estimado.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-900">{danio.usuario_reporte}</td>
                    <td className="px-4 py-3 text-slate-900 text-xs">
                      {new Date(danio.fecha_reporte).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedId(danio.id)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {data.total > filtros.pageSize! && (
            <div className="mt-6 flex justify-between items-center text-sm">
              <span className="text-slate-600">
                Mostrando {((filtros.page! - 1) * filtros.pageSize!) + 1} a{' '}
                {Math.min(filtros.page! * filtros.pageSize!, data.total)} de {data.total}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFiltros({ ...filtros, page: Math.max(1, filtros.page! - 1) })}
                  disabled={filtros.page === 1}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setFiltros({ ...filtros, page: filtros.page! + 1 })}
                  disabled={filtros.page! * filtros.pageSize! >= data.total}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
