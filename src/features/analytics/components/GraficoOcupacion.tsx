import { TrendingUp } from 'lucide-react';
import type { DatosOcupacion, DatoOcupacion } from '../types';

interface GraficoOcupacionProps {
  datos: DatosOcupacion;
  isLoading?: boolean;
}

const getColorPorEstado = (estado: string): string => {
  const colores: Record<string, string> = {
    Alto: '#10B981',
    Medio: '#F59E0B',
    Bajo: '#EF4444',
  };
  return colores[estado] || '#6B7280';
};

export const GraficoOcupacion = ({ datos, isLoading }: GraficoOcupacionProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Cargando datos de ocupación...</p>
        </div>
      </div>
    );
  }

  const datosGrafico = datos.activos.slice(0, 8).map((a: DatoOcupacion) => ({
    nombre: a.activo_nombre.substring(0, 12),
    ocupacion: a.tasa_ocupacion,
    ingresos: Math.round(a.ingresos_generados / 1000), // en miles para visualizar mejor
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Encabezado */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Tasa de Ocupación por Activo</h3>
        <p className="text-sm text-gray-600">
          Promedio: <strong>{datos.ocupacion_promedio.toFixed(1)}%</strong> • Activos activos: <strong>{datos.actividades_activas}</strong>
        </p>
      </div>

      {/* Activos destacados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-xs text-gray-600 flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            Más rentado
          </p>
          <p className="font-bold text-green-700">{datos.activo_mas_rentado.activo_nombre}</p>
          <p className="text-sm text-gray-600 mt-1">
            {datos.activo_mas_rentado.tasa_ocupacion.toFixed(1)}% ocupación • ${datos.activo_mas_rentado.ingresos_generados.toLocaleString('es-CO')}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <p className="text-xs text-gray-600 mb-1">Menos rentado</p>
          <p className="font-bold text-orange-700">{datos.activo_menos_rentado.activo_nombre}</p>
          <p className="text-sm text-gray-600 mt-1">
            {datos.activo_menos_rentado.tasa_ocupacion.toFixed(1)}% ocupación • ${datos.activo_menos_rentado.ingresos_generados.toLocaleString('es-CO')}
          </p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-80 bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-end justify-between gap-2">
        {datosGrafico.slice(0, 12).map((item: any, idx: number) => {
          const maxOcupacion = 100;
          const heightPercent = (item.ocupacion / maxOcupacion) * 90;
          
          return (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg transition-all hover:from-indigo-600 hover:to-indigo-500 cursor-pointer"
                style={{ height: `${Math.max(heightPercent, 3)}%` }}
                title={`${item.nombre}: ${item.ocupacion.toFixed(1)}%`}
              ></div>
              <p className="text-xs text-gray-600 mt-2 text-center max-w-16 truncate">{item.nombre}</p>
            </div>
          );
        })}
      </div>

      {/* Tabla de detalle */}
      <div className="mt-6">
        <h4 className="text-sm font-bold text-gray-800 mb-3">Top 5 Activos por Ocupación</h4>
        <div className="space-y-2">
          {datos.activos.slice(0, 5).map((activo: DatoOcupacion, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{activo.activo_nombre}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                    <div
                      className={`h-full rounded-full transition-all`}
                      style={{
                        width: `${activo.tasa_ocupacion}%`,
                        backgroundColor: getColorPorEstado(activo.estado),
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-gray-700 min-w-12 text-right">
                    {activo.tasa_ocupacion.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
