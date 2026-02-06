import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X, AlertCircle } from 'lucide-react';
import { useReportarDanio } from '../hooks/useDanio';
import type { TipoDanio, DanioRequest } from '../types';

const danioSchema = z.object({
  reservaId: z.number().min(1, 'Reserva requerida'),
  activoId: z.number().min(1, 'Activo requerido'),
  descripcion: z.string().min(10, 'Descripción mínimo 10 caracteres'),
  tipo: z.enum(['Fisico', 'Funcional', 'Estetico', 'Faltante', 'Excedente'] as const),
  monto_estimado: z.number().min(0, 'Monto debe ser positivo'),
});

type DanioFormData = z.infer<typeof danioSchema>;

interface DanioFormProps {
  onSuccess?: () => void;
}

export function DanioForm({ onSuccess }: DanioFormProps) {
  const [evidencias, setEvidencias] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [apiError, setApiError] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<DanioFormData>({
    resolver: zodResolver(danioSchema),
  });

  const reportarMutation = useReportarDanio();

  const tiposDisponibles: TipoDanio[] = ['Fisico', 'Funcional', 'Estetico', 'Faltante', 'Excedente'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...evidencias, ...files].slice(0, 5); // máximo 5 imágenes
    setEvidencias(newFiles);

    // Preview
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreview(newPreviews);
  };

  const removeEvidence = (index: number) => {
    const newFiles = evidencias.filter((_, i) => i !== index);
    const newPreviews = preview.filter((_, i) => i !== index);
    setEvidencias(newFiles);
    setPreview(newPreviews);
  };

  const onSubmit = async (data: DanioFormData) => {
    setApiError('');

    try {
      // En un caso real, subirías los archivos primero a un servicio de almacenamiento
      // y obtendrías las URLs. Por ahora, usamos URLs vacías.
      const payload: DanioRequest = {
        ...data,
        evidencia_url: [], // Aquí irían las URLs de las imágenes subidas
      };

      await reportarMutation.mutateAsync(payload);
      
      setEvidencias([]);
      setPreview([]);
      reset();
      onSuccess?.();
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Error al reportar daño');
      console.error('Error reportando daño:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Reportar Daño</h2>

      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-700">{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Reserva ID */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            ID Reserva *
          </label>
          <input
            type="number"
            {...register('reservaId', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: 123"
          />
          {errors.reservaId && (
            <p className="text-red-600 text-sm mt-1">{errors.reservaId.message}</p>
          )}
        </div>

        {/* Activo ID */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            ID Activo *
          </label>
          <input
            type="number"
            {...register('activoId', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: 456"
          />
          {errors.activoId && (
            <p className="text-red-600 text-sm mt-1">{errors.activoId.message}</p>
          )}
        </div>

        {/* Tipo de Daño */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tipo de Daño *
          </label>
          <select
            {...register('tipo')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecciona un tipo...</option>
            {tiposDisponibles.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
          {errors.tipo && (
            <p className="text-red-600 text-sm mt-1">{errors.tipo.message}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descripción del Daño *
          </label>
          <textarea
            {...register('descripcion')}
            rows={4}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe detalladamente el daño..."
          />
          {errors.descripcion && (
            <p className="text-red-600 text-sm mt-1">{errors.descripcion.message}</p>
          )}
        </div>

        {/* Monto Estimado */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Monto Estimado ($) *
          </label>
          <input
            type="number"
            step="0.01"
            {...register('monto_estimado', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: 50000"
          />
          {errors.monto_estimado && (
            <p className="text-red-600 text-sm mt-1">{errors.monto_estimado.message}</p>
          )}
        </div>

        {/* Evidencias */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Evidencias (Imágenes)
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 text-sm mb-2">Arrastra imágenes aquí o haz clic para seleccionar</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-700">Seleccionar archivos</span>
            </label>
            <p className="text-slate-500 text-xs mt-2">Máximo 5 imágenes</p>
          </div>

          {/* Preview */}
          {preview.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {preview.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`Evidencia ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeEvidence(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={reportarMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {reportarMutation.isPending ? 'Reportando...' : 'Reportar Daño'}
        </button>
      </form>
    </div>
  );
}
