import { Calendar, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateReservasProps {
  onCreateReserva: () => void;
}

export const EmptyStateReservas = ({ onCreateReserva }: EmptyStateReservasProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 rounded-full blur-3xl opacity-30" />
        <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900">
          <Package className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>

      <div className="text-center max-w-md space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Aún no tienes reservas
        </h2>
        <p className="text-muted-foreground text-base">
          Comienza a planificar tu evento explorando nuestros servicios y productos disponibles.
          ¡Es fácil y rápido!
        </p>
      </div>

      <div className="flex gap-3 mt-8">
        <Button 
          size="lg" 
          onClick={onCreateReserva}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <Calendar className="mr-2 h-5 w-5" />
          Realizar Reserva
        </Button>
        <Button 
          size="lg" 
          variant="outline"
          onClick={() => window.location.href = '/cliente/explorar'}
        >
          <Package className="mr-2 h-5 w-5" />
          Explorar Servicios
        </Button>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="font-semibold text-sm">Selecciona tus productos</h3>
          <p className="text-xs text-muted-foreground">
            Elige de nuestro catálogo de servicios
          </p>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-2xl">📅</span>
          </div>
          <h3 className="font-semibold text-sm">Define fecha y lugar</h3>
          <p className="text-xs text-muted-foreground">
            Completa los detalles del evento
          </p>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-2xl">✅</span>
          </div>
          <h3 className="font-semibold text-sm">Confirma y paga</h3>
          <p className="text-xs text-muted-foreground">
            Finaliza tu reserva de forma segura
          </p>
        </div>
      </div>
    </div>
  );
};
