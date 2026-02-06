import type { ElementType } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  BadgeCheck,
  Percent,
  RotateCcw,
  Star,
  Timer,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react';
import type { KPI } from '../types';

const kpiIcons: Record<string, ElementType> = {
  'Tasa conversión cotización → reserva': Percent,
  'Tasa completitud reservas': BadgeCheck,
  'Tasa cancelación': RotateCcw,
  'Tiempo promedio entrega': Truck,
  'Tiempo resolución daños': Wrench,
  'Revenue per cliente': Wallet,
  'Utilización activos %': Activity,
  'ROI activos': TrendingUp,
  'Margen contribución': TrendingUp,
  'Tasa retención clientes': Users,
  'Satisfacción cliente': Star,
  'Índice rotación inventario': Timer,
};

const getEstadoColor = (estado?: string) => {
  switch (estado) {
    case 'bueno':
      return 'bg-green-100 text-green-800';
    case 'alerta':
      return 'bg-yellow-100 text-yellow-800';
    case 'critico':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface KPIsPanelProps {
  kpis: KPI[];
}

export const KPIsPanel = ({ kpis }: KPIsPanelProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpiIcons[kpi.nombre] ?? Activity;
        return (
          <Card key={kpi.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{kpi.nombre}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {kpi.valor.toLocaleString('es-CO')}
                    {kpi.unidad ? ` ${kpi.unidad}` : ''}
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-lg opacity-80">
                  <Icon className="w-5 h-5 text-indigo-700" />
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <Badge className={getEstadoColor(kpi.estado)}>{kpi.estado ?? 'N/A'}</Badge>
                {typeof kpi.cambioPorcentual === 'number' && (
                  <span className="text-gray-500">{kpi.cambioPorcentual.toFixed(1)}%</span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
