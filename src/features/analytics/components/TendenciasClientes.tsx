import { Users, TrendingUp, UserPlus, RotateCw } from 'lucide-react';
import type { DatosTendenciasClientes, TendenciaCliente } from '../types';

interface TendenciasClientesProps {
  datos: DatosTendenciasClientes;
  isLoading?: boolean;
}

const getColorSegmento = (segmento: string): string => {
  const colores: Record<string, string> = {
    Premium: 'bg-purple-100 text-purple-800 border-purple-300',
    Regular: 'bg-blue-100 text-blue-800 border-blue-300',
    Ocasional: 'bg-gray-100 text-gray-800 border-gray-300',
  };
  return colores[segmento] || 'bg-gray-100';
};

const getColorEstado = (estado: string): string => {
  const colores: Record<string, string> = {
    Activo: 'bg-green-100 text-green-800',
    Inactivo: 'bg-red-100 text-red-800',
    Nuevo: 'bg-blue-100 text-blue-800',
  };
  return colores[estado] || 'bg-gray-100';
};

export const TendenciasClientes = ({ datos, isLoading }: TendenciasClientesProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Cargando análisis de clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Encabezado */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Análisis de Clientes</h3>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus className="w-5 h-5 text-green-600" />
            <p className="text-xs text-gray-600">Clientes Nuevos</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{datos.nuevo_clientes}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <p className="text-xs text-gray-600">Clientes Activos</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">{datos.clientes_activos}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <RotateCw className="w-5 h-5 text-red-600" />
            <p className="text-xs text-gray-600">Clientes Inactivos</p>
          </div>
          <p className="text-2xl font-bold text-red-600">{datos.clientes_inactivos}</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <p className="text-xs text-gray-600">Retención</p>
          </div>
          <p className="text-2xl font-bold text-indigo-600">{datos.tasa_retencion.toFixed(1)}%</p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Valor Promedio por Cliente</p>
          <p className="text-2xl font-bold text-gray-800">
            ${datos.valor_promedio_por_cliente.toLocaleString('es-CO')}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Lifetime Value (Promedio)</p>
          <p className="text-2xl font-bold text-gray-800">
            ${datos.valor_lifetime.toLocaleString('es-CO')}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total de Clientes</p>
          <p className="text-2xl font-bold text-gray-800">
            {datos.clientes_activos + datos.clientes_inactivos}
          </p>
        </div>
      </div>

      {/* Segmentación */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-800 mb-4">Segmentación de Clientes</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
            <p className="text-sm font-medium text-purple-700 mb-2">Premium</p>
            <p className="text-3xl font-bold text-purple-600">{datos.segmentacion.premium}</p>
            <p className="text-xs text-gray-600 mt-2">
              {((datos.segmentacion.premium / (datos.clientes_activos + datos.clientes_inactivos)) * 100).toFixed(1)}% del total
            </p>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm font-medium text-blue-700 mb-2">Regular</p>
            <p className="text-3xl font-bold text-blue-600">{datos.segmentacion.regular}</p>
            <p className="text-xs text-gray-600 mt-2">
              {((datos.segmentacion.regular / (datos.clientes_activos + datos.clientes_inactivos)) * 100).toFixed(1)}% del total
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Ocasional</p>
            <p className="text-3xl font-bold text-gray-600">{datos.segmentacion.ocasional}</p>
            <p className="text-xs text-gray-600 mt-2">
              {((datos.segmentacion.ocasional / (datos.clientes_activos + datos.clientes_inactivos)) * 100).toFixed(1)}% del total
            </p>
          </div>
        </div>
      </div>

      {/* Top clientes */}
      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">Top 5 Clientes</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {datos.clientes.slice(0, 5).map((cliente: TendenciaCliente, idx: number) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{cliente.cliente_nombre}</p>
                <p className="text-xs text-gray-600">
                  {cliente.reservas_totales} reservas • ${cliente.valor_total_gastado.toLocaleString('es-CO')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getColorSegmento(cliente.segmento)}`}>
                  {cliente.segmento}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getColorEstado(cliente.estado_cliente)}`}>
                  {cliente.estado_cliente}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
