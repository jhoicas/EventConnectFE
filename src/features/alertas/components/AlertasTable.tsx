import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { useAlertaList } from '../hooks/useAlerta';
import type { AlertaFiltros, TipoAlerta, SeveridadAlerta, EstadoAlerta, Alerta } from '../types';

const tipos: TipoAlerta[] = ['Mantenimiento', 'Depreciacion', 'Vencimiento', 'Garantia'];
const severidades: SeveridadAlerta[] = ['Critica', 'Alta', 'Media', 'Baja'];
const estados: EstadoAlerta[] = ['Pendiente', 'Asignada', 'En_Proceso', 'Resuelta'];

interface AlertasTableProps {
  onSelectAlerta?: (alerta: Alerta) => void;
}

type SortField = 'fecha_creacion' | 'severidad' | 'prioridad' | 'estado';
type SortOrder = 'asc' | 'desc';

export function AlertasTable({ onSelectAlerta }: AlertasTableProps) {
  const [filtros, setFiltros] = useState<AlertaFiltros>({
    page: 1,
    pageSize: 15,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>('fecha_creacion');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { data, isLoading, error } = useAlertaList(filtros);

  const getSeveridadColor = (severidad: SeveridadAlerta) => {
    switch (severidad) {
      case 'Critica':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Alta':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Media':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getEstadoColor = (estado: EstadoAlerta) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-yellow-50 text-yellow-700';
      case 'Asignada':
        return 'bg-blue-50 text-blue-700';
      case 'En_Proceso':
        return 'bg-purple-50 text-purple-700';
      default:
        return 'bg-green-50 text-green-700';
    }
  };

  const sortedItems = data?.items
    .slice()
    .sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'severidad') {
        const severidadMap: Record<SeveridadAlerta, number> = {
          Critica: 4,
          Alta: 3,
          Media: 2,
          Baja: 1,
        };
        aVal = severidadMap[a.severidad];
        bVal = severidadMap[b.severidad];
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }) || [];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Listado de Alertas</h2>

      {/* Filtros */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          Filtros
        </button>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
              <select
                value={filtros.tipo || ''}
                onChange={(e) =>
                  setFiltros({ ...filtros, tipo: e.target.value as TipoAlerta | undefined, page: 1 })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="">Todos</option>
                {tipos.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Severidad</label>
              <select
                value={filtros.severidad || ''}
                onChange={(e) =>
                  setFiltros({ ...filtros, severidad: e.target.value as SeveridadAlerta | undefined, page: 1 })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="">Todas</option>
                {severidades.map((sev) => (
                  <option key={sev} value={sev}>
                    {sev}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
              <select
                value={filtros.estado || ''}
                onChange={(e) =>
                  setFiltros({ ...filtros, estado: e.target.value as EstadoAlerta | undefined, page: 1 })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="">Todos</option>
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ID Activo</label>
              <input
                type="number"
                placeholder="Ej: 123"
                value={filtros.activoId || ''}
                onChange={(e) =>
                  setFiltros({ ...filtros, activoId: e.target.value ? parseInt(e.target.value) : undefined, page: 1 })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabla */}
      {isLoading && <p className="text-center text-slate-600">Cargando...</p>}
      {error && <p className="text-center text-red-600">Error al cargar alertas</p>}

      {!isLoading && !error && (!data?.items || data.items.length === 0) && (
        <p className="text-center text-slate-600 py-8">No hay alertas registradas</p>
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
                  <th
                    className="px-4 py-3 text-left font-semibold text-slate-700 cursor-pointer hover:bg-slate-200"
                    onClick={() => handleSort('severidad')}
                  >
                    <div className="flex items-center gap-1">
                      Severidad
                      {sortField === 'severidad' && (
                        <ArrowUpDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold text-slate-700 cursor-pointer hover:bg-slate-200"
                    onClick={() => handleSort('estado')}
                  >
                    <div className="flex items-center gap-1">
                      Estado
                      {sortField === 'estado' && (
                        <ArrowUpDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Asignado a</th>
                  <th
                    className="px-4 py-3 text-left font-semibold text-slate-700 cursor-pointer hover:bg-slate-200"
                    onClick={() => handleSort('prioridad')}
                  >
                    <div className="flex items-center gap-1">
                      Prioridad
                      {sortField === 'prioridad' && (
                        <ArrowUpDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sortedItems.map((alerta) => (
                  <tr key={alerta.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-900 font-medium">#{alerta.id}</td>
                    <td className="px-4 py-3 text-slate-900">{alerta.activo_nombre || `Activo ${alerta.activoId}`}</td>
                    <td className="px-4 py-3 text-slate-900">{alerta.tipo}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeveridadColor(alerta.severidad)}`}>
                        {alerta.severidad}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(alerta.estado)}`}>
                        {alerta.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-900">{alerta.usuario_asignado || '-'}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-900">
                      {alerta.prioridad || '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onSelectAlerta?.(alerta)}
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
