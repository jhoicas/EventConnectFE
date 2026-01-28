import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loteSchema, type LoteFormData } from '@/lib/validations/loteSchema';
import { useProductos } from '@/features/productos/hooks/useProductos';
import { useBodegas } from '@/features/bodegas/hooks/useBodegas';
import { useCreateLote, useUpdateLote } from '../hooks/useLotes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Lote } from '@/types';
import { Loader2 } from 'lucide-react';

interface LoteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lote?: Lote;
  onSuccess?: () => void;
}

export const LoteForm = ({
  open,
  onOpenChange,
  lote,
  onSuccess,
}: LoteFormProps) => {
  const { data: productos = [] } = useProductos();
  const { data: bodegas = [] } = useBodegas();
  const createMutation = useCreateLote();
  const updateMutation = useUpdateLote();
  const isEdit = !!lote;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<LoteFormData>({
    resolver: zodResolver(loteSchema),
    defaultValues: {
      producto_Id: 0,
      bodega_Id: undefined,
      codigo_Lote: '',
      fecha_Fabricacion: '',
      fecha_Vencimiento: '',
      cantidad_Inicial: 0,
      costo_Unitario: 0,
    },
  });

  // Resetear formulario cuando cambia el lote o se abre/cierra
  useEffect(() => {
    if (open) {
      if (lote) {
        reset({
          producto_Id: lote.producto_Id,
          bodega_Id: lote.bodega_Id,
          codigo_Lote: lote.codigo_Lote,
          fecha_Fabricacion: lote.fecha_Fabricacion || '',
          fecha_Vencimiento: lote.fecha_Vencimiento || '',
          cantidad_Inicial: lote.cantidad_Inicial,
          costo_Unitario: lote.costo_Unitario,
        });
      } else {
        reset({
          producto_Id: 0,
          bodega_Id: undefined,
          codigo_Lote: '',
          fecha_Fabricacion: '',
          fecha_Vencimiento: '',
          cantidad_Inicial: 0,
          costo_Unitario: 0,
        });
      }
    }
  }, [open, lote, reset]);

  const handleFormSubmit = async (data: LoteFormData) => {
    try {
      // Convertir código a mayúsculas
      const formattedData = {
        ...data,
        codigo_Lote: data.codigo_Lote.toUpperCase(),
      };

      if (isEdit && lote) {
        await updateMutation.mutateAsync({
          id: lote.id,
          ...formattedData,
          cantidad_Actual: lote.cantidad_Actual,
          estado: lote.estado,
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
      console.error('Error al guardar lote:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Lote' : 'Nuevo Lote'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifica los datos del lote'
              : 'Completa el formulario para crear un nuevo lote'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Producto */}
            <div className="space-y-2">
              <Label htmlFor="producto_Id">
                Producto <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="producto_Id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <SelectTrigger id="producto_Id">
                      <SelectValue placeholder="Seleccione un producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {productos.map((producto) => (
                        <SelectItem key={producto.id} value={producto.id.toString()}>
                          {producto.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.producto_Id && (
                <p className="text-sm text-red-500">{errors.producto_Id.message}</p>
              )}
            </div>

            {/* Bodega */}
            <div className="space-y-2">
              <Label htmlFor="bodega_Id">Bodega</Label>
              <Controller
                name="bodega_Id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() || ''}
                    onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                  >
                    <SelectTrigger id="bodega_Id">
                      <SelectValue placeholder="Seleccione una bodega (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin bodega</SelectItem>
                      {bodegas.map((bodega) => (
                        <SelectItem key={bodega.id} value={bodega.id.toString()}>
                          {bodega.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.bodega_Id && (
                <p className="text-sm text-red-500">{errors.bodega_Id.message}</p>
              )}
            </div>

            {/* Código Lote */}
            <div className="space-y-2">
              <Label htmlFor="codigo_Lote">
                Código Lote <span className="text-red-500">*</span>
              </Label>
              <Input
                id="codigo_Lote"
                {...register('codigo_Lote')}
                placeholder="LOTE-001"
                className="uppercase"
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  register('codigo_Lote').onChange(e);
                }}
              />
              {errors.codigo_Lote && (
                <p className="text-sm text-red-500">{errors.codigo_Lote.message}</p>
              )}
            </div>

            {/* Fecha Fabricación */}
            <div className="space-y-2">
              <Label htmlFor="fecha_Fabricacion">Fecha Fabricación</Label>
              <Input
                id="fecha_Fabricacion"
                type="date"
                {...register('fecha_Fabricacion')}
              />
              {errors.fecha_Fabricacion && (
                <p className="text-sm text-red-500">{errors.fecha_Fabricacion.message}</p>
              )}
            </div>

            {/* Fecha Vencimiento */}
            <div className="space-y-2">
              <Label htmlFor="fecha_Vencimiento">Fecha Vencimiento</Label>
              <Input
                id="fecha_Vencimiento"
                type="date"
                {...register('fecha_Vencimiento')}
              />
              {errors.fecha_Vencimiento && (
                <p className="text-sm text-red-500">{errors.fecha_Vencimiento.message}</p>
              )}
            </div>

            {/* Cantidad Inicial */}
            <div className="space-y-2">
              <Label htmlFor="cantidad_Inicial">
                Cantidad Inicial <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="cantidad_Inicial"
                control={control}
                render={({ field }) => (
                  <Input
                    id="cantidad_Inicial"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    value={field.value || 0}
                  />
                )}
              />
              {errors.cantidad_Inicial && (
                <p className="text-sm text-red-500">
                  {errors.cantidad_Inicial.message}
                </p>
              )}
            </div>

            {/* Costo Unitario */}
            <div className="space-y-2">
              <Label htmlFor="costo_Unitario">
                Costo Unitario <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="costo_Unitario"
                control={control}
                render={({ field }) => (
                  <Input
                    id="costo_Unitario"
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    value={field.value || 0}
                    placeholder="0.00"
                  />
                )}
              />
              {errors.costo_Unitario && (
                <p className="text-sm text-red-500">
                  {errors.costo_Unitario.message}
                </p>
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
