import { useState } from 'react';
import { Clock, FileText, User as UserIcon } from 'lucide-react';
import type { AuditoriaEvento } from '../types';
import { AuditoriaDiff } from './AuditoriaDiff';

interface AuditoriaEventoCardProps {
  evento: AuditoriaEvento;
}

const formatDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

export const AuditoriaEventoCard = ({ evento }: AuditoriaEventoCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-800">
            {evento.accion ?? 'Acción'} · {evento.tabla ?? 'Tabla'}#{evento.registroId ?? '-'}
          </div>
          <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {formatDate(evento.fecha)}
            </span>
            <span className="inline-flex items-center gap-1">
              <UserIcon className="h-3.5 w-3.5" /> {evento.usuario ?? 'Sistema'}
            </span>
            {evento.ip && (
              <span className="inline-flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" /> {evento.ip}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          {open ? 'Ocultar cambios' : 'Ver cambios'}
        </button>
      </div>

      {evento.descripcion && (
        <p className="mt-2 text-sm text-slate-600">{evento.descripcion}</p>
      )}

      {open && (
        <div className="mt-4">
          <AuditoriaDiff before={evento.datos_anteriores} after={evento.datos_nuevos} />
        </div>
      )}
    </div>
  );
};
