import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import type { TopCliente } from '../types';

interface TopClientesProps {
  data: TopCliente[];
}

const segmentColors: Record<string, string> = {
  VIP: 'bg-purple-100 text-purple-800',
  Frecuente: 'bg-blue-100 text-blue-800',
  Ocasional: 'bg-yellow-100 text-yellow-800',
  Nuevo: 'bg-green-100 text-green-800',
};

export const TopClientes = ({ data }: TopClientesProps) => {
  const topIngresos = useMemo(
    () => [...data].sort((a, b) => b.ingresos - a.ingresos).slice(0, 10),
    [data]
  );
  const topFrecuencia = useMemo(
    () => [...data].sort((a, b) => b.frecuencia - a.frecuencia).slice(0, 10),
    [data]
  );

  const renderRows = (items: TopCliente[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-3 py-2 font-semibold text-gray-700">Cliente</th>
            <th className="text-left px-3 py-2 font-semibold text-gray-700">Ingresos</th>
            <th className="text-left px-3 py-2 font-semibold text-gray-700">Frecuencia</th>
            <th className="text-left px-3 py-2 font-semibold text-gray-700">Segmento</th>
          </tr>
        </thead>
        <tbody>
          {items.map((cliente) => (
            <tr key={cliente.id} className="border-b">
              <td className="px-3 py-2 text-gray-700">{cliente.nombre}</td>
              <td className="px-3 py-2 text-gray-700">${cliente.ingresos.toLocaleString('es-CO')}</td>
              <td className="px-3 py-2 text-gray-700">{cliente.frecuencia}</td>
              <td className="px-3 py-2">
                <Badge className={segmentColors[cliente.segmento] ?? 'bg-gray-100 text-gray-800'}>
                  {cliente.segmento}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">Top Clientes</h3>
        <Tabs defaultValue="ingresos">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="ingresos">Por Ingresos</TabsTrigger>
            <TabsTrigger value="frecuencia">Por Frecuencia</TabsTrigger>
          </TabsList>
          <TabsContent value="ingresos">{renderRows(topIngresos)}</TabsContent>
          <TabsContent value="frecuencia">{renderRows(topFrecuencia)}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
