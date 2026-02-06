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
  RefreshCw,
  Clock,
  BarChart3,
  Share2,
  Eye,
} from 'lucide-react';
import {
  useListarReportes,
  useObtenerEstadisticas,
  useListarPlantillas,
  useListarProgramaciones,
  useGenerarReporte,
} from '@/features/reportes/hooks/useReportes';

export const ReportesPage = () => {
  const [busqueda, setBusqueda] = useState('');

  const { data: reportes } = useListarReportes({ busqueda });
  const { data: estadisticas } = useObtenerEstadisticas();
  const { data: plantillas } = useListarPlantillas();
  const { data: programaciones } = useListarProgramaciones();

  const generarMutation = useGenerarReporte();

  const reportesData = (reportes as any)?.data?.reportes || [];
  const estadisticasData = (estadisticas as any)?.data;
  const plantillasData = (plantillas as any)?.data?.plantillas || [];
  const programacionesData = (programaciones as any)?.data?.programaciones || [];

  const getTipoColor = (tipo: string) => {
    const colors: Record<string, string> = {
      ventas: 'bg-green-100 text-green-800',
      inventario: 'bg-blue-100 text-blue-800',
      usuarios: 'bg-purple-100 text-purple-800',
      activos: 'bg-orange-100 text-orange-800',
      reservas: 'bg-pink-100 text-pink-800',
      auditoría: 'bg-red-100 text-red-800',
      personalizado: 'bg-gray-100 text-gray-800',
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-transparent to-transparent">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Reportes Avanzados</h1>
          </div>
          <p className="text-indigo-100">Constructor de reportes, exportación y programación automática</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Reportes */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reportes</p>
                  <p className="text-2xl font-bold text-indigo-600">{estadisticasData?.totalReportes || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">todos los reportes</p>
                </div>
                <FileText className="w-10 h-10 text-indigo-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Reportes Activos */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reportes Activos</p>
                  <p className="text-2xl font-bold text-green-600">{estadisticasData?.reportesActivos || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">en uso</p>
                </div>
                <BarChart3 className="w-10 h-10 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Reportes Programados */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Programados</p>
                  <p className="text-2xl font-bold text-purple-600">{estadisticasData?.reportesProgramados || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">ejecución automática</p>
                </div>
                <Clock className="w-10 h-10 text-purple-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Descargas Totales */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Descargas Totales</p>
                  <p className="text-2xl font-bold text-orange-600">{estadisticasData?.descargas_totales || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">en 30 días</p>
                </div>
                <Download className="w-10 h-10 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Tiempo Generación */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tiempo Promedio</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(estadisticasData?.tiempoPromedioGeneracionMs || 0) / 1000}s
                  </p>
                  <p className="text-xs text-gray-500 mt-1">generación</p>
                </div>
                <RefreshCw className="w-10 h-10 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="reportes" className="bg-white rounded-lg border border-gray-200">
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-gray-200">
            <TabsTrigger value="reportes" className="flex gap-2">
              <FileText className="w-4 h-4" />
              Mis Reportes
            </TabsTrigger>
            <TabsTrigger value="plantillas" className="flex gap-2">
              <BarChart3 className="w-4 h-4" />
              Plantillas
            </TabsTrigger>
            <TabsTrigger value="programaciones" className="flex gap-2">
              <Clock className="w-4 h-4" />
              Programaciones
            </TabsTrigger>
            <TabsTrigger value="compartidos" className="flex gap-2">
              <Share2 className="w-4 h-4" />
              Compartidos
            </TabsTrigger>
          </TabsList>

          {/* Tab: Reportes */}
          <TabsContent value="reportes" className="p-6 space-y-4">
            <div className="flex gap-3 mb-4">
              <Input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar reportes..."
                className="flex-1"
              />
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nuevo Reporte
              </Button>
            </div>

            {reportesData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No hay reportes disponibles. Crea uno nuevo para comenzar.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {reportesData.map((reporte: any) => (
                  <Card
                    key={reporte.id}
                    className="cursor-pointer hover:border-indigo-300 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{reporte.nombre}</h4>
                            <Badge className={getTipoColor(reporte.tipo)}>{reporte.tipo}</Badge>
                            <Badge
                              variant={reporte.estado === 'publicado' ? 'default' : 'outline'}
                              className="text-xs"
                            >
                              {reporte.estado}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{reporte.descripcion}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>📊 {reporte.recursoBasePrincipal}</span>
                            {reporte.estadisticas?.totalDescargas && (
                              <span>📥 {reporte.estadisticas.totalDescargas} descargas</span>
                            )}
                            {reporte.estadisticas?.ultimaGeneracion && (
                              <span>⏱️ {new Date(reporte.estadisticas.ultimaGeneracion).toLocaleDateString('es-ES')}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              generarMutation.mutate({ id: reporte.id });
                            }}
                          >
                            <RefreshCw className="w-3 h-3" />
                            Generar
                          </Button>
                          <Button size="sm" variant="ghost" className="gap-1">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="gap-1">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Plantillas */}
          <TabsContent value="plantillas" className="p-6 space-y-4">
            {plantillasData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No hay plantillas disponibles
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plantillasData.map((plantilla: any) => (
                  <Card key={plantilla.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 flex-1">{plantilla.nombre}</h4>
                        {plantilla.icono && <span className="text-2xl">{plantilla.icono}</span>}
                      </div>
                      {plantilla.descripcion && (
                        <p className="text-sm text-gray-600 mb-3">{plantilla.descripcion}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                        <Badge variant="outline">{plantilla.tipo}</Badge>
                        {plantilla.estaEnUso && <Badge className="bg-green-100 text-green-800">En uso</Badge>}
                      </div>
                      <Button className="w-full gap-2">
                        <Plus className="w-4 h-4" />
                        Usar plantilla
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Programaciones */}
          <TabsContent value="programaciones" className="p-6 space-y-4">
            {programacionesData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No hay reportes programados
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {programacionesData.map((prog: any) => (
                  <Card key={prog.id} className="border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{prog.nombre}</h4>
                            <Badge className={prog.activa ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {prog.activa ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <span>📅 {prog.frecuencia}</span>
                            <span>⏰ {prog.horaEjecucion}</span>
                            {prog.proximaEjecucion && (
                              <span>➡️ {new Date(prog.proximaEjecucion).toLocaleDateString('es-ES')}</span>
                            )}
                            <span>📧 {prog.destinatarios?.correos?.length || 0} correos</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Clock className="w-3 h-3" />
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Compartidos */}
          <TabsContent value="compartidos" className="p-6">
            <div className="text-center text-gray-500 py-12">
              <Share2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Los reportes compartidos contigo aparecerán aquí</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
