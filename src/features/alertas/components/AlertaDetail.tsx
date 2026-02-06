import { useState } from 'react';
import { useIniciarAlerta, useResolverAlerta, useAsignarAlerta } from '../hooks/useAlerta';
import { Clock, CheckCircle, User, FileText } from 'lucide-react';
import type { Alerta } from '../types';

interface AlertaDetailProps {
  alerta: Alerta;
}

export function AlertaDetail({ alerta }: AlertaDetailProps) {
  const [showAsignar, setShowAsignar] = useState(false);
  const [showResolver, setShowResolver] = useState(false);
  const [usuarioId, setUsuarioId] = useState('');
  const [prioridad, setPrioridad] = useState(5);
  const [notas, setNotas] = useState('');

  const iniciarMutation = useIniciarAlerta();
  const resolverMutation = useResolverAlerta();
  const asignarMutation = useAsignarAlerta();

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'Critica':
        return 'bg-red-100 border-red-300 text-red-700';
      case 'Alta':
        return 'bg-orange-100 border-orange-300 text-orange-700';
      case 'Media':
        return 'bg-yellow-100 border-yellow-300 text-yellow-700';
      default:
        return 'bg-green-100 border-green-300 text-green-700';
    }
  };

  const handleIniciar = async () => {
    if (!confirm('¿Marcar esta alerta como en proceso?')) return;
    await iniciarMutation.mutateAsync(alerta.id);
  };

  const handleResolver = async () => {
    if (!notas.trim()) {
      alert('Ingresa notas de resolución');
      return;
    }
    await resolverMutation.mutateAsync({
      id: alerta.id,
      data: { notas_resolucion: notas }
    });
    setShowResolver(false);
    setNotas('');
  };

  const handleAsignar = async () => {
    if (!usuarioId) {
      alert('Selecciona un usuario');
      return;
    }
    await asignarMutation.mutateAsync({
      id: alerta.id,
      data: { usuarioAsignadoId: parseInt(usuarioId), prioridad }
    });
    setShowAsignar(false);
    setUsuarioId('');
    setPrioridad(5);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-lg border-2 p-6 ${getSeveridadColor(alerta.severidad)}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">Alerta #{alerta.id}</h2>
            <p className="text-sm opacity-75">{alerta.activo_nombre || `Activo ${alerta.activoId}`}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Tipo</p>
            <p className="font-bold">{alerta.tipo}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="opacity-75">Severidad</p>
            <p className="font-semibold">{alerta.severidad}</p>
          </div>
          <div>
            <p className="opacity-75">Estado</p>
            <p className="font-semibold">{alerta.estado}</p>
          </div>
          <div>
            <p className="opacity-75">Prioridad</p>
            <p className="font-semibold">{alerta.prioridad || '-'}</p>
          </div>
          <div>
            <p className="opacity-75">Creada por</p>
            <p className="font-semibold">{alerta.usuario_creador}</p>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Descripción</h3>
        <p className="text-slate-700 whitespace-pre-wrap">{alerta.descripcion}</p>
        {alerta.fecha_vencimiento && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-600">Fecha de vencimiento:</p>
            <p className="font-semibold text-slate-900">
              {new Date(alerta.fecha_vencimiento).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Asignación */}
      {alerta.usuario_asignado && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Asignación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-700 opacity-75">Asignado a</p>
              <p className="font-semibold text-blue-900">{alerta.usuario_asignado}</p>
            </div>
            {alerta.fecha_asignacion && (
              <div>
                <p className="text-sm text-blue-700 opacity-75">Fecha de asignación</p>
                <p className="font-semibold text-blue-900">
                  {new Date(alerta.fecha_asignacion).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline */}
      {alerta.historial && alerta.historial.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Historial
          </h3>
          <div className="space-y-4">
            {alerta.historial.map((evento, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  {idx < alerta.historial.length - 1 && <div className="w-0.5 h-12 bg-slate-200"></div>}
                </div>
                <div className="pb-4">
                  <p className="font-semibold text-slate-900">{evento.estado}</p>
                  <p className="text-sm text-slate-600">
                    {new Date(evento.fecha).toLocaleString()} por {evento.usuario}
                  </p>
                  {evento.notas && <p className="text-sm text-slate-700 mt-1">{evento.notas}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolución */}
      {alerta.notas_resolucion && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Resolución
          </h3>
          <p className="text-green-700">{alerta.notas_resolucion}</p>
        </div>
      )}

      {/* Acciones */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Acciones</h3>
        <div className="space-y-2">
          {alerta.estado === 'Pendiente' && (
            <>
              <button
                onClick={() => setShowAsignar(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                Asignar
              </button>
            </>
          )}

          {alerta.estado === 'Asignada' && (
            <>
              <button
                onClick={handleIniciar}
                disabled={iniciarMutation.isPending}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                {iniciarMutation.isPending ? 'Iniciando...' : 'Iniciar Trabajo'}
              </button>
            </>
          )}

          {alerta.estado === 'En_Proceso' && (
            <>
              <button
                onClick={() => setShowResolver(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                Resolver
              </button>
            </>
          )}

          {alerta.estado !== 'Resuelta' && alerta.estado === 'Pendiente' && (
            <button
              onClick={() => setShowAsignar(true)}
              className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Reasignar
            </button>
          )}
        </div>
      </div>

      {/* Modal Asignar */}
      {showAsignar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Asignar Alerta</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Usuario ID
                </label>
                <input
                  type="number"
                  value={usuarioId}
                  onChange={(e) => setUsuarioId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Ingresa ID del usuario"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Prioridad (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={prioridad}
                  onChange={(e) => setPrioridad(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-center text-slate-600 mt-2">{prioridad}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAsignar}
                  disabled={asignarMutation.isPending}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {asignarMutation.isPending ? 'Asignando...' : 'Asignar'}
                </button>
                <button
                  onClick={() => setShowAsignar(false)}
                  className="flex-1 bg-slate-300 text-slate-900 py-2 rounded-lg hover:bg-slate-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Resolver */}
      {showResolver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Resolver Alerta
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notas de Resolución
                </label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Describe cómo se resolvió..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleResolver}
                  disabled={resolverMutation.isPending}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {resolverMutation.isPending ? 'Resolviendo...' : 'Resolver'}
                </button>
                <button
                  onClick={() => setShowResolver(false)}
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
