import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Zap,
  Webhook,
  Lock,
  BarChart3,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import {
  useListarIntegraciones,
  useObtenerEstadisticas,
  useListarWebhooks,
  useListarCredenciales,
  useListarLogsSincronizacion,
  useSincronizar,
} from '@/features/integraciones/hooks/useIntegraciones';

export const IntegracionesPage = () => {
  const [busqueda, setBusqueda] = useState('');
  const [integracionSeleccionada, setIntegracionSeleccionada] = useState<string | null>(null);

  const { data: integraciones } = useListarIntegraciones({ busqueda, limite: 50 });
  const { data: estadisticas } = useObtenerEstadisticas();
  const { data: webhooks } = useListarWebhooks(integracionSeleccionada || '');
  const { data: credenciales } = useListarCredenciales(integracionSeleccionada || '');
  const { data: logs } = useListarLogsSincronizacion(integracionSeleccionada || '', { limite: 10 });

  const sincronizarMutation = useSincronizar();

  const integracionesData = (integraciones as any)?.data?.integraciones || [];
  const estadisticasData = (estadisticas as any)?.data;
  const webhooksData = (webhooks as any)?.data?.webhooks || [];
  const credencialesData = (credenciales as any)?.data?.credenciales || [];
  const logsData = (logs as any)?.data?.logs || [];

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      conectado: 'bg-green-100 text-green-800',
      desconectado: 'bg-gray-100 text-gray-800',
      error: 'bg-red-100 text-red-800',
      validando: 'bg-yellow-100 text-yellow-800',
      inactivo: 'bg-slate-100 text-slate-800',
      pendiente_configuracion: 'bg-blue-100 text-blue-800',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'conectado':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'validando':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-transparent to-transparent">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Integraciones Externas</h1>
          </div>
          <p className="text-blue-100">APIs, webhooks y conexiones con servicios externos</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Integraciones */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Integraciones</p>
                  <p className="text-2xl font-bold text-blue-600">{estadisticasData?.totalIntegraciones || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">todas las conexiones</p>
                </div>
                <Zap className="w-10 h-10 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Integraciones Activas */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Activas</p>
                  <p className="text-2xl font-bold text-green-600">{estadisticasData?.integracionesActivas || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">funcionando ahora</p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Webhooks Activos */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Webhooks Activos</p>
                  <p className="text-2xl font-bold text-purple-600">{estadisticasData?.webhooksActivos || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">escuchando eventos</p>
                </div>
                <Webhook className="w-10 h-10 text-purple-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Tasa Éxito */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tasa de Éxito</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {((estadisticasData?.tasaExito || 0) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">sincronizaciones</p>
                </div>
                <BarChart3 className="w-10 h-10 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Con Errores */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Con Errores</p>
                  <p className="text-2xl font-bold text-red-600">{estadisticasData?.integracionesConError || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">requieren atención</p>
                </div>
                <AlertCircle className="w-10 h-10 text-red-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="integraciones" className="bg-white rounded-lg border border-gray-200">
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-gray-200">
            <TabsTrigger value="integraciones" className="flex gap-2">
              <Zap className="w-4 h-4" />
              Integraciones
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex gap-2">
              <Webhook className="w-4 h-4" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="credenciales" className="flex gap-2">
              <Lock className="w-4 h-4" />
              Credenciales
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex gap-2">
              <BarChart3 className="w-4 h-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          {/* Tab: Integraciones */}
          <TabsContent value="integraciones" className="p-6 space-y-4">
            <div className="flex gap-3 mb-4">
              <Input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar integraciones..."
                className="flex-1"
              />
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nueva
              </Button>
            </div>

            {integracionesData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No hay integraciones configuradas
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {integracionesData.map((integ: any) => (
                  <Card
                    key={integ.id}
                    className="cursor-pointer hover:border-blue-300 transition-colors"
                    onClick={() => setIntegracionSeleccionada(integ.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{integ.nombre}</h4>
                            <Badge className={getEstadoColor(integ.estado)}>{integ.estado}</Badge>
                            <Badge variant="outline" className="text-xs">
                              {integ.tipo}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{integ.descripcion}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>📦 {integ.proveedor}</span>
                            <span>🔄 {integ.frecuenciaSincronizacion || 'manual'}</span>
                            {integ.ultimaSincronizacion && (
                              <span>⏱️ {new Date(integ.ultimaSincronizacion).toLocaleDateString('es-ES')}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-center">
                            {getEstadoIcon(integ.estado)}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              sincronizarMutation.mutate(integ.id);
                            }}
                          >
                            <RefreshCw className="w-3 h-3" />
                            Sincronizar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Webhooks */}
          <TabsContent value="webhooks" className="p-6 space-y-4">
            {!integracionSeleccionada ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  Selecciona una integración para ver sus webhooks
                </CardContent>
              </Card>
            ) : webhooksData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No hay webhooks configurados
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {webhooksData.map((webhook: any) => (
                  <Card key={webhook.id} className="border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={webhook.activa ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {webhook.activa ? 'Activo' : 'Inactivo'}
                            </Badge>
                            <Badge variant="outline">{webhook.tipo}</Badge>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">{webhook.url}</p>
                          <p className="text-xs text-gray-600">
                            Eventos: {webhook.eventos?.join(', ') || 'ninguno'}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost">
                          Detalles
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Credenciales */}
          <TabsContent value="credenciales" className="p-6 space-y-4">
            {!integracionSeleccionada ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  Selecciona una integración para ver sus credenciales
                </CardContent>
              </Card>
            ) : credencialesData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No hay credenciales configuradas
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {credencialesData.map((cred: any) => (
                  <Card key={cred.id} className="border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{cred.nombre}</h4>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <Badge variant="outline">{cred.tipo}</Badge>
                            <span>
                              Estado:{' '}
                              <span className={cred.habilitada ? 'text-green-600' : 'text-red-600'}>
                                {cred.habilitada ? 'Habilitada' : 'Deshabilitada'}
                              </span>
                            </span>
                            {cred.ultimaValidacion && (
                              <span>Validada: {new Date(cred.ultimaValidacion).toLocaleDateString('es-ES')}</span>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Logs */}
          <TabsContent value="logs" className="p-6 space-y-4">
            {!integracionSeleccionada ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  Selecciona una integración para ver sus logs
                </CardContent>
              </Card>
            ) : logsData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No hay logs de sincronización
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {logsData.map((log: any) => (
                  <Card
                    key={log.id}
                    className={
                      log.estado === 'exitosa'
                        ? 'border-green-200 bg-green-50'
                        : log.estado === 'fallida'
                          ? 'border-red-200 bg-red-50'
                          : 'border-yellow-200 bg-yellow-50'
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              className={
                                log.estado === 'exitosa'
                                  ? 'bg-green-100 text-green-800'
                                  : log.estado === 'fallida'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {log.estado}
                            </Badge>
                            <span className="text-xs text-gray-600">
                              {new Date(log.fechaInicio).toLocaleString('es-ES')}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <span>✅ Exitosos: {log.registrosExitosos}</span>
                            <span>❌ Fallidos: {log.registrosFallidos}</span>
                            <span>📝 Procesados: {log.registrosProcesados}</span>
                            {log.duracionMs && <span>⏱️ {log.duracionMs}ms</span>}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          Ver detalles
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
