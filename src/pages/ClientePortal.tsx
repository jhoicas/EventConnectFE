import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, ShoppingCart, ClipboardList, FileText, DollarSign, Search } from 'lucide-react';
import { ClienteDashboard } from '@/features/cliente-portal/components/ClienteDashboard';
import { MisReservas } from '@/features/cliente-portal/components/MisReservas';
import { SeguimientoReserva } from '@/features/cliente-portal/components/SeguimientoReserva';
import { CrearReserva } from '@/features/cliente-portal/components/CrearReserva';
import { VerificarDisponibilidad } from '@/features/cliente-portal/components/VerificarDisponibilidad';
import { MisCotizaciones } from '@/features/cliente-portal/components/MisCotizaciones';
import { HistorialPagos } from '@/features/cliente-portal/components/HistorialPagos';

export default function ClientePortal() {
  const [selectedReservaId, setSelectedReservaId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleSelectReserva = (reservaId: number) => {
    setSelectedReservaId(reservaId);
  };

  const handleBackFromSeguimiento = () => {
    setSelectedReservaId(null);
  };

  // Si se seleccionó una reserva, mostrar seguimiento
  if (selectedReservaId) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBackFromSeguimiento}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            ← Volver a Mis Reservas
          </button>
        </div>
        <SeguimientoReserva reservaId={selectedReservaId} onBack={handleBackFromSeguimiento} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Portal del Cliente</h1>
        <p className="text-blue-100">Administra tus reservas, cotizaciones y pagos</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Mi Portal</span>
          </TabsTrigger>
          <TabsTrigger value="reservas" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Mis Reservas</span>
          </TabsTrigger>
          <TabsTrigger value="crear" className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Reserva</span>
          </TabsTrigger>
          <TabsTrigger value="cotizaciones" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Cotizaciones</span>
          </TabsTrigger>
          <TabsTrigger value="pagos" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">Pagos</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <ClienteDashboard />
        </TabsContent>

        {/* Mis Reservas Tab */}
        <TabsContent value="reservas" className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Mis Reservas</h2>
            <MisReservas onSelectReserva={handleSelectReserva} />
          </div>
        </TabsContent>

        {/* Crear Reserva Tab */}
        <TabsContent value="crear" className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Crear Nueva Reserva</h2>
            
            {/* Verificador de Disponibilidad Quick */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-5 h-5 text-blue-600" />
                <p className="font-semibold text-blue-900">Verifica disponibilidad antes de reservar</p>
              </div>
              <VerificarDisponibilidad />
            </div>

            {/* Formulario de Creación */}
            <div className="border-t border-slate-200 pt-6">
              <CrearReserva
                onSuccess={() => {
                  alert('¡Reserva creada exitosamente!');
                  setActiveTab('reservas');
                }}
                onCancel={() => setActiveTab('dashboard')}
              />
            </div>
          </div>
        </TabsContent>

        {/* Cotizaciones Tab */}
        <TabsContent value="cotizaciones" className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <MisCotizaciones />
          </div>
        </TabsContent>

        {/* Pagos Tab */}
        <TabsContent value="pagos" className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Historial de Pagos</h2>
            <HistorialPagos />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
