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
import { useNotificacionesNoLeidas } from '@/features/notificaciones/hooks/useNotificaciones';
import { APP_ROUTES } from '@/lib/routes';

export const NotificationBell = () => {
  const navigate = useNavigate();
  const { data: conversaciones = [], isLoading } = useNotificacionesNoLeidas();

  const totalNoLeidas = conversaciones.reduce(
    (total, conv) => total + (conv.no_Leidos || 0),
    0
  );

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
        ) : conversaciones.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No tienes mensajes sin leer
          </div>
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto">
              {conversaciones.map((conversacion) => (
                <DropdownMenuItem
                  key={conversacion.id}
                  onClick={handleNavigateToMessages}
                  className="flex flex-col gap-2 p-3 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {conversacion.nombre_Contraparte}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {conversacion.ultimo_Mensaje || 'Sin mensajes'}
                      </p>
                    </div>
                    {conversacion.no_Leidos > 0 && (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
                        {conversacion.no_Leidos}
                      </span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleNavigateToMessages}
              className="cursor-pointer text-center justify-center text-sm font-medium text-primary"
            >
              Ver todos los mensajes
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
