import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Plus,
  Download,
  Share2,
  Clock,
  Eye,
  Edit,
  Trash2,
  Star,
  Zap,
  Calendar,
} from 'lucide-react';
import {
  useListarReportes,
  useListarPlantillas,
  useListarFavoritos,
  useListarProgramaciones,
  useListarExportaciones,
  useListarComparticiones,
} from '@/features/reportbuilder/hooks/useReportBuilder';

export const ReportBuilderPage = () => {
  const [activeTab, setActiveTab] = useState('reportes');
  const [busqueda, setBusqueda] = useState('');
  const [reporteSeleccionado, setReporteSeleccionado] = useState('');

  // Queries
  const { data: reportes } = useListarReportes({ busqueda });
  const { data: plantillas } = useListarPlantillas();
  const { data: favoritos } = useListarFavoritos();
  const { data: programaciones } = useListarProgramaciones(reporteSeleccionado);
  const { data: exportaciones } = useListarExportaciones(reporteSeleccionado);
  const { data: comparticiones } = useListarComparticiones(reporteSeleccionado);

  // Data extraction
  const reportesData = (reportes as any)?.data?.reportes || [];
  const plantillasData = (plantillas as any)?.data?.plantillas || [];
  const favoritosData = (favoritos as any)?.data?.favoritos || [];
  const programacionesData = (programaciones as any)?.data?.programaciones || [];
  const exportacionesData = (exportaciones as any)?.data?.exportaciones || [];
  const comparticionesData = (comparticiones as any)?.data?.comparticiones || [];

  // Stats
  const reportesTotal = reportesData.length;
  const reportesPublicados = reportesData.filter((r: any) => r.estado === 'published').length;
  const programacionesActivas = programacionesData.filter((p: any) => p.habilitado).length;
  const exportacionesPendientes = exportacionesData.filter((e: any) => e.estado === 'pending' || e.estado === 'processing').length;

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getExportStatus = (estado: string) => {
    switch (estado) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
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
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Custom Report Builder</h1>
              <p className="text-purple-100 mt-1">Design, generate, and distribute reports with ease</p>
            </div>
          </div>
          <Button className="bg-white text-purple-600 hover:bg-purple-50">
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Reports</p>
                <p className="text-2xl font-bold text-purple-600">{reportesTotal}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg opacity-20">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Published</p>
                <p className="text-2xl font-bold text-green-600">{reportesPublicados}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg opacity-20">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{programacionesActivas}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg opacity-20">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Processing</p>
                <p className="text-2xl font-bold text-orange-600">{exportacionesPendientes}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg opacity-20">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Favorites</p>
                <p className="text-2xl font-bold text-pink-600">{favoritosData.length}</p>
              </div>
              <div className="p-3 bg-pink-100 rounded-lg opacity-20">
                <Star className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="reportes">Reports</TabsTrigger>
          <TabsTrigger value="plantillas">Templates</TabsTrigger>
          <TabsTrigger value="programaciones">Scheduled</TabsTrigger>
          <TabsTrigger value="exportaciones">Exports</TabsTrigger>
          <TabsTrigger value="favoritos">Favorites</TabsTrigger>
          <TabsTrigger value="compartidos">Shared</TabsTrigger>
        </TabsList>

        {/* REPORTS TAB */}
        <TabsContent value="reportes" className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Search reports..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">Filter</Button>
          </div>

          {reportesData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No reports found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {reportesData.map((r: any) => (
                <Card
                  key={r.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setReporteSeleccionado(r.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{r.nombre}</h3>
                        <p className="text-xs text-gray-500 mt-1">{r.descripcion}</p>
                      </div>
                      <Badge className={getStatusColor(r.estado)}>
                        {r.estado}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex space-x-2 text-xs text-gray-600">
                        <span>Type: {r.tipo}</span>
                        {r.compartido && <span>Shared</span>}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TEMPLATES TAB */}
        <TabsContent value="plantillas" className="space-y-4">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Save as Template
          </Button>

          {plantillasData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No templates available</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plantillasData.map((t: any) => (
                <Card key={t.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{t.nombre}</h3>
                        <p className="text-xs text-gray-500 mt-1">{t.descripcion}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-semibold">{t.calificacion}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline">{t.tipo}</Badge>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* SCHEDULED TAB */}
        <TabsContent value="programaciones" className="space-y-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Clock className="w-4 h-4 mr-2" />
            Create Schedule
          </Button>

          {programacionesData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No scheduled reports</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {programacionesData.map((p: any) => (
                <Card key={p.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{p.nombre}</h3>
                        <p className="text-xs text-gray-500 mt-1">{p.descripcion}</p>
                        <div className="flex space-x-2 mt-2">
                          {p.formatos?.map((f: string) => (
                            <Badge key={f} variant="outline" className="text-xs">
                              {f}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={p.habilitado ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {p.habilitado ? 'Active' : 'Inactive'}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-2">
                          Next: {new Date(p.proximaEjecucion).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* EXPORTS TAB */}
        <TabsContent value="exportaciones" className="space-y-4">
          <Button className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>

          {exportacionesData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No exports available</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {exportacionesData.map((e: any) => (
                <Card key={e.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{e.formato.toUpperCase()}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Generated: {new Date(e.fechaGeneracion).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Size: {((e.tamanioArchivo || 0) / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Badge className={getExportStatus(e.estado)}>
                          {e.estado}
                        </Badge>
                        {e.estado === 'completed' && (
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* FAVORITES TAB */}
        <TabsContent value="favoritos" className="space-y-4">
          {favoritosData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No favorite reports yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoritosData.map((f: any) => (
                <Card key={f.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{f.nombre}</h3>
                        <p className="text-xs text-gray-500 mt-1">Added recently</p>
                      </div>
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* SHARED TAB */}
        <TabsContent value="compartidos" className="space-y-4">
          {comparticionesData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">This report is not shared with anyone</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {comparticionesData.map((c: any) => (
                <Card key={c.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{c.email}</p>
                        <div className="flex space-x-1 mt-2">
                          {c.permisos?.map((p: string) => (
                            <Badge key={p} variant="outline" className="text-xs">
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="w-4 h-4 text-red-600" />
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
  );
};
