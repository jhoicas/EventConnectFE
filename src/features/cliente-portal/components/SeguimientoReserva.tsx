import { useSeguimiento } from '../hooks/useClientePortal';
import { Truck, DollarSign, Clock } from 'lucide-react';

interface SeguimientoReservaProps {
  reservaId: number;
  onBack?: () => void;
}

export function SeguimientoReserva({ reservaId, onBack }: SeguimientoReservaProps) {
  const { data: seguimiento, isLoading } = useSeguimiento(reservaId);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Cargando seguimiento...</p>
      </div>
    );
  }

  if (!seguimiento) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow-md">
        <p className="text-slate-600">No se pudo cargar el seguimiento</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          ← Volver a mis reservas
        </button>
      )}

      {/* Estado General */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Seguimiento Reserva #{seguimiento.reservaId}</h2>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-lg font-bold text-white ${
            seguimiento.estado === 'Finalizada' ? 'bg-green-600' :
            seguimiento.estado === 'En_Entrega' ? 'bg-blue-600' :
            seguimiento.estado === 'Confirmada' ? 'bg-purple-600' :
            'bg-slate-600'
          }`}>
            {seguimiento.estado}
          </div>
        </div>
      </div>

      {/* Logística */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-600" />
          Información de Entrega
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600">Estado</p>
            <p className="font-bold text-slate-900">{seguimiento.logistica.estado}</p>
          </div>
          {seguimiento.logistica.ubicacion && (
            <div>
              <p className="text-sm text-slate-600">Ubicación Actual</p>
              <p className="font-bold text-slate-900">{seguimiento.logistica.ubicacion}</p>
            </div>
          )}
          {seguimiento.logistica.transportista && (
            <div>
              <p className="text-sm text-slate-600">Transportista</p>
              <p className="font-bold text-slate-900">{seguimiento.logistica.transportista}</p>
            </div>
          )}
          {seguimiento.logistica.numero_seguimiento && (
            <div>
              <p className="text-sm text-slate-600">Número de Seguimiento</p>
              <p className="font-mono text-sm font-bold text-slate-900">{seguimiento.logistica.numero_seguimiento}</p>
            </div>
          )}
          {seguimiento.logistica.fecha_estimada_entrega && (
            <div>
              <p className="text-sm text-slate-600">Estimado de Entrega</p>
              <p className="font-bold text-slate-900">
                {new Date(seguimiento.logistica.fecha_estimada_entrega).toLocaleDateString()}
              </p>
            </div>
          )}
          {seguimiento.logistica.fecha_entrega_real && (
            <div>
              <p className="text-sm text-slate-600">Entregado</p>
              <p className="font-bold text-green-600">
                {new Date(seguimiento.logistica.fecha_entrega_real).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Estado de Pagos
        </h3>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
            <span className="text-slate-600">Total:</span>
            <span className="font-bold text-slate-900">${seguimiento.pagos.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
            <span className="text-green-700">Pagado:</span>
            <span className="font-bold text-green-700">${seguimiento.pagos.pagado.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-orange-50 rounded border border-orange-200">
            <span className="text-orange-700">Pendiente:</span>
            <span className="font-bold text-orange-700">${seguimiento.pagos.pendiente.toLocaleString()}</span>
          </div>
        </div>

        {/* Detalles de Pagos */}
        {seguimiento.pagos.detalles.length > 0 && (
          <div className="border-t border-slate-200 pt-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Transacciones:</p>
            <div className="space-y-2">
              {seguimiento.pagos.detalles.map((pago, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 rounded text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">{new Date(pago.fecha).toLocaleDateString()}</p>
                    <p className="text-xs text-slate-600">{pago.metodo || 'Transferencia'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">${pago.monto.toLocaleString()}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      pago.estado === 'Pagado' ? 'bg-green-100 text-green-700' :
                      pago.estado === 'Procesando' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {pago.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Historial de Estados */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-600" />
          Historial
        </h3>
        <div className="space-y-4">
          {seguimiento.historial.map((evento, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-purple-600 mt-1.5"></div>
                {idx < seguimiento.historial.length - 1 && <div className="w-0.5 h-12 bg-slate-200"></div>}
              </div>
              <div className="pb-4">
                <p className="font-semibold text-slate-900">{evento.estado}</p>
                <p className="text-sm text-slate-600">{new Date(evento.fecha).toLocaleString()}</p>
                {evento.descripcion && <p className="text-sm text-slate-700 mt-1">{evento.descripcion}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-2">
        <button
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition"
        >
          Descargar Comprobante
        </button>
        <button
          className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded transition"
        >
          Contactar Soporte
        </button>
      </div>
    </div>
  );
}
