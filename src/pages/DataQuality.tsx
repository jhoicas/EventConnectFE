import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Shield,
  Plus,
  Play,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3,
} from 'lucide-react';
import {
  useListarPuntuaciones,
  useListarReglas,
  useListarAnomalias,
  useListarMonitores,
  useListarVerificaciones,
  useListarReportesGenerados,
} from '@/features/dataquality/hooks/useDataQuality';

export const DataQualityPage = () => {
  const [activeTab, setActiveTab] = useState('puntuaciones');
  const [busqueda, setBusqueda] = useState('');

  // Queries
  const { data: puntuaciones } = useListarPuntuaciones();
  const { data: reglas } = useListarReglas();
  const { data: anomalias } = useListarAnomalias();
  const { data: monitores } = useListarMonitores();
  const { data: verificaciones } = useListarVerificaciones();
  const { data: reportes } = useListarReportesGenerados();

  // Data extraction
  const puntuacionesData = (puntuaciones as any)?.data?.puntuaciones || [];
  const reglasData = (reglas as any)?.data?.reglas || [];
  const anomaliasData = (anomalias as any)?.data?.anomalias || [];
  const monitoresData = (monitores as any)?.data?.monitores || [];
  const verificacionesData = (verificaciones as any)?.data?.verificaciones || [];
  const reportesData = (reportes as any)?.data?.reportes || [];

  // Stats
  const puntuacionPromedio = puntuacionesData.length > 0
    ? (puntuacionesData.reduce((sum: number, p: any) => sum + p.overallScore, 0) / puntuacionesData.length).toFixed(1)
    : 0;
  const anomaliasNoResueltas = anomaliasData.filter((a: any) => !a.resuelto).length;
  const reglasActivas = reglasData.filter((r: any) => r.activo).length;
  const monitoresActivos = monitoresData.filter((m: any) => m.activo).length;
  const cumplimientoVerificaciones = verificacionesData.length > 0
    ? Math.round((verificacionesData.filter((v: any) => v.estado_cumplimiento === 'compliant').length / verificacionesData.length) * 100)
    : 0;

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceColor = (estado: string) => {
    switch (estado) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'non-compliant':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Data Quality & Validation</h1>
              <p className="text-blue-100 mt-1">Monitor, validate, and ensure data integrity across all systems</p>
            </div>
          </div>
          <Button className="bg-white text-blue-600 hover:bg-blue-50">
            <Plus className="w-4 h-4 mr-2" />
            New Validation
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg Quality Score</p>
                <p className="text-2xl font-bold text-blue-600">{puntuacionPromedio}%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg opacity-20">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Rules</p>
                <p className="text-2xl font-bold text-green-600">{reglasActivas}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg opacity-20">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Unresolved Issues</p>
                <p className="text-2xl font-bold text-orange-600">{anomaliasNoResueltas}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg opacity-20">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Monitors</p>
                <p className="text-2xl font-bold text-purple-600">{monitoresActivos}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg opacity-20">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Compliance</p>
                <p className="text-2xl font-bold text-teal-600">{cumplimientoVerificaciones}%</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-lg opacity-20">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="puntuaciones">Quality Scores</TabsTrigger>
          <TabsTrigger value="reglas">Rules</TabsTrigger>
          <TabsTrigger value="anomalias">Anomalies</TabsTrigger>
          <TabsTrigger value="monitores">Monitoring</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="reportes">Reports</TabsTrigger>
        </TabsList>

        {/* QUALITY SCORES TAB */}
        <TabsContent value="puntuaciones" className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Search by table name..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">Filter</Button>
          </div>

          {puntuacionesData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No quality scores yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {puntuacionesData.map((p: any) => (
                <Card key={p.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{p.entityType}</h3>
                        <p className="text-xs text-gray-500 mt-1">Entity: {p.entityId}</p>
                      </div>
                      <Badge className={getStatusColor(p.status)}>
                        {p.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div>
                        <p className="text-xs text-gray-600">Overall</p>
                        <p className="text-lg font-bold text-blue-600">{p.overallScore}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Completeness</p>
                        <p className="text-lg font-bold text-green-600">{p.completenessScore}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Trend</p>
                        <p className={`text-lg font-bold ${p.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {p.trend >= 0 ? '+' : ''}{p.trend}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* RULES TAB */}
        <TabsContent value="reglas" className="space-y-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Rule
          </Button>

          {reglasData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No validation rules created</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {reglasData.map((r: any) => (
                <Card key={r.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{r.nombre}</h3>
                        <p className="text-xs text-gray-500 mt-1">{r.descripcion}</p>
                        <div className="flex space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">{r.tipo}</Badge>
                          <Badge variant="outline" className="text-xs">{r.severidad}</Badge>
                          {r.activo && <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>}
                        </div>
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

        {/* ANOMALIES TAB */}
        <TabsContent value="anomalias" className="space-y-4">
          {anomaliasData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No anomalies detected</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {anomaliasData.map((a: any) => (
                <Card key={a.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{a.tipo.toUpperCase()}</h3>
                        <p className="text-xs text-gray-500 mt-1">{a.descripcion}</p>
                        <p className="text-xs text-gray-600 mt-1">Table: {a.tabla} | Field: {a.campo}</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Badge className={
                          a.severidad === 'critical' ? 'bg-red-100 text-red-800' :
                          a.severidad === 'high' ? 'bg-orange-100 text-orange-800' :
                          a.severidad === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {a.severidad}
                        </Badge>
                        {a.resuelto ? (
                          <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Unresolved</Badge>
                        )}
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
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Monitor
          </Button>

          {monitoresData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No monitors configured</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {monitoresData.map((m: any) => (
                <Card key={m.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{m.nombre}</h3>
                        <p className="text-xs text-gray-500 mt-1">Frequency: {m.frecuenciaEvaluacion}</p>
                        <p className="text-xs text-gray-600 mt-1">Tables: {m.tablasMonitoreadas?.length || 0}</p>
                      </div>
                      <Badge className={m.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {m.activo ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* COMPLIANCE TAB */}
        <TabsContent value="compliance" className="space-y-4">
          {verificacionesData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No compliance checks configured</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {verificacionesData.map((v: any) => (
                <Card key={v.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{v.nombre}</h3>
                        <p className="text-xs text-gray-500 mt-1">Frameworks: {v.frameworks?.join(', ')}</p>
                      </div>
                      <Badge className={getComplianceColor(v.estado_cumplimiento)}>
                        {v.estado_cumplimiento}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      {v.frameworks?.slice(0, 3).map((f: string) => (
                        <Badge key={f} variant="outline" className="text-xs">
                          {f.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* REPORTS TAB */}
        <TabsContent value="reportes" className="space-y-4">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            Generate Report
          </Button>

          {reportesData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No reports generated yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {reportesData.map((rep: any) => (
                <Card key={rep.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{rep.nombre}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Period: {new Date(rep.periodo.inicio).toLocaleDateString()} - {new Date(rep.periodo.fin).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <p className="text-xs text-gray-600">Avg Quality</p>
                        <p className="text-lg font-bold text-blue-600">{rep.metricas_resumen.promedio_calidad}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Issues Resolved</p>
                        <p className="text-lg font-bold text-green-600">{rep.metricas_resumen.tasa_resolucion}%</p>
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
