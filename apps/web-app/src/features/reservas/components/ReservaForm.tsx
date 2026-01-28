import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reservaSchema, type ReservaFormData } from '@/lib/validations/reservaSchema';
import { useCreateReserva, useUpdateReserva } from '../hooks/useReservas';
import { useClientes } from '@/features/clientes/hooks/useClientes';
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
import type { Reserva } from '@/types';
import { Loader2 } from 'lucide-react';

interface ReservaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reserva?: Reserva;
  onSuccess?: () => void;
}

export const ReservaForm = ({
  open,
  onOpenChange,
  reserva,
  onSuccess,
}: ReservaFormProps) => {
  const createMutation = useCreateReserva();
  const updateMutation = useUpdateReserva();
  const { data: clientes = [] } = useClientes();
  const isEdit = !!reserva;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ReservaFormData>({
    resolver: zodResolver(reservaSchema),
    defaultValues: {
      cliente_Id: 0,
      fecha_Evento: '',
      fecha_Entrega: '',
      fecha_Devolucion_Programada: '',
      direccion_Entrega: '',
      ciudad_Entrega: '',
      contacto_En_Sitio: '',
      telefono_Contacto: '',
      subtotal: 0,
      descuento: 0,
      total: 0,
      fianza: 0,
      metodo_Pago: '',
      estado_Pago: '',
      observaciones: '',
    },
  });

  // Watch subtotal and descuento to auto-calculate total
  const subtotal = watch('subtotal');
  const descuento = watch('descuento');

  useEffect(() => {
    const calculatedTotal = Math.max(0, (subtotal || 0) - (descuento || 0));
    setValue('total', calculatedTotal);
  }, [subtotal, descuento, setValue]);

  // Reset form when opened/closed or reserva changes
  useEffect(() => {
    if (open) {
      if (reserva) {
        reset({
          cliente_Id: reserva.cliente_Id,
          fecha_Evento: reserva.fecha_Evento?.split('T')[0] || '',
          fecha_Entrega: reserva.fecha_Entrega?.split('T')[0] || '',
          fecha_Devolucion_Programada: reserva.fecha_Devolucion_Programada?.split('T')[0] || '',
          direccion_Entrega: reserva.direccion_Entrega || '',
          ciudad_Entrega: reserva.ciudad_Entrega || '',
          contacto_En_Sitio: reserva.contacto_En_Sitio || '',
          telefono_Contacto: reserva.telefono_Contacto || '',
          subtotal: reserva.subtotal,
          descuento: reserva.descuento,
          total: reserva.total,
          fianza: reserva.fianza || 0,
          metodo_Pago: reserva.metodo_Pago,
          estado_Pago: reserva.estado_Pago,
          observaciones: reserva.observaciones || '',
        });
      } else {
        reset({
          cliente_Id: 0,
          fecha_Evento: '',
          fecha_Entrega: '',
          fecha_Devolucion_Programada: '',
          direccion_Entrega: '',
          ciudad_Entrega: '',
          contacto_En_Sitio: '',
          telefono_Contacto: '',
          subtotal: 0,
          descuento: 0,
          total: 0,
          fianza: 0,
          metodo_Pago: '',
          estado_Pago: '',
          observaciones: '',
        });
      }
    }
  }, [open, reserva, reset]);

  const handleFormSubmit = async (data: ReservaFormData) => {
    try {
      if (isEdit && reserva) {
        await updateMutation.mutateAsync({
          id: reserva.id,
          ...data,
          estado: reserva.estado,
          fianza: data.fianza || 0,
          fianza_Devuelta: reserva.fianza_Devuelta,
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          fianza: data.fianza || 0,
        });
      }

      reset();
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al guardar reserva:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Reserva' : 'Nueva Reserva'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifica los datos de la reserva'
              : 'Completa el formulario para crear una nueva reserva'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cliente */}
            <div className="space-y-2">
              <Label htmlFor="cliente_Id">
                Cliente <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="cliente_Id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? field.value.toString() : ''}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger id="cliente_Id">
                      <SelectValue placeholder="Seleccione cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id.toString()}>
                          {cliente.nombre} - {cliente.documento}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.cliente_Id && (
                <p className="text-sm text-red-500">{errors.cliente_Id.message}</p>
              )}
            </div>

            {/* Fecha Evento */}
            <div className="space-y-2">
              <Label htmlFor="fecha_Evento">
                Fecha del Evento <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fecha_Evento"
                type="date"
                {...register('fecha_Evento')}
                className={errors.fecha_Evento ? 'border-red-500' : ''}
              />
              {errors.fecha_Evento && (
                <p className="text-sm text-red-500">{errors.fecha_Evento.message}</p>
              )}
            </div>

            {/* Fecha Entrega */}
            <div className="space-y-2">
              <Label htmlFor="fecha_Entrega">Fecha de Entrega</Label>
              <Input
                id="fecha_Entrega"
                type="date"
                {...register('fecha_Entrega')}
                className={errors.fecha_Entrega ? 'border-red-500' : ''}
              />
              {errors.fecha_Entrega && (
                <p className="text-sm text-red-500">{errors.fecha_Entrega.message}</p>
              )}
            </div>

            {/* Fecha Devolución Programada */}
            <div className="space-y-2">
              <Label htmlFor="fecha_Devolucion_Programada">
                Fecha Devolución Programada
              </Label>
              <Input
                id="fecha_Devolucion_Programada"
                type="date"
                {...register('fecha_Devolucion_Programada')}
                className={errors.fecha_Devolucion_Programada ? 'border-red-500' : ''}
              />
              {errors.fecha_Devolucion_Programada && (
                <p className="text-sm text-red-500">
                  {errors.fecha_Devolucion_Programada.message}
                </p>
              )}
            </div>

            {/* Dirección Entrega */}
            <div className="space-y-2">
              <Label htmlFor="direccion_Entrega">Dirección de Entrega</Label>
              <Input
                id="direccion_Entrega"
                {...register('direccion_Entrega')}
                placeholder="Dirección donde se entregará"
                className={errors.direccion_Entrega ? 'border-red-500' : ''}
              />
              {errors.direccion_Entrega && (
                <p className="text-sm text-red-500">{errors.direccion_Entrega.message}</p>
              )}
            </div>

            {/* Ciudad Entrega */}
            <div className="space-y-2">
              <Label htmlFor="ciudad_Entrega">Ciudad de Entrega</Label>
              <Input
                id="ciudad_Entrega"
                {...register('ciudad_Entrega')}
                placeholder="Ciudad de entrega"
                className={errors.ciudad_Entrega ? 'border-red-500' : ''}
              />
              {errors.ciudad_Entrega && (
                <p className="text-sm text-red-500">{errors.ciudad_Entrega.message}</p>
              )}
            </div>

            {/* Contacto en Sitio */}
            <div className="space-y-2">
              <Label htmlFor="contacto_En_Sitio">Contacto en Sitio</Label>
              <Input
                id="contacto_En_Sitio"
                {...register('contacto_En_Sitio')}
                placeholder="Nombre del contacto en el sitio"
                className={errors.contacto_En_Sitio ? 'border-red-500' : ''}
              />
              {errors.contacto_En_Sitio && (
                <p className="text-sm text-red-500">{errors.contacto_En_Sitio.message}</p>
              )}
            </div>

            {/* Teléfono Contacto */}
            <div className="space-y-2">
              <Label htmlFor="telefono_Contacto">Teléfono de Contacto</Label>
              <Input
                id="telefono_Contacto"
                type="tel"
                {...register('telefono_Contacto')}
                placeholder="Ej: +57 300 123 4567"
                className={errors.telefono_Contacto ? 'border-red-500' : ''}
              />
              {errors.telefono_Contacto && (
                <p className="text-sm text-red-500">{errors.telefono_Contacto.message}</p>
              )}
            </div>

            {/* Subtotal */}
            <div className="space-y-2">
              <Label htmlFor="subtotal">
                Subtotal <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subtotal"
                type="number"
                step="0.01"
                {...register('subtotal', { valueAsNumber: true })}
                placeholder="0.00"
                className={errors.subtotal ? 'border-red-500' : ''}
              />
              {errors.subtotal && (
                <p className="text-sm text-red-500">{errors.subtotal.message}</p>
              )}
              {subtotal > 0 && (
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(subtotal)}
                </p>
              )}
            </div>

            {/* Descuento */}
            <div className="space-y-2">
              <Label htmlFor="descuento">Descuento</Label>
              <Input
                id="descuento"
                type="number"
                step="0.01"
                {...register('descuento', { valueAsNumber: true })}
                placeholder="0.00"
                className={errors.descuento ? 'border-red-500' : ''}
              />
              {errors.descuento && (
                <p className="text-sm text-red-500">{errors.descuento.message}</p>
              )}
              {descuento > 0 && (
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(descuento)}
                </p>
              )}
            </div>

            {/* Total (read-only, auto-calculated) */}
            <div className="space-y-2">
              <Label htmlFor="total">
                Total <span className="text-red-500">*</span>
              </Label>
              <Input
                id="total"
                type="number"
                {...register('total', { valueAsNumber: true })}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
              {watch('total') > 0 && (
                <p className="text-sm font-semibold text-green-600">
                  {formatCurrency(watch('total'))}
                </p>
              )}
            </div>

            {/* Fianza */}
            <div className="space-y-2">
              <Label htmlFor="fianza">Fianza</Label>
              <Input
                id="fianza"
                type="number"
                step="0.01"
                {...register('fianza', { valueAsNumber: true })}
                placeholder="0.00"
                className={errors.fianza ? 'border-red-500' : ''}
              />
              {errors.fianza && (
                <p className="text-sm text-red-500">{errors.fianza.message}</p>
              )}
              {(watch('fianza') ?? 0) > 0 && (
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(watch('fianza') || 0)}
                </p>
              )}
            </div>

            {/* Método de Pago */}
            <div className="space-y-2">
              <Label htmlFor="metodo_Pago">
                Método de Pago <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="metodo_Pago"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="metodo_Pago">
                      <SelectValue placeholder="Seleccione método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Efectivo">Efectivo</SelectItem>
                      <SelectItem value="Transferencia">Transferencia</SelectItem>
                      <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="PSE">PSE</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.metodo_Pago && (
                <p className="text-sm text-red-500">{errors.metodo_Pago.message}</p>
              )}
            </div>

            {/* Estado de Pago */}
            <div className="space-y-2">
              <Label htmlFor="estado_Pago">
                Estado de Pago <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="estado_Pago"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="estado_Pago">
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Parcial">Parcial</SelectItem>
                      <SelectItem value="Pagado">Pagado</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.estado_Pago && (
                <p className="text-sm text-red-500">{errors.estado_Pago.message}</p>
              )}
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              {...register('observaciones')}
              placeholder="Notas adicionales sobre la reserva..."
              rows={3}
              className={errors.observaciones ? 'border-red-500' : ''}
            />
            {errors.observaciones && (
              <p className="text-sm text-red-500">{errors.observaciones.message}</p>
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
              {isEdit ? 'Actualizar' : 'Crear'} Reserva
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
