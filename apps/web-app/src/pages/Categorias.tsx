import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Search, Tag } from 'lucide-react';
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
import { CategoriaForm } from '@/features/categorias/components/CategoriaForm';
import { useCategorias } from '@/features/categorias/hooks/useCategorias';
import { useCreateCategoria } from '@/features/categorias/hooks/useCreateCategoria';
import { useUpdateCategoria } from '@/features/categorias/hooks/useUpdateCategoria';
import { useDeleteCategoria } from '@/features/categorias/hooks/useDeleteCategoria';
import type { Categoria, CreateCategoriaDto, UpdateCategoriaDto } from '@/types';
import type { CategoriaFormData } from '@/lib/validations/categoriaSchema';

const CategoriasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | undefined>();

  const { data: categorias = [], isLoading } = useCategorias();
  const createCategoria = useCreateCategoria();
  const updateCategoria = useUpdateCategoria();
  const deleteCategoria = useDeleteCategoria();

  // Filtrado y búsqueda
  const filteredCategorias = useMemo(() => {
    let filtered = categorias;

    // Búsqueda por nombre o descripción
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (categoria) =>
          categoria.nombre.toLowerCase().includes(term) ||
          categoria.descripcion?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [categorias, searchTerm]);

  const handleCreate = () => {
    setSelectedCategoria(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setIsFormOpen(true);
  };

  const handleDelete = async (categoria: Categoria) => {
    if (window.confirm(`¿Está seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      try {
        await deleteCategoria.mutateAsync(categoria.id);
        alert('Categoría eliminada correctamente');
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        alert('Error al eliminar la categoría');
      }
    }
  };

  const handleFormSubmit = async (data: CategoriaFormData) => {
    try {
      if (selectedCategoria) {
        // Actualizar
        const updateData: UpdateCategoriaDto = {
          id: selectedCategoria.id,
          ...data,
          activo: selectedCategoria.activo,
        };
        await updateCategoria.mutateAsync(updateData);
        alert('Categoría actualizada correctamente');
      } else {
        // Crear
        const createData: CreateCategoriaDto = data;
        await createCategoria.mutateAsync(createData);
        alert('Categoría creada correctamente');
      }
      setIsFormOpen(false);
      setSelectedCategoria(undefined);
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      alert('Error al guardar la categoría');
    }
  };

  const getEstadoBadgeColor = (activo: boolean) => {
    return activo
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  // Estadísticas
  const stats = useMemo(() => {
    const total = categorias.length;
    const activas = categorias.filter((c) => c.activo).length;
    return { total, activas };
  }, [categorias]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
          <p className="text-muted-foreground">
            Gestiona las categorías de productos y activos
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">Total Categorías</p>
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
            <p className="text-muted-foreground">Cargando categorías...</p>
          </div>
        ) : filteredCategorias.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">No se encontraron categorías</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Icono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell className="font-medium">{categoria.nombre}</TableCell>
                  <TableCell>
                    {categoria.descripcion || (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {categoria.icono && categoria.color ? (
                      <span
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: `${categoria.color}20`,
                          color: categoria.color,
                        }}
                      >
                        <Tag className="h-3 w-3" />
                        {categoria.icono}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getEstadoBadgeColor(
                        categoria.activo
                      )}`}
                    >
                      {categoria.activo ? 'Activa' : 'Inactiva'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(categoria)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(categoria)}
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
      <CategoriaForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        categoria={selectedCategoria}
        onSubmit={handleFormSubmit}
        isLoading={createCategoria.isPending || updateCategoria.isPending}
      />
    </div>
  );
};

export default CategoriasPage;
