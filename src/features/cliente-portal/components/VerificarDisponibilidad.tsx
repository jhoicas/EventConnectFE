import { useState } from 'react';
import { useVerificacionDisponibilidad } from '../hooks/useClientePortal';
import { Check, X } from 'lucide-react';

export function VerificarDisponibilidad() {
  const [activoId, setActivoId] = useState<number>();
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [checked, setChecked] = useState(false);

  const { data, isLoading } = useVerificacionDisponibilidad(
    activoId,
    fechaInicio,
    fechaFin,
    cantidad,
    checked && !!activoId && !!fechaInicio && !!fechaFin
  );

  const handleVerificar = () => {
    if (!activoId || !fechaInicio || !fechaFin) {
      alert('Por favor completa todos los campos');
      return;
    }
    setChecked(true);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Verificar Disponibilidad</h2>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">ID del Activo</label>
        <input
          type="number"
          value={activoId || ''}
          onChange={(e) => setActivoId(e.target.value ? parseInt(e.target.value) : undefined)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
          placeholder="123"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de inicio</label>
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de fin</label>
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
          min="1"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
        />
      </div>

      <button
        onClick={handleVerificar}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
      >
        Verificar
      </button>

      {/* Resultado */}
      {isLoading && <p className="text-center text-slate-600 text-sm">Verificando disponibilidad...</p>}

      {data && !isLoading && (
        <div className={`p-4 rounded-lg border-2 ${
          data.disponible
            ? 'bg-green-50 border-green-300'
            : 'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            {data.disponible ? (
              <>
                <Check className="w-5 h-5 text-green-600" />
                <p className="font-bold text-green-700">¡Disponible!</p>
              </>
            ) : (
              <>
                <X className="w-5 h-5 text-red-600" />
                <p className="font-bold text-red-700">No disponible</p>
              </>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-700">Disponibles:</span>
              <span className="font-bold">{data.cantidad_disponible} unidades</span>
            </div>
            {data.disponible && data.precio_total && (
              <div className="flex justify-between pt-2 border-t border-green-300">
                <span className="text-green-700">Precio total:</span>
                <span className="font-bold text-green-700">${data.precio_total.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
