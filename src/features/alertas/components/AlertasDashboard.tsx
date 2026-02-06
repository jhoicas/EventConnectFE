import { useAlertaCriticas, useAlertaEstadisticas } from '../hooks/useAlerta';
import { AlertCircle, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export function AlertasDashboard() {
  const { data: criticas, isLoading: loadingCriticas } = useAlertaCriticas();
  const { data: stats, isLoading: loadingStats } = useAlertaEstadisticas();

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Alertas Críticas</p>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">
            {loadingStats ? '-' : stats?.criticas_sin_resolver || 0}
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Urgentes Hoy</p>
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {loadingStats ? '-' : stats?.urgentes_hoy || 0}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Total Alertas</p>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {loadingStats ? '-' : stats?.total || 0}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Resueltas (Prom.)</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {loadingStats ? '-' : `${stats?.promedio_tiempo_resolucion.toFixed(1)}h` || '-'}
          </p>
        </div>
      </div>

      {/* Alertas Críticas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          Alertas Críticas Sin Resolver
        </h3>

        {loadingCriticas && <p className="text-slate-600">Cargando...</p>}

        {!loadingCriticas && (!criticas || criticas.length === 0) && (
          <p className="text-center text-slate-600 py-8">No hay alertas críticas</p>
        )}

        {criticas && criticas.length > 0 && (
          <div className="space-y-3">
            {criticas.map((alerta) => (
              <div
                key={alerta.id}
                className="border-l-4 border-red-600 bg-red-50 p-4 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-slate-900">{alerta.activo_nombre}</p>
                    <p className="text-sm text-slate-600">{alerta.tipo}</p>
                  </div>
                  <span className="px-2 py-1 bg-red-200 text-red-700 text-xs font-bold rounded">
                    {alerta.dias_restantes || 0} días
                  </span>
                </div>
                <p className="text-sm text-slate-700">{alerta.descripcion}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Estado de Alertas */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Pendiente', count: stats.por_estado.Pendiente || 0, color: 'bg-yellow-100 text-yellow-700' },
            { label: 'Asignada', count: stats.por_estado.Asignada || 0, color: 'bg-blue-100 text-blue-700' },
            { label: 'En Proceso', count: stats.por_estado.En_Proceso || 0, color: 'bg-purple-100 text-purple-700' },
            { label: 'Resuelta', count: stats.por_estado.Resuelta || 0, color: 'bg-green-100 text-green-700' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-lg shadow-md p-4 text-center">
              <p className="text-slate-600 text-sm mb-2">{item.label}</p>
              <p className={`text-2xl font-bold ${item.color} px-3 py-1 rounded`}>
                {item.count}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
