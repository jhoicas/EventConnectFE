import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Trophy,
  Plus,
  Zap,
  Star,
  Users,
  Target,
  TrendingUp,
  Gift,
} from 'lucide-react';
import {
  useObtenerPerfilJugador,
  useListarLogros,
  useListarInsignias,
  useListarRecompensas,
  useObtenerClasificacion,
  useListarRetos,
} from '@/features/sistemapuntos/hooks/useSistemaPuntos';

export const SistemaPuntosPage = () => {
  const [busqueda, setBusqueda] = useState('');
  const [periodoClasificacion, setPeriodoClasificacion] = useState('mensual');

  const { data: perfil } = useObtenerPerfilJugador();
  const { data: logros } = useListarLogros({ busqueda });
  const { data: insignias } = useListarInsignias();
  const { data: recompensas } = useListarRecompensas();
  const { data: clasificacion } = useObtenerClasificacion(periodoClasificacion);
  const { data: retos } = useListarRetos();

  const perfilData = (perfil as any)?.data;
  const logrosData = (logros as any)?.data?.logros || [];
  const insigniasData = (insignias as any)?.data?.insignias || [];
  const recompensasData = (recompensas as any)?.data?.recompensas || [];
  const clasificacionData = (clasificacion as any)?.data?.clasificacion || [];
  const retosData = (retos as any)?.data?.retos || [];

  const getNivelColor = (nivel: string) => {
    const colors: Record<string, string> = {
      principiante: 'bg-blue-100 text-blue-800',
      novato: 'bg-green-100 text-green-800',
      intermedio: 'bg-yellow-100 text-yellow-800',
      avanzado: 'bg-orange-100 text-orange-800',
      experto: 'bg-red-100 text-red-800',
      maestro: 'bg-purple-100 text-purple-800',
      leyenda: 'bg-indigo-100 text-indigo-800',
    };
    return colors[nivel] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      desbloqueado: 'bg-green-100 text-green-800',
      en_progreso: 'bg-blue-100 text-blue-800',
      completado: 'bg-green-100 text-green-800',
      bloqueado: 'bg-gray-100 text-gray-800',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sistema de Puntos</h1>
                <p className="text-gray-600">Gamificación y Logros</p>
              </div>
            </div>
            {perfilData && (
              <div className="text-right">
                <div className="text-4xl font-bold text-indigo-600">{perfilData.puntosActuales || 0}</div>
                <div className="text-sm text-gray-600">Puntos Disponibles</div>
              </div>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Puntos */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Puntos Totales</p>
                  <p className="text-2xl font-bold text-indigo-600">{perfilData?.puntosActuales || 0}</p>
                </div>
                <Zap className="w-12 h-12 text-indigo-100 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Nivel Actual */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nivel Actual</p>
                  <p className="text-2xl font-bold text-green-600">{perfilData?.nivelActual || 'N/A'}</p>
                </div>
                <Star className="w-12 h-12 text-green-100 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Logros Completados */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Logros</p>
                  <p className="text-2xl font-bold text-purple-600">{perfilData?.logrosCompletados?.length || 0}</p>
                </div>
                <Target className="w-12 h-12 text-purple-100 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Insignias Desbloqueadas */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Insignias</p>
                  <p className="text-2xl font-bold text-orange-600">{perfilData?.insigniasDesbloqueadas?.length || 0}</p>
                </div>
                <Badge className="h-auto w-12 h-12 flex items-center justify-center bg-orange-100 text-orange-800 opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Racha Actual */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Racha Actual</p>
                  <p className="text-2xl font-bold text-blue-600">{perfilData?.rachaActual || 0} días</p>
                </div>
                <TrendingUp className="w-12 h-12 text-blue-100 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="logros" className="bg-white rounded-lg shadow-sm border-0">
          <TabsList className="w-full justify-start border-b bg-gray-50 rounded-none rounded-t-lg p-0">
            <TabsTrigger value="logros" className="gap-2">
              <Target className="w-4 h-4" />
              Logros
            </TabsTrigger>
            <TabsTrigger value="insignias" className="gap-2">
              <Star className="w-4 h-4" />
              Insignias
            </TabsTrigger>
            <TabsTrigger value="recompensas" className="gap-2">
              <Gift className="w-4 h-4" />
              Recompensas
            </TabsTrigger>
            <TabsTrigger value="clasificacion" className="gap-2">
              <Users className="w-4 h-4" />
              Clasificación
            </TabsTrigger>
            <TabsTrigger value="retos" className="gap-2">
              <Zap className="w-4 h-4" />
              Retos
            </TabsTrigger>
          </TabsList>

          {/* Tab: Logros */}
          <TabsContent value="logros" className="p-6 space-y-4">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Buscar logros..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="flex-1"
              />
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nuevo
              </Button>
            </div>

            {logrosData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No hay logros disponibles
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {logrosData.map((logro: any) => (
                  <Card key={logro.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{logro.nombre}</h4>
                          <p className="text-sm text-gray-600 mt-1">{logro.descripcion}</p>
                        </div>
                        <span className="text-2xl">{logro.icono}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge className={getEstadoColor(logro.estado)}>{logro.estado}</Badge>
                        <Badge variant="outline" className="text-xs">
                          {logro.puntosRecompensa} pts
                        </Badge>
                      </div>
                      <div className="bg-gray-100 rounded-full h-2 mb-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${logro.progreso || 0}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600">{logro.progreso || 0}% Completado</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Insignias */}
          <TabsContent value="insignias" className="p-6 space-y-4">
            {insigniasData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No hay insignias disponibles
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {insigniasData.map((insignia: any) => (
                  <Card
                    key={insignia.id}
                    className={`border-2 hover:shadow-lg transition-all ${
                      insignia.desbloquead ? 'border-indigo-200' : 'border-gray-200 opacity-60'
                    }`}
                  >
                    <CardContent className="p-6 text-center">
                      <span className="text-4xl block mb-3">{insignia.icono}</span>
                      <h4 className="font-semibold text-gray-900 mb-1">{insignia.nombre}</h4>
                      <Badge className={`mb-2 ${insignia.nivel === 'oro' ? 'bg-yellow-500' : insignia.nivel === 'plata' ? 'bg-gray-400' : insignia.nivel === 'diamante' ? 'bg-cyan-400' : 'bg-orange-600'}`}>
                        {insignia.nivel}
                      </Badge>
                      {insignia.desbloquead && (
                        <p className="text-xs text-green-600 mt-2">✓ Desbloqueada</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Recompensas */}
          <TabsContent value="recompensas" className="p-6 space-y-4">
            {recompensasData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No hay recompensas disponibles
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recompensasData.map((recompensa: any) => (
                  <Card key={recompensa.id} className="border-purple-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{recompensa.nombre}</h4>
                          <p className="text-sm text-gray-600 mt-1">{recompensa.descripcion}</p>
                        </div>
                        <Gift className="w-6 h-6 text-purple-500" />
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline">{recompensa.costoPuntos} pts</Badge>
                        <Badge className={recompensa.estado === 'disponible' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {recompensa.estado}
                        </Badge>
                      </div>
                      <Button className="w-full" disabled={recompensa.estado !== 'disponible'}>
                        Canjear
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Clasificación */}
          <TabsContent value="clasificacion" className="p-6 space-y-4">
            <div className="flex gap-2 mb-4">
              <select
                value={periodoClasificacion}
                onChange={(e) => setPeriodoClasificacion(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="semanal">Semanal</option>
                <option value="mensual">Mensual</option>
                <option value="trimestral">Trimestral</option>
                <option value="anual">Anual</option>
                <option value="todo_tiempo">Todo Tiempo</option>
              </select>
            </div>

            {clasificacionData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No hay datos de clasificación
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {clasificacionData.slice(0, 10).map((item: any, index: number) => (
                  <Card
                    key={item.id}
                    className={index === 0 ? 'border-l-4 border-l-yellow-500' : index === 1 ? 'border-l-4 border-l-gray-400' : index === 2 ? 'border-l-4 border-l-orange-500' : ''}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-gray-400 w-8 text-center">{index + 1}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{item.nombreUsuario}</p>
                          <Badge className={getNivelColor(item.nivelActual)}>{item.nivelActual}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-indigo-600">{item.puntosEstaSemanMes}</p>
                          <p className="text-xs text-gray-600">puntos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Retos */}
          <TabsContent value="retos" className="p-6 space-y-4">
            {retosData.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No hay retos disponibles
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {retosData.map((reto: any) => (
                  <Card key={reto.id} className="border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{reto.nombre}</h4>
                            <Badge
                              variant={reto.estado === 'activo' ? 'default' : 'outline'}
                              className="text-xs"
                            >
                              {reto.estado}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{reto.descripcion}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>🎯 {reto.dificultad}</span>
                            <span>👥 {reto.participantes} participantes</span>
                            {reto.puntosBonus && <span>⭐ {reto.puntosBonus} pts bonus</span>}
                          </div>
                        </div>
                        <Button size="sm" className="gap-1">
                          <Zap className="w-3 h-3" />
                          Unirse
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
