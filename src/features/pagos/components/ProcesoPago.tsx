import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useProcesarTransaccion, useObtenerTransaccion } from '../hooks/usePagos';
import { AlertCircle, CheckCircle2, Clock, Loader2, RefreshCw } from 'lucide-react';
import type { MetodoPago } from '../types';

interface ProcesoPagoProps {
  transaccionId: string;
}

export const ProcesoPago = ({ transaccionId }: ProcesoPagoProps) => {
  const { data: transaccion, isLoading } = useObtenerTransaccion(transaccionId);
  const { mutate: procesar, isPending } = useProcesarTransaccion(transaccionId);
  const [metodo, setMetodo] = useState<MetodoPago>('tarjeta');
  const [tarjeta, setTarjeta] = useState('');
  const [cvv, setCvv] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [error, setError] = useState('');
  const [confirmacion, setConfirmacion] = useState(false);

  const handleProcesar = () => {
    if (!tarjeta || tarjeta.length < 13) {
      setError('Número de tarjeta inválido');
      return;
    }
    if (!cvv || cvv.length < 3) {
      setError('CVV inválido');
      return;
    }
    procesar(undefined, {
      onSuccess: () => {
        setConfirmacion(true);
        setError('');
        setTimeout(() => setConfirmacion(false), 5000);
      },
      onError: (err: any) => {
        setError(err.response?.data?.mensaje || 'Error al procesar pago');
      },
    });
  };

  if (isLoading) {
    return (
      <Card className="border-blue-200">
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          💳 Proceso de Pago
        </CardTitle>
        <CardDescription>Procesa el pago de la reserva de forma segura</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {transaccion && (
          <>
            <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="text-sm text-blue-600">Monto a Pagar</p>
                <p className="text-2xl font-bold text-blue-900">${transaccion.monto.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Moneda</p>
                <p className="text-2xl font-bold text-blue-900">{transaccion.moneda}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Método de Pago</Label>
              <Select value={metodo} onValueChange={(v) => setMetodo(v as MetodoPago)}>
                <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                <option value="paypal">PayPal</option>
                <option value="transferencia">Transferencia Bancaria</option>
                <option value="stripe">Stripe</option>
              </Select>
            </div>

            {metodo === 'tarjeta' && (
              <>
                <div className="space-y-2">
                  <Label>Número de Tarjeta</Label>
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={tarjeta}
                    onChange={(e) => {
                      setTarjeta(e.target.value.replace(/\s/g, ''));
                      setError('');
                    }}
                    maxLength={19}
                    className="border-blue-200 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vencimiento (MM/YY)</Label>
                    <Input
                      type="text"
                      placeholder="12/25"
                      value={vencimiento}
                      onChange={(e) => setVencimiento(e.target.value)}
                      maxLength={5}
                      className="border-blue-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CVV</Label>
                    <Input
                      type="password"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={4}
                      className="border-blue-200"
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {confirmacion && (
              <div className="flex gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-green-700">Pago procesado exitosamente</span>
              </div>
            )}

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 font-semibold mb-2">Estado Actual</p>
              <div className="flex items-center gap-2">
                {transaccion.estado === 'completado' && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
                {transaccion.estado === 'procesando' && (
                  <Clock className="h-4 w-4 text-amber-600 animate-spin" />
                )}
                {transaccion.estado === 'fallido' && (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="capitalize font-medium">{transaccion.estado}</span>
              </div>
            </div>

            <Button
              onClick={handleProcesar}
              disabled={isPending || transaccion.estado === 'completado'}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Procesar Pago
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
