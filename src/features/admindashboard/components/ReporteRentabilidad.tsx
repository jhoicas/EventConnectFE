import { useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Download } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import type { ReporteRentabilidad } from '../types';

interface ReporteRentabilidadProps {
  data?: ReporteRentabilidad;
  fechaInicio: Date;
  fechaFin: Date;
  onChangeFechas: (inicio: Date, fin: Date) => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
}

export const ReporteRentabilidadPanel = ({
  data,
  fechaInicio,
  fechaFin,
  onChangeFechas,
  onExportExcel,
  onExportPdf,
}: ReporteRentabilidadProps) => {
  const categorias = data?.porCategoria ?? [];
  const porMes = data?.porMes ?? [];

  const resumen = useMemo(() => {
    return {
      ingresos: data?.totalIngresos ?? 0,
      costos: data?.totalCostos ?? 0,
      margen: data?.margenTotal ?? 0,
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <DatePicker
                selected={fechaInicio}
                onChange={(date: Date | null) => date && onChangeFechas(date, fechaFin)}
                selectsStart
                startDate={fechaInicio}
                endDate={fechaFin}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <span className="text-gray-500">a</span>
            <div className="flex items-center gap-2">
              <DatePicker
                selected={fechaFin}
                onChange={(date: Date | null) => date && onChangeFechas(fechaInicio, date)}
                selectsEnd
                startDate={fechaInicio}
                endDate={fechaFin}
                minDate={fechaInicio}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                dateFormat="yyyy-MM-dd"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onExportExcel}>
              <Download className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
            <Button onClick={onExportPdf} className="bg-indigo-600 hover:bg-indigo-700">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Ingresos', value: resumen.ingresos },
          { label: 'Costos', value: resumen.costos },
          { label: 'Margen', value: resumen.margen },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">
                ${item.value.toLocaleString('es-CO')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Rentabilidad por Categoría</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorias}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#4F46E5" name="Ingresos" />
                  <Bar dataKey="costos" fill="#EF4444" name="Costos" />
                  <Bar dataKey="margen" fill="#10B981" name="Margen" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Rentabilidad Mensual</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={porMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ingresos" stroke="#4F46E5" name="Ingresos" />
                  <Line type="monotone" dataKey="costos" stroke="#EF4444" name="Costos" />
                  <Line type="monotone" dataKey="margen" stroke="#10B981" name="Margen" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
