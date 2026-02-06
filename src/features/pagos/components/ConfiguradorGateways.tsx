import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useListarGateways, useVerificarGateway } from '../hooks/usePagos';
import { AlertCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import type { IntegracionGateway } from '../types';

export const ConfiguradorGateways = () => {
  const { data: gateways, isLoading } = useListarGateways();
  const { mutate: verificar, isPending } = useVerificarGateway();
  const [expandido, setExpandido] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleVerificar = (id: string) => {
    if (!apiKey && !expandido) {
      setError('Ingresa una API key para verificar');
      return;
    }
    verificar(id, {
      onSuccess: () => {
        setError('');
        setExpandido(null);
        setApiKey('');
      },
      onError: (err: any) => {
        setError(err.response?.data?.mensaje || 'Error al verificar gateway');
      },
    });
  };

  if (isLoading) {
    return (
      <Card className="border-indigo-200">
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-indigo-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔗 Configurador de Gateways de Pago
        </CardTitle>
        <CardDescription>Gestiona integraciones con proveedores de pago</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!gateways || gateways.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No hay gateways configurados
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gateways.map((gateway: IntegracionGateway) => (
              <div
                key={gateway.id}
                className="border border-indigo-200 rounded-lg p-4 space-y-3 hover:bg-indigo-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{gateway.nombre}</h3>
                    <p className="text-xs text-gray-600 capitalize">{gateway.tipo}</p>
                  </div>
                  <div>
                    {gateway.configurado ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-gray-600 text-xs">Comisión</span>
                    <p className="font-semibold text-gray-900">{gateway.comisionPorcentaje}%</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-gray-600 text-xs">Estado</span>
                    <p className="font-semibold text-gray-900">
                      {gateway.activo ? 'Activo' : 'Inactivo'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {gateway.monedasSoportadas.slice(0, 3).map((moneda) => (
                    <span
                      key={moneda}
                      className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded"
                    >
                      {moneda}
                    </span>
                  ))}
                  {gateway.monedasSoportadas.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                      +{gateway.monedasSoportadas.length - 3}
                    </span>
                  )}
                </div>

                {expandido === gateway.id && (
                  <div className="space-y-2 pt-2 border-t border-indigo-200">
                    <Label htmlFor={`key-${gateway.id}`}>API Key</Label>
                    <Input
                      id={`key-${gateway.id}`}
                      type="password"
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value);
                        setError('');
                      }}
                      placeholder="sk_live_..."
                      className="border-indigo-200 text-xs"
                    />
                    {error && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {error}
                      </p>
                    )}
                  </div>
                )}

                <Button
                  size="sm"
                  onClick={() => {
                    if (expandido === gateway.id) {
                      handleVerificar(gateway.id);
                    } else {
                      setExpandido(gateway.id);
                    }
                  }}
                  disabled={isPending}
                  className={
                    expandido === gateway.id
                      ? 'w-full bg-indigo-600 hover:bg-indigo-700'
                      : 'w-full border border-indigo-200 hover:bg-indigo-50 text-indigo-700'
                  }
                  variant={expandido === gateway.id ? 'default' : 'outline'}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : expandido === gateway.id ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Verificar Conexión
                    </>
                  ) : (
                    'Configurar'
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
