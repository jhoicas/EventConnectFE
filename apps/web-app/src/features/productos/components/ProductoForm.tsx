import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productoSchema, type ProductoFormData } from '@/lib/validations/productoSchema';
import { useCategorias } from '@/features/categorias/hooks/useCategorias';
import { useCreateProducto, useUpdateProducto } from '../hooks/useProductos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import type { Producto } from '@/types';
import { Loader2 } from 'lucide-react';

interface ProductoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  producto?: Producto;
  onSuccess?: () => void;
}

const UNIDADES_MEDIDA = ['Unidad', 'Paquete', 'Caja', 'Metro', 'Kilo'];

export const ProductoForm = ({
  open,
  onOpenChange,
  producto,
  onSuccess,
}: ProductoFormProps) => {
  const { data: categorias = [] } = useCategorias();
  const createMutation = useCreateProducto();
  const updateMutation = useUpdateProducto();
  const isEdit = !!producto;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      categoria_Id: 0,
      sku: '',
      nombre: '',
      descripcion: '',
      unidad_Medida: 'Unidad',
      precio_Alquiler_Dia: 0,
      cantidad_Stock: 0,
      stock_Minimo: 0,
      imagen_URL: '',
      es_Alquilable: true,
      es_Vendible: false,
      peso_Kg: undefined,
      dimensiones: '',
      observaciones: '',
    },
  });

  // Resetear formulario cuando cambia el producto o se abre/cierra
  useEffect(() => {
    if (open) {
      if (producto) {
        reset({
          categoria_Id: producto.categoria_Id,
          sku: producto.sku,
          nombre: producto.nombre,
          descripcion: producto.descripcion || '',
          unidad_Medida: producto.unidad_Medida || 'Unidad',
          precio_Alquiler_Dia: producto.precio_Alquiler_Dia || 0,
          cantidad_Stock: producto.cantidad_Stock || 0,
          stock_Minimo: producto.stock_Minimo || 0,
          imagen_URL: producto.imagen_URL || '',
          es_Alquilable: producto.es_Alquilable ?? true,
          es_Vendible: producto.es_Vendible ?? false,
          peso_Kg: producto.peso_Kg,
          dimensiones: producto.dimensiones || '',
          observaciones: producto.observaciones || '',
        });
      } else {
        reset({
          categoria_Id: 0,
          sku: '',
          nombre: '',
          descripcion: '',
          unidad_Medida: 'Unidad',
          precio_Alquiler_Dia: 0,
          cantidad_Stock: 0,
          stock_Minimo: 0,
          imagen_URL: '',
          es_Alquilable: true,
          es_Vendible: false,
          peso_Kg: undefined,
          dimensiones: '',
          observaciones: '',
        });
      }
    }
  }, [open, producto, reset]);

  const handleFormSubmit = async (data: ProductoFormData) => {
    try {
      // Convertir SKU a mayúsculas
      const formattedData = {
        ...data,
        sku: data.sku.toUpperCase(),
      };

      if (isEdit && producto) {
        await updateMutation.mutateAsync({
          id: producto.id,
          ...formattedData,
          requiere_Mantenimiento: producto.requiere_Mantenimiento,
          dias_Mantenimiento: producto.dias_Mantenimiento,
          activo: producto.activo,
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
      console.error('Error al guardar producto:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifica los datos del producto'
              : 'Completa el formulario para crear un nuevo producto'}
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

            {/* SKU */}
            <div className="space-y-2">
              <Label htmlFor="sku">
                SKU <span className="text-red-500">*</span>
              </Label>
              <Input
                id="sku"
                {...register('sku')}
                placeholder="PROD-001"
                className="uppercase"
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  register('sku').onChange(e);
                }}
              />
              {errors.sku && (
                <p className="text-sm text-red-500">{errors.sku.message}</p>
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
                placeholder="Nombre del producto"
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                {...register('descripcion')}
                placeholder="Descripción detallada del producto"
                rows={3}
              />
              {errors.descripcion && (
                <p className="text-sm text-red-500">{errors.descripcion.message}</p>
              )}
            </div>

            {/* Unidad de Medida */}
            <div className="space-y-2">
              <Label htmlFor="unidad_Medida">
                Unidad de Medida <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="unidad_Medida"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="unidad_Medida">
                      <SelectValue placeholder="Seleccione unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIDADES_MEDIDA.map((unidad) => (
                        <SelectItem key={unidad} value={unidad}>
                          {unidad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.unidad_Medida && (
                <p className="text-sm text-red-500">{errors.unidad_Medida.message}</p>
              )}
            </div>

            {/* Precio Alquiler Día */}
            <div className="space-y-2">
              <Label htmlFor="precio_Alquiler_Dia">
                Precio Alquiler/Día <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="precio_Alquiler_Dia"
                control={control}
                render={({ field }) => (
                  <Input
                    id="precio_Alquiler_Dia"
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    value={field.value || 0}
                    placeholder="0.00"
                  />
                )}
              />
              {errors.precio_Alquiler_Dia && (
                <p className="text-sm text-red-500">
                  {errors.precio_Alquiler_Dia.message}
                </p>
              )}
            </div>

            {/* Cantidad Stock */}
            <div className="space-y-2">
              <Label htmlFor="cantidad_Stock">
                Cantidad en Stock <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="cantidad_Stock"
                control={control}
                render={({ field }) => (
                  <Input
                    id="cantidad_Stock"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    value={field.value || 0}
                  />
                )}
              />
              {errors.cantidad_Stock && (
                <p className="text-sm text-red-500">
                  {errors.cantidad_Stock.message}
                </p>
              )}
            </div>

            {/* Stock Mínimo */}
            <div className="space-y-2">
              <Label htmlFor="stock_Minimo">
                Stock Mínimo <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="stock_Minimo"
                control={control}
                render={({ field }) => (
                  <Input
                    id="stock_Minimo"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    value={field.value || 0}
                  />
                )}
              />
              {errors.stock_Minimo && (
                <p className="text-sm text-red-500">
                  {errors.stock_Minimo.message}
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

            {/* Es Alquilable */}
            <div className="flex items-center space-x-2">
              <Controller
                name="es_Alquilable"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="es_Alquilable"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label
                htmlFor="es_Alquilable"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Es Alquilable
              </Label>
            </div>

            {/* Es Vendible */}
            <div className="flex items-center space-x-2">
              <Controller
                name="es_Vendible"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="es_Vendible"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label
                htmlFor="es_Vendible"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Es Vendible
              </Label>
            </div>

            {/* Peso */}
            <div className="space-y-2">
              <Label htmlFor="peso_Kg">Peso (Kg)</Label>
              <Controller
                name="peso_Kg"
                control={control}
                render={({ field }) => (
                  <Input
                    id="peso_Kg"
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
              {errors.peso_Kg && (
                <p className="text-sm text-red-500">{errors.peso_Kg.message}</p>
              )}
            </div>

            {/* Dimensiones */}
            <div className="space-y-2">
              <Label htmlFor="dimensiones">Dimensiones</Label>
              <Input
                id="dimensiones"
                {...register('dimensiones')}
                placeholder="Alto x Ancho x Largo"
              />
              {errors.dimensiones && (
                <p className="text-sm text-red-500">{errors.dimensiones.message}</p>
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
