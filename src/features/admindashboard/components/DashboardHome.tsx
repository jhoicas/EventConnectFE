import { Card, CardContent } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight, Bell, Box, CalendarCheck, DollarSign, Users } from 'lucide-react';
import type { MetricasGenerales } from '../types';

interface DashboardHomeProps {
  metricas?: MetricasGenerales;
}

const metricasConfig = [
  { key: 'ingresos', label: 'Ingresos', icon: DollarSign },
  { key: 'reservas', label: 'Reservas', icon: CalendarCheck },
  { key: 'clientes', label: 'Clientes', icon: Users },
  { key: 'activos', label: 'Activos', icon: Box },
  { key: 'alertas', label: 'Alertas', icon: Bell },
] as const;

export const DashboardHome = ({ metricas }: DashboardHomeProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {metricasConfig.map(({ key, label, icon: Icon }) => {
        const data = metricas ? metricas[key] : undefined;
        const cambio = data?.cambioPorcentual ?? 0;
        const isPositive = cambio >= 0;

        return (
          <Card key={key} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data?.valor?.toLocaleString('es-CO') ?? 0}
                    {data?.unidad ? ` ${data.unidad}` : ''}
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-lg opacity-80">
                  <Icon className="w-5 h-5 text-indigo-700" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs">
                <span
                  className={`inline-flex items-center gap-1 font-semibold ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(cambio).toFixed(1)}%
                </span>
                <span className="text-gray-500 ml-2">vs. mes anterior</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
