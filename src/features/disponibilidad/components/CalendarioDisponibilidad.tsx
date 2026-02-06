import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, AlertCircle } from 'lucide-react';
import { useCalendario } from '../hooks/useDisponibilidad';
import type { EstadoDisponibilidad } from '../types';

interface CalendarioDisponibilidadProps {
  activoId: number;
  onDateSelect?: (fecha: string) => void;
  onRangeSelect?: (fechaInicio: string, fechaFin: string) => void;
}

const getEstadoColor = (estado: EstadoDisponibilidad): string => {
  const colors: Record<EstadoDisponibilidad, string> = {
    Disponible: 'bg-green-100 text-green-800 border-green-300',
    Reservado: 'bg-blue-100 text-blue-800 border-blue-300',
    Mantenimiento: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    No_Disponible: 'bg-red-100 text-red-800 border-red-300',
  };
  return colors[estado];
};

const getNombreMes = (mes: number): string => {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  return meses[mes - 1];
};

export const CalendarioDisponibilidad = ({
  activoId,
  onDateSelect,
  onRangeSelect,
}: CalendarioDisponibilidadProps) => {
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [fechaInicio, setFechaInicio] = useState<string | null>(null);

  const { data: calendario, isLoading, error } = useCalendario(activoId, mes, anio);

  const handleMesAnterior = () => {
    if (mes === 1) {
      setMes(12);
      setAnio(anio - 1);
    } else {
      setMes(mes - 1);
    }
  };

  const handleMesSiguiente = () => {
    if (mes === 12) {
      setMes(1);
      setAnio(anio + 1);
    } else {
      setMes(mes + 1);
    }
  };

  const handleDiaClick = (fecha: string) => {
    if (!fechaInicio) {
      setFechaInicio(fecha);
      onDateSelect?.(fecha);
    } else {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fecha);

      if (fin < inicio) {
        setFechaInicio(fecha);
        onDateSelect?.(fecha);
      } else {
        onRangeSelect?.(fechaInicio, fecha);
        setFechaInicio(null);
      }
    }
  };

  if (!calendario && !isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <p>No se pudo cargar el calendario</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-800">
            {getNombreMes(mes)} {anio}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleMesAnterior}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleMesSiguiente}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Próximo mes"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((dia) => (
          <div key={dia} className="text-center font-semibold text-gray-600 text-sm py-2">
            {dia}
          </div>
        ))}
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-1">
        {isLoading ? (
          <div className="col-span-7 text-center py-8 text-gray-500">
            Cargando calendario...
          </div>
        ) : calendario?.semanas ? (
          calendario.semanas.map((semana, semanaIdx) =>
            semana.map((dia, diaIdx) => (
              <button
                key={`${semanaIdx}-${diaIdx}`}
                onClick={() => !dia.fuera_mes && handleDiaClick(dia.fecha)}
                disabled={dia.fuera_mes}
                className={`aspect-square p-2 rounded-lg border-2 transition text-xs font-medium flex flex-col items-center justify-center ${
                  dia.fuera_mes
                    ? 'bg-gray-50 text-gray-300 border-gray-200'
                    : `${getEstadoColor(dia.estado)} cursor-pointer hover:shadow-md`
                }`}
                title={`${dia.numero_dia}: ${dia.disponible}/${dia.total} disponibles`}
              >
                <div className="font-bold">{dia.numero_dia}</div>
                <div className="text-xs">{dia.disponible}/{dia.total}</div>
              </button>
            ))
          )
        ) : null}
      </div>

      {/* Leyenda */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
          <span className="text-sm text-gray-700">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
          <span className="text-sm text-gray-700">Reservado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
          <span className="text-sm text-gray-700">Mantenimiento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
          <span className="text-sm text-gray-700">No Disponible</span>
        </div>
      </div>

      {/* Estado de selección */}
      {fechaInicio && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Fecha inicio seleccionada: <strong>{fechaInicio}</strong>
            <br />
            Haz clic en otra fecha para completar el rango.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">Error al cargar el calendario</p>
        </div>
      )}
    </div>
  );
};
