import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Brain,
  Plus,
  Play,
  Zap,
  TrendingUp,
  Package,
  Clock,
} from 'lucide-react';
import {
  useListarModelos,
  useListarTrainings,
  useListarDespliegues,
  useListarPredicciones,
  useListarMonitores,
  useListarExperimentos,
} from '@/features/mlmodels/hooks/useMLModels';

export const MLModelsPage = () => {
  const [activeTab, setActiveTab] = useState('modelos');
  const [busqueda, setBusqueda] = useState('');

  // Queries
  const { data: modelos } = useListarModelos();
  const { data: trainings } = useListarTrainings();
  const { data: despliegues } = useListarDespliegues();
  const { data: predicciones } = useListarPredicciones();
  const { data: monitores } = useListarMonitores();
  const { data: experimentos } = useListarExperimentos();

  // Data extraction
  const modelosData = (modelos as any)?.data?.modelos || [];
  const trainingsData = (trainings as any)?.data?.trainings || [];
  const desplieguesData = (despliegues as any)?.data?.despliegues || [];
  const prediccionesData = (predicciones as any)?.data?.predicciones || [];
  const monitoresData = (monitores as any)?.data?.monitores || [];
  const experimentosData = (experimentos as any)?.data?.experimentos || [];

  // Stats
  const modelosActivos = modelosData.filter((m: any) => m.estado === 'deployed').length;
  const trainingEnProgreso = trainingsData.filter((t: any) => t.estado === 'running').length;
  const desplieguesActivos = desplieguesData.filter((d: any) => d.estado === 'running').length;
  const prediccionesHoy = prediccionesData.filter((p: any) => {
    const hoy = new Date().toDateString();
    return new Date(p.createdAt).toDateString() === hoy;
  }).length;

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'deployed':
        return 'bg-green-100 text-green-800';
      case 'trained':
        return 'bg-blue-100 text-blue-800';
      case 'training':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  const getTrainingStatus = (estado: string) => {
    switch (estado) {
      case 'running':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">ML Model Management</h1>
              <p className="text-indigo-100 mt-1">Train, deploy, monitor, and optimize machine learning models</p>
            </div>
          </div>
          <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
            <Plus className="w-4 h-4 mr-2" />
            New Model
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Models</p>
                <p className="text-2xl font-bold text-indigo-600">{modelosActivos}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg opacity-20">
                <Brain className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Training Jobs</p>
                <p className="text-2xl font-bold text-yellow-600">{trainingEnProgreso}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg opacity-20">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Deployments</p>
                <p className="text-2xl font-bold text-green-600">{desplieguesActivos}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg opacity-20">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Predictions Today</p>
                <p className="text-2xl font-bold text-blue-600">{prediccionesHoy}</p>
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
                <p className="text-sm text-gray-600 font-medium">Experiments</p>
                <p className="text-2xl font-bold text-purple-600">{experimentosData.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg opacity-20">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="modelos">Models</TabsTrigger>
          <TabsTrigger value="entrenamiento">Training</TabsTrigger>
          <TabsTrigger value="despliegues">Deployments</TabsTrigger>
          <TabsTrigger value="predicciones">Predictions</TabsTrigger>
          <TabsTrigger value="monitores">Monitoring</TabsTrigger>
          <TabsTrigger value="experimentos">Experiments</TabsTrigger>
        </TabsList>

        {/* MODELS TAB */}
        <TabsContent value="modelos" className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Search models..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">Filter</Button>
          </div>

          {modelosData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No models created yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {modelosData.map((m: any) => (
                <Card key={m.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{m.nombre}</h3>
                        <p className="text-xs text-gray-500 mt-1">{m.descripcion}</p>
                      </div>
                      <Badge className={getStatusColor(m.estado)}>
                        {m.estado}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex space-x-2 text-xs text-gray-600">
                        <span>Type: {m.tipo}</span>
                        <span>Framework: {m.framework}</span>
                        <span>v{m.version}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TRAINING TAB */}
        <TabsContent value="entrenamiento" className="space-y-4">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Start Training Job
          </Button>

          {trainingsData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No training jobs</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {trainingsData.map((t: any) => (
                <Card key={t.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{t.nombre}</h3>
                        <p className="text-xs text-gray-500 mt-1">Duration: {Math.round((t.duracionMs || 0) / 1000)}s</p>
                      </div>
                      <Badge className={getTrainingStatus(t.estado)}>
                        {t.estado}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${t.progreso || 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{t.progreso || 0}% Complete</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* DEPLOYMENTS TAB */}
        <TabsContent value="despliegues" className="space-y-4">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Deploy Model
          </Button>

          {desplieguesData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No active deployments</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {desplieguesData.map((d: any) => (
                <Card key={d.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{d.nome}</h3>
                        <p className="text-xs text-gray-500 mt-1">v{d.version}</p>
                      </div>
                      <Badge className={d.estado === 'running' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {d.estado}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-gray-600">Latency</p>
                        <p className="font-semibold">{d.metricas_despliegue?.latenciaPromedio || 0}ms</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Uptime</p>
                        <p className="font-semibold">{d.metricas_despliegue?.uptime_porcentaje || 0}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Requests/min</p>
                        <p className="font-semibold">{d.metricas_despliegue?.requestsPorMinuto || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* PREDICTIONS TAB */}
        <TabsContent value="predicciones" className="space-y-4">
          {prediccionesData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No predictions made yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {prediccionesData.slice(0, 10).map((p: any) => (
                <Card key={p.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Model: {p.modelId}</p>
                        <p className="font-semibold mt-1">Confidence: {(p.confianza * 100).toFixed(1)}%</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Badge className={p.estado === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {p.estado}
                        </Badge>
                        <span className="text-xs text-gray-600">{p.tiempoInferencia}ms</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* MONITORING TAB */}
        <TabsContent value="monitores" className="space-y-4">
          {monitoresData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No monitors configured</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {monitoresData.map((mon: any) => (
                <Card key={mon.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">Model Monitor</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Period: {new Date(mon.periodo.inicio).toLocaleDateString()} - {new Date(mon.periodo.fin).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={
                        mon.estado_general === 'critical' ? 'bg-red-100 text-red-800' :
                        mon.estado_general === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {mon.estado_general}
                      </Badge>
                    </div>
                    {mon.data_drift?.detectado && (
                      <p className="text-sm text-orange-600 font-medium">⚠️ Data Drift Detected</p>
                    )}
                    {mon.model_drift?.detectado && (
                      <p className="text-sm text-red-600 font-medium">⚠️ Model Drift Detected</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* EXPERIMENTS TAB */}
        <TabsContent value="experimentos" className="space-y-4">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            New Experiment
          </Button>

          {experimentosData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No experiments yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {experimentosData.map((exp: any) => (
                <Card key={exp.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{exp.nombre}</h3>
                        <p className="text-xs text-gray-500 mt-1">{exp.descripcion}</p>
                      </div>
                      <Badge className={
                        exp.estado === 'completed' ? 'bg-green-100 text-green-800' :
                        exp.estado === 'running' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {exp.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Runs: {exp.runs?.length || 0}</p>
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
