import { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useObtenerAnalytics, useListarBultos } from '@/features/optimizarReservas/hooks/useOptimizarReservas';
import { ConfiguradorPrecios } from '@/features/optimizarReservas/components/ConfiguradorPrecios';
import { ValidadorDisponibilidad } from '@/features/optimizarReservas/components/ValidadorDisponibilidad';
import { TablaReservas } from '@/features/optimizarReservas/components/TablaReservas';
import { Loader2, TrendingUp, Package, BarChart3 } from 'lucide-react';

export default function OptimizarReservasPage() {
  const [activoSeleccionado, setActivoSeleccionado] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const { data: analytics, isLoading: loadingAnalytics } = useObtenerAnalytics(
    fechaInicio || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fechaFin || new Date().toISOString().split('T')[0]
  );

  const { data: bultos, isLoading: loadingBultos } = useListarBultos();

  const handleSetearFechas = () => {
    const hoy = new Date();
    const hace30 = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);
    setFechaInicio(hace30.toISOString().split('T')[0]);
    setFechaFin(hoy.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-emerald-900 mb-2">
          🚀 Optimizar Reservas
        </h1>
        <p className="text-emerald-700">
          Sistema inteligente de precios dinámicos, validación de disponibilidad y procesamiento en bulto
        </p>
      </div>

      {/* Tabs Principal */}
      <Tabs defaultValue="configuracion" className="space-y-4">
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'configuracion', label: '⚙️ Configuración', icon: 'Config' },
            { id: 'validacion', label: '🔍 Validación', icon: 'Validar' },
            { id: 'reservas', label: '📊 Reservas', icon: 'Tabla' },
            { id: 'analytics', label: '📈 Analytics', icon: 'Stats' },
            { id: 'bultos', label: '📦 Bultos', icon: 'Bulks' },
          ].map((tab) => (
            <button
              key={tab.id}
              className="px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:border-emerald-200 text-gray-700 hover:text-gray-900 transition-colors"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: Configuración */}
        <div className="space-y-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona un Activo
              </label>
              <input
                type="text"
                value={activoSeleccionado}
                onChange={(e) => setActivoSeleccionado(e.target.value)}
                placeholder="ID del activo"
                className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <Button
              disabled={!activoSeleccionado}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Cargar
            </Button>
          </div>
          {activoSeleccionado && <ConfiguradorPrecios activoId={activoSeleccionado} />}
        </div>

        {/* TAB: Validación */}
        <div className="space-y-4">
          {activoSeleccionado && <ValidadorDisponibilidad activoId={activoSeleccionado} />}
          {!activoSeleccionado && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6 text-center">
                <p className="text-blue-700">Selecciona un activo en la pestaña Configuración</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* TAB: Reservas */}
        <TablaReservas />

        {/* TAB: Analytics */}
        <div className="space-y-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango de Fechas
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="px-2 py-2 text-gray-600">→</span>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <Button
              onClick={handleSetearFechas}
              variant="outline"
              className="border-blue-200 hover:bg-blue-50"
            >
              Últimos 30 días
            </Button>
          </div>

          {loadingAnalytics ? (
            <Card className="border-blue-200">
              <CardContent className="pt-6 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              </CardContent>
            </Card>
          ) : analytics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Tasa de Optimización
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {analytics.tasaOptimizacion.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {analytics.reservasOptimizadas} de {analytics.totalReservas} reservas optimizadas
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Ahorro Promedio Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    ${analytics.ahorroPromedioCliente.toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Ingresos adicionales: ${analytics.ingresosAdicionalesGenerados.toFixed(2)}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg">Ocupación Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {analytics.ocupacionPromedio.toFixed(1)}%
                  </div>
                  <div className="w-full h-2 bg-purple-200 rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full bg-purple-600"
                      style={{ width: `${analytics.ocupacionPromedio}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-lg">Rentabilidad Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {analytics.rentabilidadPromedio.toFixed(2)}x
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Ratio ingresos/costo operativo
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>

        {/* TAB: Bultos */}
        <div className="space-y-4">
          {loadingBultos ? (
            <Card className="border-purple-200">
              <CardContent className="pt-6 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
              </CardContent>
            </Card>
          ) : !bultos || bultos.length === 0 ? (
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="pt-6 text-center">
                <Package className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                <p className="text-purple-700 font-medium">No hay bultos creados aún</p>
                <p className="text-sm text-purple-600 mt-1">
                  Crea un bulto desde la tabla de reservas
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bultos.map((bulto) => (
                <Card key={bulto.id} className="border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-lg">{bulto.nombre}</CardTitle>
                    <CardDescription>{bulto.descripcion}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Reservas:</span>
                      <span className="font-semibold">{bulto.reservas.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Estado:</span>
                      <span className="font-semibold text-purple-600">{bulto.estado}</span>
                    </div>
                    {bulto.resultados && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Exitosas:</span>
                          <span className="font-semibold text-green-600">
                            {bulto.resultados.reservasExitosas}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Ahorro Total:</span>
                          <span className="font-semibold text-emerald-600">
                            ${bulto.resultados.ahorroTotal.toFixed(2)}
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
