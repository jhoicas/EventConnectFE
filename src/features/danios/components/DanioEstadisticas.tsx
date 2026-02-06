import { useDanioEstadisticas } from '../hooks/useDanio';
import { AlertCircle, TrendingUp } from 'lucide-react';

export function DanioEstadisticas() {
  const { data: stats, isLoading, error } = useDanioEstadisticas();

  if (isLoading) return <p className="text-center text-slate-600">Cargando...</p>;
  if (error || !stats) return <p className="text-center text-red-600">Error al cargar estadísticas</p>;

  const porEstadoData = Object.entries(stats.por_estado).map(([estado, count]) => ({
    name: estado,
    value: count,
  }));

  const porTipoData = Object.entries(stats.por_tipo).map(([tipo, count]) => ({
    name: tipo,
    value: count,
  }));

  const COLORS = [
    '#FBBF24', // yellow
    '#F97316', // orange
    '#3B82F6', // blue
    '#A855F7', // purple
    '#10B981', // green
    '#EF4444', // red
    '#6B7280', // gray
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Total de Daños</p>
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Monto Estimado Total</p>
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            ${stats.monto_total_estimado.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Costo de Reparaciones</p>
            <TrendingUp className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            ${stats.monto_total_reparacion.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Tasa de Resolución</p>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{(stats.tasa_resolucion * 100).toFixed(1)}%</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Por Estado */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Daños por Estado</h3>
          <div className="space-y-3">
            {porEstadoData.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">{item.name}</span>
                    <span className="font-semibold text-slate-900">{item.value}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.value / stats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Por Tipo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Daños por Tipo</h3>
          <div className="space-y-3">
            {porTipoData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">{item.name}</span>
                    <span className="font-semibold text-slate-900">{item.value}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        backgroundColor: COLORS[idx % COLORS.length],
                        width: `${(item.value / stats.total) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen por Estado */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Resumen por Estado</h3>
        <div className="space-y-2">
          {porEstadoData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-slate-700">{item.name}</span>
              </div>
              <span className="font-semibold text-slate-900">{item.value} daños</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen por Tipo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Resumen por Tipo</h3>
        <div className="space-y-2">
          {porTipoData.map((item, idx) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                ></div>
                <span className="text-slate-700">{item.name}</span>
              </div>
              <span className="font-semibold text-slate-900">{item.value} daños</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
