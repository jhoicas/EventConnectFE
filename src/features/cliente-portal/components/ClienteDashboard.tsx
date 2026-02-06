import { useEstadisticasCliente, useMisReservas } from '../hooks/useClientePortal';
import { TrendingUp, ShoppingCart, DollarSign, Calendar, Star } from 'lucide-react';

export function ClienteDashboard() {
  const { data: stats, isLoading: loadingStats } = useEstadisticasCliente();
  const { data: reservas, isLoading: loadingReservas } = useMisReservas({
    pageSize: 5,
  });

  const reservasActivas = reservas?.items.filter((r) => r.estado === 'Confirmada' || r.estado === 'En_Entrega') || [];
  const proximasReservas = reservas?.items.filter((r) => r.estado === 'Pendiente') || [];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Mi Portal</h1>
        <p className="text-blue-100">Gestiona tus reservas y cotizaciones en un solo lugar</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Reservas Totales</p>
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {loadingStats ? '-' : stats?.total_reservas || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Activas Ahora</p>
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {loadingStats ? '-' : stats?.reservas_activas || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Gasto Total</p>
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            ${loadingStats ? '-' : (stats?.total_gastado || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-600 text-sm font-medium">Puntos Lealtad</p>
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {loadingStats ? '-' : stats?.puntos_lealtad || 0}
          </p>
        </div>
      </div>

      {/* Estadísticas Adicionales */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-slate-600 mb-1">Gasto Promedio</p>
            <p className="text-2xl font-bold text-slate-900">
              ${stats.promedio_gasto?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-slate-600 mb-1">Activo Favorito</p>
            <p className="text-lg font-bold text-slate-900">{stats.activo_mas_usado || '-'}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-slate-600 mb-1">Satisfacción</p>
            <p className="text-2xl font-bold text-slate-900">
              {stats.tasa_satisfaccion || 0}%
            </p>
          </div>
        </div>
      )}

      {/* Reservas Activas */}
      {!loadingReservas && reservasActivas.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Reservas Activas
          </h3>
          <div className="space-y-3">
            {reservasActivas.slice(0, 3).map((reserva) => (
              <div key={reserva.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-semibold text-slate-900">Reserva #{reserva.id}</p>
                  <p className="text-sm text-slate-600">
                    {new Date(reserva.fecha_inicio).toLocaleDateString()} - {new Date(reserva.fecha_fin).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    {reserva.estado}
                  </span>
                  <p className="text-sm text-slate-600 mt-1">${reserva.total.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Próximas Reservas */}
      {!loadingReservas && proximasReservas.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Próximas a Confirmar
          </h3>
          <div className="space-y-3">
            {proximasReservas.slice(0, 3).map((reserva) => (
              <div key={reserva.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <p className="font-semibold text-slate-900">Reserva #{reserva.id}</p>
                  <p className="text-sm text-slate-600">{reserva.direccion_entrega}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                    {reserva.estado}
                  </span>
                  <p className="text-sm text-slate-600 mt-1">${reserva.total.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loadingReservas && reservasActivas.length === 0 && proximasReservas.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">Aún no tienes reservas</p>
          <a href="/cliente/crear-reserva" className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
            Crear tu primera reserva
          </a>
        </div>
      )}
    </div>
  );
}
