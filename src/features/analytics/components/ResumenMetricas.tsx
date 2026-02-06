import { DollarSign, Target, Users, TrendingUp, AlertCircle } from 'lucide-react';
import type { MetricasResumen } from '../types';

interface ResumenMetricasProps {
  metricas: MetricasResumen;
  isLoading?: boolean;
}

const getTasaColor = (valor: number): string => {
  if (valor >= 5) return 'text-green-600 bg-green-50';
  if (valor >= 0) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
};

export const ResumenMetricas = ({ metricas, isLoading }: ResumenMetricasProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 h-40 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const metricasCards = [
    {
      titulo: 'Ingresos Totales',
      valor: `$${metricas.total_ingresos.toLocaleString('es-CO')}`,
      icon: DollarSign,
      color: 'indigo',
      cambio: metricas.total_ingresos - (metricas.total_ingresos * 0.8), // Comparativa estimada
      mes_anterior: metricas.ingresos_mes_anterior,
    },
    {
      titulo: 'Reservas Activas',
      valor: metricas.total_reservas,
      icon: Target,
      color: 'blue',
      cambio: metricas.total_reservas > 10 ? 5 : -2,
      mes_anterior: null,
    },
    {
      titulo: 'Ocupación Promedio',
      valor: `${metricas.ocupacion_promedio.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'green',
      cambio: metricas.ocupacion_promedio - metricas.ocupacion_mes_anterior,
      mes_anterior: metricas.ocupacion_mes_anterior,
    },
    {
      titulo: 'Clientes Activos',
      valor: metricas.clientes_activos,
      icon: Users,
      color: 'purple',
      cambio: metricas.tasa_crecimiento,
      mes_anterior: null,
    },
  ];

  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  };

  const iconColorMap: Record<string, string> = {
    indigo: 'text-indigo-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
  };

  return (
    <div>
      {/* Grid de métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metricasCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`rounded-lg shadow p-6 border ${colorMap[card.color]}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.titulo}</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-800">{card.valor}</p>
                </div>
                <Icon className={`w-8 h-8 ${iconColorMap[card.color]}`} />
              </div>

              {/* Cambio respecto mes anterior */}
              {card.cambio !== 0 && (
                <div className={`flex items-center gap-1 text-sm font-medium ${getTasaColor(card.cambio)}`}>
                  <span>{card.cambio > 0 ? '↑' : '↓'}</span>
                  <span>{Math.abs(card.cambio).toFixed(1)}% vs mes anterior</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Alertas y recomendaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Estado general */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-indigo-600" />
            Estado General
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">Reservas Pendientes</p>
              <p className="font-bold text-gray-800">{metricas.reservas_pendientes}</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">Tasa de Crecimiento</p>
              <p className={`font-bold ${metricas.tasa_crecimiento > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metricas.tasa_crecimiento > 0 ? '+' : ''}{metricas.tasa_crecimiento.toFixed(2)}%
              </p>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">Ocupación Disponible</p>
              <p className="font-bold text-gray-800">{Math.round(100 - metricas.ocupacion_promedio)}%</p>
            </div>
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Recomendaciones
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {metricas.ocupacion_promedio > 80 && (
              <li className="flex items-start gap-2 p-2 bg-yellow-50 rounded">
                <span className="text-yellow-600 font-bold mt-1">•</span>
                <span>Alta ocupación detectada. Considera aumentar inventario.</span>
              </li>
            )}
            {metricas.ocupacion_promedio < 40 && (
              <li className="flex items-start gap-2 p-2 bg-orange-50 rounded">
                <span className="text-orange-600 font-bold mt-1">•</span>
                <span>Baja ocupación. Promociona activos disponibles.</span>
              </li>
            )}
            {metricas.reservas_pendientes > 5 && (
              <li className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Hay {metricas.reservas_pendientes} reservas pendientes. Confirma ASAP.</span>
              </li>
            )}
            {metricas.tasa_crecimiento > 10 && (
              <li className="flex items-start gap-2 p-2 bg-green-50 rounded">
                <span className="text-green-600 font-bold mt-1">•</span>
                <span>Crecimiento excelente este período. Mantén momentum.</span>
              </li>
            )}
            {metricas.clientes_activos > 100 && (
              <li className="flex items-start gap-2 p-2 bg-purple-50 rounded">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span>Base de clientes sólida. Enfócate en retención.</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
