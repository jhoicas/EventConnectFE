import { useState } from 'react';
import { useEvaluarDanio } from '../hooks/useDanio';

interface DanioEvaluacionProps {
  danioId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DanioEvaluacion({ danioId, onSuccess, onCancel }: DanioEvaluacionProps) {
  const [montoFinal, setMontoFinal] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState('');

  const evaluarMutation = useEvaluarDanio();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!montoFinal || parseFloat(montoFinal) < 0) {
      setError('Ingresa un monto válido');
      return;
    }

    if (!observaciones.trim()) {
      setError('Las observaciones son requeridas');
      return;
    }

    try {
      await evaluarMutation.mutateAsync({
        id: danioId,
        data: {
          monto_final: parseFloat(montoFinal),
          observaciones_evaluacion: observaciones,
        }
      });
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al evaluar daño');
      console.error('Error evaluando daño:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Evaluar Daño</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Monto Final ($) *
            </label>
            <input
              type="number"
              step="0.01"
              value={montoFinal}
              onChange={(e) => setMontoFinal(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 25000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Observaciones *
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe la evaluación del daño..."
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={evaluarMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
              {evaluarMutation.isPending ? 'Evaluando...' : 'Guardar Evaluación'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-900 font-medium py-2 px-4 rounded-lg transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
