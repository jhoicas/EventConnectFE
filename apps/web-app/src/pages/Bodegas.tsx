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
import { BodegaForm } from '@/features/bodegas/components/BodegaForm';
import {
  useBodegas,
  useDeleteBodega,
} from '@/features/bodegas/hooks/useBodegas';
import type { Bodega } from '@/types';

const BodegasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBodega, setSelectedBodega] = useState<Bodega | undefined>();

  const { data: bodegas = [], isLoading } = useBodegas();
  const deleteBodega = useDeleteBodega();

  // Filtrado y búsqueda
  const filteredBodegas = useMemo(() => {
    let filtered = bodegas;

    // Búsqueda por código o nombre
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (bodega) =>
          bodega.codigo_Bodega.toLowerCase().includes(term) ||
          bodega.nombre.toLowerCase().includes(term) ||
          bodega.ciudad?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [bodegas, searchTerm]);

  const handleCreate = () => {
    setSelectedBodega(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (bodega: Bodega) => {
    setSelectedBodega(bodega);
    setIsFormOpen(true);
  };

  const handleDelete = async (bodega: Bodega) => {
    if (window.confirm(`¿Está seguro de eliminar la bodega ${bodega.codigo_Bodega}?`)) {
      try {
        await deleteBodega.mutateAsync(bodega.id);
      } catch (error) {
        console.error('Error al eliminar bodega:', error);
        alert('Error al eliminar la bodega');
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedBodega(undefined);
  };

  const getEstadoBadgeColor = (estado: string) => {
    return estado === 'Activa'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  // Stats
  const stats = useMemo(() => {
    return {
      total: bodegas.length,
      activas: bodegas.filter((b) => b.estado === 'Activa').length,
    };
  }, [bodegas]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bodegas</h1>
          <p className="text-muted-foreground">
            Gestiona las bodegas de almacenamiento
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Bodega
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por código, nombre o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Total Bodegas</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Activas</p>
          <p className="text-2xl font-bold">{stats.activas}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Cargando bodegas...</p>
          </div>
        ) : filteredBodegas.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">No se encontraron bodegas</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Capacidad M³</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBodegas.map((bodega) => (
                <TableRow key={bodega.id}>
                  <TableCell className="font-medium">
                    {bodega.codigo_Bodega}
                  </TableCell>
                  <TableCell>{bodega.nombre}</TableCell>
                  <TableCell>{bodega.ciudad || '-'}</TableCell>
                  <TableCell>{bodega.telefono || '-'}</TableCell>
                  <TableCell>
                    {bodega.capacidad_M3 ? bodega.capacidad_M3.toFixed(2) : '-'}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getEstadoBadgeColor(
                        bodega.estado
                      )}`}
                    >
                      {bodega.estado}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(bodega)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(bodega)}
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
      <BodegaForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        bodega={selectedBodega}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default BodegasPage;
