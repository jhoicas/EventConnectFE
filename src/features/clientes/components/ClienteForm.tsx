import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clienteSchema, type ClienteFormData } from '@/lib/validations/clienteSchema';
import { useCreateCliente, useUpdateCliente } from '../hooks/useClientes';
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
import type { Cliente } from '@/types';
import { Loader2 } from 'lucide-react';

interface ClienteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente?: Cliente;
  onSuccess?: () => void;
}

export const ClienteForm = ({
  open,
  onOpenChange,
  cliente,
  onSuccess,
}: ClienteFormProps) => {
  const createMutation = useCreateCliente();
  const updateMutation = useUpdateCliente();
  const isEdit = !!cliente;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      tipo_Cliente: 'Persona',
      nombre: '',
      tipo_Documento: 'CC',
      documento: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      contacto_Nombre: '',
      contacto_Telefono: '',
      observaciones: '',
    },
  });

  // Watch tipo_Cliente para mostrar/ocultar campos de contacto
  const tipoCliente = watch('tipo_Cliente');

  // Resetear formulario cuando cambia el cliente o se abre/cierra
  useEffect(() => {
    if (open) {
      if (cliente) {
        reset({
          tipo_Cliente: cliente.tipo_Cliente as 'Persona' | 'Empresa',
          nombre: cliente.nombre,
          tipo_Documento: cliente.tipo_Documento as 'CC' | 'NIT' | 'CE' | 'PAS',
          documento: cliente.documento,
          email: cliente.email || '',
          telefono: cliente.telefono || '',
          direccion: cliente.direccion || '',
          ciudad: cliente.ciudad || '',
          contacto_Nombre: cliente.contacto_Nombre || '',
          contacto_Telefono: cliente.contacto_Telefono || '',
          observaciones: cliente.observaciones || '',
        });
      } else {
        reset({
          tipo_Cliente: 'Persona',
          nombre: '',
          tipo_Documento: 'CC',
          documento: '',
          email: '',
          telefono: '',
          direccion: '',
          ciudad: '',
          contacto_Nombre: '',
          contacto_Telefono: '',
          observaciones: '',
        });
      }
    }
  }, [open, cliente, reset]);

  const handleFormSubmit = async (data: ClienteFormData) => {
    try {
      if (isEdit && cliente) {
        await updateMutation.mutateAsync({
          id: cliente.id,
          ...data,
          rating: cliente.rating,
          estado: cliente.estado,
        });
      } else {
        await createMutation.mutateAsync(data);
      }

      // Reset form and close on success
      reset();
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled by mutation hooks
      console.error('Error al guardar cliente:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifica los datos del cliente'
              : 'Completa el formulario para crear un nuevo cliente'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipo Cliente */}
            <div className="space-y-2">
              <Label htmlFor="tipo_Cliente">
                Tipo de Cliente <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="tipo_Cliente"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="tipo_Cliente">
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Persona">Persona</SelectItem>
                      <SelectItem value="Empresa">Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipo_Cliente && (
                <p className="text-sm text-red-500">{errors.tipo_Cliente.message}</p>
              )}
            </div>

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">
                Nombre {tipoCliente === 'Empresa' ? 'de la Empresa' : 'Completo'} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                {...register('nombre')}
                placeholder={tipoCliente === 'Empresa' ? 'Nombre de la empresa' : 'Nombre completo'}
                className={errors.nombre ? 'border-red-500' : ''}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            {/* Tipo Documento */}
            <div className="space-y-2">
              <Label htmlFor="tipo_Documento">
                Tipo de Documento <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="tipo_Documento"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="tipo_Documento">
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                      <SelectItem value="NIT">NIT</SelectItem>
                      <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                      <SelectItem value="PAS">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipo_Documento && (
                <p className="text-sm text-red-500">{errors.tipo_Documento.message}</p>
              )}
            </div>

            {/* Documento */}
            <div className="space-y-2">
              <Label htmlFor="documento">
                Número de Documento <span className="text-red-500">*</span>
              </Label>
              <Input
                id="documento"
                {...register('documento')}
                placeholder="Ej: 1234567890"
                className={errors.documento ? 'border-red-500' : ''}
              />
              {errors.documento && (
                <p className="text-sm text-red-500">{errors.documento.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="correo@ejemplo.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                {...register('telefono')}
                placeholder="Ej: +57 300 123 4567"
                className={errors.telefono ? 'border-red-500' : ''}
              />
              {errors.telefono && (
                <p className="text-sm text-red-500">{errors.telefono.message}</p>
              )}
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                {...register('direccion')}
                placeholder="Dirección completa"
                className={errors.direccion ? 'border-red-500' : ''}
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
                placeholder="Ciudad de residencia"
                className={errors.ciudad ? 'border-red-500' : ''}
              />
              {errors.ciudad && (
                <p className="text-sm text-red-500">{errors.ciudad.message}</p>
              )}
            </div>

            {/* Contacto Nombre - Solo para Empresas */}
            {tipoCliente === 'Empresa' && (
              <div className="space-y-2">
                <Label htmlFor="contacto_Nombre">Nombre de Contacto</Label>
                <Input
                  id="contacto_Nombre"
                  {...register('contacto_Nombre')}
                  placeholder="Nombre del contacto principal"
                  className={errors.contacto_Nombre ? 'border-red-500' : ''}
                />
                {errors.contacto_Nombre && (
                  <p className="text-sm text-red-500">{errors.contacto_Nombre.message}</p>
                )}
              </div>
            )}

            {/* Contacto Teléfono - Solo para Empresas */}
            {tipoCliente === 'Empresa' && (
              <div className="space-y-2">
                <Label htmlFor="contacto_Telefono">Teléfono de Contacto</Label>
                <Input
                  id="contacto_Telefono"
                  type="tel"
                  {...register('contacto_Telefono')}
                  placeholder="Teléfono del contacto"
                  className={errors.contacto_Telefono ? 'border-red-500' : ''}
                />
                {errors.contacto_Telefono && (
                  <p className="text-sm text-red-500">{errors.contacto_Telefono.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              {...register('observaciones')}
              placeholder="Notas adicionales sobre el cliente..."
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
              {isEdit ? 'Actualizar' : 'Crear'} Cliente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
