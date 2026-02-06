import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useListarTransacciones, useObtenerAnalyticas } from '@/features/pagos/hooks/usePagos';
import { ProcesoPago } from '@/features/pagos/components/ProcesoPago';
import { DetalleFactura } from '@/features/pagos/components/DetalleFactura';
import { HistorialPagos } from '@/features/pagos/components/HistorialPagos';
import { ConfiguradorGateways } from '@/features/pagos/components/ConfiguradorGateways';
import { Loader2, CreditCard, FileText } from 'lucide-react';

export default function PagosPage() {
  const [transaccionSeleccionada, setTransaccionSeleccionada] = useState('');
  const [facturaSeleccionada, setFacturaSeleccionada] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const { data: transacciones, isLoading: loadingTransacciones } = useListarTransacciones();
  const { data: analytics, isLoading: loadingAnalytics } = useObtenerAnalyticas(
    fechaInicio || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fechaFin || new Date().toISOString().split('T')[0]
  );

  const handleSetearFechas = () => {
    const hoy = new Date();
    const hace30 = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);
    setFechaInicio(hace30.toISOString().split('T')[0]);
    setFechaFin(hoy.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          💳 Pagos e Invoicing
        </h1>
        <p className="text-blue-700">
          Sistema completo de procesamiento de pagos, generación de facturas y gestión de reembolsos
        </p>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'transacciones', label: '💰 Transacciones', icon: 'Trans' },
            { id: 'facturas', label: '📄 Facturas', icon: 'Fact' },
            { id: 'historial', label: '📜 Historial', icon: 'Hist' },
            { id: 'gateways', label: '⚙️ Gateways', icon: 'Gate' },
            { id: 'analytics', label: '📊 Analytics', icon: 'Anal' },
          ].map((tab) => (
            <button
              key={tab.id}
              className="px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-200 text-gray-700 hover:text-gray-900 transition-colors"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: Transacciones */}
        <div className="space-y-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona una Transacción
              </label>
              <select
                value={transaccionSeleccionada}
                onChange={(e) => setTransaccionSeleccionada(e.target.value)}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Seleccionar --</option>
                {transacciones?.map((trans) => (
                  <option key={trans.id} value={trans.id}>
                    {trans.id.substring(0, 8)} - ${trans.monto.toFixed(2)} ({trans.estado})
                  </option>
                ))}
              </select>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              {loadingTransacciones ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
            </Button>
          </div>

          {transaccionSeleccionada && (
            <ProcesoPago transaccionId={transaccionSeleccionada} />
          )}

          {!transaccionSeleccionada && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6 text-center">
                <p className="text-blue-700">Selecciona una transacción para procesar</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* TAB: Facturas */}
        <div className="space-y-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona una Factura
              </label>
              <input
                type="text"
                placeholder="ID o número de factura"
                value={facturaSeleccionada}
                onChange={(e) => setFacturaSeleccionada(e.target.value)}
                className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <FileText className="h-4 w-4" />
            </Button>
          </div>

          {facturaSeleccionada && (
            <DetalleFactura facturaId={facturaSeleccionada} />
          )}

          {!facturaSeleccionada && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6 text-center">
                <p className="text-green-700">Ingresa un ID de factura para ver detalles</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* TAB: Historial */}
        <HistorialPagos />

        {/* TAB: Gateways */}
        <ConfiguradorGateways />

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
                  className="flex-1 px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="px-2 py-2 text-gray-600">→</span>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="flex-1 px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <Button
              onClick={handleSetearFechas}
              variant="outline"
              className="border-purple-200 hover:bg-purple-50"
            >
              Últimos 30 días
            </Button>
          </div>

          {loadingAnalytics ? (
            <Card className="border-purple-200">
              <CardContent className="pt-6 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
              </CardContent>
            </Card>
          ) : analytics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Total Transacciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">{analytics.totalTransacciones}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {analytics.transaccionesExitosas} exitosas (
                    {analytics.tasaExito.toFixed(1)}%)
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg">Monto Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">
                    ${analytics.montoTotal.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Neto: ${analytics.montoNeto.toFixed(2)}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-lg">Comisiones</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-600">
                    ${analytics.montoComisiones.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Reembolsos: ${analytics.reembolsosTotales.toFixed(2)}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-lg">Transacciones Fallidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-600">{analytics.transaccionesFallidas}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Tasa: {(
                      (analytics.transaccionesFallidas / analytics.totalTransacciones) *
                      100
                    ).toFixed(1)}%
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg">Ticket Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-600">
                    ${analytics.ticketPromedio.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Por transacción</p>
                </CardContent>
              </Card>

              <Card className="border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-lg">Deudores Activos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-yellow-600">{analytics.deudoresActivos}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Facturas: {analytics.facturasPendientes}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
