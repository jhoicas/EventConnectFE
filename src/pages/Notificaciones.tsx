import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { EnviarNotificacion } from '@/features/notificaciones/components/EnviarNotificacion';
import { ListaNotificaciones } from '@/features/notificaciones/components/ListaNotificaciones';
import { GestorPlantillas } from '@/features/notificaciones/components/GestorPlantillas';
import { ConfiguracionNotificaciones } from '@/features/notificaciones/components/ConfiguracionNotificaciones';
import { useObtenerEstadisticas } from '@/features/notificaciones/hooks/useNotificaciones';
import { Mail, MessageSquare, FileText, Settings, TrendingUp, Send, CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { EstadoNotificacion, TipoNotificacion } from '@/features/notificaciones/types';

export default function NotificacionesPage() {
  const [tabActiva, setTabActiva] = useState('enviar');
  const [fechaInicio] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [fechaFin] = useState(new Date().toISOString().split('T')[0]);

  const { data: estadisticas } = useObtenerEstadisticas(fechaInicio, fechaFin);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-100 border border-purple-200 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-purple-900 mb-2">
          📬 Notificaciones
        </h1>
        <p className="text-purple-700">
          Sistema completo de Email, SMS y notificaciones push con plantillas y estadísticas
        </p>
      </div>

      {/* Analytics Cards */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Enviadas</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.totalEnviadas.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">
                    Tasa éxito: {(estadisticas.tasaExito * 100).toFixed(1)}%
                  </p>
                </div>
                <Send className="w-10 h-10 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Exitosas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(estadisticas.totalEnviadas - estadisticas.totalFallidas).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {estadisticas.emailsEnviados} emails, {estadisticas.smsEnviados} SMS
                  </p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Fallidas</p>
                  <p className="text-2xl font-bold text-red-600">{estadisticas.totalFallidas.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((estadisticas.totalFallidas / estadisticas.totalEnviadas) * 100).toFixed(1)}% del total
                  </p>
                </div>
                <XCircle className="w-10 h-10 text-red-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">{estadisticas.totalPendientes.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Tiempo promedio: {estadisticas.tiempoPromedioEnvio.toFixed(0)}ms
                  </p>
                </div>
                <Clock className="w-10 h-10 text-yellow-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={tabActiva} onValueChange={setTabActiva}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="enviar" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Enviar
          </TabsTrigger>
          <TabsTrigger value="historial" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Historial
          </TabsTrigger>
          <TabsTrigger value="plantillas" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Plantillas
          </TabsTrigger>
          <TabsTrigger value="estadisticas" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Estadísticas
          </TabsTrigger>
          <TabsTrigger value="configuracion" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuración
          </TabsTrigger>
        </TabsList>

        {/* Tab: Enviar */}
        <TabsContent value="enviar" className="space-y-4">
          <EnviarNotificacion onEnvioExitoso={() => setTabActiva('historial')} />
        </TabsContent>

        {/* Tab: Historial */}
        <TabsContent value="historial" className="space-y-4">
          <ListaNotificaciones />
        </TabsContent>

        {/* Tab: Plantillas */}
        <TabsContent value="plantillas" className="space-y-4">
          <GestorPlantillas />
        </TabsContent>

        {/* Tab: Estadísticas */}
        <TabsContent value="estadisticas" className="space-y-4">
          {estadisticas && (
            <>
              {/* Distribución por tipo */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Distribución por Tipo</h3>
                  <div className="space-y-3">
                    {(Object.entries(estadisticas.distribucionPorTipo) as [TipoNotificacion, number][]).map(([tipo, cantidad]) => {
                      const total = estadisticas.totalEnviadas;
                      const porcentaje = total > 0 ? (cantidad / total) * 100 : 0;
                      return (
                        <div key={tipo} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2">
                              {tipo === 'email' && <Mail className="w-4 h-4" />}
                              {tipo === 'sms' && <MessageSquare className="w-4 h-4" />}
                              {tipo.toUpperCase()}
                            </span>
                            <span className="font-medium">{cantidad} ({porcentaje.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${porcentaje}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Distribución por estado */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Distribución por Estado</h3>
                  <div className="space-y-3">
                    {(Object.entries(estadisticas.distribucionPorEstado) as [EstadoNotificacion, number][]).map(([estado, cantidad]) => {
                      const total = estadisticas.totalEnviadas;
                      const porcentaje = total > 0 ? (cantidad / total) * 100 : 0;
                      const color = estado === 'enviada' ? 'bg-green-600' : estado === 'fallida' ? 'bg-red-600' : 'bg-yellow-600';
                      return (
                        <div key={estado} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="capitalize">{estado}</span>
                            <span className="font-medium">{cantidad} ({porcentaje.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`${color} h-2 rounded-full`}
                              style={{ width: `${porcentaje}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Métricas adicionales */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Métricas de Engagement</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Tasa de Apertura</p>
                      <p className="text-2xl font-bold text-blue-900">{(estadisticas.tasaApertura * 100).toFixed(1)}%</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Tasa de Clicks</p>
                      <p className="text-2xl font-bold text-green-900">{(estadisticas.tasaClicks * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Tab: Configuración */}
        <TabsContent value="configuracion" className="space-y-4">
          <ConfiguracionNotificaciones />
        </TabsContent>
      </Tabs>
    </div>
  );
}
