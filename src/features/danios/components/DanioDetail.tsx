import { useState } from 'react';
import { useDanioDetail, useEvaluarDanio, useConfirmarDanio, useMarcarReparado, useMarcarPerdidaTotal, useRechazarDanio } from '../hooks/useDanio';
import { AlertCircle, Image as ImageIcon } from 'lucide-react';

interface DanioDetailProps {
  id: number;
}

export function DanioDetail({ id }: DanioDetailProps) {
  const [showEvaluacion, setShowEvaluacion] = useState(false);
  const [showReparar, setShowReparar] = useState(false);
  const [showRechazar, setShowRechazar] = useState(false);
  const [rechazoMotivo, setRechazoMotivo] = useState('');

  const { data: danio, isLoading, error } = useDanioDetail(id);

  const confirmarMutation = useConfirmarDanio();
  const repararMutation = useMarcarReparado();
  const perdidaMutation = useMarcarPerdidaTotal();
  const rechazarMutation = useRechazarDanio();
  const evaluarMutation = useEvaluarDanio();

  // Simplified role check - in production, use proper auth store
  const isAdmin = true;

  const handleConfirmar = async () => {
    if (!confirm('¿Confirmar este daño?')) return;
    try {
      await confirmarMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error confirmando daño:', error);
    }
  };

  const handlePerdidaTotal = async () => {
    if (!confirm('¿Marcar como pérdida total?')) return;
    try {
      await perdidaMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error marcando pérdida total:', error);
    }
  };

  const handleRechazar = async () => {
    if (!rechazoMotivo.trim()) {
      alert('Ingresa un motivo de rechazo');
      return;
    }
    try {
      await rechazarMutation.mutateAsync({
        id,
        data: { motivo_rechazo: rechazoMotivo }
      });
      setShowRechazar(false);
      setRechazoMotivo('');
    } catch (error) {
      console.error('Error rechazando daño:', error);
    }
  };

  if (isLoading) return <p className="text-center text-slate-600">Cargando...</p>;
  if (error || !danio) return <p className="text-center text-red-600">Error al cargar daño</p>;

  const estadoColor = {
    'Reportado': 'bg-yellow-50 border-yellow-200',
    'En_Evaluacion': 'bg-orange-50 border-orange-200',
    'Confirmado': 'bg-blue-50 border-blue-200',
    'En_Reparacion': 'bg-purple-50 border-purple-200',
    'Reparado': 'bg-green-50 border-green-200',
    'Perdida_Total': 'bg-red-50 border-red-200',
    'Rechazado': 'bg-gray-50 border-gray-200',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-lg border-2 p-6 ${estadoColor[danio.estado]}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Daño #{danio.id}</h2>
            <p className="text-slate-600 text-sm">Reserva #{danio.reserva_numero || danio.reservaId}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-slate-900">${danio.monto_estimado.toLocaleString()}</p>
            <p className="text-slate-600 text-sm">Monto estimado</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-slate-600">Tipo</p>
            <p className="font-semibold text-slate-900">{danio.tipo}</p>
          </div>
          <div>
            <p className="text-slate-600">Estado</p>
            <p className="font-semibold text-slate-900">{danio.estado}</p>
          </div>
          <div>
            <p className="text-slate-600">Activo</p>
            <p className="font-semibold text-slate-900">{danio.activo_nombre || `Activo ${danio.activoId}`}</p>
          </div>
          <div>
            <p className="text-slate-600">Reportado por</p>
            <p className="font-semibold text-slate-900">{danio.usuario_reporte}</p>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Descripción del Daño</h3>
        <p className="text-slate-700 whitespace-pre-wrap">{danio.descripcion}</p>
      </div>

      {/* Evidencias */}
      {danio.evidencia_url && danio.evidencia_url.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Galería de Evidencias
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {danio.evidencia_url.map((url, idx) => (
              <div key={idx} className="group relative">
                <img
                  src={url}
                  alt={`Evidencia ${idx + 1}`}
                  className="w-full h-40 object-cover rounded-lg hover:opacity-75 transition cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evaluación */}
      {danio.observaciones_evaluacion && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Evaluación</h3>
          {danio.monto_final && (
            <div className="mb-4">
              <p className="text-slate-600">Monto Final</p>
              <p className="text-2xl font-bold text-slate-900">${danio.monto_final.toLocaleString()}</p>
            </div>
          )}
          <div className="bg-slate-50 rounded p-4">
            <p className="text-slate-700">{danio.observaciones_evaluacion}</p>
          </div>
        </div>
      )}

      {/* Reparación */}
      {danio.costo_reparacion && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Reparación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-600">Costo de Reparación</p>
              <p className="text-2xl font-bold text-slate-900">${danio.costo_reparacion.toLocaleString()}</p>
            </div>
            {danio.resolucion && (
              <div>
                <p className="text-slate-600">Resolución</p>
                <p className="text-slate-900">{danio.resolucion}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rechazo */}
      {danio.motivo_rechazo && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Motivo del Rechazo
          </h3>
          <p className="text-red-700">{danio.motivo_rechazo}</p>
        </div>
      )}

      {/* Acciones */}
      {isAdmin && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Acciones</h3>

          {danio.estado === 'Reportado' && (
            <div className="space-y-2">
              <button
                onClick={() => setShowEvaluacion(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                Evaluar Daño
              </button>
            </div>
          )}

          {danio.estado === 'En_Evaluacion' && (
            <div className="space-y-2">
              <button
                onClick={handleConfirmar}
                disabled={confirmarMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                {confirmarMutation.isPending ? 'Confirmando...' : 'Confirmar Daño'}
              </button>
            </div>
          )}

          {danio.estado === 'Confirmado' && (
            <div className="space-y-2">
              <button
                onClick={() => setShowReparar(true)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                Registrar Reparación
              </button>
              <button
                onClick={handlePerdidaTotal}
                disabled={perdidaMutation.isPending}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                {perdidaMutation.isPending ? 'Procesando...' : 'Marcar como Pérdida Total'}
              </button>
            </div>
          )}

          {['Reportado', 'En_Evaluacion'].includes(danio.estado) && (
            <button
              onClick={() => setShowRechazar(true)}
              className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Rechazar Reporte
            </button>
          )}
        </div>
      )}

      {/* Modal Evaluación */}
      {showEvaluacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Evaluar Daño</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                evaluarMutation.mutate({
                  id: id,
                  data: {
                    monto_final: parseFloat(formData.get('monto') as string),
                    observaciones_evaluacion: formData.get('observaciones') as string,
                  }
                });
                setShowEvaluacion(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Monto Final ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="monto"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones</label>
                <textarea
                  name="observaciones"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowEvaluacion(false)}
                  className="flex-1 bg-slate-300 text-slate-900 py-2 rounded-lg hover:bg-slate-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Reparación */}
      {showReparar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Registrar Reparación</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                repararMutation.mutate({
                  id,
                  data: {
                    costo_reparacion: parseFloat(formData.get('costo') as string),
                    resolucion: formData.get('resolucion') as string,
                  }
                });
                setShowReparar(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Costo ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="costo"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea
                  name="resolucion"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={repararMutation.isPending}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowReparar(false)}
                  className="flex-1 bg-slate-300 text-slate-900 py-2 rounded-lg hover:bg-slate-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Rechazo */}
      {showRechazar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Rechazar Reporte</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Motivo del Rechazo</label>
                <textarea
                  value={rechazoMotivo}
                  onChange={(e) => setRechazoMotivo(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Describe el motivo..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRechazar}
                  disabled={rechazarMutation.isPending}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => setShowRechazar(false)}
                  className="flex-1 bg-slate-300 text-slate-900 py-2 rounded-lg hover:bg-slate-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
