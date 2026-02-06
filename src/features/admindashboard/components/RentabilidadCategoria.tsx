import { Card, CardContent } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { RentabilidadCategoria } from '../types';

interface RentabilidadCategoriaProps {
  data: RentabilidadCategoria[];
}

export const RentabilidadCategoriaChart = ({ data }: RentabilidadCategoriaProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">Ingresos por Categoría</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ingresos" fill="#4F46E5" name="Ingresos" />
              <Bar dataKey="margen" fill="#10B981" name="Margen" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
