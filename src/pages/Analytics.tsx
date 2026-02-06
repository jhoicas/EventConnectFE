import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, Download } from 'lucide-react';
import { ResumenMetricas } from '@/features/analytics/components/ResumenMetricas';
import { GraficoVentas } from '@/features/analytics/components/GraficoVentas';
import { GraficoOcupacion } from '@/features/analytics/components/GraficoOcupacion';
import { TendenciasClientes } from '@/features/analytics/components/TendenciasClientes';
import { AnalyticsFilters } from '@/features/analytics/components/AnalyticsFilters';
import {
  useResumenAnalytics,
  useVentasAnalytics,
  useOcupacionAnalytics,
  useTendenciasClientesAnalytics,
} from '@/features/analytics/hooks/useAnalytics';
import type { PeriodoAnalytics, FiltrosAnalytics } from '@/features/analytics/types';

const AnalyticsPage = () => {
  const [periodo, setPeriodo] = useState<PeriodoAnalytics>('mes');
  const [filtros, setFiltros] = useState<FiltrosAnalytics>({ periodo });

  const { data: resumen, isLoading: loadingResumen } = useResumenAnalytics(filtros);
  const { data: ventas, isLoading: loadingVentas } = useVentasAnalytics(filtros);
  const { data: ocupacion, isLoading: loadingOcupacion } = useOcupacionAnalytics(filtros);
  const { data: tendencias, isLoading: loadingTendencias } = useTendenciasClientesAnalytics(
    filtros
  );

  const handlePeriodoChange = (nuevoPeriodo: PeriodoAnalytics) => {
    setPeriodo(nuevoPeriodo);
    setFiltros({ ...filtros, periodo: nuevoPeriodo });
  };

  const handleFechasChange = (inicio: string, fin: string) => {
    setFiltros({
      ...filtros,
      periodo: 'personalizado',
      fecha_inicio: inicio,
      fecha_fin: fin,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Analytics & Reportes</h1>
          </div>
          <p className="text-gray-600">
            Dashboard empresarial con métricas de negocio, ventas, ocupación y análisis de clientes.
          </p>
        </div>

        {/* Filtros */}
        <AnalyticsFilters
          periodo={periodo}
          onPeriodoChange={handlePeriodoChange}
          onFechasChange={handleFechasChange}
        />

        {/* Botón de exportar */}
        <div className="mb-6 flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium">
            <Download className="w-4 h-4" />
            Descargar Reporte
          </button>
        </div>

        {/* Tabs principales */}
        <Tabs defaultValue="resumen" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="resumen" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="ventas" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Ventas</span>
            </TabsTrigger>
            <TabsTrigger value="ocupacion" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Ocupación</span>
            </TabsTrigger>
            <TabsTrigger value="clientes" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Clientes</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Resumen */}
          <TabsContent value="resumen" className="space-y-6">
            {resumen ? (
              <ResumenMetricas metricas={resumen} isLoading={loadingResumen} />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">Cargando resumen...</p>
              </div>
            )}
          </TabsContent>

          {/* Tab: Ventas */}
          <TabsContent value="ventas" className="space-y-6">
            {ventas ? (
              <GraficoVentas datos={ventas} isLoading={loadingVentas} />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">Cargando datos de ventas...</p>
              </div>
            )}
          </TabsContent>

          {/* Tab: Ocupación */}
          <TabsContent value="ocupacion" className="space-y-6">
            {ocupacion ? (
              <GraficoOcupacion datos={ocupacion} isLoading={loadingOcupacion} />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">Cargando datos de ocupación...</p>
              </div>
            )}
          </TabsContent>

          {/* Tab: Clientes */}
          <TabsContent value="clientes" className="space-y-6">
            {tendencias ? (
              <TendenciasClientes datos={tendencias} isLoading={loadingTendencias} />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">Cargando análisis de clientes...</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <p>
            <strong>Nota:</strong> Los datos se actualizan automáticamente cada minuto. Los gráficos
            muestran información del período seleccionado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
