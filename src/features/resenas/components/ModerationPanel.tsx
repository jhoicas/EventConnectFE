import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useListarResenas, useAprobarResenia, useRechazarResenia, useModerarLote } from '../hooks/useResenas';
import { Check, X, Loader2, AlertCircle } from 'lucide-react';

export const ModerationPanel = () => {
  const [filtroEstado] = useState<'pendiente' | 'aprobada' | 'rechazada'>('pendiente');
  const [reseniasSeleccionadas, setReseniasSeleccionadas] = useState<string[]>([]);
  const [razonRechazo, setRazonRechazo] = useState('');
  const [reseniaPendiente, setReseniaPendiente] = useState<string | null>(null);

  const { data: resenas } = useListarResenas({
    estado: [filtroEstado],
    limite: 50,
  });

  const { mutate: aprobar, isPending: aprobando } = useAprobarResenia();
  const { mutate: rechazar, isPending: rechazando } = useRechazarResenia();
  const { mutate: moderarLote, isPending: moderandoLote } = useModerarLote();

  const handleAprobar = (resienaId: string) => {
    aprobar({ resienaId, moderadoPor: 'moderator-id' });
  };

  const handleRechazar = (resienaId: string) => {
    if (!razonRechazo) {
      alert('Debes proporcionar una razón para rechazar');
      return;
    }
    rechazar({
      resienaId,
      estado: 'rechazada',
      razonRechazo,
      moderadoPor: 'moderator-id',
    });
    setRazonRechazo('');
  };

  const handleAprobarLote = () => {
    if (reseniasSeleccionadas.length === 0) return;
    moderarLote({
      resienaIds: reseniasSeleccionadas,
      estado: 'aprobada',
      moderadoPor: 'moderator-id',
    });
    setReseniasSeleccionadas([]);
  };

  const toggleSeleccionar = (id: string) => {
    setReseniasSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const reseniaPendienteData = resenas?.find((r) => r.id === reseniaPendiente);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Lista de reseñas pendientes */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Pendientes ({resenas?.length || 0})</CardTitle>
          <CardDescription>Reseñas por revisar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
          {!resenas || resenas.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Sin reseñas pendientes</p>
          ) : (
            resenas.map((resenia) => (
              <div
                key={resenia.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  reseniaPendiente === resenia.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setReseniaPendiente(resenia.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <input
                    type="checkbox"
                    checked={reseniasSeleccionadas.includes(resenia.id)}
                    onChange={() => toggleSeleccionar(resenia.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{resenia.titulo}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{resenia.contenido}</p>
                    <p className="text-xs text-gray-500 mt-1">{resenia.clienteNombre}</p>
                  </div>
                  <div className="text-yellow-400">⭐ {resenia.calificacion}</div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Detalles y acciones */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Detalles de Reseña</CardTitle>
        </CardHeader>
        <CardContent>
          {!reseniaPendienteData ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              Selecciona una reseña para revisar
            </div>
          ) : (
            <div className="space-y-4">
              {/* Info básica */}
              <div className="space-y-2">
                <h3 className="font-bold text-lg">{reseniaPendienteData.titulo}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{reseniaPendienteData.clienteNombre}</span>
                  <span>•</span>
                  <span>⭐ {reseniaPendienteData.calificacion}/5</span>
                  {reseniaPendienteData.compraVerificada && (
                    <>
                      <span>•</span>
                      <span className="text-green-600">✓ Compra verificada</span>
                    </>
                  )}
                </div>
              </div>

              {/* Contenido */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{reseniaPendienteData.contenido}</p>
              </div>

              {/* Aspectos */}
              {(reseniaPendienteData.aspectosPositivos?.length || 0) > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Aspectos positivos:</p>
                  <div className="flex flex-wrap gap-2">
                    {reseniaPendienteData.aspectosPositivos?.map((a) => (
                      <span key={a} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        ✓ {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(reseniaPendienteData.aspectosNegativos?.length || 0) > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Aspectos negativos:</p>
                  <div className="flex flex-wrap gap-2">
                    {reseniaPendienteData.aspectosNegativos?.map((a) => (
                      <span key={a} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                        ✗ {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Razón de rechazo (si la hay) */}
              <div className="space-y-2">
                <Label>Razón de rechazo (si aplica)</Label>
                <Textarea
                  placeholder="Proporciona una razón clara para rechazar..."
                  value={razonRechazo}
                  onChange={(e) => setRazonRechazo(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => handleAprobar(reseniaPendienteData.id)}
                  disabled={aprobando}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {aprobando ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Aprobando...</>
                  ) : (
                    <><Check className="w-4 h-4 mr-2" />Aprobar</>
                  )}
                </Button>
                <Button
                  onClick={() => handleRechazar(reseniaPendienteData.id)}
                  disabled={rechazando}
                  variant="destructive"
                  className="flex-1"
                >
                  {rechazando ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Rechazando...</>
                  ) : (
                    <><X className="w-4 h-4 mr-2" />Rechazar</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acciones de lote */}
      {reseniasSeleccionadas.length > 0 && (
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm">Acciones de lote ({reseniasSeleccionadas.length} seleccionadas)</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button
              onClick={handleAprobarLote}
              disabled={moderandoLote}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {moderandoLote ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
              Aprobar todos
            </Button>
            <Button
              variant="outline"
              onClick={() => setReseniasSeleccionadas([])}
            >
              Limpiar selección
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
