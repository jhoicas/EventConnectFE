import { useMisCotizaciones } from '../hooks/useClientePortal';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { EstadoCotizacion } from '../types';

export function MisCotizaciones() {
  const { data, isLoading } = useMisCotizaciones();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const getEstadoColor = (estado: EstadoCotizacion) => {
    switch (estado) {
      case 'Solicitada':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Respondida':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Aceptada':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Rechazada':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Mis Cotizaciones
        </h2>

        {isLoading ? (
          <p className="text-center text-slate-600 py-8">Cargando cotizaciones...</p>
        ) : data?.items && data.items.length > 0 ? (
          <div className="space-y-3">
            {data.items.map((cotizacion) => (
              <div
                key={cotizacion.id}
                className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition"
              >
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50"
                  onClick={() => setExpandedId(expandedId === cotizacion.id ? null : cotizacion.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-slate-900">Cotización #{cotizacion.id}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${getEstadoColor(cotizacion.estado)}`}>
                        {cotizacion.estado}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      Solicitada: {new Date(cotizacion.fecha_solicitud).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right mr-3">
                    <p className="font-bold text-slate-900">${cotizacion.total.toLocaleString()}</p>
                    {cotizacion.fecha_expiracion && (
                      <p className="text-xs text-orange-600 font-semibold">
                        Vence: {new Date(cotizacion.fecha_expiracion).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <button className="p-1 hover:bg-slate-100 rounded">
                    {expandedId === cotizacion.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Detalles Expandidos */}
                {expandedId === cotizacion.id && (
                  <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-2">Detalles:</p>
                      <div className="space-y-1">
                        {cotizacion.detalles.map((detalle, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-slate-600">Activo {detalle.activoId} x{detalle.cantidad}</span>
                            <span className="font-semibold text-slate-900">${detalle.subtotal.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {cotizacion.notas && (
                      <div className="p-3 bg-white rounded border border-slate-200">
                        <p className="text-xs font-semibold text-slate-700 mb-1">Notas:</p>
                        <p className="text-sm text-slate-700">{cotizacion.notas}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {cotizacion.estado === 'Respondida' && (
                        <>
                          <button className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition">
                            Aceptar
                          </button>
                          <button className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition">
                            Rechazar
                          </button>
                        </>
                      )}
                      <button className="flex-1 px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium rounded transition">
                        Ver Detalle
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-600">No tienes cotizaciones</p>
            <a href="/cliente/solicitar-cotizacion" className="inline-block mt-2 text-blue-600 hover:text-blue-700 font-medium">
              Solicitar una cotización
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
