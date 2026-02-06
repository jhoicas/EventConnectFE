import type { AuditoriaEvento } from '../types';
import { AuditoriaEventoCard } from './AuditoriaEventoCard';

interface AuditoriaHistorialProps {
  items: AuditoriaEvento[];
  isLoading?: boolean;
  error?: string;
}

export const AuditoriaHistorial = ({ items, isLoading, error }: AuditoriaHistorialProps) => {
  if (isLoading) {
    return <div className="text-sm text-slate-500">Cargando historial...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  if (!items.length) {
    return <div className="text-sm text-slate-500">No hay cambios registrados.</div>;
  }

  return (
    <div className="space-y-4">
      {items.map((evento) => (
        <AuditoriaEventoCard key={`${evento.id ?? evento.fecha}-${evento.tabla}`} evento={evento} />
      ))}
    </div>
  );
};
