import { useMemo } from 'react';
import { useProductos } from '@/features/productos/hooks/useProductos';

const ClienteExplorarPage = () => {
  const { data: productos = [], isLoading, isError } = useProductos();

  const productosActivos = useMemo(
    () => productos.filter((producto) => producto.activo),
    [productos]
  );

  const formatCurrency = (value?: number) => {
    if (!value) return '-';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Explorar Productos</h1>
        <p className="text-muted-foreground">
          Encuentra productos y servicios de proveedores para tu evento
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-lg border bg-card p-6">
          <p className="text-center text-muted-foreground">
            Cargando productos...
          </p>
        </div>
      ) : isError ? (
        <div className="rounded-lg border bg-card p-6">
          <p className="text-center text-muted-foreground">
            No fue posible cargar los productos. Intenta nuevamente.
          </p>
        </div>
      ) : productosActivos.length === 0 ? (
        <div className="rounded-lg border bg-card p-10">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">No hay productos disponibles</p>
            <p className="text-muted-foreground">
              Cuando haya productos publicados, los verás aquí.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productosActivos.map((producto) => (
            <div
              key={producto.id}
              className="rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-muted">
                <img
                  src={producto.imagen_URL || 'https://via.placeholder.com/640x360?text=Producto'}
                  alt={producto.nombre}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/640x360?text=Producto';
                  }}
                />
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold leading-tight">
                    {producto.nombre}
                  </h3>
                  {producto.descripcion && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {producto.descripcion}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Precio / día</span>
                  <span className="font-semibold">
                    {formatCurrency(producto.precio_Alquiler_Dia)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Disponibles</span>
                  <span>{producto.cantidad_Stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClienteExplorarPage;
