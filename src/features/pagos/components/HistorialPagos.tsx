import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useListarReembolsos, useProcesarReembolso } from '../hooks/usePagos';
import { Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const HistorialPagos = () => {
  const { data: reembolsos, isLoading } = useListarReembolsos();
  const { mutate: procesar, isPending: procesando } = useProcesarReembolso('');

  if (isLoading) {
    return (
      <Card className="border-purple-200">
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📜 Historial de Pagos y Reembolsos
        </CardTitle>
        <CardDescription>Registro de transacciones y cambios de estado</CardDescription>
      </CardHeader>
      <CardContent>
        {!reembolsos || reembolsos.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Sin historial de reembolsos</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {reembolsos.map((reembolso) => (
              <div
                key={reembolso.id}
                className="border border-purple-100 rounded-lg p-4 space-y-2 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {reembolso.estado === 'procesado' && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                      {reembolso.estado === 'pendiente' && (
                        <Clock className="h-4 w-4 text-yellow-600 animate-pulse" />
                      )}
                      {reembolso.estado === 'rechazado' && (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-semibold text-gray-900">${reembolso.monto.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{reembolso.razon}</p>
                  </div>
                  <Badge
                    className={
                      reembolso.estado === 'procesado'
                        ? 'bg-green-100 text-green-800'
                        : reembolso.estado === 'pendiente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {reembolso.estado}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-semibold">Método:</span> {reembolso.metodoPago}
                  </div>
                  <div>
                    <span className="font-semibold">Solicitado:</span>{' '}
                    {new Date(reembolso.fechaSolicitud).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-semibold">Por:</span> {reembolso.solicitadoPor}
                  </div>
                </div>

                {reembolso.estado === 'pendiente' && (
                  <Button
                    size="sm"
                    onClick={() => procesar(undefined)}
                    disabled={procesando}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-xs"
                  >
                    {procesando ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      'Procesar Reembolso'
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
