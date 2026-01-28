import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, MapPin, DollarSign, Package, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Reserva } from '@/types';

interface ReservaCardProps {
  reserva: Reserva;
  onClick?: () => void;
}

const getEstadoBadge = (estado: string) => {
  const estados: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
    'Pendiente': { 
      label: 'Pendiente', 
      variant: 'outline',
      icon: <Clock className="h-3 w-3" />
    },
    'Confirmada': { 
      label: 'Confirmada', 
      variant: 'default',
      icon: <CheckCircle2 className="h-3 w-3" />
    },
    'En Proceso': { 
      label: 'En Proceso', 
      variant: 'secondary',
      icon: <Package className="h-3 w-3" />
    },
    'Completada': { 
      label: 'Completada', 
      variant: 'default',
      icon: <CheckCircle2 className="h-3 w-3" />
    },
    'Cancelada': { 
      label: 'Cancelada', 
      variant: 'destructive',
      icon: <XCircle className="h-3 w-3" />
    },
  };

  const config = estados[estado] || { 
    label: estado, 
    variant: 'outline' as const,
    icon: <AlertCircle className="h-3 w-3" />
  };

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      {config.icon}
      {config.label}
    </Badge>
  );
};

const getEstadoPagoBadge = (estadoPago: string) => {
  const estados: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    'Pendiente': { label: 'Pago Pendiente', variant: 'outline' },
    'Pagado': { label: 'Pagado', variant: 'default' },
    'Parcial': { label: 'Pago Parcial', variant: 'secondary' },
    'Reembolsado': { label: 'Reembolsado', variant: 'destructive' },
  };

  const config = estados[estadoPago] || { label: estadoPago, variant: 'outline' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const ReservaCard = ({ reserva, onClick }: ReservaCardProps) => {
  const fechaEvento = reserva.fecha_Evento ? new Date(reserva.fecha_Evento) : null;

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              {reserva.codigo_Reserva}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {fechaEvento ? (
                <>
                  {format(fechaEvento, "d 'de' MMMM, yyyy", { locale: es })}
                  <span className="text-xs">
                    ({format(fechaEvento, 'HH:mm', { locale: es })})
                  </span>
                </>
              ) : (
                'Fecha no especificada'
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {getEstadoBadge(reserva.estado)}
            {getEstadoPagoBadge(reserva.estado_Pago)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {reserva.direccion_Entrega && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">{reserva.direccion_Entrega}</p>
              {reserva.ciudad_Entrega && (
                <p className="text-muted-foreground">{reserva.ciudad_Entrega}</p>
              )}
            </div>
          </div>
        )}

        {reserva.contacto_En_Sitio && (
          <div className="text-sm">
            <span className="font-medium">Contacto:</span>{' '}
            <span className="text-muted-foreground">{reserva.contacto_En_Sitio}</span>
            {reserva.telefono_Contacto && (
              <span className="text-muted-foreground"> • {reserva.telefono_Contacto}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Subtotal:</span>
              <span>${reserva.subtotal.toLocaleString('es-CO')}</span>
            </div>
            
            {reserva.descuento > 0 && (
              <div className="flex items-center gap-1 text-green-600">
                <span className="font-medium">Descuento:</span>
                <span>-${reserva.descuento.toLocaleString('es-CO')}</span>
              </div>
            )}
          </div>

          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-xl font-bold text-primary">
              ${reserva.total.toLocaleString('es-CO')}
            </p>
          </div>
        </div>

        {reserva.fianza > 0 && (
          <div className="text-sm bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-2">
            <span className="font-medium">Fianza:</span>{' '}
            <span>${reserva.fianza.toLocaleString('es-CO')}</span>
            {reserva.fianza_Devuelta && (
              <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                Devuelta
              </Badge>
            )}
          </div>
        )}

        {reserva.observaciones && (
          <div className="text-sm text-muted-foreground italic">
            {reserva.observaciones}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
