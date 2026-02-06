import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BarChart3,
  Plus,
  Download,
  TrendingUp,
  Target,
  AlertCircle,
  PieChart,
  Activity,
} from 'lucide-react';
import {
  useListarDashboards,
  useObtenerEstadisticas,
  useListarKPIs,
  useListarAlertas,
  useListarPronosticos,
} from '@/features/businessintelligence/hooks/useBusinessIntelligence';

export const BusinessIntelligencePage = () => {
  const [busqueda, setBusqueda] = useState('');

  const { data: dashboards } = useListarDashboards({ busqueda });
  const { data: estadisticas } = useObtenerEstadisticas();
  const { data: kpis } = useListarKPIs();
  const { data: alertas } = useListarAlertas();
  const { data: pronosticos } = useListarPronosticos();

  const dashboardsData = (dashboards as any)?.data?.dashboards || [];
  const estadisticasData = (estadisticas as any)?.data;
  const kpisData = (kpis as any)?.data?.kpis || [];
  const alertasData = (alertas as any)?.data?.alertas || [];
  const pronosticosData = (pronosticos as any)?.data?.pronosticos || [];

  const getTendenciaColor = (tendencia: string) => {
    const colors: Record<string, string> = {
      aumento: 'text-green-600',
      disminucion: 'text-red-600',
      estable: 'text-gray-600',
    };
    return colors[tendencia] || 'text-gray-600';
  };

  const getTendenciaIcon = (tendencia: string) => {
    if (tendencia === 'aumento') return '📈';
    if (tendencia === 'disminucion') return '📉';
    return '➡️';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Business Intelligence</h1>
                <p className="text-gray-600">Dashboard de Análisis e Inteligencia Empresarial</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{dashboardsData.length || 0}</div>
              <div className="text-sm text-gray-600">Dashboards Activos</div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Dashboards */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Dashboards</p>
                  <p className="text-2xl font-bold text-blue-600">{dashboardsData.length || 0}</p>
                </div>
                <BarChart3 className="w-12 h-12 text-blue-100 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* KPIs Monitoreados */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">KPIs</p>
                  <p className="text-2xl font-bold text-green-600">{kpisData.length || 0}</p>
                </div>
                <Target className="w-12 h-12 text-green-100 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Alertas Activas */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Alertas Activas</p>
                  <p className="text-2xl font-bold text-orange-600">{alertasData.filter((a: any) => a.activa).length || 0}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-orange-100 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Pronósticos */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pronósticos</p>
                  <p className="text-2xl font-bold text-purple-600">{pronosticosData.length || 0}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-100 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Disponibilidad */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Disponibilidad</p>
                  <p className="text-2xl font-bold text-indigo-600">{estadisticasData?.disponibilidad || 0}%</p>
                </div>
                <Activity className="w-12 h-12 text-indigo-100 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dashboards" className="bg-white rounded-lg shadow-sm border-0">
          <TabsList className="w-full justify-start border-b bg-gray-50 rounded-none rounded-t-lg p-0">
            <TabsTrigger value="dashboards" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboards
            </TabsTrigger>
            <TabsTrigger value="kpis" className="gap-2">
              <Target className="w-4 h-4" />
              KPIs
            </TabsTrigger>
            <TabsTrigger value="alertas" className="gap-2">
              <AlertCircle className="w-4 h-4" />
              Alertas
            </TabsTrigger>
            <TabsTrigger value="pronosticos" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Pronósticos
            </TabsTrigger>
            <TabsTrigger value="analisis" className="gap-2">
              <PieChart className="w-4 h-4" />
              Análisis
            </TabsTrigger>
          </TabsList>

          {/* Tab: Dashboards */}
          <TabsContent value="dashboards" className="p-6 space-y-4">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Buscar dashboards..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="flex-1"
              />
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nuevo Dashboard
              </Button>
            </div>

            {dashboardsData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No hay dashboards disponibles
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardsData.map((dashboard: any) => (
                  <Card key={dashboard.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{dashboard.nombre}</h4>
                          <p className="text-sm text-gray-600 mt-1">{dashboard.descripcion}</p>
                        </div>
                        <BarChart3 className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          className={
                            dashboard.estado === 'activo'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {dashboard.estado}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {dashboard.widgets?.length || 0} widgets
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" variant="default">
                          Abrir
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: KPIs */}
          <TabsContent value="kpis" className="p-6 space-y-4">
            {kpisData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No hay KPIs configurados
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {kpisData.slice(0, 10).map((kpi: any) => (
                  <Card key={kpi.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{kpi.nombre}</h4>
                            <Badge variant="outline" className="text-xs">
                              {kpi.tipo}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{kpi.descripcion}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-semibold">
                              {kpi.valor} {kpi.unidad}
                            </span>
                            {kpi.metaObjetivo && (
                              <span className="text-gray-600">
                                Meta: {kpi.metaObjetivo} {kpi.unidad}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-2xl font-bold ${getTendenciaColor(kpi.tendencia)}`}
                          >
                            {getTendenciaIcon(kpi.tendencia)} {kpi.porcentajeCambio > 0 ? '+' : ''}
                            {kpi.porcentajeCambio}%
                          </div>
                          {kpi.progreso && (
                            <div className="mt-2">
                              <div className="bg-gray-200 rounded-full h-2 w-24">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${Math.min(kpi.progreso, 100)}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{kpi.progreso}%</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Alertas */}
          <TabsContent value="alertas" className="p-6 space-y-4">
            {alertasData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No hay alertas configuradas
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {alertasData.map((alerta: any) => (
                  <Card key={alerta.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{alerta.nombre}</h4>
                            <Badge
                              className={
                                alerta.activa
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {alerta.activa ? 'Activa' : 'Inactiva'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {alerta.tipo} • {alerta.condicion}
                          </p>
                          <p className="text-xs text-gray-500">
                            Frecuencia: {alerta.frecuencia}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Pronósticos */}
          <TabsContent value="pronosticos" className="p-6 space-y-4">
            {pronosticosData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No hay pronósticos disponibles
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {pronosticosData.map((pronostico: any) => (
                  <Card key={pronostico.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">Pronóstico - {pronostico.kpi}</h4>
                            <Badge variant="outline">{pronostico.modelo}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-gray-600">
                              Precisión: <span className="font-semibold">{pronostico.precision}%</span>
                            </span>
                            <span className="text-gray-600">
                              Confianza: <span className="font-semibold">{pronostico.confianza}%</span>
                            </span>
                          </div>
                        </div>
                        <TrendingUp className="w-6 h-6 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Análisis */}
          <TabsContent value="analisis" className="p-6 space-y-4">
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <PieChart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Análisis Detallados
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Aquí encontrarás análisis profundos, segmentaciones y comparativas
                  </p>
                  <Button>
                    Crear Análisis Personalizado
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
