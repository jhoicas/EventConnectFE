import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ComportamientoSegmento } from '../types';

interface ComportamientoClientesProps {
  data: ComportamientoSegmento[];
  segmento: string;
  onChangeSegmento: (segmento: string) => void;
}

const segmentColors: Record<string, string> = {
  VIP: 'bg-purple-100 text-purple-800',
  Frecuente: 'bg-blue-100 text-blue-800',
  Ocasional: 'bg-yellow-100 text-yellow-800',
  Nuevo: 'bg-green-100 text-green-800',
};

export const ComportamientoClientes = ({
  data,
  segmento,
  onChangeSegmento,
}: ComportamientoClientesProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Comportamiento de Clientes</h3>
          <Select value={segmento} onValueChange={onChangeSegmento}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Segmento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
              <SelectItem value="Frecuente">Frecuente</SelectItem>
              <SelectItem value="Ocasional">Ocasional</SelectItem>
              <SelectItem value="Nuevo">Nuevo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {data.map((item) => (
            <div key={item.segmento} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <Badge className={segmentColors[item.segmento] ?? 'bg-gray-100 text-gray-800'}>
                  {item.segmento}
                </Badge>
                <span className="text-xs text-gray-500">{item.clientes} clientes</span>
              </div>
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p>Ingresos: ${item.ingresos.toLocaleString('es-CO')}</p>
                <p>Ticket Prom.: ${item.ticketPromedio.toLocaleString('es-CO')}</p>
                <p>Retención: {item.retencion.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
