import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useMisReservas, useCancelarReserva } from '../hooks/useClientePortal';
import type { EstadoReserva, FiltrosReserva } from '../types';

const estados: EstadoReserva[] = ['Pendiente', 'Confirmada', 'En_Entrega', 'Finalizada', 'Cancelada'];

interface MisReservasProps {
  onSelectReserva?: (reservaId: number) => void;
}

export function MisReservas({ onSelectReserva }: MisReservasProps) {
  const [filtros, setFiltros] = useState<FiltrosReserva>({ pageSize: 10 });
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { data, isLoading } = useMisReservas(filtros);
  const cancelarMutation = useCancelarReserva();

  const handleCancelar = async (reservaId: number) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;
    await cancelarMutation.mutateAsync(reservaId);
  };

  const handleEstadoChange = (estado: EstadoReserva) => {
    setFiltros({ ...filtros, estado: estado === filtros.estado ? undefined : estado, page: 1 });
  };

  const getEstadoColor = (estado: EstadoReserva) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Confirmada':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'En_Entrega':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Finalizada':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-sm font-medium text-slate-700 mb-3">Filtrar por estado:</p>
        <div className="flex flex-wrap gap-2">
          {estados.map((estado) => (
            <button
              key={estado}
              onClick={() => handleEstadoChange(estado)}
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

      {/* Tabla */}
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-slate-600">Cargando reservas...</p>
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <div className="space-y-3">
          {data.items.map((reserva) => (
            <div key={reserva.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
              {/* Header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
                onClick={() => setExpandedId(expandedId === reserva.id ? null : reserva.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-slate-900">Reserva #{reserva.id}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getEstadoColor(reserva.estado)}`}>
                      {reserva.estado}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{reserva.direccion_entrega}</p>
                </div>
                <div className="text-right mr-3">
                  <p className="font-bold text-slate-900">${reserva.total.toLocaleString()}</p>
                  <p className="text-xs text-slate-600">{new Date(reserva.fecha_creacion).toLocaleDateString()}</p>
                </div>
                <button className="p-1 hover:bg-slate-100 rounded">
                  {expandedId === reserva.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Detalles Expandidos */}
              {expandedId === reserva.id && (
                <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-3">
                  {/* Fechas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-600">Fecha de inicio</p>
                      <p className="font-semibold text-slate-900">
                        {new Date(reserva.fecha_inicio).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Fecha de fin</p>
                      <p className="font-semibold text-slate-900">
                        {new Date(reserva.fecha_fin).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Detalles de Activos */}
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-2">Activos:</p>
                    <div className="space-y-1">
                      {reserva.detalles.map((detalle, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-slate-600">{detalle.activo?.nombre || `Activo ${detalle.activoId}`}</span>
                          <span className="font-semibold text-slate-900">
                            x{detalle.cantidad} - ${detalle.subtotal.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Saldo */}
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600">Total:</span>
                      <span className="font-bold text-slate-900">${reserva.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Pendiente:</span>
                      <span className={`font-bold ${reserva.saldo_pendiente > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                        ${reserva.saldo_pendiente.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => onSelectReserva?.(reserva.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition"
                    >
                      Ver Seguimiento
                    </button>
                    {reserva.estado !== 'Finalizada' && reserva.estado !== 'Cancelada' && (
                      <button
                        onClick={() => handleCancelar(reserva.id)}
                        disabled={cancelarMutation.isPending}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition disabled:opacity-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-slate-600">No hay reservas</p>
        </div>
      )}

      {/* Paginación */}
      {data && data.total > 0 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setFiltros({ ...filtros, page: (filtros.page || 1) - 1 })}
            disabled={(filtros.page || 1) <= 1}
            className="px-3 py-2 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-slate-600">
            Página {filtros.page || 1} de {Math.ceil(data.total / (filtros.pageSize || 10))}
          </span>
          <button
            onClick={() => setFiltros({ ...filtros, page: (filtros.page || 1) + 1 })}
            disabled={(filtros.page || 1) >= Math.ceil(data.total / (filtros.pageSize || 10))}
            className="px-3 py-2 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
