import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mantenimientoSchema, type MantenimientoFormData } from '@/lib/validations/mantenimientoSchema';
import { useActivos } from '@/features/activos/hooks/useActivos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import type { Mantenimiento } from '@/types';
import { Loader2 } from 'lucide-react';

interface MantenimientoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mantenimiento?: Mantenimiento;
  onSubmit: (data: MantenimientoFormData) => void;
  isLoading?: boolean;
}

const tiposMantenimiento = ['Preventivo', 'Correctivo', 'Limpieza', 'Revisión'];

export const MantenimientoForm = ({
  open,
  onOpenChange,
  mantenimiento,
  onSubmit,
  isLoading = false,
}: MantenimientoFormProps) => {
  const { data: activos = [] } = useActivos();
  const isEdit = !!mantenimiento;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<MantenimientoFormData>({
    resolver: zodResolver(mantenimientoSchema),
    defaultValues: {
      activo_Id: 0,
      tipo_Mantenimiento: '',
      fecha_Programada: '',
      fecha_Realizada: '',
      descripcion: '',
      proveedor_Servicio: '',
      costo: 0,
      observaciones: '',
    },
  });

  // Resetear formulario cuando cambia el mantenimiento o se abre/cierra
  useEffect(() => {
    if (open) {
      if (mantenimiento) {
        reset({
          activo_Id: mantenimiento.activo_Id,
          tipo_Mantenimiento: mantenimiento.tipo_Mantenimiento,
          fecha_Programada: mantenimiento.fecha_Programada?.split('T')[0] || '',
          fecha_Realizada: mantenimiento.fecha_Realizada?.split('T')[0] || '',
          descripcion: mantenimiento.descripcion || '',
          proveedor_Servicio: mantenimiento.proveedor_Servicio || '',
          costo: mantenimiento.costo || 0,
          observaciones: mantenimiento.observaciones || '',
        });
      } else {
        reset({
          activo_Id: 0,
          tipo_Mantenimiento: '',
          fecha_Programada: '',
          fecha_Realizada: '',
          descripcion: '',
          proveedor_Servicio: '',
          costo: 0,
          observaciones: '',
        });
      }
    }
  }, [open, mantenimiento, reset]);

  const handleFormSubmit = (data: MantenimientoFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Mantenimiento' : 'Crear Mantenimiento'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifica los datos del mantenimiento'
              : 'Completa el formulario para crear un nuevo mantenimiento'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Activo */}
            <div className="space-y-2">
              <Label htmlFor="activo_Id">
                Activo <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="activo_Id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <SelectTrigger id="activo_Id">
                      <SelectValue placeholder="Seleccione un activo" />
                    </SelectTrigger>
                    <SelectContent>
                      {activos.map((activo) => (
                        <SelectItem key={activo.id} value={activo.id.toString()}>
                          {activo.codigo_Activo} - {activo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.activo_Id && (
                <p className="text-sm text-red-500">{errors.activo_Id.message}</p>
              )}
            </div>

            {/* Tipo de Mantenimiento */}
            <div className="space-y-2">
              <Label htmlFor="tipo_Mantenimiento">
                Tipo de Mantenimiento <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="tipo_Mantenimiento"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="tipo_Mantenimiento">
                      <SelectValue placeholder="Seleccione el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposMantenimiento.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipo_Mantenimiento && (
                <p className="text-sm text-red-500">{errors.tipo_Mantenimiento.message}</p>
              )}
            </div>

            {/* Fecha Programada */}
            <div className="space-y-2">
              <Label htmlFor="fecha_Programada">Fecha Programada</Label>
              <Input
                id="fecha_Programada"
                type="date"
                {...register('fecha_Programada')}
              />
              {errors.fecha_Programada && (
                <p className="text-sm text-red-500">{errors.fecha_Programada.message}</p>
              )}
            </div>

            {/* Fecha Realizada */}
            <div className="space-y-2">
              <Label htmlFor="fecha_Realizada">Fecha Realizada</Label>
              <Input
                id="fecha_Realizada"
                type="date"
                {...register('fecha_Realizada')}
              />
              {errors.fecha_Realizada && (
                <p className="text-sm text-red-500">{errors.fecha_Realizada.message}</p>
              )}
            </div>

            {/* Proveedor de Servicio */}
            <div className="space-y-2">
              <Label htmlFor="proveedor_Servicio">Proveedor de Servicio</Label>
              <Input
                id="proveedor_Servicio"
                {...register('proveedor_Servicio')}
                placeholder="Nombre del proveedor"
              />
              {errors.proveedor_Servicio && (
                <p className="text-sm text-red-500">{errors.proveedor_Servicio.message}</p>
              )}
            </div>

            {/* Costo */}
            <div className="space-y-2">
              <Label htmlFor="costo">Costo (COP)</Label>
              <Controller
                name="costo"
                control={control}
                render={({ field }) => (
                  <Input
                    id="costo"
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
              {errors.costo && (
                <p className="text-sm text-red-500">{errors.costo.message}</p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                {...register('descripcion')}
                placeholder="Describa el mantenimiento a realizar"
                rows={3}
              />
              {errors.descripcion && (
                <p className="text-sm text-red-500">{errors.descripcion.message}</p>
              )}
            </div>

            {/* Observaciones */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                {...register('observaciones')}
                placeholder="Observaciones adicionales"
                rows={3}
              />
              {errors.observaciones && (
                <p className="text-sm text-red-500">{errors.observaciones.message}</p>
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
