import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useReservas } from '@/features/reservas/hooks/useReservas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Search, Plus, Loader2, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReservaCard } from './components/ReservaCard';
import { EmptyStateReservas } from './components/EmptyStateReservas';
import { NuevaReservaModal } from './components/NuevaReservaModal';

const ClienteReservasPage = () => {
  const { user } = useAuthStore();
  const { data: reservas = [], isLoading } = useReservas();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todas');
  const [showNewReservaModal, setShowNewReservaModal] = useState(false);

  // Filtrar reservas del cliente actual
  const reservasCliente = reservas.filter(
    (reserva) => reserva.cliente_Id === user?.id
  );

  // Aplicar filtros de búsqueda y estado
  const reservasFiltradas = reservasCliente.filter((reserva) => {
    const matchSearch =
      reserva.codigo_Reserva.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.direccion_Entrega?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.ciudad_Entrega?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchEstado =
      filterEstado === 'todas' || reserva.estado === filterEstado;

    return matchSearch && matchEstado;
  });

  const handleReservaClick = (reserva: any) => {
    // Aquí puedes abrir un modal con los detalles completos de la reserva
    console.log('Ver detalles de reserva:', reserva);
  };

  const handleReservaCreated = () => {
    // Se muestra automáticamente por el refetch de React Query
    alert('¡Reserva creada exitosamente!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-8 w-8 text-indigo-600" />
            Mis Reservas
          </h1>
          <p className="text-muted-foreground mt-1">
            {reservasCliente.length > 0
              ? `Tienes ${reservasCliente.length} reserva${reservasCliente.length !== 1 ? 's' : ''}`
              : 'Consulta y gestiona tus reservas'}
          </p>
        </div>

        {reservasCliente.length > 0 && (
          <Button
            onClick={() => setShowNewReservaModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva Reserva
          </Button>
        )}
      </div>

      {reservasCliente.length === 0 ? (
        <EmptyStateReservas onCreateReserva={() => setShowNewReservaModal(true)} />
      ) : (
        <>
          {/* Filtros y búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código, dirección o ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Confirmada">Confirmada</SelectItem>
                <SelectItem value="En Proceso">En Proceso</SelectItem>
                <SelectItem value="Completada">Completada</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de reservas */}
          {reservasFiltradas.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron reservas</h3>
              <p className="text-muted-foreground">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reservasFiltradas.map((reserva) => (
                <ReservaCard
                  key={reserva.id}
                  reserva={reserva}
                  onClick={() => handleReservaClick(reserva)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal para nueva reserva */}
      <NuevaReservaModal
        open={showNewReservaModal}
        onOpenChange={setShowNewReservaModal}
        onSuccess={handleReservaCreated}
      />
    </div>
  );
};

export default ClienteReservasPage;
