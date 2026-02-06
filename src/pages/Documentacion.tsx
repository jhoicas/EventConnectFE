import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, HelpCircle, BarChart3, Clock, Eye, MessageSquare, TrendingUp } from 'lucide-react';
import { EditorArticulo } from '@/features/documentacion/components/EditorArticulo';
import { ListaArticulos } from '@/features/documentacion/components/ListaArticulos';
import { ListaFAQ } from '@/features/documentacion/components/ListaFAQ';
import { HistorialVersiones } from '@/features/documentacion/components/HistorialVersiones';
import { useObtenerEstadisticas, useObtenerArticulosPendientes } from '@/features/documentacion/hooks/useDocumentacion';
import type { Articulo } from '@/features/documentacion/types';

export const DocumentacionPage = () => {
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<string | null>(null);
  
  const { data: estadisticas } = useObtenerEstadisticas(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
    new Date()
  );
  const { data: articulosPendientes } = useObtenerArticulosPendientes();

  const stats = estadisticas?.data;
  const pendientes = articulosPendientes?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-transparent to-transparent">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Documentación</h1>
          </div>
          <p className="text-amber-100">Knowledge base, guías y preguntas frecuentes</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Artículos */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Artículos</p>
                  <p className="text-2xl font-bold text-blue-600">{stats?.totalArticulos || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats?.articulosPublicados || 0} publicados
                  </p>
                </div>
                <BookOpen className="w-10 h-10 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Preguntas Frecuentes</p>
                  <p className="text-2xl font-bold text-green-600">{stats?.totalFAQs || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats?.faqsPublicadas || 0} activas
                  </p>
                </div>
                <HelpCircle className="w-10 h-10 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Vistas Mes */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Vistas Este Mes</p>
                  <p className="text-2xl font-bold text-purple-600">{(stats?.totalVistasMes || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(stats?.vistasPromedioPorArticulo || 0).toFixed(0)} por artículo
                  </p>
                </div>
                <Eye className="w-10 h-10 text-purple-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Tiempo Promedio */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Lectura Promedio</p>
                  <p className="text-2xl font-bold text-orange-600">{(stats?.tiempoPromedioLectura || 0).toFixed(0)} min</p>
                  <p className="text-xs text-gray-500 mt-1">tiempo por artículo</p>
                </div>
                <Clock className="w-10 h-10 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Pendientes Revisión */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendientes Revisión</p>
                  <p className="text-2xl font-bold text-red-600">{stats?.articulosPendientesRevision || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">esperando aprobación</p>
                </div>
                <MessageSquare className="w-10 h-10 text-red-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="articulos" className="bg-white rounded-lg border border-gray-200">
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-gray-200">
            <TabsTrigger value="articulos" className="flex gap-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              <BookOpen className="w-4 h-4" />
              Artículos
            </TabsTrigger>
            <TabsTrigger value="crear" className="flex gap-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              <TrendingUp className="w-4 h-4" />
              Crear
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex gap-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              <HelpCircle className="w-4 h-4" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="versiones" className="flex gap-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              <BarChart3 className="w-4 h-4" />
              Versiones
            </TabsTrigger>
          </TabsList>

          {/* Tab: Ver Artículos */}
          <TabsContent value="articulos" className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Artículos Disponibles</h3>
              <ListaArticulos onArticuloSeleccionado={(art: Articulo) => setArticuloSeleccionado(art.id)} />
            </div>

            {/* Artículos Más Consultados */}
            {stats?.articuloMasVisto && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="text-sm">🔥 Más Consultado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-gray-900">{stats.articuloMasVisto.titulo}</p>
                  <p className="text-sm text-gray-600 mt-1">{stats.articuloMasVisto.vistas} vistas</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Crear Artículo */}
          <TabsContent value="crear" className="p-6">
            <EditorArticulo onSuccess={() => {}} />
          </TabsContent>

          {/* Tab: FAQs */}
          <TabsContent value="faqs" className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preguntas Frecuentes</h3>
              <ListaFAQ />
            </div>
          </TabsContent>

          {/* Tab: Historial Versiones */}
          <TabsContent value="versiones" className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Historial de Versiones</h3>
              {articuloSeleccionado ? (
                <HistorialVersiones articuloId={articuloSeleccionado} articuloTitulo="Artículo" />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    Selecciona un artículo para ver su historial de versiones
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Sección de Artículos Pendientes */}
        {pendientes.length > 0 && (
          <Card className="mt-8 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Artículos Pendientes de Revisión ({pendientes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pendientes.map((art: any) => (
                  <div key={art.id} className="flex items-center justify-between p-3 bg-white rounded border border-yellow-200">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{art.titulo}</p>
                      <p className="text-xs text-gray-600">{art.autorNombre}</p>
                    </div>
                    <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                      Pendiente
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estadísticas adicionales */}
        {stats?.categoriasMasConsultadas && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-base">Categorías Más Consultadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.categoriasMasConsultadas.map((cat: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{cat.nombre}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{
                            width: `${(cat.vistas / (stats.categoriasMasConsultadas[0]?.vistas || 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-16 text-right">{cat.vistas} vistas</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DocumentacionPage;
