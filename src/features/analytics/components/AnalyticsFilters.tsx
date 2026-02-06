import { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import type { PeriodoAnalytics } from '../types';

interface AnalyticsFiltersProps {
  onPeriodoChange?: (periodo: PeriodoAnalytics) => void;
  onFechasChange?: (inicio: string, fin: string) => void;
  periodo?: PeriodoAnalytics;
}

const periodos: Array<{ value: PeriodoAnalytics; label: string }> = [
  { value: 'hoy', label: 'Hoy' },
  { value: 'semana', label: 'Esta Semana' },
  { value: 'mes', label: 'Este Mes' },
  { value: 'anio', label: 'Este Año' },
  { value: 'personalizado', label: 'Personalizado' },
];

export const AnalyticsFilters = ({
  onPeriodoChange,
  onFechasChange,
  periodo = 'mes',
}: AnalyticsFiltersProps) => {
  const [periodoActual, setPeriodoActual] = useState<PeriodoAnalytics>(periodo);
  const [mostrarFechas, setMostrarFechas] = useState(false);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const handlePeriodoChange = (nuevoPeriodo: PeriodoAnalytics) => {
    setPeriodoActual(nuevoPeriodo);
    onPeriodoChange?.(nuevoPeriodo);

    if (nuevoPeriodo === 'personalizado') {
      setMostrarFechas(true);
    } else {
      setMostrarFechas(false);
    }
  };

  const handleAplicarFechas = () => {
    if (fechaInicio && fechaFin) {
      onFechasChange?.(fechaInicio, fechaFin);
      setMostrarFechas(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-gray-800">Filtros</h3>
      </div>

      {/* Períodos */}
      <div className="flex flex-wrap gap-2 mb-4">
        {periodos.map((p) => (
          <button
            key={p.value}
            onClick={() => handlePeriodoChange(p.value)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              periodoActual === p.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Selector de fechas personalizadas */}
      {mostrarFechas && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-gray-600" />
            <p className="text-sm font-medium text-gray-800">Selecciona un rango de fechas</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fecha Inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fecha Fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAplicarFechas}
              disabled={!fechaInicio || !fechaFin}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Aplicar
            </button>
            <button
              onClick={() => {
                setMostrarFechas(false);
                setPeriodoActual('mes');
              }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
