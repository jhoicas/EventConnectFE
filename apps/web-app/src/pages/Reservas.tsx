import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReservaForm } from '@/features/reservas/components/ReservaForm';
import {
  useReservas,
  useDeleteReserva,
} from '@/features/reservas/hooks/useReservas';
import { useClientes } from '@/features/clientes/hooks/useClientes';
import type { Reserva } from '@/types';

const ReservasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<string>('todos');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | undefined>();

  const { data: reservas = [], isLoading, error } = useReservas();
  const { data: clientes = [] } = useClientes();
  const deleteReserva = useDeleteReserva();

  // Helper para obtener nombre de cliente
  const getClienteNombre = (clienteId: number) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente?.nombre || 'Desconocido';
  };

  // Filtrado y búsqueda
  const filteredReservas = useMemo(() => {
    let filtered = reservas;

    // Filtro por estado
    if (estadoFilter !== 'todos') {
      filtered = filtered.filter((reserva) => reserva.estado === estadoFilter);
    }

    // Búsqueda por código o cliente
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (reserva) =>
          reserva.codigo_Reserva.toLowerCase().includes(term) ||
          getClienteNombre(reserva.cliente_Id).toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [reservas, estadoFilter, searchTerm, clientes]);

  const handleCreate = () => {
    setSelectedReserva(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (reserva: Reserva) => {
    setSelectedReserva(reserva);
    setIsFormOpen(true);
  };

  const handleDelete = async (reserva: Reserva) => {
    if (
      window.confirm(
        `¿Está seguro de eliminar la reserva ${reserva.codigo_Reserva}?\nEsta acción no se puede deshacer.`
      )
    ) {
      try {
        await deleteReserva.mutateAsync(reserva.id);
      } catch (error) {
        console.error('Error al eliminar reserva:', error);
        alert('Error al eliminar la reserva. Por favor, intente nuevamente.');
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedReserva(undefined);
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmada':
        return 'bg-blue-100 text-blue-800';
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoPagoBadgeColor = (estadoPago: string) => {
    switch (estadoPago.toLowerCase()) {
      case 'pagado':
        return 'bg-green-100 text-green-800';
      case 'parcial':
        return 'bg-blue-100 text-blue-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Stats
  const stats = useMemo(() => {
    return {
      total: reservas.length,
      pendientes: reservas.filter((r) => r.estado.toLowerCase() === 'pendiente').length,
      confirmadas: reservas.filter((r) => r.estado.toLowerCase() === 'confirmada').length,
      completadas: reservas.filter((r) => r.estado.toLowerCase() === 'completada').length,
    };
  }, [reservas]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
          <p className="text-muted-foreground">
            Gestiona las reservas y eventos
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Reserva
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Total Reservas</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendientes}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Confirmadas</p>
          <p className="text-2xl font-bold text-blue-600">{stats.confirmadas}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Completadas</p>
          <p className="text-2xl font-bold text-green-600">{stats.completadas}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por código o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={estadoFilter}
          onValueChange={setEstadoFilter}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
            <SelectItem value="Confirmada">Confirmada</SelectItem>
            <SelectItem value="Completada">Completada</SelectItem>
            <SelectItem value="Cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Cargando reservas...</p>
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-red-500">Error al cargar las reservas. Por favor, intente nuevamente.</p>
          </div>
        ) : filteredReservas.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">
              {searchTerm || estadoFilter !== 'todos'
                ? 'No se encontraron reservas que coincidan con los filtros'
                : 'No hay reservas registradas'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha Evento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Estado Pago</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservas.map((reserva) => (
                <TableRow key={reserva.id}>
                  <TableCell className="font-medium">
                    {reserva.codigo_Reserva}
                  </TableCell>
                  <TableCell>{getClienteNombre(reserva.cliente_Id)}</TableCell>
                  <TableCell>{formatDate(reserva.fecha_Evento)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getEstadoBadgeColor(
                        reserva.estado
                      )}`}
                    >
                      {reserva.estado}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getEstadoPagoBadgeColor(
                        reserva.estado_Pago
                      )}`}
                    >
                      {reserva.estado_Pago}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(reserva.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(reserva)}
                        title="Editar reserva"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(reserva)}
                        title="Eliminar reserva"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Form Modal */}
      <ReservaForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        reserva={selectedReserva}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default ReservasPage;
