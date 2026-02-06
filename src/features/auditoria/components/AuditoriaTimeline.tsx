import type { AuditoriaEvento } from '../types';
import { AuditoriaEventoCard } from './AuditoriaEventoCard';

interface AuditoriaTimelineProps {
  items: AuditoriaEvento[];
  isLoading?: boolean;
  error?: string;
}

export const AuditoriaTimeline = ({ items, isLoading, error }: AuditoriaTimelineProps) => {
  if (isLoading) {
    return <div className="text-sm text-slate-500">Cargando auditoría...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  if (!items.length) {
    return <div className="text-sm text-slate-500">No hay eventos para mostrar.</div>;
  }

  return (
    <div className="space-y-4">
      {items.map((evento) => (
        <AuditoriaEventoCard key={`${evento.id ?? evento.creadoEn}-${evento.tipoRecurso}`} evento={evento} />
      ))}
    </div>
  );
};
