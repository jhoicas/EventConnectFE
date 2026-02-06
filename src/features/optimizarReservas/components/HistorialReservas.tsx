import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useObtenerHistorial } from '../hooks/useOptimizarReservas';
import { Loader2, TrendingDown, TrendingUp, RotateCw } from 'lucide-react';
import type { HistorialOptimizacion } from '../types';

interface HistorialReservasProps {
  reservaId: string;
}

const getAccionInfo = (accion: string) => {
  switch (accion) {
    case 'precio_actualizado':
      return { icon: TrendingDown, label: 'Precio Actualizado', color: 'bg-blue-100 text-blue-800' };
    case 'validacion_ejecutada':
      return { icon: RotateCw, label: 'Validación Ejecutada', color: 'bg-purple-100 text-purple-800' };
    case 'bulto_procesado':
      return { icon: TrendingUp, label: 'Bulto Procesado', color: 'bg-green-100 text-green-800' };
    default:
      return { icon: RotateCw, label: 'Acción', color: 'bg-gray-100 text-gray-800' };
  }
};

export const HistorialReservas = ({ reservaId }: HistorialReservasProps) => {
  const { data: historial, isLoading } = useObtenerHistorial(reservaId);

  if (isLoading) {
    return (
      <Card className="border-amber-200">
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📋 Historial de Optimizaciones
        </CardTitle>
        <CardDescription>Registro de cambios y actualizaciones de precios</CardDescription>
      </CardHeader>
      <CardContent>
        {!historial || historial.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">Sin historial de cambios aún</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {historial.map((registro: HistorialOptimizacion) => {
              const accionInfo = getAccionInfo(registro.accion);
              const Icon = accionInfo.icon;

              return (
                <div key={registro.id} className="border border-amber-100 rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <Icon className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900">
                          {accionInfo.label}
                        </p>
                        <p className="text-xs text-gray-600">
                          Por: <span className="font-medium">{registro.usuario}</span>
                        </p>
                      </div>
                    </div>
                    <Badge className={accionInfo.color}>
                      {new Date(registro.timestamp).toLocaleString()}
                    </Badge>
                  </div>

                  {registro.precioAnterior !== undefined && registro.precioNuevo !== undefined && (
                    <div className="flex items-center gap-3 ml-6 text-sm">
                      <div>
                        <span className="text-gray-600">Precio:</span>
                        <span className="ml-2 line-through text-red-500">
                          ${registro.precioAnterior.toFixed(2)}
                        </span>
                      </div>
                      <span className="text-gray-400">→</span>
                      <div>
                        <span className="ml-2 font-semibold text-green-600">
                          ${registro.precioNuevo.toFixed(2)}
                        </span>
                        <span className="ml-2 text-xs text-green-600">
                          ({((
                            ((registro.precioNuevo - registro.precioAnterior) /
                              registro.precioAnterior) *
                            100
                          ).toFixed(1))}%)
                        </span>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-700 ml-6 bg-amber-50 p-2 rounded border border-amber-100">
                    {registro.detalles}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
