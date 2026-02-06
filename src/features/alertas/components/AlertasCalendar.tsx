import { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useAlertaList } from '../hooks/useAlerta';
import type { AlertaFiltros } from '../types';

export function AlertasCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filtros] = useState<AlertaFiltros>({ estado: 'Pendiente' });
  const { data } = useAlertaList(filtros);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(
    currentDate
  );

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Agrupar alertas por fecha de vencimiento
  const alertasPorFecha = new Map<number, number>();
  if (data?.items) {
    data.items.forEach((alerta) => {
      if (alerta.fecha_vencimiento) {
        const fecha = new Date(alerta.fecha_vencimiento);
        if (
          fecha.getMonth() === currentDate.getMonth() &&
          fecha.getFullYear() === currentDate.getFullYear()
        ) {
          const day = fecha.getDate();
          alertasPorFecha.set(day, (alertasPorFecha.get(day) || 0) + 1);
        }
      }
    });
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 capitalize">{monthName}</h2>
            <button
              onClick={handleToday}
              className="text-sm text-blue-600 hover:text-blue-700 mt-1"
            >
              Hoy
            </button>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-slate-600 py-2 text-sm"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"></div>
            ))}

            {/* Days of month */}
            {days.map((day) => {
              const alertaCount = alertasPorFecha.get(day) || 0;
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition cursor-pointer ${
                    isToday
                      ? 'border-blue-500 bg-blue-50'
                      : alertaCount > 0
                        ? 'border-red-300 bg-red-50 hover:bg-red-100'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-semibold text-sm text-slate-900">{day}</span>
                  {alertaCount > 0 && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <AlertCircle className="w-3 h-3 text-red-600" />
                      <span className="text-xs font-bold text-red-600">{alertaCount}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Leyenda</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded border-2 border-blue-500 bg-blue-50"></div>
              <span className="text-slate-700">Hoy</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded border-2 border-red-300 bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-slate-700">Con alertas vencidas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded border-2 border-slate-200 bg-slate-50"></div>
              <span className="text-slate-700">Sin alertas</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Estadísticas</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total en el mes:</span>
              <span className="font-bold text-slate-900">
                {Array.from(alertasPorFecha.values()).reduce((a, b) => a + b, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Días con alertas:</span>
              <span className="font-bold text-slate-900">{alertasPorFecha.size}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Promedio por día:</span>
              <span className="font-bold text-slate-900">
                {alertasPorFecha.size > 0
                  ? (
                      Array.from(alertasPorFecha.values()).reduce((a, b) => a + b, 0) /
                      alertasPorFecha.size
                    ).toFixed(1)
                  : '0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical alerts this month */}
      {data?.items && data.items.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Alertas Críticas Este Mes
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {data.items
              .filter((a) => a.severidad === 'Critica')
              .map((alerta) => (
                <div
                  key={alerta.id}
                  className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-red-900 text-sm">
                      {alerta.activo_nombre || `Activo ${alerta.activoId}`}
                    </p>
                    <p className="text-xs text-red-700 truncate">{alerta.descripcion}</p>
                  </div>
                  {alerta.fecha_vencimiento && (
                    <div className="text-right text-xs whitespace-nowrap">
                      <p className="text-red-600 font-semibold">
                        {new Date(alerta.fecha_vencimiento).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
