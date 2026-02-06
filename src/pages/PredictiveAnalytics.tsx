import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  BarChart3,
  Zap,
  RefreshCw,
  Download,
  Plus,
  Calendar,
  Activity,
} from 'lucide-react';
import {
  useListarSeries,
  useDetectarAnomalias,
  useListarAnomalias,
  useListarPronosticos,
  useAnalizarTendencia,
  useObtenerFactoresEstacionales,
  useListarModelos,
} from '@/features/predictiveanalytics/hooks/usePredictiveAnalytics';

export const PredictiveAnalyticsPage = () => {
  const [busqueda, setBusqueda] = useState('');
  const [timeSeriesSeleccionada, setTimeSeriesSeleccionada] = useState('');
  const [activeTab, setActiveTab] = useState('series');

  // Queries
  const { data: series } = useListarSeries({ busqueda });
  const { data: anomalias } = useListarAnomalias(timeSeriesSeleccionada);
  const { data: pronosticos } = useListarPronosticos(timeSeriesSeleccionada);
  const { data: modelos } = useListarModelos();
  const { data: tendencia } = useAnalizarTendencia(timeSeriesSeleccionada);
  const { data: factoresEstacionales } = useObtenerFactoresEstacionales(timeSeriesSeleccionada);

  // Mutations
  const { mutate: detectarAnomalias } = useDetectarAnomalias();

  // Data extraction
  const seriesData = (series as any)?.data?.series || [];
  const anomiasData = (anomalias as any)?.data?.anomalies || [];
  const pronosticosData = (pronosticos as any)?.data?.forecasts || [];
  const modelosData = (modelos as any)?.data?.models || [];
  const tendenciaData = (tendencia as any)?.data;
  const factoresData = (factoresEstacionales as any)?.data?.factors || [];

  // Stats
  const anomaliasAlta = anomiasData.filter((a: any) => a.severidad === 'alta' || a.severidad === 'critica').length;
  const pronosticosActivos = pronosticosData.filter((p: any) => p.estadoModelo === 'activo').length;
  const modelosEntrenados = modelosData.filter((m: any) => m.estadoModelo === 'activo').length;

  const getTrendColor = (tendencia: string) => {
    switch (tendencia) {
      case 'upward':
        return 'text-green-600 bg-green-50';
      case 'downward':
        return 'text-red-600 bg-red-50';
      case 'stable':
        return 'text-gray-600 bg-gray-50';
      case 'cyclical':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (tendencia: string) => {
    if (tendencia === 'upward') return <TrendingUp className="w-5 h-5" />;
    if (tendencia === 'downward') return <TrendingDown className="w-5 h-5" />;
    return <Activity className="w-5 h-5" />;
  };

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'critica':
        return 'bg-red-100 text-red-800';
      case 'alta':
        return 'bg-orange-100 text-orange-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baja':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccuracyColor = (accuracy: string) => {
    switch (accuracy) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Predictive Analytics</h1>
              <p className="text-blue-100 mt-1">Time series forecasting, anomaly detection & trend analysis</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              <Plus className="w-4 h-4 mr-2" />
              New Series
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Time Series</p>
                <p className="text-2xl font-bold text-blue-600">{seriesData.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg opacity-20">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Anomalies Detected</p>
                <p className="text-2xl font-bold text-orange-600">{anomiasData.length}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg opacity-20">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">{anomaliasAlta}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg opacity-20">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Forecasts</p>
                <p className="text-2xl font-bold text-green-600">{pronosticosActivos}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg opacity-20">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">ML Models</p>
                <p className="text-2xl font-bold text-purple-600">{modelosEntrenados}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg opacity-20">
                <RefreshCw className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="series">Time Series</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="seasonality">Seasonality</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
        </TabsList>

        {/* TIME SERIES TAB */}
        <TabsContent value="series" className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Search time series..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {seriesData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No time series found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seriesData.map((s: any) => (
                <Card
                  key={s.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setTimeSeriesSeleccionada(s.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{s.nombre}</h3>
                        <p className="text-xs text-gray-500">{s.metrica}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">{s.frecuencia}</Badge>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1 mt-3">
                      <p>Data Points: {s.totalPuntos}</p>
                      <p>Period: {s.fechaInicio} to {s.fechaFin}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* FORECASTS TAB */}
        <TabsContent value="forecasts" className="space-y-4">
          <div className="flex space-x-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Generate Forecast
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {pronosticosData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No forecasts available</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pronosticosData.map((p: any) => (
                <Card key={p.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {p.timeSeriesId} - {p.modeloUtilizado}
                        </h3>
                        <div className="grid grid-cols-3 gap-3 mt-2">
                          <div className="text-sm">
                            <p className="text-gray-600">RMSE</p>
                            <p className="font-semibold text-gray-900">{p.metricasEvaluacion?.rmse?.toFixed(2) || 'N/A'}</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-600">MAPE</p>
                            <p className="font-semibold text-gray-900">{p.metricasEvaluacion?.mape?.toFixed(2) || 'N/A'}%</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-600">R² Score</p>
                            <p className="font-semibold text-gray-900">{p.metricasEvaluacion?.r2Score?.toFixed(3) || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <Badge className={getAccuracyColor(p.precisión)}>
                        {p.precisión}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ANOMALIES TAB */}
        <TabsContent value="anomalies" className="space-y-4">
          <div className="flex space-x-2">
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => detectarAnomalias({ timeSeriesId: timeSeriesSeleccionada })}>
              <Zap className="w-4 h-4 mr-2" />
              Detect Anomalies
            </Button>
          </div>

          {anomiasData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No anomalies detected</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {anomiasData.map((a: any) => (
                <Card key={a.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{a.tipo}</h3>
                        <p className="text-sm text-gray-600 mt-1">{a.recomendacion}</p>
                        <div className="flex space-x-2 mt-3">
                          <Badge className={getSeveridadColor(a.severidad)}>
                            {a.severidad}
                          </Badge>
                          <Badge variant="outline">
                            {a.descubiertoPor}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Impact</p>
                        <p className="text-lg font-bold text-red-600">{a.impacto}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TRENDS TAB */}
        <TabsContent value="trends" className="space-y-4">
          {tendenciaData ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${getTrendColor(tendenciaData.tipo)}`}>
                      {getTrendIcon(tendenciaData.tipo)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Overall Trend</p>
                      <p className="text-lg font-semibold capitalize">{tendenciaData.tipo}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Slope</p>
                      <p className="text-lg font-bold text-gray-900">{tendenciaData.pendiente?.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Avg Change</p>
                      <p className="text-lg font-bold text-gray-900">{tendenciaData.cambioPromedio?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Confidence</p>
                      <p className="text-lg font-bold text-gray-900">{tendenciaData.confianzaTrend}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">Select a time series to analyze trends</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* SEASONALITY TAB */}
        <TabsContent value="seasonality" className="space-y-4">
          {factoresData.length > 0 ? (
            <div className="space-y-3">
              {factoresData.map((f: any, idx: number) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{f.periodo}</h3>
                        <p className="text-sm text-gray-600 mt-1">Seasonal Factor</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{f.factor.toFixed(3)}</p>
                        <p className="text-xs text-gray-500">multiplier</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No seasonality patterns detected</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* MODELS TAB */}
        <TabsContent value="models" className="space-y-4">
          {modelosData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No ML models available</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modelosData.map((m: any) => (
                <Card key={m.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{m.modeloTipo}</h3>
                      <Badge className={m.estadoModelo === 'activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {m.estadoModelo}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">RMSE (Train)</span>
                        <span className="font-semibold">{m.metricas?.trainRMSE?.toFixed(2) || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">RMSE (Test)</span>
                        <span className="font-semibold">{m.metricas?.testRMSE?.toFixed(2) || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data Points</span>
                        <span className="font-semibold">{m.datasetSize}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
