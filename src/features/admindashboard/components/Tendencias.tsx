import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { TendenciasDashboard } from '../types';

interface TendenciasProps {
  tendencias?: TendenciasDashboard;
}

export const Tendencias = ({ tendencias }: TendenciasProps) => {
  const diarias = tendencias?.diarias ?? [];
  const mensuales = tendencias?.mensuales ?? [];

  return (
    <Card>
      <CardContent className="p-4">
        <Tabs defaultValue="diarias">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="diarias">Diarias (30d)</TabsTrigger>
            <TabsTrigger value="mensuales">Mensuales (12m)</TabsTrigger>
          </TabsList>

          <TabsContent value="diarias">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={diarias}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ingresos" stroke="#4F46E5" name="Ingresos" />
                  <Line type="monotone" dataKey="reservas" stroke="#10B981" name="Reservas" />
                  <Line type="monotone" dataKey="clientes" stroke="#F59E0B" name="Clientes" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="mensuales">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mensuales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ingresos" stroke="#4F46E5" name="Ingresos" />
                  <Line type="monotone" dataKey="reservas" stroke="#10B981" name="Reservas" />
                  <Line type="monotone" dataKey="clientes" stroke="#F59E0B" name="Clientes" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
