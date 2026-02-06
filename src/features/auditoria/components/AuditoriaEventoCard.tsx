import { useState } from 'react';
import { Clock, FileText, User as UserIcon } from 'lucide-react';
import type { AuditoriaEvento } from '../types';
import { AuditoriaDiff } from './AuditoriaDiff';

interface AuditoriaEventoCardProps {
  evento: AuditoriaEvento;
}

const formatDate = (value?: string | Date) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
};

export const AuditoriaEventoCard = ({ evento }: AuditoriaEventoCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-800">
            {evento.tipoAccion ?? 'Acción'} · {evento.tipoRecurso ?? 'Recurso'}#{evento.recursoId ?? '-'}
          </div>
          <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {formatDate(evento.creadoEn)}
            </span>
            <span className="inline-flex items-center gap-1">
              <UserIcon className="h-3.5 w-3.5" /> {evento.usuarioNombre ?? 'Sistema'}
            </span>
            {evento.ipAddress && (
              <span className="inline-flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" /> {evento.ipAddress}
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
          <AuditoriaDiff before={evento.cambiosAntes} after={evento.cambiosDespues} />
        </div>
      )}
    </div>
  );
};
