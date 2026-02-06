import { axiosInstance } from '@/lib/axios';
import type {
  Reserva,
  ReservaListResponse,
  CrearReservaRequest,
  SeguimientoReserva,
  VerificacionDisponibilidad,
  Cotizacion,
  CotizacionListResponse,
  SolicitudCotizacion,
  EstadisticasCliente,
  PagoListResponse,
  FiltrosReserva,
  FiltrosPago,
} from '../types';

class ClientePortalService {
  private baseURL = '/api/cliente-portal';

  // RESERVAS
  async obtenerMisReservas(filtros?: FiltrosReserva): Promise<ReservaListResponse> {
    const params = new URLSearchParams();
    if (filtros?.estado) params.append('estado', filtros.estado);
    if (filtros?.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
    if (filtros?.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
    if (filtros?.page) params.append('page', filtros.page.toString());
    if (filtros?.pageSize) params.append('pageSize', filtros.pageSize.toString());

    const { data } = await axiosInstance.get<ReservaListResponse>(
      `${this.baseURL}/mis-reservas?${params.toString()}`
    );
    return data;
  }

  async obtenerSeguimiento(reservaId: number): Promise<SeguimientoReserva> {
    const { data } = await axiosInstance.get<SeguimientoReserva>(
      `${this.baseURL}/seguimiento/${reservaId}`
    );
    return data;
  }

  async crearReserva(request: CrearReservaRequest): Promise<Reserva> {
    const { data } = await axiosInstance.post<Reserva>(
      `${this.baseURL}/crear-reserva`,
      request
    );
    return data;
  }

  async cancelarReserva(reservaId: number): Promise<Reserva> {
    const { data } = await axiosInstance.put<Reserva>(
      `${this.baseURL}/cancelar-reserva/${reservaId}`
    );
    return data;
  }

  // DISPONIBILIDAD
  async verificarDisponibilidad(
    activoId: number,
    fechaInicio: string,
    fechaFin: string,
    cantidad: number
  ): Promise<VerificacionDisponibilidad> {
    const params = new URLSearchParams({
      activoId: activoId.toString(),
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      cantidad: cantidad.toString(),
    });

    const { data } = await axiosInstance.post<VerificacionDisponibilidad>(
      `${this.baseURL}/verificar-disponibilidad`,
      Object.fromEntries(params)
    );
    return data;
  }

  // COTIZACIONES
  async obtenerMisCotizaciones(page = 1, pageSize = 10): Promise<CotizacionListResponse> {
    const { data } = await axiosInstance.get<CotizacionListResponse>(
      `${this.baseURL}/mis-cotizaciones?page=${page}&pageSize=${pageSize}`
    );
    return data;
  }

  async solicitarCotizacion(request: SolicitudCotizacion): Promise<Cotizacion> {
    const { data } = await axiosInstance.post<Cotizacion>(
      `${this.baseURL}/solicitar-cotizacion`,
      request
    );
    return data;
  }

  // ESTADÍSTICAS
  async obtenerEstadisticas(): Promise<EstadisticasCliente> {
    const { data } = await axiosInstance.get<EstadisticasCliente>(
      `${this.baseURL}/mis-estadisticas`
    );
    return data;
  }

  // PAGOS
  async obtenerHistorialPagos(filtros?: FiltrosPago): Promise<PagoListResponse> {
    const params = new URLSearchParams();
    if (filtros?.estado) params.append('estado', filtros.estado);
    if (filtros?.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
    if (filtros?.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
    if (filtros?.page) params.append('page', filtros.page.toString());
    if (filtros?.pageSize) params.append('pageSize', filtros.pageSize.toString());

    const { data } = await axiosInstance.get<PagoListResponse>(
      `${this.baseURL}/historial-pagos?${params.toString()}`
    );
    return data;
  }
}

export const clientePortalService = new ClientePortalService();
