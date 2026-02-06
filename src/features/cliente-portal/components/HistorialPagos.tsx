import { useHistorialPagos } from '../hooks/useClientePortal';
import { DollarSign, Download, Filter } from 'lucide-react';
import { useState } from 'react';
import type { EstadoPago, FiltrosPago } from '../types';

const estatusPago: EstadoPago[] = ['Pendiente', 'Procesando', 'Pagado', 'Rechazado', 'Reembolsado'];

export function HistorialPagos() {
  const [filtros, setFiltros] = useState<FiltrosPago>({ pageSize: 20 });
  const { data, isLoading } = useHistorialPagos(filtros);

  const getEstadoColor = (estado: EstadoPago) => {
    switch (estado) {
      case 'Pagado':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Procesando':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Rechazado':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const totalPagado = data?.items?.filter((p) => p.estado === 'Pagado').reduce((sum, p) => sum + p.monto, 0) || 0;
  const totalPendiente = data?.items?.filter((p) => p.estado === 'Pendiente').reduce((sum, p) => sum + p.monto, 0) || 0;

  return (
    <div className="space-y-4">
      {/* Totales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-600">
          <p className="text-sm text-slate-600">Total Pagado</p>
          <p className="text-2xl font-bold text-green-600">${totalPagado.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-600">
          <p className="text-sm text-slate-600">Pendiente de Pago</p>
          <p className="text-2xl font-bold text-orange-600">${totalPendiente.toLocaleString()}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtrar por estado:
        </p>
        <div className="flex flex-wrap gap-2">
          {estatusPago.map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltros({ ...filtros, estado: estado === filtros.estado ? undefined : estado, page: 1 })}
              className={`px-3 py-1 rounded-lg border-2 text-xs font-semibold transition ${
                filtros.estado === estado
                  ? getEstadoColor(estado)
                  : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-slate-400'
              }`}
            >
              {estado}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Pagos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-slate-600">Cargando historial...</p>
          </div>
        ) : data?.items && data.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Reserva</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Método</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Referencia</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">Monto</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">Estado</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.items.map((pago) => (
                  <tr key={pago.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-sm text-slate-900 font-medium">
                      {new Date(pago.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      #{pago.reservaId}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {pago.metodo_pago || 'Transferencia'}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-600">
                      {pago.referencia}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-900 text-right">
                      ${pago.monto.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${getEstadoColor(pago.estado)}`}>
                        {pago.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {pago.comprobante_url && (
                        <button className="p-1 hover:bg-slate-100 rounded transition" title="Descargar comprobante">
                          <Download className="w-4 h-4 text-blue-600" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600">No hay pagos registrados</p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {data && data.total > 0 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setFiltros({ ...filtros, page: (filtros.page || 1) - 1 })}
            disabled={(filtros.page || 1) <= 1}
            className="px-3 py-2 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-slate-600">
            Página {filtros.page || 1} de {Math.ceil(data.total / (filtros.pageSize || 20))}
          </span>
          <button
            onClick={() => setFiltros({ ...filtros, page: (filtros.page || 1) + 1 })}
            disabled={(filtros.page || 1) >= Math.ceil(data.total / (filtros.pageSize || 20))}
            className="px-3 py-2 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
