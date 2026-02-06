import axios from '@/lib/axios';
import type {
  ConfiguracionDinamica,
  ValidacionDisponibilidad,
  OptimizacionPrecio,
  ReservaOptimizada,
  HistorialOptimizacion,
  BultoReservas,
  FiltrosOptimizacion,
  AnalisticasOptimizacion,
  RespuestaOptimizacion,
} from '../types';

const BASE_URL = '/api/optimizar-reservas';

export const optimizarReservasService = {
  // Configuración de pricing dinámico
  async obtenerConfiguracion(activoId: string): Promise<ConfiguracionDinamica> {
    const { data } = await axios.get<ConfiguracionDinamica>(
      `${BASE_URL}/configuracion/${activoId}`
    );
    return data;
  },

  async crearConfiguracion(config: Partial<ConfiguracionDinamica>): Promise<ConfiguracionDinamica> {
    const { data } = await axios.post<ConfiguracionDinamica>(
      `${BASE_URL}/configuracion`,
      config
    );
    return data;
  },

  async actualizarConfiguracion(
    activoId: string,
    config: Partial<ConfiguracionDinamica>
  ): Promise<ConfiguracionDinamica> {
    const { data } = await axios.put<ConfiguracionDinamica>(
      `${BASE_URL}/configuracion/${activoId}`,
      config
    );
    return data;
  },

  async eliminarConfiguracion(activoId: string): Promise<void> {
    await axios.delete(`${BASE_URL}/configuracion/${activoId}`);
  },

  // Validación de disponibilidad
  async validarDisponibilidad(
    activoId: string,
    fechaInicio: string,
    fechaFin: string
  ): Promise<ValidacionDisponibilidad> {
    const { data } = await axios.get<ValidacionDisponibilidad>(
      `${BASE_URL}/validar-disponibilidad`,
      {
        params: { activoId, fechaInicio, fechaFin },
      }
    );
    return data;
  },

  // Optimización de precio
  async optimizarPrecio(reservaId: string): Promise<OptimizacionPrecio> {
    const { data } = await axios.post<OptimizacionPrecio>(
      `${BASE_URL}/optimizar-precio/${reservaId}`
    );
    return data;
  },

  async aplicarOptimizacion(reservaId: string, optimizacion: OptimizacionPrecio): Promise<ReservaOptimizada> {
    const { data } = await axios.post<ReservaOptimizada>(
      `${BASE_URL}/aplicar-optimizacion/${reservaId}`,
      optimizacion
    );
    return data;
  },

  // Gestión de reservas optimizadas
  async obtenerReserva(reservaId: string): Promise<ReservaOptimizada> {
    const { data } = await axios.get<ReservaOptimizada>(
      `${BASE_URL}/reservas/${reservaId}`
    );
    return data;
  },

  async listarReservas(filtros?: FiltrosOptimizacion): Promise<ReservaOptimizada[]> {
    const { data } = await axios.get<ReservaOptimizada[]>(
      `${BASE_URL}/reservas`,
      { params: filtros }
    );
    return data;
  },

  async actualizarReserva(
    reservaId: string,
    actualizacion: Partial<ReservaOptimizada>
  ): Promise<ReservaOptimizada> {
    const { data } = await axios.put<ReservaOptimizada>(
      `${BASE_URL}/reservas/${reservaId}`,
      actualizacion
    );
    return data;
  },

  // Historial de optimizaciones
  async obtenerHistorial(reservaId: string): Promise<HistorialOptimizacion[]> {
    const { data } = await axios.get<HistorialOptimizacion[]>(
      `${BASE_URL}/historial/${reservaId}`
    );
    return data;
  },

  // Operaciones en bulto
  async crearBulto(nombre: string, descripcion: string, reservaIds: string[]): Promise<BultoReservas> {
    const { data } = await axios.post<BultoReservas>(
      `${BASE_URL}/bultos`,
      { nombre, descripcion, reservas: reservaIds }
    );
    return data;
  },

  async procesarBulto(bultoId: string): Promise<RespuestaOptimizacion> {
    const { data } = await axios.post<RespuestaOptimizacion>(
      `${BASE_URL}/bultos/${bultoId}/procesar`
    );
    return data;
  },

  async obtenerBulto(bultoId: string): Promise<BultoReservas> {
    const { data } = await axios.get<BultoReservas>(
      `${BASE_URL}/bultos/${bultoId}`
    );
    return data;
  },

  async listarBultos(): Promise<BultoReservas[]> {
    const { data } = await axios.get<BultoReservas[]>(
      `${BASE_URL}/bultos`
    );
    return data;
  },

  // Analíticas
  async obtenerAnalytics(
    fechaInicio: string,
    fechaFin: string
  ): Promise<AnalisticasOptimizacion> {
    const { data } = await axios.get<AnalisticasOptimizacion>(
      `${BASE_URL}/analytics`,
      { params: { fechaInicio, fechaFin } }
    );
    return data;
  },

  async obtenerRecomendaciones(activoId: string): Promise<string[]> {
    const { data } = await axios.get<string[]>(
      `${BASE_URL}/recomendaciones/${activoId}`
    );
    return data;
  },
};
