import { Card, CardContent } from '@/components/ui/card';
import type { DistribucionGeografica } from '../types';

interface MapaGeograficoProps {
  data: DistribucionGeografica[];
}

export const MapaGeografico = ({ data }: MapaGeograficoProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">Distribución Geográfica</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-gray-700">Ciudad</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-700">Reservas</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-700">Ingresos</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-700">Clientes</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.ciudad} className="border-b">
                  <td className="px-3 py-2 text-gray-700">{item.ciudad}</td>
                  <td className="px-3 py-2 text-gray-700">{item.reservas}</td>
                  <td className="px-3 py-2 text-gray-700">${item.ingresos.toLocaleString('es-CO')}</td>
                  <td className="px-3 py-2 text-gray-700">{item.clientes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
