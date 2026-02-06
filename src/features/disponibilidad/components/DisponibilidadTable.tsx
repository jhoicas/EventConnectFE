import { useState } from 'react';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useDisponibilidadRango } from '../hooks/useDisponibilidad';
import type { DisponibilidadDia, EstadoDisponibilidad } from '../types';

interface DisponibilidadTableProps {
  activoId: number;
  fechaInicio: string;
  fechaFin: string;
}

const getEstadoBadgeColor = (estado: EstadoDisponibilidad): string => {
  const colors: Record<EstadoDisponibilidad, string> = {
    Disponible: 'bg-green-100 text-green-800',
    Reservado: 'bg-blue-100 text-blue-800',
    Mantenimiento: 'bg-yellow-100 text-yellow-800',
    No_Disponible: 'bg-red-100 text-red-800',
  };
  return colors[estado];
};

const formatFecha = (fecha: string): string => {
  const date = new Date(fecha + 'T00:00:00');
  return date.toLocaleDateString('es-CO', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const DisponibilidadTable = ({
  activoId,
  fechaInicio,
  fechaFin,
}: DisponibilidadTableProps) => {
  const { data: rango, isLoading, error } = useDisponibilidadRango(
    activoId,
    fechaInicio,
    fechaFin
  );

  const [sortBy, setSortBy] = useState<'fecha' | 'disponible'>('fecha');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (!rango && !isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <p>No se encontraron datos de disponibilidad</p>
        </div>
      </div>
    );
  }

  const sortedDias = [...(rango?.dias || [])].sort((a, b) => {
    if (sortBy === 'fecha') {
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    } else {
      return b.cantidad_disponible - a.cantidad_disponible;
    }
  });

  const estadisticas = {
    total_dias: rango?.dias.length || 0,
    dias_disponibles: rango?.dias.filter(d => d.estado === 'Disponible').length || 0,
    dias_reservados: rango?.dias.filter(d => d.estado === 'Reservado').length || 0,
    dias_mantenimiento: rango?.dias.filter(d => d.estado === 'Mantenimiento').length || 0,
    ocupacion_promedio: rango?.dias
      ? Math.round(
          (rango.dias.reduce((sum, d) => sum + (d.cantidad_total - d.cantidad_disponible), 0) /
            (rango.dias.length * (rango.dias[0]?.cantidad_total || 1))) *
            100
        )
      : 0,
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">Período</p>
          <p className="text-lg font-bold text-blue-600">{estadisticas.total_dias} días</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600">Disponibles</p>
          <p className="text-lg font-bold text-green-600">{estadisticas.dias_disponibles}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-gray-600">Reservados</p>
          <p className="text-lg font-bold text-yellow-600">{estadisticas.dias_reservados}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <p className="text-sm text-gray-600">Mantenimiento</p>
          <p className="text-lg font-bold text-orange-600">{estadisticas.dias_mantenimiento}</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ocupación</p>
              <p className="text-lg font-bold text-indigo-600">{estadisticas.ocupacion_promedio}%</p>
            </div>
            {estadisticas.ocupacion_promedio > 70 ? (
              <TrendingUp className="w-5 h-5 text-red-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-green-600" />
            )}
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Detalle del Período</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'fecha' | 'disponible')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="fecha">Ordenar por fecha</option>
          <option value="disponible">Ordenar por disponibilidad</option>
        </select>
      </div>

      {/* Tabla */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Cargando datos...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Disponibles</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Total</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Reservas</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Estado</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedDias.map((dia: DisponibilidadDia) => (
                <tbody key={dia.fecha}>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{formatFecha(dia.fecha)}</p>
                        <p className="text-xs text-gray-500">{dia.fecha}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        {dia.cantidad_disponible}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700 font-medium">
                      {dia.cantidad_total}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700">
                      {dia.reservas > 0 ? (
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {dia.reservas}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEstadoBadgeColor(dia.estado)}`}>
                        {dia.estado === 'No_Disponible' ? 'No Disponible' : dia.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setExpandedRow(expandedRow === dia.fecha ? null : dia.fecha)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                      >
                        {expandedRow === dia.fecha ? 'Ocultar' : 'Ver más'}
                      </button>
                    </td>
                  </tr>
                  {expandedRow === dia.fecha && (
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <td colSpan={6} className="py-4 px-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Porcentaje Disponible</p>
                            <p className="text-lg font-bold text-gray-800">
                              {((dia.cantidad_disponible / dia.cantidad_total) * 100).toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Mantenimiento</p>
                            <p className="text-lg font-bold text-gray-800">
                              {dia.mantenimiento ? 'Sí' : 'No'}
                            </p>
                          </div>
                          {dia.precio_especial && (
                            <div>
                              <p className="text-sm text-gray-600">Precio Especial</p>
                              <p className="text-lg font-bold text-indigo-600">
                                ${dia.precio_especial.toLocaleString('es-CO')}
                              </p>
                            </div>
                          )}
                          {dia.observaciones && (
                            <div className="col-span-2">
                              <p className="text-sm text-gray-600">Observaciones</p>
                              <p className="text-sm text-gray-800">{dia.observaciones}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">Error al cargar la disponibilidad</p>
        </div>
      )}
    </div>
  );
};
