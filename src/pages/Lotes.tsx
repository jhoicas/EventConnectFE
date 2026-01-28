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
import { LoteForm } from '@/features/lotes/components/LoteForm';
import {
  useLotes,
  useDeleteLote,
} from '@/features/lotes/hooks/useLotes';
import { useProductos } from '@/features/productos/hooks/useProductos';
import { useBodegas } from '@/features/bodegas/hooks/useBodegas';
import type { Lote } from '@/types';

const LotesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLote, setSelectedLote] = useState<Lote | undefined>();

  const { data: lotes = [], isLoading } = useLotes();
  const { data: productos = [] } = useProductos();
  const { data: bodegas = [] } = useBodegas();
  const deleteLote = useDeleteLote();

  // Filtrado y búsqueda
  const filteredLotes = useMemo(() => {
    let filtered = lotes;

    // Búsqueda por código
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (lote) =>
          lote.codigo_Lote.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [lotes, searchTerm]);

  const handleCreate = () => {
    setSelectedLote(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (lote: Lote) => {
    setSelectedLote(lote);
    setIsFormOpen(true);
  };

  const handleDelete = async (lote: Lote) => {
    if (window.confirm(`¿Está seguro de eliminar el lote ${lote.codigo_Lote}?`)) {
      try {
        await deleteLote.mutateAsync(lote.id);
      } catch (error) {
        console.error('Error al eliminar lote:', error);
        alert('Error al eliminar el lote');
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedLote(undefined);
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
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO');
  };

  const getProductoName = (productoId: number) => {
    const producto = productos.find((p) => p.id === productoId);
    return producto?.nombre || '-';
  };

  const getBodegaName = (bodegaId?: number) => {
    if (!bodegaId) return '-';
    const bodega = bodegas.find((b) => b.id === bodegaId);
    return bodega?.nombre || '-';
  };

  const getEstadoBadgeColor = (estado: string, fechaVencimiento?: string) => {
    if (fechaVencimiento) {
      const hoy = new Date();
      const vencimiento = new Date(fechaVencimiento);
      if (vencimiento < hoy) {
        return 'bg-red-100 text-red-800';
      }
    }
    return estado === 'Activo'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  const isLoteVencido = (fechaVencimiento?: string) => {
    if (!fechaVencimiento) return false;
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    return vencimiento < hoy;
  };

  // Stats
  const stats = useMemo(() => {
    const vigentes = lotes.filter((l) => !isLoteVencido(l.fecha_Vencimiento));
    const vencidos = lotes.filter((l) => isLoteVencido(l.fecha_Vencimiento));
    
    return {
      total: lotes.length,
      vigentes: vigentes.length,
      vencidos: vencidos.length,
    };
  }, [lotes]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lotes</h1>
          <p className="text-muted-foreground">
            Gestiona los lotes de productos
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Lote
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por código de lote..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Total Lotes</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Vigentes</p>
          <p className="text-2xl font-bold">{stats.vigentes}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Vencidos</p>
          <p className="text-2xl font-bold">{stats.vencidos}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Cargando lotes...</p>
          </div>
        ) : filteredLotes.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">No se encontraron lotes</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Bodega</TableHead>
                <TableHead>F. Fabricación</TableHead>
                <TableHead>F. Vencimiento</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLotes.map((lote) => (
                <TableRow key={lote.id}>
                  <TableCell className="font-medium">
                    {lote.codigo_Lote}
                  </TableCell>
                  <TableCell>{getProductoName(lote.producto_Id)}</TableCell>
                  <TableCell>{getBodegaName(lote.bodega_Id)}</TableCell>
                  <TableCell>{formatDate(lote.fecha_Fabricacion)}</TableCell>
                  <TableCell>{formatDate(lote.fecha_Vencimiento)}</TableCell>
                  <TableCell>{lote.cantidad_Actual}</TableCell>
                  <TableCell>{formatCurrency(lote.costo_Unitario)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getEstadoBadgeColor(
                        lote.estado,
                        lote.fecha_Vencimiento
                      )}`}
                    >
                      {isLoteVencido(lote.fecha_Vencimiento) ? 'Vencido' : lote.estado}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(lote)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(lote)}
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
      <LoteForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        lote={selectedLote}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default LotesPage;
