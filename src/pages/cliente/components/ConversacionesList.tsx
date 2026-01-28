import { useConversacionesDelUsuario } from '@/store/api/chatHooks';
import { Button } from '@/components/ui/button';
import { MessageSquare, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversacionesListProps {
  conversacionSeleccionada?: number;
  onSelect: (id: number) => void;
}

export const ConversacionesList = ({ conversacionSeleccionada, onSelect }: ConversacionesListProps) => {
  const { conversaciones, isLoading, isError, refetch } = useConversacionesDelUsuario();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Cargando conversaciones...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <MessageSquare className="w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground text-center mb-4">
          Error al cargar las conversaciones
        </p>
        <Button onClick={() => refetch()} size="sm" variant="outline">
          Reintentar
        </Button>
      </div>
    );
  }

  if (conversaciones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <MessageSquare className="w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground text-center">
          Sin conversaciones aún
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-slate-900">
      <div className="overflow-y-auto flex-1">
        {conversaciones.map((conversacion) => (
          <button
            key={conversacion.id}
            onClick={() => onSelect(conversacion.id)}
            className={cn(
              'w-full px-4 py-3 md:py-4 text-left border-b dark:border-slate-800 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800',
              conversacionSeleccionada === conversacion.id &&
                'bg-blue-50 dark:bg-blue-950/30 border-l-4 border-l-blue-500'
            )}
          >
            <div className="flex items-start gap-3">
              {conversacion.avatar_URL && (
                <img
                  src={conversacion.avatar_URL}
                  alt={conversacion.nombre_Contraparte}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {conversacion.nombre_Contraparte}
                  </h3>
                  {conversacion.no_Leidos > 0 && (
                    <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-semibold flex-shrink-0">
                      {conversacion.no_Leidos > 99 ? '99+' : conversacion.no_Leidos}
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                  {conversacion.ultimo_Mensaje || 'Sin mensajes'}
                </p>
                {conversacion.fecha_Ultimo_Mensaje && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(conversacion.fecha_Ultimo_Mensaje).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
