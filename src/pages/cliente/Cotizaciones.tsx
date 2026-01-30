import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCotizaciones } from '@/features/cotizaciones/hooks/useCotizaciones';
import { useProductos } from '@/features/productos/hooks/useProductos';
import { APP_ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';

const ClienteCotizacionesPage = () => {
  const navigate = useNavigate();
  const { data: cotizaciones = [], isLoading, isError } = useCotizaciones();
  const { data: productos = [] } = useProductos();

  // Map productos by id for easy lookup
  const productosMap = useMemo(
    () =>
      productos.reduce(
        (acc, prod) => {
          acc[prod.id] = prod;
          return acc;
        },
        {} as Record<number, any>
      ),
    [productos]
  );

  const formatCurrency = (value?: number) => {
    if (!value) return '-';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'Solicitada':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Respondida':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Aceptada':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Rechazada':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mis Cotizaciones</h1>
        <p className="text-muted-foreground">
          Solicitudes de presupuesto para productos
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-lg border bg-card p-6">
          <p className="text-center text-muted-foreground">
            Cargando cotizaciones...
          </p>
        </div>
      ) : isError ? (
        <div className="rounded-lg border bg-card p-6">
          <p className="text-center text-muted-foreground">
            No fue posible cargar las cotizaciones. Intenta nuevamente.
          </p>
        </div>
      ) : cotizaciones.length === 0 ? (
        <div className="rounded-lg border bg-card p-10">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <p className="text-lg font-medium">No tienes cotizaciones</p>
              <p className="text-muted-foreground">
                Explora nuestros productos y solicita presupuestos para empezar.
              </p>
            </div>
            <Button
              onClick={() => navigate(APP_ROUTES.CLIENTE_EXPLORAR)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Explorar Productos
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Monto Cotización
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Fecha Solicitud
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {cotizaciones.map((cotizacion) => {
                  const producto = productosMap[cotizacion.producto_Id];
                  return (
                    <tr
                      key={cotizacion.id}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium">
                        {producto?.nombre || 'Producto eliminado'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {cotizacion.cantidad_Solicitada}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        {formatCurrency(cotizacion.monto_Cotizacion)}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(cotizacion.fecha_Solicitud)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getEstadoBadgeColor(
                            cotizacion.estado
                          )}`}
                        >
                          {cotizacion.estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClienteCotizacionesPage;
