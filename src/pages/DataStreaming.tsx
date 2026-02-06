import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Wifi,
  WifiOff,
  Radio,
  Activity,
  Zap,
  Clock,
  Server,
  RefreshCw,
} from 'lucide-react';
import {
  useListarConexiones,
  useObtenerEventosEnTiempoReal,
  useObtenerKPIsEnVivo,
  useObtenerOrdenesEnVivo,
  useObtenerNivelesEnVivo,
  useObtenerTransaccionesEnVivo,
  useObtenerEstadisticas,
  useObtenerLatencia,
  useObtenerHealthCheck,
  useListarDashboards,
} from '@/features/datastreaming/hooks/useDataStreaming';

export const DataStreamingPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Queries
  const { data: conexiones } = useListarConexiones();
  const { data: eventos } = useObtenerEventosEnTiempoReal(['kpi_update', 'alert_triggered']);
  const { data: kpisVivo } = useObtenerKPIsEnVivo([]);
  const { data: ordenesVivo } = useObtenerOrdenesEnVivo();
  const { data: inventarioVivo } = useObtenerNivelesEnVivo();
  const { data: transaccionesVivo } = useObtenerTransaccionesEnVivo();
  const { data: estadisticas } = useObtenerEstadisticas();
  const { data: latencia } = useObtenerLatencia();
  const { data: health } = useObtenerHealthCheck();
  const { data: dashboards } = useListarDashboards();

  // Data extraction
  const conexionesData = (conexiones as any)?.data?.conexiones || [];
  const eventosData = (eventos as any)?.data?.eventos || [];
  const kpisData = (kpisVivo as any)?.data?.kpis || [];
  const ordenesData = (ordenesVivo as any)?.data?.ordenes || [];
  const inventarioData = (inventarioVivo as any)?.data?.niveles || [];
  const transaccionesData = (transaccionesVivo as any)?.data?.transacciones || [];
  const estadisticasData = (estadisticas as any)?.data;
  const latenciaData = (latencia as any)?.data;
  const healthData = (health as any)?.data;
  const dashboardsData = (dashboards as any)?.data?.dashboards || [];

  // Calculate stats
  const conexionesActivas = conexionesData.filter((c: any) => c.estado === 'connected').length;
  const tasaEventos = estadisticasData?.tasaPromedio || 0;
  const latenciaMs = latenciaData?.promedio || 0;
  const healthStatus = healthData?.estado || 'unknown';

  const getConnectionColor = (estado: string) => {
    switch (estado) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'connecting':
        return 'bg-yellow-100 text-yellow-800';
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      case 'reconnecting':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConnectionIcon = (estado: string) => {
    return estado === 'connected' ? (
      <Wifi className="w-4 h-4" />
    ) : (
      <WifiOff className="w-4 h-4" />
    );
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'unhealthy':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Real-Time Data Streaming</h1>
              <p className="text-blue-100 mt-1">Live dashboards, event streaming, and real-time KPI updates</p>
            </div>
          </div>
          <Button className="bg-white text-blue-600 hover:bg-blue-50">
            <RefreshCw className="w-4 h-4 mr-2" />
            Auto-Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Connections</p>
                <p className="text-2xl font-bold text-green-600">{conexionesActivas}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg opacity-20">
                <Wifi className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Events/Second</p>
                <p className="text-2xl font-bold text-blue-600">{tasaEventos.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg opacity-20">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Latency (ms)</p>
                <p className="text-2xl font-bold text-purple-600">{latenciaMs.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg opacity-20">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Live Events</p>
                <p className="text-2xl font-bold text-orange-600">{eventosData.length}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg opacity-20">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">System Health</p>
                <p className={`text-2xl font-bold ${getHealthColor(healthStatus)}`}>
                  {healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)}
                </p>
              </div>
              <div className="p-3 bg-cyan-100 rounded-lg opacity-20">
                <Server className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="streams">Streams</TabsTrigger>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Connections</span>
                    <span className="font-semibold">{conexionesData.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Events</span>
                    <span className="font-semibold">{eventosData.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Latency</span>
                    <span className="font-semibold">{latenciaMs.toFixed(2)}ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Events/sec</span>
                    <span className="font-semibold">{tasaEventos.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Data Streams</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">KPI Updates</span>
                    <span className="font-semibold text-blue-600">{kpisData.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Orders Live</span>
                    <span className="font-semibold text-green-600">{ordenesData.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Inventory Changes</span>
                    <span className="font-semibold text-orange-600">{inventarioData.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Transactions</span>
                    <span className="font-semibold text-purple-600">{transaccionesData.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CONNECTIONS TAB */}
        <TabsContent value="connections" className="space-y-4">
          <div className="flex space-x-2 mb-4">
            <Input placeholder="Filter connections..." className="flex-1" />
            <Button variant="outline">Add Connection</Button>
          </div>

          {conexionesData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No active connections</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {conexionesData.map((c: any) => (
                <Card key={c.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {getConnectionIcon(c.estado)}
                          <h3 className="font-semibold text-gray-900">{c.url}</h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Connected: {new Date(c.ultimaConexion).toLocaleTimeString()}
                        </p>
                        <div className="flex space-x-2 mt-2">
                          {c.eventos?.map((e: string) => (
                            <Badge key={e} variant="outline" className="text-xs">
                              {e}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge className={getConnectionColor(c.estado)}>
                        {c.estado}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* EVENTS TAB */}
        <TabsContent value="events" className="space-y-4">
          <div className="flex space-x-2 mb-4">
            <Input placeholder="Filter events..." className="flex-1" />
            <Button variant="outline">Clear Old Events</Button>
          </div>

          {eventosData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No recent events</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {eventosData.slice(0, 20).map((e: any) => (
                <Card key={e.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{e.tipo}</p>
                        <p className="text-xs text-gray-500">{new Date(e.timestamp).toLocaleTimeString()}</p>
                      </div>
                      <Badge
                        className={
                          e.prioridad === 'critical'
                            ? 'bg-red-100 text-red-800'
                            : e.prioridad === 'high'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-blue-100 text-blue-800'
                        }
                      >
                        {e.prioridad}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* STREAMS TAB */}
        <TabsContent value="streams" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">KPI Stream</h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">{kpisData.length}</p>
                <p className="text-xs text-gray-500">Live KPI updates</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Order Stream</h3>
                <p className="text-2xl font-bold text-green-600 mb-2">{ordenesData.length}</p>
                <p className="text-xs text-gray-500">Live order status updates</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Inventory Stream</h3>
                <p className="text-2xl font-bold text-orange-600 mb-2">{inventarioData.length}</p>
                <p className="text-xs text-gray-500">Inventory changes</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Transaction Stream</h3>
                <p className="text-2xl font-bold text-purple-600 mb-2">{transaccionesData.length}</p>
                <p className="text-xs text-gray-500">Real-time transactions</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* DASHBOARDS TAB */}
        <TabsContent value="dashboards" className="space-y-4">
          <Button className="bg-blue-600 hover:bg-blue-700">Create Live Dashboard</Button>

          {dashboardsData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No dashboards created</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboardsData.map((d: any) => (
                <Card key={d.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900">{d.nombre}</h3>
                    <p className="text-xs text-gray-500 mt-1">{d.tiposEvento?.join(', ')}</p>
                    <div className="mt-3 flex justify-between">
                      <Badge variant="outline">{d.metricas?.length || 0} Metrics</Badge>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* PERFORMANCE TAB */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Avg Latency</p>
                  <p className="text-lg font-bold text-gray-900">{latenciaMs.toFixed(2)}ms</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Peak Rate</p>
                  <p className="text-lg font-bold text-gray-900">
                    {estadisticasData?.tasaPico?.toFixed(1) || '0'} ev/s
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Error Rate</p>
                  <p className="text-lg font-bold text-gray-900">
                    {estadisticasData?.tasaError?.toFixed(1) || '0'}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Events</p>
                  <p className="text-lg font-bold text-gray-900">
                    {estadisticasData?.eventosTotales?.toLocaleString() || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Last Hour</p>
                  <p className="text-lg font-bold text-gray-900">
                    {estadisticasData?.eventosUltimaHora?.toLocaleString() || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Last Minute</p>
                  <p className="text-lg font-bold text-gray-900">
                    {estadisticasData?.eventosUltimoMinuto?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
