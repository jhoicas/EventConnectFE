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
import { ProductoForm } from '@/features/productos/components/ProductoForm';
import {
  useProductos,
  useDeleteProducto,
} from '@/features/productos/hooks/useProductos';
import { useCategorias } from '@/features/categorias/hooks/useCategorias';
import type { Producto } from '@/types';

const ProductosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | undefined>();

  const { data: productos = [], isLoading } = useProductos();
  const { data: categorias = [] } = useCategorias();
  const deleteProducto = useDeleteProducto();

  // Filtrado y búsqueda
  const filteredProductos = useMemo(() => {
    let filtered = productos;

    // Búsqueda por SKU o nombre
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (producto) =>
          producto.sku.toLowerCase().includes(term) ||
          producto.nombre.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [productos, searchTerm]);

  const handleCreate = () => {
    setSelectedProducto(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (producto: Producto) => {
    setSelectedProducto(producto);
    setIsFormOpen(true);
  };

  const handleDelete = async (producto: Producto) => {
    if (window.confirm(`¿Está seguro de eliminar el producto ${producto.sku}?`)) {
      try {
        await deleteProducto.mutateAsync(producto.id);
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedProducto(undefined);
  };

  const formatCurrency = (value?: number) => {
    if (!value) return '-';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(value);
  };

  const getCategoryName = (categoriaId: number) => {
    const categoria = categorias.find((c) => c.id === categoriaId);
    return categoria?.nombre || '-';
  };

  const getEstadoBadgeColor = (activo: boolean) => {
    return activo
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  // Stats
  const stats = useMemo(() => {
    return {
      total: productos.length,
      stockBajo: productos.filter((p) => p.cantidad_Stock < p.stock_Minimo).length,
      alquilables: productos.filter((p) => p.es_Alquilable).length,
      vendibles: productos.filter((p) => p.es_Vendible).length,
    };
  }, [productos]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">
            Gestiona el inventario de productos
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por SKU o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Total Productos</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Stock Bajo</p>
          <p className="text-2xl font-bold">{stats.stockBajo}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Alquilables</p>
          <p className="text-2xl font-bold">{stats.alquilables}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Vendibles</p>
          <p className="text-2xl font-bold">{stats.vendibles}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Cargando productos...</p>
          </div>
        ) : filteredProductos.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">No se encontraron productos</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Precio/Día</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Stock Mín</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProductos.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell className="font-medium">
                    {producto.sku}
                  </TableCell>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>{getCategoryName(producto.categoria_Id)}</TableCell>
                  <TableCell>{producto.unidad_Medida || '-'}</TableCell>
                  <TableCell>{formatCurrency(producto.precio_Alquiler_Dia)}</TableCell>
                  <TableCell>{producto.cantidad_Stock}</TableCell>
                  <TableCell>{producto.stock_Minimo}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getEstadoBadgeColor(
                        producto.activo
                      )}`}
                    >
                      {producto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(producto)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(producto)}
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
      <ProductoForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        producto={selectedProducto}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default ProductosPage;
