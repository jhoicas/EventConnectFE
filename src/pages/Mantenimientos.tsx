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
import { MantenimientoForm } from '@/features/mantenimientos/components/MantenimientoForm';
import {
  useMantenimientos,
  useCreateMantenimiento,
  useUpdateMantenimiento,
  useDeleteMantenimiento,
} from '@/features/mantenimientos/hooks/useMantenimientos';
import { useActivos } from '@/features/activos/hooks/useActivos';
import type { Mantenimiento, CreateMantenimientoDto, UpdateMantenimientoDto } from '@/types';
import type { MantenimientoFormData } from '@/lib/validations/mantenimientoSchema';

const MantenimientosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<string>('Todos');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMantenimiento, setSelectedMantenimiento] = useState<Mantenimiento | undefined>();

  const { data: mantenimientos = [], isLoading } = useMantenimientos();
  const { data: activos = [] } = useActivos();
  const createMantenimiento = useCreateMantenimiento();
  const updateMantenimiento = useUpdateMantenimiento();
  const deleteMantenimiento = useDeleteMantenimiento();

  // Crear un mapa de activos para búsquedas rápidas
  const activosMap = useMemo(() => {
    return new Map(activos.map((activo) => [activo.id, activo]));
  }, [activos]);

  // Filtrado y búsqueda
  const filteredMantenimientos = useMemo(() => {
    let filtered = mantenimientos;

    // Filtro por estado
    if (estadoFilter !== 'Todos') {
      filtered = filtered.filter((mant) => mant.estado === estadoFilter);
    }

    // Búsqueda por activo, tipo o proveedor
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((mant) => {
        const activo = activosMap.get(mant.activo_Id);
        return (
          activo?.codigo_Activo.toLowerCase().includes(term) ||
          activo?.nombre.toLowerCase().includes(term) ||
          mant.tipo_Mantenimiento.toLowerCase().includes(term) ||
          mant.proveedor_Servicio?.toLowerCase().includes(term)
        );
      });
    }

    return filtered;
  }, [mantenimientos, estadoFilter, searchTerm, activosMap]);

  // Cálculo de estadísticas
  const stats = useMemo(() => {
    const total = mantenimientos.length;
    const pendientes = mantenimientos.filter((m) => m.estado === 'Pendiente').length;
    const completados = mantenimientos.filter((m) => m.estado === 'Completado').length;
    const vencidos = mantenimientos.filter((m) => m.estado === 'Vencido').length;

    return { total, pendientes, completados, vencidos };
  }, [mantenimientos]);

  const handleCreate = () => {
    setSelectedMantenimiento(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (mantenimiento: Mantenimiento) => {
    setSelectedMantenimiento(mantenimiento);
    setIsFormOpen(true);
  };

  const handleDelete = async (mantenimiento: Mantenimiento) => {
    const activo = activosMap.get(mantenimiento.activo_Id);
    const activoNombre = activo ? `${activo.codigo_Activo} - ${activo.nombre}` : 'este activo';
    
    if (window.confirm(`¿Está seguro de eliminar el mantenimiento de ${activoNombre}?`)) {
      try {
        await deleteMantenimiento.mutateAsync(mantenimiento.id);
      } catch (error) {
        console.error('Error al eliminar mantenimiento:', error);
        alert('Error al eliminar el mantenimiento');
      }
    }
  };

  const handleFormSubmit = async (data: MantenimientoFormData) => {
    try {
      if (selectedMantenimiento) {
        // Actualizar
        const updateData: UpdateMantenimientoDto = {
          id: selectedMantenimiento.id,
          ...data,
          estado: selectedMantenimiento.estado,
        };
        await updateMantenimiento.mutateAsync(updateData);
      } else {
        // Crear
        const createData: CreateMantenimientoDto = data;
        await createMantenimiento.mutateAsync(createData);
      }
      setIsFormOpen(false);
      setSelectedMantenimiento(undefined);
    } catch (error) {
      console.error('Error al guardar mantenimiento:', error);
      alert('Error al guardar el mantenimiento');
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return '-';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'vencido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Estados únicos para el filtro
  const estados = useMemo(() => {
    const estadosSet = new Set(mantenimientos.map((m) => m.estado));
    return ['Todos', ...Array.from(estadosSet)];
  }, [mantenimientos]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mantenimientos</h1>
          <p className="text-muted-foreground">
            Gestiona los mantenimientos de activos
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Mantenimiento
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por activo, tipo o proveedor..."
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
          <p className="text-sm font-medium text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendientes}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Completados</p>
          <p className="text-2xl font-bold text-green-600">{stats.completados}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Vencidos</p>
          <p className="text-2xl font-bold text-red-600">{stats.vencidos}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Cargando mantenimientos...</p>
          </div>
        ) : filteredMantenimientos.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">No se encontraron mantenimientos</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>F. Programada</TableHead>
                <TableHead>F. Realizada</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMantenimientos.map((mantenimiento) => {
                const activo = activosMap.get(mantenimiento.activo_Id);
                return (
                  <TableRow key={mantenimiento.id}>
                    <TableCell className="font-medium">
                      {activo ? `${activo.codigo_Activo} - ${activo.nombre}` : '-'}
                    </TableCell>
                    <TableCell>{mantenimiento.tipo_Mantenimiento}</TableCell>
                    <TableCell>{formatDate(mantenimiento.fecha_Programada)}</TableCell>
                    <TableCell>{formatDate(mantenimiento.fecha_Realizada)}</TableCell>
                    <TableCell>{mantenimiento.proveedor_Servicio || '-'}</TableCell>
                    <TableCell>{formatCurrency(mantenimiento.costo)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getEstadoBadgeColor(
                          mantenimiento.estado
                        )}`}
                      >
                        {mantenimiento.estado}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(mantenimiento)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(mantenimiento)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Form Modal */}
      <MantenimientoForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mantenimiento={selectedMantenimiento}
        onSubmit={handleFormSubmit}
        isLoading={createMantenimiento.isPending || updateMantenimiento.isPending}
      />
    </div>
  );
};

export default MantenimientosPage;
