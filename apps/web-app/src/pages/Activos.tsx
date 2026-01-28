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
import { ActivoForm } from '@/features/activos/components/ActivoForm';
import {
  useActivos,
  useCreateActivo,
  useUpdateActivo,
  useDeleteActivo,
} from '@/features/activos/hooks/useActivos';
import type { Activo, CreateActivoDto, UpdateActivoDto } from '@/types';
import type { ActivoFormData } from '@/lib/validations/activoSchema';

const ActivosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<string>('Todos');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedActivo, setSelectedActivo] = useState<Activo | undefined>();

  const { data: activos = [], isLoading } = useActivos();
  const createActivo = useCreateActivo();
  const updateActivo = useUpdateActivo();
  const deleteActivo = useDeleteActivo();

  // Filtrado y búsqueda
  const filteredActivos = useMemo(() => {
    let filtered = activos;

    // Filtro por estado
    if (estadoFilter !== 'Todos') {
      filtered = filtered.filter((activo) => activo.estado === estadoFilter);
    }

    // Búsqueda por código, nombre o marca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (activo) =>
          activo.codigo_Activo.toLowerCase().includes(term) ||
          activo.nombre.toLowerCase().includes(term) ||
          activo.marca?.toLowerCase().includes(term) ||
          activo.modelo?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [activos, estadoFilter, searchTerm]);

  const handleCreate = () => {
    setSelectedActivo(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (activo: Activo) => {
    setSelectedActivo(activo);
    setIsFormOpen(true);
  };

  const handleDelete = async (activo: Activo) => {
    if (window.confirm(`¿Está seguro de eliminar el activo ${activo.codigo_Activo}?`)) {
      try {
        await deleteActivo.mutateAsync(activo.id);
      } catch (error) {
        console.error('Error al eliminar activo:', error);
        alert('Error al eliminar el activo');
      }
    }
  };

  const handleFormSubmit = async (data: ActivoFormData) => {
    try {
      if (selectedActivo) {
        // Actualizar
        const updateData: UpdateActivoDto = {
          id: selectedActivo.id,
          ...data,
          estado: selectedActivo.estado,
        };
        await updateActivo.mutateAsync(updateData);
      } else {
        // Crear
        const createData: CreateActivoDto = data;
        await createActivo.mutateAsync(createData);
      }
      setIsFormOpen(false);
      setSelectedActivo(undefined);
    } catch (error) {
      console.error('Error al guardar activo:', error);
      alert('Error al guardar el activo');
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return '-';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'disponible':
        return 'bg-green-100 text-green-800';
      case 'en uso':
        return 'bg-blue-100 text-blue-800';
      case 'mantenimiento':
        return 'bg-yellow-100 text-yellow-800';
      case 'baja':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Estados únicos para el filtro
  const estados = useMemo(() => {
    const estadosSet = new Set(activos.map((a) => a.estado));
    return ['Todos', ...Array.from(estadosSet)];
  }, [activos]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activos</h1>
          <p className="text-muted-foreground">
            Gestiona el inventario de activos de la empresa
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Activo
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por código, nombre, marca o modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={estadoFilter} onValueChange={setEstadoFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            {estados.map((estado) => (
              <SelectItem key={estado} value={estado}>
                {estado}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Total Activos</p>
          <p className="text-2xl font-bold">{activos.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Disponibles</p>
          <p className="text-2xl font-bold">
            {activos.filter((a) => a.estado === 'Disponible').length}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">En Uso</p>
          <p className="text-2xl font-bold">
            {activos.filter((a) => a.estado === 'En Uso').length}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Mantenimiento</p>
          <p className="text-2xl font-bold">
            {activos.filter((a) => a.estado === 'Mantenimiento').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Cargando activos...</p>
          </div>
        ) : filteredActivos.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">No se encontraron activos</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Fecha Adquisición</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivos.map((activo) => (
                <TableRow key={activo.id}>
                  <TableCell className="font-medium">
                    {activo.codigo_Activo}
                  </TableCell>
                  <TableCell>{activo.nombre}</TableCell>
                  <TableCell>{activo.marca || '-'}</TableCell>
                  <TableCell>{activo.modelo || '-'}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getEstadoBadgeColor(
                        activo.estado
                      )}`}
                    >
                      {activo.estado}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(activo.valor_Adquisicion)}</TableCell>
                  <TableCell>{formatDate(activo.fecha_Adquisicion)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(activo)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(activo)}
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
      <ActivoForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        activo={selectedActivo}
        onSubmit={handleFormSubmit}
        isLoading={createActivo.isPending || updateActivo.isPending}
      />
    </div>
  );
};

export default ActivosPage;
