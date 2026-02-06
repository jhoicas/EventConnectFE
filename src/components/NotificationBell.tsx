import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useListarNotificaciones } from '@/features/notificaciones/hooks/useNotificaciones';
import { APP_ROUTES } from '@/lib/routes';

export const NotificationBell = () => {
  const navigate = useNavigate();
  const { data: notificaciones = [], isLoading } = useListarNotificaciones({ 
    estado: ['pendiente', 'enviada']
  });

  // Filtrar solo notificaciones no leídas
  const notificacionesNoLeidas = notificaciones.filter(n => !n.leidaEn);
  const totalNoLeidas = notificacionesNoLeidas.length;

  const handleNavigateToMessages = () => {
    navigate(APP_ROUTES.CLIENTE_MENSAJES);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {totalNoLeidas > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
              {totalNoLeidas > 99 ? '99+' : totalNoLeidas}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            Cargando...
          </div>
        ) : notificacionesNoLeidas.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No tienes notificaciones sin leer
          </div>
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto">
              {notificacionesNoLeidas.map((notificacion) => (
                <DropdownMenuItem
                  key={notificacion.id}
                  onClick={handleNavigateToMessages}
                  className="flex flex-col gap-2 p-3 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {notificacion.asunto || notificacion.canal}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notificacion.mensaje}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {notificacion.prioridad === 'urgente' ? '🔴' : 
                       notificacion.prioridad === 'alta' ? '🟡' : ''}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleNavigateToMessages}
              className="cursor-pointer text-center justify-center text-sm font-medium text-primary"
            >
              Ver todas las notificaciones
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
