import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, BarChart3, Calendar, Bell, RotateCw } from 'lucide-react';
import { AlertasDashboard } from '@/features/alertas/components/AlertasDashboard';
import { AlertasTable } from '@/features/alertas/components/AlertasTable';
import { AlertasCalendar } from '@/features/alertas/components/AlertasCalendar';
import { AlertasNotificaciones } from '@/features/alertas/components/AlertasNotificaciones';
import { AlertaDetail } from '@/features/alertas/components/AlertaDetail';
import { useGenerarAutomaticas, useLimpiarResueltas, useAlertaList } from '@/features/alertas/hooks/useAlerta';
import type { Alerta, AlertaFiltros } from '@/features/alertas/types';

export default function Alertas() {
  const [selectedAlerta, setSelectedAlerta] = useState<Alerta | null>(null);
  const [_filtros, _setFiltros] = useState<AlertaFiltros>({});
  
  const generarMutation = useGenerarAutomaticas();
  const limpiarMutation = useLimpiarResueltas();
  const { data } = useAlertaList({});

  const handleGenerarAutomaticas = async () => {
    if (!confirm('¿Generar alertas automáticas de mantenimiento y depreciación?')) return;
    await generarMutation.mutateAsync();
  };

  const handleLimpiarResueltas = async () => {
    if (!confirm('¿Eliminar alertas resueltas hace más de 30 días?')) return;
    await limpiarMutation.mutateAsync();
  };

  // Obtener estadísticas rápidas
  const stats = {
    criticas: data?.items?.filter((a: Alerta) => a.severidad === 'Critica').length || 0,
    urgentes: data?.items?.filter((a: Alerta) => a.severidad === 'Alta' && a.estado === 'Pendiente').length || 0,
    enProceso: data?.items?.filter((a: Alerta) => a.estado === 'En_Proceso').length || 0,
    total: data?.items?.length || 0,
  };

  if (selectedAlerta) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedAlerta(null)}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          ← Volver al listado
        </button>
        <AlertaDetail alerta={selectedAlerta} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
            Alertas
          </h1>
          <p className="text-slate-600 mt-1">
            Gestión centralizada de alertas de mantenimiento y depreciación
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleGenerarAutomaticas}
            disabled={generarMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
          >
            <RotateCw className="w-4 h-4" />
            Generar Automáticas
          </button>
          <button
            onClick={handleLimpiarResueltas}
            disabled={limpiarMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition disabled:opacity-50"
          >
            Limpiar Resueltas
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 text-center">
          <p className="text-sm text-red-700 font-medium">Críticas</p>
          <p className="text-3xl font-bold text-red-900 mt-1">{stats.criticas}</p>
        </div>
        <div className="bg-orange-100 border-2 border-orange-300 rounded-lg p-4 text-center">
          <p className="text-sm text-orange-700 font-medium">Urgentes</p>
          <p className="text-3xl font-bold text-orange-900 mt-1">{stats.urgentes}</p>
        </div>
        <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-700 font-medium">En Proceso</p>
          <p className="text-3xl font-bold text-blue-900 mt-1">{stats.enProceso}</p>
        </div>
        <div className="bg-slate-100 border-2 border-slate-300 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-700 font-medium">Total</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="listado" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Listado</span>
          </TabsTrigger>
          <TabsTrigger value="calendario" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Calendario</span>
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notificaciones</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <AlertasDashboard />
        </TabsContent>

        <TabsContent value="listado" className="space-y-4">
          <AlertasTable onSelectAlerta={setSelectedAlerta} />
        </TabsContent>

        <TabsContent value="calendario" className="space-y-4">
          <AlertasCalendar />
        </TabsContent>

        <TabsContent value="notificaciones" className="space-y-4">
          <AlertasNotificaciones />
        </TabsContent>
      </Tabs>
    </div>
  );
}
