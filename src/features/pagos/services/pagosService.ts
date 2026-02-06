import axios from '@/lib/axios';
import type {
  Transaccion,
  Factura,
  Reembolso,
  HistorialPago,
  ConfiguracionPago,
  IntegracionGateway,
  FiltrosPagos,
  FiltrosFacturas,
  AnalyticasPagos,
  RespuestaPago,
  RespuestaFactura,
} from '../types';

const BASE_URL = '/api/pagos';

export const pagosService = {
  // Transacciones
  async crearTransaccion(datos: Partial<Transaccion>): Promise<RespuestaPago> {
    const { data } = await axios.post<RespuestaPago>(`${BASE_URL}/transacciones`, datos);
    return data;
  },

  async obtenerTransaccion(id: string): Promise<Transaccion> {
    const { data } = await axios.get<Transaccion>(`${BASE_URL}/transacciones/${id}`);
    return data;
  },

  async listarTransacciones(filtros?: FiltrosPagos): Promise<Transaccion[]> {
    const { data } = await axios.get<Transaccion[]>(`${BASE_URL}/transacciones`, {
      params: filtros,
    });
    return data;
  },

  async procesarTransaccion(id: string): Promise<RespuestaPago> {
    const { data } = await axios.post<RespuestaPago>(`${BASE_URL}/transacciones/${id}/procesar`);
    return data;
  },

  async reintentar(id: string): Promise<RespuestaPago> {
    const { data } = await axios.post<RespuestaPago>(
      `${BASE_URL}/transacciones/${id}/reintentar`
    );
    return data;
  },

  // Facturas
  async crearFactura(datos: Partial<Factura>): Promise<RespuestaFactura> {
    const { data } = await axios.post<RespuestaFactura>(`${BASE_URL}/facturas`, datos);
    return data;
  },

  async obtenerFactura(id: string): Promise<Factura> {
    const { data } = await axios.get<Factura>(`${BASE_URL}/facturas/${id}`);
    return data;
  },

  async listarFacturas(filtros?: FiltrosFacturas): Promise<Factura[]> {
    const { data } = await axios.get<Factura[]>(`${BASE_URL}/facturas`, {
      params: filtros,
    });
    return data;
  },

  async actualizarFactura(id: string, actualizacion: Partial<Factura>): Promise<Factura> {
    const { data } = await axios.put<Factura>(`${BASE_URL}/facturas/${id}`, actualizacion);
    return data;
  },

  async generarPDF(id: string): Promise<RespuestaFactura> {
    const { data } = await axios.get<RespuestaFactura>(`${BASE_URL}/facturas/${id}/pdf`);
    return data;
  },

  async enviarFactura(id: string, email: string): Promise<RespuestaFactura> {
    const { data } = await axios.post<RespuestaFactura>(`${BASE_URL}/facturas/${id}/enviar`, {
      email,
    });
    return data;
  },

  async marcarComoPagada(id: string, montoTransaccionId: string): Promise<Factura> {
    const { data } = await axios.post<Factura>(`${BASE_URL}/facturas/${id}/marcar-pagada`, {
      transaccionId: montoTransaccionId,
    });
    return data;
  },

  // Reembolsos
  async crearReembolso(datos: Partial<Reembolso>): Promise<RespuestaPago> {
    const { data } = await axios.post<RespuestaPago>(`${BASE_URL}/reembolsos`, datos);
    return data;
  },

  async obtenerReembolso(id: string): Promise<Reembolso> {
    const { data } = await axios.get<Reembolso>(`${BASE_URL}/reembolsos/${id}`);
    return data;
  },

  async listarReembolsos(transaccionId?: string): Promise<Reembolso[]> {
    const { data } = await axios.get<Reembolso[]>(`${BASE_URL}/reembolsos`, {
      params: { transaccionId },
    });
    return data;
  },

  async aprobarReembolso(id: string): Promise<RespuestaPago> {
    const { data } = await axios.post<RespuestaPago>(
      `${BASE_URL}/reembolsos/${id}/aprobar`
    );
    return data;
  },

  async procesarReembolso(id: string): Promise<RespuestaPago> {
    const { data } = await axios.post<RespuestaPago>(
      `${BASE_URL}/reembolsos/${id}/procesar`
    );
    return data;
  },

  // Configuración
  async obtenerConfiguracion(proveedorId: string): Promise<ConfiguracionPago> {
    const { data } = await axios.get<ConfiguracionPago>(`${BASE_URL}/configuracion/${proveedorId}`);
    return data;
  },

  async actualizarConfiguracion(
    proveedorId: string,
    config: Partial<ConfiguracionPago>
  ): Promise<ConfiguracionPago> {
    const { data } = await axios.put<ConfiguracionPago>(
      `${BASE_URL}/configuracion/${proveedorId}`,
      config
    );
    return data;
  },

  // Integraciones Gateway
  async listarGateways(): Promise<IntegracionGateway[]> {
    const { data } = await axios.get<IntegracionGateway[]>(`${BASE_URL}/gateways`);
    return data;
  },

  async obtenerGateway(id: string): Promise<IntegracionGateway> {
    const { data } = await axios.get<IntegracionGateway>(`${BASE_URL}/gateways/${id}`);
    return data;
  },

  async verificarGateway(id: string): Promise<RespuestaPago> {
    const { data } = await axios.post<RespuestaPago>(`${BASE_URL}/gateways/${id}/verificar`);
    return data;
  },

  // Historial
  async obtenerHistorialPago(transaccionId: string): Promise<HistorialPago[]> {
    const { data } = await axios.get<HistorialPago[]>(
      `${BASE_URL}/historial/${transaccionId}`
    );
    return data;
  },

  // Analíticas
  async obtenerAnalyticas(
    fechaInicio: string,
    fechaFin: string
  ): Promise<AnalyticasPagos> {
    const { data } = await axios.get<AnalyticasPagos>(`${BASE_URL}/analytics`, {
      params: { fechaInicio, fechaFin },
    });
    return data;
  },

  // Reportes
  async generarReporte(formato: 'pdf' | 'excel', filtros?: FiltrosPagos): Promise<Blob> {
    const { data } = await axios.get(`${BASE_URL}/reportes`, {
      params: { formato, ...filtros },
      responseType: 'blob',
    });
    return data;
  },
};
