import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Search, Star } from 'lucide-react';
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
import { ClienteForm } from '@/features/clientes/components/ClienteForm';
import {
  useClientes,
  useDeleteCliente,
} from '@/features/clientes/hooks/useClientes';
import type { Cliente } from '@/types';

const ClientesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | undefined>();

  const { data: clientes = [], isLoading, error } = useClientes();
  const deleteCliente = useDeleteCliente();

  // Filtrado y búsqueda
  const filteredClientes = useMemo(() => {
    let filtered = clientes;

    // Búsqueda por nombre, documento o email
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().includes(term) ||
          cliente.documento.toLowerCase().includes(term) ||
          cliente.email?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [clientes, searchTerm]);

  const handleCreate = () => {
    setSelectedCliente(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setIsFormOpen(true);
  };

  const handleDelete = async (cliente: Cliente) => {
    if (
      window.confirm(
        `¿Está seguro de eliminar el cliente ${cliente.nombre}?\nEsta acción no se puede deshacer.`
      )
    ) {
      try {
        await deleteCliente.mutateAsync(cliente.id);
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        alert('Error al eliminar el cliente. Por favor, intente nuevamente.');
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedCliente(undefined);
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'inactivo':
        return 'bg-red-100 text-red-800';
      case 'suspendido':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Stats
  const stats = useMemo(() => {
    return {
      total: clientes.length,
      personas: clientes.filter((c) => c.tipo_Cliente === 'Persona').length,
      empresas: clientes.filter((c) => c.tipo_Cliente === 'Empresa').length,
      activos: clientes.filter((c) => c.estado.toLowerCase() === 'activo').length,
    };
  }, [clientes]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona tu cartera de clientes
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, documento o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Total Clientes</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Personas</p>
          <p className="text-2xl font-bold">{stats.personas}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Empresas</p>
          <p className="text-2xl font-bold">{stats.empresas}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Activos</p>
          <p className="text-2xl font-bold">{stats.activos}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Cargando clientes...</p>
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-red-500">Error al cargar los clientes. Por favor, intente nuevamente.</p>
          </div>
        ) : filteredClientes.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">
              {searchTerm
                ? 'No se encontraron clientes que coincidan con la búsqueda'
                : 'No hay clientes registrados'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        cliente.tipo_Cliente === 'Empresa'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {cliente.tipo_Cliente}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{cliente.nombre}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        {cliente.tipo_Documento}
                      </span>
                      <span>{cliente.documento}</span>
                    </div>
                  </TableCell>
                  <TableCell>{cliente.email || '-'}</TableCell>
                  <TableCell>{cliente.telefono || '-'}</TableCell>
                  <TableCell>{cliente.ciudad || '-'}</TableCell>
                  <TableCell>{renderStars(cliente.rating || 0)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getEstadoBadgeColor(
                        cliente.estado
                      )}`}
                    >
                      {cliente.estado}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(cliente)}
                        title="Editar cliente"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(cliente)}
                        title="Eliminar cliente"
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
      <ClienteForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        cliente={selectedCliente}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default ClientesPage;
