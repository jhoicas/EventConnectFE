import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActualizarConfiguracion, useObtenerConfiguracion } from '../hooks/useOptimizarReservas';
import type { TipoPricingDinamico } from '../types';
import { AlertCircle, Check, Loader2 } from 'lucide-react';

interface ConfiguradorPreciosProps {
  activoId: string;
}

export const ConfiguradorPrecios = ({ activoId }: ConfiguradorPreciosProps) => {
  const { data: config, isLoading } = useObtenerConfiguracion(activoId);
  const { mutate: actualizar, isPending } = useActualizarConfiguracion(activoId);

  const [precioBase, setPrecioBase] = useState<number>(config?.precioBase || 0);
  const [precioMinimo, setPrecioMinimo] = useState<number>(config?.precioMinimo || 0);
  const [precioMaximo, setPrecioMaximo] = useState<number>(config?.precioMaximo || 0);
  const [tipo, setTipo] = useState<TipoPricingDinamico>((config?.tipo || 'fijo') as TipoPricingDinamico);
  const [error, setError] = useState<string>('');
  const [exitoso, setExitoso] = useState(false);

  const handleGuardar = () => {
    if (precioBase <= 0) {
      setError('El precio base debe ser mayor a 0');
      return;
    }
    if (precioMinimo > 0 && precioMinimo > precioBase) {
      setError('El precio mínimo no puede ser mayor al precio base');
      return;
    }
    if (precioMaximo > 0 && precioMaximo < precioBase) {
      setError('El precio máximo no puede ser menor al precio base');
      return;
    }

    actualizar(
      {
        precioBase,
        precioMinimo: precioMinimo || undefined,
        precioMaximo: precioMaximo || undefined,
        tipo,
        activo: true,
      },
      {
        onSuccess: () => {
          setExitoso(true);
          setError('');
          setTimeout(() => setExitoso(false), 3000);
        },
        onError: (err: any) => {
          setError(err.response?.data?.mensaje || 'Error al guardar configuración');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Card className="border-indigo-200 bg-indigo-50">
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
          ⚙️ Configurador de Precios Dinámicos
        </CardTitle>
        <CardDescription>Configura reglas de precios automáticas para este activo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Pricing</Label>
            <Select value={tipo} onValueChange={(val) => setTipo(val as TipoPricingDinamico)}>
              <option value="fijo">Precio Fijo</option>
              <option value="porcentaje">Ajuste por Porcentaje</option>
              <option value="escala">Escala de Volumen</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="precioBase">Precio Base ($)</Label>
            <Input
              id="precioBase"
              type="number"
              min="0"
              step="0.01"
              value={precioBase}
              onChange={(e) => setPrecioBase(parseFloat(e.target.value))}
              className="border-indigo-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="precioMinimo">Precio Mínimo ($) (opcional)</Label>
            <Input
              id="precioMinimo"
              type="number"
              min="0"
              step="0.01"
              value={precioMinimo}
              onChange={(e) => setPrecioMinimo(parseFloat(e.target.value))}
              className="border-indigo-200"
              placeholder="Sin límite"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="precioMaximo">Precio Máximo ($) (opcional)</Label>
            <Input
              id="precioMaximo"
              type="number"
              min="0"
              step="0.01"
              value={precioMaximo}
              onChange={(e) => setPrecioMaximo(parseFloat(e.target.value))}
              className="border-indigo-200"
              placeholder="Sin límite"
            />
          </div>
        </div>

        {error && (
          <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {exitoso && (
          <div className="flex gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">Configuración guardada correctamente</span>
          </div>
        )}

        <Button
          onClick={handleGuardar}
          disabled={isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar Configuración'
          )}
        </Button>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 font-semibold mb-2">Información de la Configuración:</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-2 bg-gray-50 rounded">
              <p className="text-gray-600">Tipo Activo</p>
              <p className="font-semibold text-gray-900">{tipo}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p className="text-gray-600">Estado</p>
              <p className="font-semibold text-green-600">Activo</p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p className="text-gray-600">Creado</p>
              <p className="font-semibold text-gray-900">
                {config?.fechaCreacion ? new Date(config.fechaCreacion).toLocaleDateString() : '-'}
              </p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p className="text-gray-600">Actualizado</p>
              <p className="font-semibold text-gray-900">
                {config?.fechaActualizacion ? new Date(config.fechaActualizacion).toLocaleDateString() : '-'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
