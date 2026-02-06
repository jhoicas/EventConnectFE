import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useValidarDisponibilidad } from '../hooks/useOptimizarReservas';
import { useState } from 'react';
import { AlertCircle, CheckCircle2, Calendar } from 'lucide-react';

interface ValidadorDisponibilidadProps {
  activoId: string;
}

export const ValidadorDisponibilidad = ({ activoId }: ValidadorDisponibilidadProps) => {
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [validando, setValidando] = useState(false);

  const { data: validacion } = useValidarDisponibilidad(
    activoId,
    fechaInicio,
    fechaFin
  );

  const handleValidar = () => {
    if (!fechaInicio || !fechaFin) {
      alert('Por favor selecciona ambas fechas');
      return;
    }
    setValidando(true);
  };

  const diasTotales =
    fechaInicio && fechaFin
      ? Math.ceil(
          (new Date(fechaFin).getTime() - new Date(fechaInicio).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Validador de Disponibilidad
        </CardTitle>
        <CardDescription>Verifica disponibilidad en rango de fechas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fechaInicio">Fecha Inicio</Label>
            <Input
              id="fechaInicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => {
                setFechaInicio(e.target.value);
                setValidando(false);
              }}
              className="border-blue-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fechaFin">Fecha Fin</Label>
            <Input
              id="fechaFin"
              type="date"
              value={fechaFin}
              onChange={(e) => {
                setFechaFin(e.target.value);
                setValidando(false);
              }}
              className="border-blue-200"
            />
          </div>
        </div>

        <Button
          onClick={handleValidar}
          disabled={!fechaInicio || !fechaFin}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Validar Disponibilidad
        </Button>

        {validando && validacion && (
          <div className="space-y-3">
            {validacion.disponible ? (
              <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-green-800">Disponible</p>
                  <p className="text-sm text-green-700">
                    {validacion.diasDisponibles.length} de {diasTotales} días disponibles
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-800">No Disponible</p>
                  <p className="text-sm text-red-700">{validacion.razonNoDisponibilidad}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 font-semibold">Ocupación</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${validacion.ocupacionPorcentaje}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-blue-700">
                    {validacion.ocupacionPorcentaje.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-600 font-semibold">Días Ocupados</p>
                <p className="text-2xl font-bold text-purple-700 mt-1">
                  {validacion.diasOcupados.length}
                </p>
              </div>
            </div>

            {validacion.diasOcupados.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-semibold text-amber-800 mb-2">Fechas Ocupadas:</p>
                <div className="flex flex-wrap gap-2">
                  {validacion.diasOcupados.map((fecha) => (
                    <span
                      key={fecha}
                      className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded"
                    >
                      {new Date(fecha).toLocaleDateString()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!validando && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p className="text-sm text-gray-600">Selecciona un rango de fechas para validar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
