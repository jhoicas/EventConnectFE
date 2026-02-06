import { TrendingUp, TrendingDown } from 'lucide-react';
import type { DatosVentas, DatoVenta } from '../types';

interface GraficoVentasProps {
  datos: DatosVentas;
  isLoading?: boolean;
}

export const GraficoVentas = ({ datos, isLoading }: GraficoVentasProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Cargando datos de ventas...</p>
        </div>
      </div>
    );
  }

  const datosGrafico = datos.datos.map((d: DatoVenta) => ({
    nombre: d.fecha_label,
    ingresos: d.ingresos,
    reservas: d.reservas_completadas,
  }));

  const cambioVentas = (datos.total_ingresos / (datos.total_ingresos - 10000)) * 100 || 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Encabezado */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800">Ingresos y Reservas</h3>
          <div className="flex items-center gap-2">
            {cambioVentas > 0 ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-bold ${cambioVentas > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {cambioVentas > 0 ? '+' : ''}{cambioVentas.toFixed(1)}%
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Total: ${datos.total_ingresos.toLocaleString('es-CO')} • {datos.total_reservas} reservas
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
          <p className="text-xs text-gray-600">Total Ingresos</p>
          <p className="text-sm font-bold text-indigo-600">
            ${datos.total_ingresos.toLocaleString('es-CO')}
          </p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <p className="text-xs text-gray-600">Promedio Diario</p>
          <p className="text-sm font-bold text-green-600">
            ${datos.ingresos_promedio_diario.toLocaleString('es-CO')}
          </p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600">Reservas Totales</p>
          <p className="text-sm font-bold text-blue-600">{datos.total_reservas}</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
          <p className="text-xs text-gray-600">Promedio por Reserva</p>
          <p className="text-sm font-bold text-purple-600">
            ${datos.reserva_promedio.toLocaleString('es-CO')}
          </p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-80 bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-end justify-between gap-2">
        {datosGrafico.map((item: any, idx: number) => {
          const maxIngresos = Math.max(...datosGrafico.map((d: any) => d.ingresos));
          const heightPercent = (item.ingresos / maxIngresos) * 100;
          
          return (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-indigo-500 rounded-t-lg transition-all hover:bg-indigo-600 cursor-pointer"
                style={{ height: `${Math.max(heightPercent, 5)}%` }}
                title={`${item.nombre}: $${item.ingresos.toLocaleString('es-CO')}`}
              ></div>
              <p className="text-xs text-gray-600 mt-2 text-center max-w-16 truncate">{item.nombre}</p>
            </div>
          );
        })}
      </div>

      {/* Información adicional */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600">
        <p>Período: {datos.fecha_inicio} a {datos.fecha_fin}</p>
      </div>
    </div>
  );
};
