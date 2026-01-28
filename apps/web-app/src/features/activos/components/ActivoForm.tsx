import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { activoSchema, type ActivoFormData } from '@/lib/validations/activoSchema';
import { useCategorias } from '@/features/categorias/hooks/useCategorias';
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
import type { Activo } from '@/types';
import { Loader2 } from 'lucide-react';

interface ActivoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activo?: Activo;
  onSubmit: (data: ActivoFormData) => void;
  isLoading?: boolean;
}

export const ActivoForm = ({
  open,
  onOpenChange,
  activo,
  onSubmit,
  isLoading = false,
}: ActivoFormProps) => {
  const { data: categorias = [] } = useCategorias();
  const isEdit = !!activo;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ActivoFormData>({
    resolver: zodResolver(activoSchema),
    defaultValues: {
      categoria_Id: 0,
      codigo_Activo: '',
      nombre: '',
      descripcion: '',
      marca: '',
      modelo: '',
      numero_Serie: '',
      fecha_Adquisicion: '',
      valor_Adquisicion: 0,
      vida_Util_Meses: 0,
      ubicacion_Fisica: '',
      imagen_URL: '',
      observaciones: '',
      bodega_Id: undefined,
    },
  });

  // Resetear formulario cuando cambia el activo o se abre/cierra
  useEffect(() => {
    if (open) {
      if (activo) {
        reset({
          categoria_Id: activo.categoria_Id,
          codigo_Activo: activo.codigo_Activo,
          nombre: activo.nombre,
          descripcion: activo.descripcion || '',
          marca: activo.marca || '',
          modelo: activo.modelo || '',
          numero_Serie: activo.numero_Serie || '',
          fecha_Adquisicion: activo.fecha_Adquisicion?.split('T')[0] || '',
          valor_Adquisicion: activo.valor_Adquisicion || 0,
          vida_Util_Meses: activo.vida_Util_Meses || 0,
          ubicacion_Fisica: activo.ubicacion_Fisica || '',
          imagen_URL: activo.imagen_URL || '',
          observaciones: activo.observaciones || '',
          bodega_Id: activo.bodega_Id,
        });
      } else {
        reset({
          categoria_Id: 0,
          codigo_Activo: '',
          nombre: '',
          descripcion: '',
          marca: '',
          modelo: '',
          numero_Serie: '',
          fecha_Adquisicion: '',
          valor_Adquisicion: 0,
          vida_Util_Meses: 0,
          ubicacion_Fisica: '',
          imagen_URL: '',
          observaciones: '',
          bodega_Id: undefined,
        });
      }
    }
  }, [open, activo, reset]);

  const handleFormSubmit = (data: ActivoFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Activo' : 'Crear Activo'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifica los datos del activo'
              : 'Completa el formulario para crear un nuevo activo'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Categoría */}
            <div className="space-y-2">
              <Label htmlFor="categoria_Id">
                Categoría <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="categoria_Id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <SelectTrigger id="categoria_Id">
                      <SelectValue placeholder="Seleccione una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoria_Id && (
                <p className="text-sm text-red-500">{errors.categoria_Id.message}</p>
              )}
            </div>

            {/* Código */}
            <div className="space-y-2">
              <Label htmlFor="codigo_Activo">
                Código <span className="text-red-500">*</span>
              </Label>
              <Input
                id="codigo_Activo"
                {...register('codigo_Activo')}
                placeholder="ACT-001"
              />
              {errors.codigo_Activo && (
                <p className="text-sm text-red-500">{errors.codigo_Activo.message}</p>
              )}
            </div>

            {/* Nombre */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nombre">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                {...register('nombre')}
                placeholder="Nombre del activo"
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            {/* Marca */}
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input id="marca" {...register('marca')} placeholder="Marca" />
              {errors.marca && (
                <p className="text-sm text-red-500">{errors.marca.message}</p>
              )}
            </div>

            {/* Modelo */}
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input id="modelo" {...register('modelo')} placeholder="Modelo" />
              {errors.modelo && (
                <p className="text-sm text-red-500">{errors.modelo.message}</p>
              )}
            </div>

            {/* Número de Serie */}
            <div className="space-y-2">
              <Label htmlFor="numero_Serie">Número de Serie</Label>
              <Input
                id="numero_Serie"
                {...register('numero_Serie')}
                placeholder="Número de serie"
              />
              {errors.numero_Serie && (
                <p className="text-sm text-red-500">{errors.numero_Serie.message}</p>
              )}
            </div>

            {/* Fecha de Adquisición */}
            <div className="space-y-2">
              <Label htmlFor="fecha_Adquisicion">Fecha de Adquisición</Label>
              <Input
                id="fecha_Adquisicion"
                type="date"
                {...register('fecha_Adquisicion')}
              />
              {errors.fecha_Adquisicion && (
                <p className="text-sm text-red-500">
                  {errors.fecha_Adquisicion.message}
                </p>
              )}
            </div>

            {/* Valor de Adquisición */}
            <div className="space-y-2">
              <Label htmlFor="valor_Adquisicion">Valor de Adquisición</Label>
              <Controller
                name="valor_Adquisicion"
                control={control}
                render={({ field }) => (
                  <Input
                    id="valor_Adquisicion"
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    value={field.value || 0}
                  />
                )}
              />
              {errors.valor_Adquisicion && (
                <p className="text-sm text-red-500">
                  {errors.valor_Adquisicion.message}
                </p>
              )}
            </div>

            {/* Vida Útil en Meses */}
            <div className="space-y-2">
              <Label htmlFor="vida_Util_Meses">Vida Útil (Meses)</Label>
              <Controller
                name="vida_Util_Meses"
                control={control}
                render={({ field }) => (
                  <Input
                    id="vida_Util_Meses"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    value={field.value || 0}
                  />
                )}
              />
              {errors.vida_Util_Meses && (
                <p className="text-sm text-red-500">
                  {errors.vida_Util_Meses.message}
                </p>
              )}
            </div>

            {/* Ubicación Física */}
            <div className="space-y-2">
              <Label htmlFor="ubicacion_Fisica">Ubicación Física</Label>
              <Input
                id="ubicacion_Fisica"
                {...register('ubicacion_Fisica')}
                placeholder="Bodega A - Estante 5"
              />
              {errors.ubicacion_Fisica && (
                <p className="text-sm text-red-500">
                  {errors.ubicacion_Fisica.message}
                </p>
              )}
            </div>

            {/* URL de Imagen */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="imagen_URL">URL de Imagen</Label>
              <Input
                id="imagen_URL"
                {...register('imagen_URL')}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {errors.imagen_URL && (
                <p className="text-sm text-red-500">{errors.imagen_URL.message}</p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                {...register('descripcion')}
                placeholder="Descripción detallada del activo"
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
