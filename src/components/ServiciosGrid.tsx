import { useGetServiciosPublicosQuery } from '@/store/api/serviciosApi';
import { Loader2, AlertCircle, Package } from 'lucide-react';

export const ServiciosGrid = () => {
  const { data: servicios, isLoading, error } = useGetServiciosPublicosQuery();

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 font-medium">Error al cargar servicios</p>
            <p className="text-red-600 text-sm mt-1">
              No se pudieron cargar los servicios. Por favor intenta de nuevo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!servicios || servicios.length === 0) {
    return (
      <div className="py-20">
        <div className="max-w-md mx-auto text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay servicios disponibles
          </h3>
          <p className="text-gray-600">
            Los servicios se mostrarán aquí cuando el administrador los agregue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-gray-600">
            Conectamos empresas proveedoras de servicios para eventos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicios.map((servicio) => (
            <div
              key={servicio.id_Servicio}
              className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow group"
            >
              {/* Imagen */}
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={servicio.imagen_Url}
                  alt={servicio.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback si imagen no carga
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x300?text=Servicio';
                  }}
                />
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {servicio.titulo}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {servicio.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
