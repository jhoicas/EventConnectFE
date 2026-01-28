import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categoriaSchema, type CategoriaFormData } from '@/lib/validations/categoriaSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Categoria } from '@/types';
import { Loader2 } from 'lucide-react';

interface CategoriaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoria?: Categoria;
  onSubmit: (data: CategoriaFormData) => void;
  isLoading?: boolean;
}

export const CategoriaForm = ({
  open,
  onOpenChange,
  categoria,
  onSubmit,
  isLoading = false,
}: CategoriaFormProps) => {
  const isEdit = !!categoria;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      icono: '',
      color: '#3B82F6',
    },
  });

  // Resetear formulario cuando cambia la categoría o se abre/cierra
  useEffect(() => {
    if (open) {
      if (categoria) {
        reset({
          nombre: categoria.nombre,
          descripcion: categoria.descripcion || '',
          icono: categoria.icono || '',
          color: categoria.color || '#3B82F6',
        });
      } else {
        reset({
          nombre: '',
          descripcion: '',
          icono: '',
          color: '#3B82F6',
        });
      }
    }
  }, [open, categoria, reset]);

  const handleFormSubmit = (data: CategoriaFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifica los datos de la categoría'
              : 'Completa el formulario para crear una nueva categoría'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre"
              {...register('nombre')}
              placeholder="Nombre de la categoría"
              disabled={isLoading}
            />
            {errors.nombre && (
              <p className="text-sm text-red-500">{errors.nombre.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              {...register('descripcion')}
              placeholder="Descripción de la categoría"
              rows={3}
              disabled={isLoading}
            />
            {errors.descripcion && (
              <p className="text-sm text-red-500">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Icono */}
          <div className="space-y-2">
            <Label htmlFor="icono">Icono</Label>
            <Input
              id="icono"
              {...register('icono')}
              placeholder="lucide icon name (ej: Package, Wrench)"
              disabled={isLoading}
            />
            {errors.icono && (
              <p className="text-sm text-red-500">{errors.icono.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Ver iconos disponibles en{' '}
              <a
                href="https://lucide.dev/icons"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                lucide.dev/icons
              </a>
            </p>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="color-picker"
                {...register('color')}
                className="h-10 w-20 cursor-pointer"
                disabled={isLoading}
              />
              <Input
                id="color"
                {...register('color')}
                placeholder="#3B82F6"
                className="flex-1"
                disabled={isLoading}
              />
            </div>
            {errors.color && (
              <p className="text-sm text-red-500">{errors.color.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
