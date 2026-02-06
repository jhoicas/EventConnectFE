import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import {
  useMetricasDashboard,
  useRentabilidad,
  useTendencias,
  useKpis,
  useTopActivos,
  useTopClientes,
  useDistribucionEstados,
  useDistribucionGeografica,
  useComportamientoClientes,
  useRentabilidadCategoria,
} from '@/features/admindashboard/hooks/useAdminDashboard';
import { DashboardHome } from '@/features/admindashboard/components/DashboardHome';
import { ReporteRentabilidadPanel } from '@/features/admindashboard/components/ReporteRentabilidad';
import { Tendencias } from '@/features/admindashboard/components/Tendencias';
import { KPIsPanel } from '@/features/admindashboard/components/KPIsPanel';
import { TopActivos } from '@/features/admindashboard/components/TopActivos';
import { TopClientes } from '@/features/admindashboard/components/TopClientes';
import { DistribucionEstados } from '@/features/admindashboard/components/DistribucionEstados';
import { MapaGeografico } from '@/features/admindashboard/components/MapaGeografico';
import { ComportamientoClientes } from '@/features/admindashboard/components/ComportamientoClientes';
import { RentabilidadCategoriaChart } from '@/features/admindashboard/components/RentabilidadCategoria';

const defaultStart = new Date(new Date().setDate(new Date().getDate() - 30));
const defaultEnd = new Date();

export const AdminAnalyticsDashboardPage = () => {
  const [fechaInicio, setFechaInicio] = useState<Date>(defaultStart);
  const [fechaFin, setFechaFin] = useState<Date>(defaultEnd);
  const [segmento, setSegmento] = useState('ALL');

  const { data: metricasResponse } = useMetricasDashboard();
  const { data: rentabilidadResponse } = useRentabilidad(
    fechaInicio.toISOString().slice(0, 10),
    fechaFin.toISOString().slice(0, 10)
  );
  const { data: tendenciasResponse } = useTendencias();
  const { data: kpisResponse } = useKpis();
  const { data: topActivosResponse } = useTopActivos(10);
  const { data: topClientesResponse } = useTopClientes(10);
  const { data: estadosResponse } = useDistribucionEstados();
  const { data: geograficaResponse } = useDistribucionGeografica();
  const { data: comportamientoResponse } = useComportamientoClientes(segmento === 'ALL' ? undefined : segmento);
  const { data: rentabilidadCategoriaResponse } = useRentabilidadCategoria();

  const metricas = metricasResponse?.data;
  const rentabilidad = rentabilidadResponse?.data;
  const tendencias = tendenciasResponse?.data;
  const kpis = kpisResponse?.data ?? [];
  const topActivos = topActivosResponse?.data ?? [];
  const topClientes = topClientesResponse?.data ?? [];
  const estados = estadosResponse?.data ?? [];
  const geografica = geograficaResponse?.data ?? [];
  const comportamiento = comportamientoResponse?.data ?? [];
  const rentabilidadCategoria = rentabilidadCategoriaResponse?.data ?? [];

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    if (metricas) {
      const metricasSheet = XLSX.utils.json_to_sheet([
        { nombre: 'Ingresos', valor: metricas.ingresos.valor, cambio: metricas.ingresos.cambioPorcentual },
        { nombre: 'Reservas', valor: metricas.reservas.valor, cambio: metricas.reservas.cambioPorcentual },
        { nombre: 'Clientes', valor: metricas.clientes.valor, cambio: metricas.clientes.cambioPorcentual },
        { nombre: 'Activos', valor: metricas.activos.valor, cambio: metricas.activos.cambioPorcentual },
        { nombre: 'Alertas', valor: metricas.alertas.valor, cambio: metricas.alertas.cambioPorcentual },
      ]);
      XLSX.utils.book_append_sheet(wb, metricasSheet, 'Metricas');
    }
    if (kpis.length) {
      const kpisSheet = XLSX.utils.json_to_sheet(kpis);
      XLSX.utils.book_append_sheet(wb, kpisSheet, 'KPIs');
    }
    if (topActivos.length) {
      const activosSheet = XLSX.utils.json_to_sheet(topActivos);
      XLSX.utils.book_append_sheet(wb, activosSheet, 'TopActivos');
    }
    if (topClientes.length) {
      const clientesSheet = XLSX.utils.json_to_sheet(topClientes);
      XLSX.utils.book_append_sheet(wb, clientesSheet, 'TopClientes');
    }

    XLSX.writeFile(wb, 'dashboard-analitica.xlsx');
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Dashboard de Analítica - Resumen', 14, 20);
    doc.setFontSize(12);
    if (metricas) {
      doc.text(`Ingresos: ${metricas.ingresos.valor.toLocaleString('es-CO')}`, 14, 35);
      doc.text(`Reservas: ${metricas.reservas.valor.toLocaleString('es-CO')}`, 14, 43);
      doc.text(`Clientes: ${metricas.clientes.valor.toLocaleString('es-CO')}`, 14, 51);
      doc.text(`Activos: ${metricas.activos.valor.toLocaleString('es-CO')}`, 14, 59);
    }
    doc.text(`KPIs: ${kpis.length}`, 14, 70);
    doc.text(`Top Activos: ${topActivos.length}`, 14, 78);
    doc.text(`Top Clientes: ${topClientes.length}`, 14, 86);
    doc.save('dashboard-analitica.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Analítica</h1>
            <p className="text-indigo-100 mt-1">Vista avanzada para Admin y SuperAdmin</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportExcel} className="bg-white text-indigo-600 hover:bg-indigo-50">
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button onClick={handleExportPdf} variant="outline" className="border-white text-white">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs">
          <Badge className="bg-white/20 text-white">Actualización cada 5 min</Badge>
          <Badge className="bg-white/20 text-white">Comparación mensual</Badge>
          <Badge className="bg-white/20 text-white">Drill-down habilitado</Badge>
        </div>
      </div>

      <DashboardHome metricas={metricas} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Tendencias tendencias={tendencias} />
        <DistribucionEstados data={estados} />
      </div>

      <Tabs defaultValue="kpis" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="rentabilidad">Rentabilidad</TabsTrigger>
          <TabsTrigger value="top">Top Rankings</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="kpis" className="space-y-6">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold">Panel de KPIs</h2>
              </div>
              <Badge className="bg-indigo-100 text-indigo-800">12 KPIs</Badge>
            </CardContent>
          </Card>
          <KPIsPanel kpis={kpis} />
        </TabsContent>

        <TabsContent value="rentabilidad" className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtro de fechas y exportación</span>
          </div>
          <ReporteRentabilidadPanel
            data={rentabilidad}
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            onChangeFechas={(inicio, fin) => {
              setFechaInicio(inicio);
              setFechaFin(fin);
            }}
            onExportExcel={handleExportExcel}
            onExportPdf={handleExportPdf}
          />
          <RentabilidadCategoriaChart data={rentabilidadCategoria} />
        </TabsContent>

        <TabsContent value="top" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopActivos data={topActivos} />
            <TopClientes data={topClientes} />
          </div>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-6">
          <ComportamientoClientes
            data={comportamiento}
            segmento={segmento}
            onChangeSegmento={setSegmento}
          />
          <MapaGeografico data={geografica} />
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="p-4 text-sm text-gray-600">
          Este dashboard incluye filtros de rango, comparación mensual, exportación a Excel/PDF,
          gráficos interactivos y actualización automática cada 5 minutos.
        </CardContent>
      </Card>
    </div>
  );
};
