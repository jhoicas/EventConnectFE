import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { CrearResenia } from '@/features/resenas/components/CrearResenia';
import { ListaResenas } from '@/features/resenas/components/ListaResenas';
import { ResumenCalificacion } from '@/features/resenas/components/ResumenCalificacion';
import { ModerationPanel } from '@/features/resenas/components/ModerationPanel';
import { useObtenerEstadisticas } from '@/features/resenas/hooks/useResenas';
import { Star, MessageSquare, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ReseniasPage() {
  const [tabActiva, setTabActiva] = useState('verResenas');
  const [fechaInicio] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [fechaFin] = useState(new Date().toISOString().split('T')[0]);

  const { data: estadisticas } = useObtenerEstadisticas(fechaInicio, fechaFin);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-100 border border-amber-200 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">
          ⭐ Reseñas y Calificaciones
        </h1>
        <p className="text-amber-700">
          Sistema completo de reseñas, calificaciones y moderación con análisis de aspectos positivos y negativos
        </p>
      </div>

      {/* Analytics Cards */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reseñas</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.totalResenas.toLocaleString()}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Calificación: {estadisticas.calificacionPromedio.toFixed(1)}/5
                  </p>
                </div>
                <Star className="w-10 h-10 text-yellow-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aprobadas</p>
                  <p className="text-2xl font-bold text-green-600">{estadisticas.reseniasAprobadas.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((estadisticas.reseniasAprobadas / estadisticas.totalResenas) * 100).toFixed(1)}% del total
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
                  <p className="text-sm text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">{estadisticas.resienasPendientes.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((estadisticas.resienasPendientes / estadisticas.totalResenas) * 100).toFixed(1)}% por revisar
                  </p>
                </div>
                <AlertCircle className="w-10 h-10 text-yellow-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tasa de Respuesta</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(estadisticas.tasaRespuestaProveedor * 100 || 0).toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">de reseñas respondidas</p>
                </div>
                <TrendingUp className="w-10 h-10 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={tabActiva} onValueChange={setTabActiva}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="verResenas" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Reseñas
          </TabsTrigger>
          <TabsTrigger value="crear" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Crear
          </TabsTrigger>
          <TabsTrigger value="resumen" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="moderacion" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Moderación
          </TabsTrigger>
        </TabsList>

        {/* Tab: Ver Reseñas */}
        <TabsContent value="verResenas" className="space-y-4">
          <ListaResenas />
        </TabsContent>

        {/* Tab: Crear Reseña */}
        <TabsContent value="crear" className="space-y-4">
          <CrearResenia
            tipo="servicio"
            refId="servicio-1"
            clienteId="cliente-123"
            clienteNombre="Juan García"
            onSuccess={() => setTabActiva('verResenas')}
          />
        </TabsContent>

        {/* Tab: Resumen de Calificación */}
        <TabsContent value="resumen" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResumenCalificacion
              tipo="servicio"
              refId="servicio-1"
              nombre="Servicio Premium"
            />
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Distribución por Tipo de Reseña</h3>
                {estadisticas && (
                  <div className="space-y-3">
                    {Object.entries(estadisticas.distribucionPorCalificacion).map(([calificacion, cantidad]) => {
                      const porcentaje = estadisticas.totalResenas > 0 
                        ? (cantidad / estadisticas.totalResenas) * 100 
                        : 0;
                      return (
                        <div key={calificacion} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>⭐ {calificacion} estrellas</span>
                            <span className="font-medium">{cantidad} ({porcentaje.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${porcentaje}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Panel de Moderación */}
        <TabsContent value="moderacion" className="space-y-4">
          <ModerationPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
