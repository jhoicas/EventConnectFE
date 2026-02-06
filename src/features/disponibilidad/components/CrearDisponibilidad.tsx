import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, AlertCircle } from 'lucide-react';
import { useCrearDisponibilidad } from '../hooks/useDisponibilidad';
import type { EstadoDisponibilidad } from '../types';

const crearDisponibilidadSchema = z.object({
  activo_Id: z.number().min(1, 'Selecciona un activo'),
  fecha_inicio: z.string().min(1, 'Fecha de inicio requerida'),
  fecha_fin: z.string().min(1, 'Fecha de fin requerida'),
  cantidad_disponible: z.number().min(1, 'Cantidad debe ser mayor a 0'),
  estado: z.enum(['Disponible', 'Reservado', 'Mantenimiento', 'No_Disponible']),
  precio_especial: z.number().optional(),
  observaciones: z.string().optional(),
});

type CrearDisponibilidadFormData = z.infer<typeof crearDisponibilidadSchema>;

interface CrearDisponibilidadProps {
  activoId?: number;
  onSuccess?: () => void;
}

const estadosOptions: Array<{ value: EstadoDisponibilidad; label: string }> = [
  { value: 'Disponible', label: 'Disponible' },
  { value: 'Reservado', label: 'Reservado' },
  { value: 'Mantenimiento', label: 'Mantenimiento' },
  { value: 'No_Disponible', label: 'No Disponible' },
];

export const CrearDisponibilidad = ({
  activoId,
  onSuccess,
}: CrearDisponibilidadProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const crearMutation = useCrearDisponibilidad();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CrearDisponibilidadFormData>({
    resolver: zodResolver(crearDisponibilidadSchema),
    defaultValues: {
      activo_Id: activoId || 0,
      fecha_inicio: '',
      fecha_fin: '',
      cantidad_disponible: 1,
      estado: 'Disponible',
      precio_especial: undefined,
      observaciones: '',
    },
  });

  const fechaInicio = watch('fecha_inicio');
  const fechaFin = watch('fecha_fin');
  const estado = watch('estado');

  const onSubmit = async (data: CrearDisponibilidadFormData) => {
    try {
      await crearMutation.mutateAsync(data);
      reset();
      setIsExpanded(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error al crear disponibilidad:', error);
    }
  };

  const calcularDias = (): number => {
    if (!fechaInicio || !fechaFin) return 0;
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const dias = calcularDias();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 px-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
      >
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-indigo-600">
            {isExpanded ? 'Ocultar Formulario' : 'Crear Disponibilidad'}
          </span>
        </div>
      </button>

      {isExpanded && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Activo ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activo <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="ID del activo"
                {...register('activo_Id', { valueAsNumber: true })}
                disabled={!!activoId}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition ${
                  errors.activo_Id ? 'border-red-500' : 'border-gray-300'
                } ${activoId ? 'bg-gray-100' : ''}`}
              />
              {errors.activo_Id && (
                <p className="text-red-500 text-sm mt-1">{errors.activo_Id.message}</p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                {...register('estado')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              >
                {estadosOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.estado && (
                <p className="text-red-500 text-sm mt-1">{errors.estado.message}</p>
              )}
            </div>

            {/* Fecha Inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('fecha_inicio')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition ${
                  errors.fecha_inicio ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fecha_inicio && (
                <p className="text-red-500 text-sm mt-1">{errors.fecha_inicio.message}</p>
              )}
            </div>

            {/* Fecha Fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('fecha_fin')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition ${
                  errors.fecha_fin ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fecha_fin && (
                <p className="text-red-500 text-sm mt-1">{errors.fecha_fin.message}</p>
              )}
            </div>

            {/* Cantidad Disponible */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad Disponible <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                {...register('cantidad_disponible', { valueAsNumber: true })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition ${
                  errors.cantidad_disponible ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cantidad_disponible && (
                <p className="text-red-500 text-sm mt-1">{errors.cantidad_disponible.message}</p>
              )}
            </div>

            {/* Precio Especial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Especial <span className="text-gray-400">(Opcional)</span>
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Ej: 50000"
                {...register('precio_especial', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones <span className="text-gray-400">(Opcional)</span>
            </label>
            <textarea
              placeholder="Notas o detalles adicionales..."
              {...register('observaciones')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Resumen */}
          {dias > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Duración</p>
                  <p className="font-bold text-blue-600">{dias} día(s)</p>
                </div>
                <div>
                  <p className="text-gray-600">Unidades/Día</p>
                  <p className="font-bold text-blue-600">{watch('cantidad_disponible')}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Disponible</p>
                  <p className="font-bold text-blue-600">
                    {dias * watch('cantidad_disponible')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Estado</p>
                  <p className="font-bold text-blue-600">{estado}</p>
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || crearMutation.isPending}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting || crearMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Disponibilidad'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setIsExpanded(false);
              }}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
          </div>

          {crearMutation.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">Error al crear disponibilidad</p>
            </div>
          )}

          {crearMutation.isSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">✓ Disponibilidad creada exitosamente</p>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
