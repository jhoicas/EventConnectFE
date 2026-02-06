import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useListarNotificaciones, useReintentarNotificacion } from '../hooks/useNotificaciones';
import { Mail, MessageSquare, Bell, CheckCircle2, XCircle, Clock, RefreshCw, Loader2 } from 'lucide-react';
import type { FiltrosNotificaciones, EstadoNotificacion, TipoNotificacion } from '../types';

interface ListaNotificacionesProps {
  filtros?: FiltrosNotificaciones;
}

export const ListaNotificaciones = ({ filtros }: ListaNotificacionesProps) => {
  const { data: notificaciones, isLoading } = useListarNotificaciones(filtros);
  const { mutate: reintentar, isPending } = useReintentarNotificacion();

  const getEstadoBadge = (estado: EstadoNotificacion) => {
    const config = {
      enviada: { color: 'bg-green-100 text-green-800', icon: CheckCircle2, label: 'Enviada' },
      fallida: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Fallida' },
      pendiente: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pendiente' },
      enviando: { color: 'bg-blue-100 text-blue-800', icon: Loader2, label: 'Enviando' },
      programada: { color: 'bg-purple-100 text-purple-800', icon: Clock, label: 'Programada' },
    };
    return config[estado] || config.pendiente;
  };

  const getTipoIcon = (tipo: TipoNotificacion) => {
    const icons = {
      email: Mail,
      sms: MessageSquare,
      push: Bell,
      inApp: Bell,
    };
    const Icon = icons[tipo] || Bell;
    return <Icon className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Cargando notificaciones...</span>
        </CardContent>
      </Card>
    );
  }

  if (!notificaciones || notificaciones.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No hay notificaciones para mostrar
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Notificaciones</CardTitle>
        <CardDescription>
          {notificaciones.length} notificación{notificaciones.length !== 1 ? 'es' : ''} encontrada{notificaciones.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {notificaciones.map((notif) => {
            const estadoConfig = getEstadoBadge(notif.estado);
            const IconEstado = estadoConfig.icon;

            return (
              <div
                key={notif.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getTipoIcon(notif.tipo)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{notif.destinatario}</span>
                        <Badge className={estadoConfig.color}>
                          <IconEstado className="w-3 h-3 mr-1" />
                          {estadoConfig.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {notif.tipo.toUpperCase()}
                        </Badge>
                      </div>

                      {notif.asunto && (
                        <p className="text-sm font-medium text-gray-900">{notif.asunto}</p>
                      )}

                      <p className="text-sm text-gray-600 line-clamp-2">{notif.mensaje}</p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Canal: {notif.canal}</span>
                        <span>Prioridad: {notif.prioridad}</span>
                        <span>Intentos: {notif.intentos}/{notif.maxIntentos}</span>
                        {notif.enviadaEn && (
                          <span>
                            Enviada: {new Date(notif.enviadaEn).toLocaleString('es-CO', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>

                      {notif.errorMensaje && (
                        <p className="text-xs text-red-600 bg-red-50 p-2 rounded mt-2">
                          Error: {notif.errorMensaje}
                        </p>
                      )}
                    </div>
                  </div>

                  {notif.estado === 'fallida' && notif.intentos < notif.maxIntentos && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => reintentar(notif.id)}
                      disabled={isPending}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Reintentar
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
