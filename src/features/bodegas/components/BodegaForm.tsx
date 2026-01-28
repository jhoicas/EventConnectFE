import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bodegaSchema, type BodegaFormData } from '@/lib/validations/bodegaSchema';
import { useCreateBodega, useUpdateBodega } from '../hooks/useBodegas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Bodega } from '@/types';
import { Loader2 } from 'lucide-react';

interface BodegaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bodega?: Bodega;
  onSuccess?: () => void;
}

export const BodegaForm = ({
  open,
  onOpenChange,
  bodega,
  onSuccess,
}: BodegaFormProps) => {
  const createMutation = useCreateBodega();
  const updateMutation = useUpdateBodega();
  const isEdit = !!bodega;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<BodegaFormData>({
    resolver: zodResolver(bodegaSchema),
    defaultValues: {
      codigo_Bodega: '',
      nombre: '',
      direccion: '',
      ciudad: '',
      telefono: '',
      capacidad_M3: undefined,
    },
  });

  // Resetear formulario cuando cambia la bodega o se abre/cierra
  useEffect(() => {
    if (open) {
      if (bodega) {
        reset({
          codigo_Bodega: bodega.codigo_Bodega,
          nombre: bodega.nombre,
          direccion: bodega.direccion || '',
          ciudad: bodega.ciudad || '',
          telefono: bodega.telefono || '',
          capacidad_M3: bodega.capacidad_M3,
        });
      } else {
        reset({
          codigo_Bodega: '',
          nombre: '',
          direccion: '',
          ciudad: '',
          telefono: '',
          capacidad_M3: undefined,
        });
      }
    }
  }, [open, bodega, reset]);

  const handleFormSubmit = async (data: BodegaFormData) => {
    try {
      // Convertir código a mayúsculas
      const formattedData = {
        ...data,
        codigo_Bodega: data.codigo_Bodega.toUpperCase(),
      };

      if (isEdit && bodega) {
        await updateMutation.mutateAsync({
          id: bodega.id,
          ...formattedData,
          estado: bodega.estado,
        });
      } else {
        await createMutation.mutateAsync(formattedData);
      }

      // Reset form and close on success
      reset();
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled by mutation hooks
      console.error('Error al guardar bodega:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Bodega' : 'Nueva Bodega'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifica los datos de la bodega'
              : 'Completa el formulario para crear una nueva bodega'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Código Bodega */}
            <div className="space-y-2">
              <Label htmlFor="codigo_Bodega">
                Código Bodega <span className="text-red-500">*</span>
              </Label>
              <Input
                id="codigo_Bodega"
                {...register('codigo_Bodega')}
                placeholder="BOD-001"
                className="uppercase"
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  register('codigo_Bodega').onChange(e);
                }}
              />
              {errors.codigo_Bodega && (
                <p className="text-sm text-red-500">{errors.codigo_Bodega.message}</p>
              )}
            </div>

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                {...register('nombre')}
                placeholder="Nombre de la bodega"
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            {/* Dirección */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                {...register('direccion')}
                placeholder="Dirección completa"
              />
              {errors.direccion && (
                <p className="text-sm text-red-500">{errors.direccion.message}</p>
              )}
            </div>

            {/* Ciudad */}
            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                {...register('ciudad')}
                placeholder="Ciudad"
              />
              {errors.ciudad && (
                <p className="text-sm text-red-500">{errors.ciudad.message}</p>
              )}
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                {...register('telefono')}
                placeholder="(000) 000-0000"
              />
              {errors.telefono && (
                <p className="text-sm text-red-500">{errors.telefono.message}</p>
              )}
            </div>

            {/* Capacidad M3 */}
            <div className="space-y-2">
              <Label htmlFor="capacidad_M3">Capacidad (M³)</Label>
              <Controller
                name="capacidad_M3"
                control={control}
                render={({ field }) => (
                  <Input
                    id="capacidad_M3"
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseFloat(value) : undefined);
                    }}
                    value={field.value ?? ''}
                    placeholder="0.00"
                  />
                )}
              />
              {errors.capacidad_M3 && (
                <p className="text-sm text-red-500">{errors.capacidad_M3.message}</p>
              )}
            </div>
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
