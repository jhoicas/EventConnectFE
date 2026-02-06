import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useListarResenas, useMarcarBeneficioso, useMarcarPerjudicial } from '../hooks/useResenas';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import type { FiltrosResenia } from '../types';

interface ListaReseniasProps {
  filtros?: FiltrosResenia;
}

export const ListaResenas = ({ filtros }: ListaReseniasProps) => {
  const { data: resenas, isLoading } = useListarResenas(filtros);
  const { mutate: marcarBeneficioso } = useMarcarBeneficioso();
  const { mutate: marcarPerjudicial } = useMarcarPerjudicial();

  const renderEstrella = (calificacion: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < calificacion ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  if (!resenas || resenas.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No hay reseñas disponibles
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reseñas y Calificaciones</CardTitle>
        <CardDescription>{resenas.length} reseña{resenas.length !== 1 ? 's' : ''} encontrada{resenas.length !== 1 ? 's' : ''}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[700px] overflow-y-auto">
          {resenas.map((resenia) => (
            <div key={resenia.id} className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {resenia.clienteAvatar && (
                      <img
                        src={resenia.clienteAvatar}
                        alt={resenia.clienteNombre}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{resenia.clienteNombre}</h4>
                        {resenia.compraVerificada && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Compra verificada
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-1">
                          {renderEstrella(resenia.calificacion)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {new Date(resenia.createdAt).toLocaleDateString('es-CO')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className={resenia.estado === 'aprobada' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>
                    {resenia.estado}
                  </Badge>
                </div>

                {/* Título y contenido */}
                <div>
                  <h5 className="font-semibold text-gray-900">{resenia.titulo}</h5>
                  <p className="text-sm text-gray-700 mt-1">{resenia.contenido}</p>
                </div>

                {/* Aspectos */}
                {(resenia.aspectosPositivos?.length || 0) > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {resenia.aspectosPositivos?.map((aspecto) => (
                      <Badge key={aspecto} className="bg-green-50 text-green-800">
                        ✓ {aspecto}
                      </Badge>
                    ))}
                  </div>
                )}

                {(resenia.aspectosNegativos?.length || 0) > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {resenia.aspectosNegativos?.map((aspecto) => (
                      <Badge key={aspecto} className="bg-red-50 text-red-800">
                        ✗ {aspecto}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Respuesta proveedor */}
                {resenia.respuestaProveedor && (
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <h6 className="font-medium text-blue-900">{resenia.respuestaProveedor.proveedorNombre}</h6>
                    </div>
                    <p className="text-sm text-blue-800">{resenia.respuestaProveedor.contenido}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {new Date(resenia.respuestaProveedor.createdAt).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                )}

                {/* Útil / No útil */}
                <div className="flex items-center gap-4 pt-2 border-t">
                  <span className="text-xs text-gray-600">¿Te fue útil?</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => marcarBeneficioso({ resienaId: resenia.id, usuarioId: 'current-user' })}
                    className="flex items-center gap-1"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    {resenia.beneficioso}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => marcarPerjudicial({ resienaId: resenia.id, usuarioId: 'current-user' })}
                    className="flex items-center gap-1"
                  >
                    <ThumbsDown className="w-3 h-3" />
                    {resenia.perjudicial}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
