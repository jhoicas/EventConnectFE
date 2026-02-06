import { useState } from 'react';
import { useCrearReserva } from '../hooks/useClientePortal';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { ReservaDetalle } from '../types';

interface CrearReservaProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CrearReserva({ onSuccess, onCancel }: CrearReservaProps) {
  const [step, setStep] = useState(1);
  const [detalles, setDetalles] = useState<ReservaDetalle[]>([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [direccion, setDireccion] = useState('');
  const [notas, setNotas] = useState('');
  const crearMutation = useCrearReserva();

  const handleRemoveActivo = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const handleCreateReserva = async () => {
    if (!fechaInicio || !fechaFin || !direccion || detalles.length === 0) {
      alert('Por favor completa todos los campos');
      return;
    }

    await crearMutation.mutateAsync({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      direccion_entrega: direccion,
      detalles,
      notas,
    });
    onSuccess?.();
  };

  const total = detalles.reduce((sum, d) => sum + d.subtotal, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {s}
              </div>
              {s < 4 && <div className={`h-1 w-12 ml-2 mr-2 ${step > s ? 'bg-blue-600' : 'bg-slate-200'}`}></div>}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>Activos</span>
          <span>Fechas</span>
          <span>Dirección</span>
          <span>Confirmación</span>
        </div>
      </div>

      {/* Step 1: Seleccionar Activos */}
      {step === 1 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Selecciona los Activos</h2>
          <div className="space-y-3 mb-6">
            {detalles.length > 0 ? (
              detalles.map((detalle, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-blue-50 rounded border border-blue-200">
                  <div>
                    <p className="font-semibold text-slate-900">Activo {detalle.activoId}</p>
                    <p className="text-sm text-slate-600">Cantidad: {detalle.cantidad}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">${detalle.subtotal.toLocaleString()}</p>
                    <button
                      onClick={() => handleRemoveActivo(idx)}
                      className="text-red-600 hover:text-red-700 text-xs font-medium mt-1"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-600 text-center py-4">No hay activos seleccionados</p>
            )}
          </div>

          {/* Agregar Activo Form */}
          <div className="border-t border-slate-200 pt-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Agregar activo:</p>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="ID del activo"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Cantidad"
                  className="px-3 py-2 border border-slate-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Precio unitario"
                  className="px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <button className="w-full px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition">
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Fechas */}
      {step === 2 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Selecciona las Fechas</h2>
          <div className="space-y-4">
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
            {fechaInicio && fechaFin && (
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <p className="text-sm text-slate-600">Duración:</p>
                <p className="text-lg font-bold text-blue-700">
                  {Math.ceil((new Date(fechaFin).getTime() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24))} días
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Dirección */}
      {step === 3 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Dirección de Entrega</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
              <textarea
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                rows={4}
                placeholder="Calle, número, apartamento, ciudad..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notas (opcional)</label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
                placeholder="Instrucciones especiales para la entrega..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Confirmación */}
      {step === 4 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Confirmación</h2>
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded border border-slate-200">
              <p className="text-sm text-slate-600 mb-1">Activos:</p>
              <p className="font-bold text-slate-900">{detalles.length} artículos</p>
            </div>
            <div className="bg-slate-50 p-4 rounded border border-slate-200">
              <p className="text-sm text-slate-600 mb-1">Período:</p>
              <p className="font-bold text-slate-900">
                {new Date(fechaInicio).toLocaleDateString()} - {new Date(fechaFin).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <p className="text-sm text-blue-600 mb-1">Total:</p>
              <p className="text-2xl font-bold text-blue-700">${total.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            if (step > 1) setStep(step - 1);
            else onCancel?.();
          }}
          className="flex-1 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-900 font-medium rounded transition flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          {step === 1 ? 'Cancelar' : 'Atrás'}
        </button>
        <button
          onClick={() => {
            if (step === 4) handleCreateReserva();
            else if (step < 4) setStep(step + 1);
          }}
          disabled={crearMutation.isPending}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {step === 4 ? 'Crear Reserva' : 'Siguiente'}
          {step !== 4 && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
