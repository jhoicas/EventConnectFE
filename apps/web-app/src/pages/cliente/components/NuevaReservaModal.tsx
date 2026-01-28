import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useCreateReserva } from '@/features/reservas/hooks/useReservas';
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
import { Calendar, MapPin, CreditCard, CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface NuevaReservaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const reservaStepSchema = z.object({
  fecha_Evento: z.string().min(1, 'La fecha del evento es requerida'),
  direccion_Entrega: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  ciudad_Entrega: z.string().min(2, 'La ciudad es requerida'),
  contacto_En_Sitio: z.string().min(3, 'El nombre del contacto es requerido'),
  telefono_Contacto: z.string().min(7, 'Ingrese un teléfono válido'),
  subtotal: z.number().min(0, 'El subtotal debe ser mayor o igual a 0'),
  descuento: z.number().min(0, 'El descuento debe ser mayor o igual a 0'),
  total: z.number().min(0, 'El total debe ser mayor o igual a 0'),
  metodo_Pago: z.string().min(1, 'Seleccione un método de pago'),
  estado_Pago: z.string().min(1, 'Seleccione el estado del pago'),
  observaciones: z.string().optional(),
});

type ReservaStepData = z.infer<typeof reservaStepSchema>;

export const NuevaReservaModal = ({
  open,
  onOpenChange,
  onSuccess,
}: NuevaReservaModalProps) => {
  const [step, setStep] = useState(1);
  const { user } = useAuthStore();
  const createMutation = useCreateReserva();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ReservaStepData>({
    resolver: zodResolver(reservaStepSchema),
    defaultValues: {
      fecha_Evento: '',
      direccion_Entrega: '',
      ciudad_Entrega: '',
      contacto_En_Sitio: user?.nombre_Completo || '',
      telefono_Contacto: user?.telefono || '',
      subtotal: 0,
      descuento: 0,
      total: 0,
      metodo_Pago: '',
      estado_Pago: 'Pendiente',
      observaciones: '',
    },
  });

  const subtotal = watch('subtotal');
  const descuento = watch('descuento');

  useEffect(() => {
    const calculatedTotal = Math.max(0, (subtotal || 0) - (descuento || 0));
    setValue('total', calculatedTotal);
  }, [subtotal, descuento, setValue]);

  useEffect(() => {
    if (open) {
      setStep(1);
      reset({
        fecha_Evento: '',
        direccion_Entrega: '',
        ciudad_Entrega: '',
        contacto_En_Sitio: user?.nombre_Completo || '',
        telefono_Contacto: user?.telefono || '',
        subtotal: 0,
        descuento: 0,
        total: 0,
        metodo_Pago: '',
        estado_Pago: 'Pendiente',
        observaciones: '',
      });
    }
  }, [open, reset, user]);

  const onSubmit = async (data: ReservaStepData) => {
    if (!user?.id) {
      alert('Usuario no autenticado');
      return;
    }

    try {
      await createMutation.mutateAsync({
        cliente_Id: user.id,
        ...data,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error al crear reserva:', error);
      alert('Error al crear la reserva. Por favor intente nuevamente.');
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: 'Evento', icon: Calendar },
      { number: 2, label: 'Productos', icon: MapPin },
      { number: 3, label: 'Pago', icon: CreditCard },
    ];

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, idx) => (
          <div key={s.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= s.number
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}
              >
                {step > s.number ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <s.icon className="h-5 w-5" />
                )}
              </div>
              <span className="text-xs mt-2 font-medium">{s.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 ${
                  step > s.number ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fecha_Evento">Fecha del Evento *</Label>
        <Input
          id="fecha_Evento"
          type="datetime-local"
          {...register('fecha_Evento')}
          className={errors.fecha_Evento ? 'border-red-500' : ''}
        />
        {errors.fecha_Evento && (
          <p className="text-sm text-red-500 mt-1">{errors.fecha_Evento.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="direccion_Entrega">Dirección del Evento *</Label>
        <Input
          id="direccion_Entrega"
          {...register('direccion_Entrega')}
          placeholder="Calle 123 # 45-67"
          className={errors.direccion_Entrega ? 'border-red-500' : ''}
        />
        {errors.direccion_Entrega && (
          <p className="text-sm text-red-500 mt-1">{errors.direccion_Entrega.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="ciudad_Entrega">Ciudad *</Label>
        <Input
          id="ciudad_Entrega"
          {...register('ciudad_Entrega')}
          placeholder="Bogotá"
          className={errors.ciudad_Entrega ? 'border-red-500' : ''}
        />
        {errors.ciudad_Entrega && (
          <p className="text-sm text-red-500 mt-1">{errors.ciudad_Entrega.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contacto_En_Sitio">Nombre de Contacto *</Label>
          <Input
            id="contacto_En_Sitio"
            {...register('contacto_En_Sitio')}
            className={errors.contacto_En_Sitio ? 'border-red-500' : ''}
          />
          {errors.contacto_En_Sitio && (
            <p className="text-sm text-red-500 mt-1">{errors.contacto_En_Sitio.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="telefono_Contacto">Teléfono *</Label>
          <Input
            id="telefono_Contacto"
            {...register('telefono_Contacto')}
            className={errors.telefono_Contacto ? 'border-red-500' : ''}
          />
          {errors.telefono_Contacto && (
            <p className="text-sm text-red-500 mt-1">{errors.telefono_Contacto.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Próximamente:</strong> En esta sección podrás seleccionar productos y servicios de diferentes empresas.
            Por ahora, ingresa los montos manualmente.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="subtotal">Subtotal ($) *</Label>
          <Input
            id="subtotal"
            type="number"
            step="0.01"
            {...register('subtotal', { valueAsNumber: true })}
            className={errors.subtotal ? 'border-red-500' : ''}
          />
          {errors.subtotal && (
            <p className="text-sm text-red-500 mt-1">{errors.subtotal.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="descuento">Descuento ($)</Label>
          <Input
            id="descuento"
            type="number"
            step="0.01"
            {...register('descuento', { valueAsNumber: true })}
            className={errors.descuento ? 'border-red-500' : ''}
          />
          {errors.descuento && (
            <p className="text-sm text-red-500 mt-1">{errors.descuento.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="total">Total ($)</Label>
        <Input
          id="total"
          type="number"
          step="0.01"
          {...register('total', { valueAsNumber: true })}
          disabled
          className="bg-gray-100 dark:bg-gray-800"
        />
      </div>

      <div>
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          {...register('observaciones')}
          placeholder="Instrucciones especiales, preferencias, etc."
          rows={3}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="metodo_Pago">Método de Pago *</Label>
        <Controller
          name="metodo_Pago"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={errors.metodo_Pago ? 'border-red-500' : ''}>
                <SelectValue placeholder="Seleccione un método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Efectivo">Efectivo</SelectItem>
                <SelectItem value="Transferencia">Transferencia</SelectItem>
                <SelectItem value="Tarjeta">Tarjeta de Crédito/Débito</SelectItem>
                <SelectItem value="PSE">PSE</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.metodo_Pago && (
          <p className="text-sm text-red-500 mt-1">{errors.metodo_Pago.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="estado_Pago">Estado del Pago *</Label>
        <Controller
          name="estado_Pago"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={errors.estado_Pago ? 'border-red-500' : ''}>
                <SelectValue placeholder="Seleccione un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Pagado">Pagado</SelectItem>
                <SelectItem value="Parcial">Pago Parcial</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.estado_Pago && (
          <p className="text-sm text-red-500 mt-1">{errors.estado_Pago.message}</p>
        )}
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-2">Resumen de tu Reserva</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal?.toLocaleString('es-CO') || 0}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Descuento:</span>
              <span>-${descuento?.toLocaleString('es-CO') || 0}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total:</span>
              <span>${watch('total')?.toLocaleString('es-CO') || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle>Nueva Reserva</DialogTitle>
          <DialogDescription>
            Completa los siguientes pasos para crear tu reserva
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStepIndicator()}

          <div className="py-4">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <div>
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>

              {step < 3 ? (
                <Button type="button" onClick={handleNext}>
                  Siguiente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Confirmar Reserva
                    </>
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
