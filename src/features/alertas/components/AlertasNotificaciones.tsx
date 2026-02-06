import { useEffect, useState } from 'react';
import { Bell, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAlertaCriticas } from '../hooks/useAlerta';
import type { AlertaCritica } from '../types';

interface ToastNotification {
  id: string;
  alerta: AlertaCritica;
  timestamp: number;
}

export function AlertasNotificaciones() {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [readAlerts, setReadAlerts] = useState<Set<number>>(new Set());
  const { data: criticasData } = useAlertaCriticas(true);

  // Simular recibimiento de alertas críticas nuevas
  useEffect(() => {
    if (criticasData && Array.isArray(criticasData)) {
      const newAlertas = criticasData.filter(
        (a: AlertaCritica) => !readAlerts.has(a.id) && !toasts.some((t) => t.alerta.id === a.id)
      );

      newAlertas.forEach((alerta: AlertaCritica) => {
        const id = `toast-${alerta.id}-${Date.now()}`;
        setToasts((prev) => [...prev, { id, alerta, timestamp: Date.now() }]);

        // Reproducir sonido de notificación
        playNotificationSound();

        // Auto-remover después de 6 segundos
        setTimeout(() => {
          removeToast(id);
        }, 6000);
      });
    }
  }, [criticasData]);

  const playNotificationSound = () => {
    // Crear un sonido de notificación usando Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio context not available');
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markAsRead = (alertaId: number) => {
    setReadAlerts((prev) => new Set(prev).add(alertaId));
    setToasts((prev) => prev.filter((t) => t.alerta.id !== alertaId));
  };

  const unreadCount = (criticasData || []).filter(
    (a: AlertaCritica) => !readAlerts.has(a.id)
  ).length;

  return (
    <>
      {/* Toast Notifications - Bottom Right Corner */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-red-600 text-white rounded-lg shadow-lg overflow-hidden animate-slide-in"
          >
            <div className="p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 animate-pulse" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">Alerta Crítica</p>
                <p className="text-xs text-red-100 truncate">
                  {toast.alerta.activo_nombre || `Activo ${toast.alerta.activoId}`}
                </p>
                <p className="text-xs text-red-100 line-clamp-2 mt-1">
                  {toast.alerta.descripcion}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 hover:bg-red-700 p-1 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="h-1 bg-red-400 animate-progress"></div>
          </div>
        ))}
      </div>

      {/* Notification Badge for Navbar */}
      {unreadCount > 0 && (
        <div className="fixed top-4 right-4 z-40">
          <div className="bg-red-600 text-white rounded-full p-3 shadow-lg animate-bounce">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        </div>
      )}

      {/* Notification Center Panel */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Centro de Notificaciones
            </h3>
            {unreadCount > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount} sin leer
              </span>
            )}
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {criticasData && Array.isArray(criticasData) && criticasData.length > 0 ? (
              criticasData.map((alerta: AlertaCritica) => (
                <div
                  key={alerta.id}
                  className={`p-4 rounded-lg border-2 transition ${
                    readAlerts.has(alerta.id)
                      ? 'border-slate-200 bg-slate-50'
                      : 'border-red-300 bg-red-50'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {readAlerts.has(alerta.id) ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">
                          {alerta.activo_nombre || `Activo ${alerta.activoId}`}
                        </p>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                          {alerta.severidad}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 mt-1">{alerta.descripcion}</p>
                      <div className="flex justify-between items-center mt-2 text-xs text-slate-600">
                        <span>{alerta.tipo}</span>
                        <span>
                          {alerta.fecha_creacion
                            ? new Date(alerta.fecha_creacion).toLocaleDateString('es-ES', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'Sin fecha'}
                        </span>
                      </div>
                    </div>
                    {!readAlerts.has(alerta.id) && (
                      <button
                        onClick={() => markAsRead(alerta.id)}
                        className="flex-shrink-0 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                      >
                        Marcar
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-600">No hay alertas críticas en este momento</p>
              </div>
            )}
          </div>
        </div>

        {/* Clear read notifications */}
        {readAlerts.size > 0 && (
          <button
            onClick={() => setReadAlerts(new Set())}
            className="w-full text-slate-600 hover:text-slate-900 text-sm font-medium py-2 transition"
          >
            Limpiar notificaciones leídas
          </button>
        )}
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-progress {
          animation: progress 6s linear;
        }
      `}</style>
    </>
  );
}
