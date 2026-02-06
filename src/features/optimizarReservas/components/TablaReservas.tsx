import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useListarReservas, useOptimizarPrecio } from '../hooks/useOptimizarReservas';
import { Loader2, TrendingDown, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import type { EstadoReserva } from '../types';

interface TablaReservasProps {
  filtroEstado?: EstadoReserva;
}

const getEstadoColor = (estado: EstadoReserva) => {
  switch (estado) {
    case 'confirmada':
      return 'bg-green-100 text-green-800';
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelada':
      return 'bg-red-100 text-red-800';
    case 'completada':
      return 'bg-blue-100 text-blue-800';
    case 'vencida':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const TablaReservas = ({ filtroEstado }: TablaReservasProps) => {
  const { data: reservas, isLoading } = useListarReservas(filtroEstado ? { estado: filtroEstado } : undefined);
  const { mutate: optimizarPrecio, isPending } = useOptimizarPrecio();
  const [reservaOptimizando, setReservaOptimizando] = useState<string | null>(null);

  const handleOptimizar = (reservaId: string) => {
    setReservaOptimizando(reservaId);
    optimizarPrecio(reservaId, {
      onSuccess: () => {
        setReservaOptimizando(null);
      },
      onError: () => {
        setReservaOptimizando(null);
      },
    });
  };

  if (isLoading) {
    return (
      <Card className="border-emerald-200">
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Tabla de Reservas
        </CardTitle>
        <CardDescription>Listado de reservas y opciones de optimización</CardDescription>
      </CardHeader>
      <CardContent>
        {!reservas || reservas.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No hay reservas disponibles</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Cliente</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Fechas</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Precio Base</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Precio Final</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Estado</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reservas.map((reserva) => (
                  <tr key={reserva.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      {reserva.id.substring(0, 8)}...
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{reserva.contacto}</p>
                        <p className="text-xs text-gray-500">{reserva.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="flex flex-col">
                        <span>{new Date(reserva.fechaInicio).toLocaleDateString()}</span>
                        <span className="text-xs text-gray-500">
                          {reserva.diasReservados} días
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">
                      ${reserva.precioBase.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-emerald-600">
                        ${reserva.precioFinal.toFixed(2)}
                      </span>
                      {reserva.optimizacion && (
                        <div className="text-xs text-green-600 font-semibold">
                          <TrendingDown className="h-3 w-3 inline mr-1" />
                          ${reserva.optimizacion.ahorro.toFixed(2)} ahorrado
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge className={getEstadoColor(reserva.estado)}>
                        {reserva.estado}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOptimizar(reserva.id)}
                        disabled={isPending && reservaOptimizando === reserva.id}
                        className="border-emerald-200 hover:bg-emerald-50"
                      >
                        {isPending && reservaOptimizando === reserva.id ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Optimizando...
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-3 w-3 mr-1" />
                            Optimizar
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
