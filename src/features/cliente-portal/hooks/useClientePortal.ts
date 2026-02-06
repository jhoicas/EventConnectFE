import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientePortalService } from '../services/clientePortalService';
import type {
  FiltrosReserva,
  FiltrosPago,
  CrearReservaRequest,
  SolicitudCotizacion,
} from '../types';

// ===== RESERVAS =====
export function useMisReservas(filtros?: FiltrosReserva, enabled = true) {
  return useQuery({
    queryKey: ['cliente-portal', 'reservas', filtros],
    queryFn: () => clientePortalService.obtenerMisReservas(filtros),
    staleTime: 30000,
    enabled,
  });
}

export function useSeguimiento(reservaId: number, enabled = true) {
  return useQuery({
    queryKey: ['cliente-portal', 'seguimiento', reservaId],
    queryFn: () => clientePortalService.obtenerSeguimiento(reservaId),
    staleTime: 20000,
    enabled,
  });
}

export function useCrearReserva() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CrearReservaRequest) => clientePortalService.crearReserva(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cliente-portal', 'reservas'] });
      queryClient.invalidateQueries({ queryKey: ['cliente-portal', 'estadisticas'] });
    },
  });
}

export function useCancelarReserva() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reservaId: number) => clientePortalService.cancelarReserva(reservaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cliente-portal', 'reservas'] });
    },
  });
}

// ===== DISPONIBILIDAD =====
export function useVerificacionDisponibilidad(
  activoId?: number,
  fechaInicio?: string,
  fechaFin?: string,
  cantidad?: number,
  enabled = false
) {
  return useQuery({
    queryKey: ['cliente-portal', 'disponibilidad', activoId, fechaInicio, fechaFin, cantidad],
    queryFn: () =>
      clientePortalService.verificarDisponibilidad(
        activoId!,
        fechaInicio!,
        fechaFin!,
        cantidad || 1
      ),
    staleTime: 10000,
    enabled: enabled && !!activoId && !!fechaInicio && !!fechaFin,
  });
}

// ===== COTIZACIONES =====
export function useMisCotizaciones(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['cliente-portal', 'cotizaciones', page, pageSize],
    queryFn: () => clientePortalService.obtenerMisCotizaciones(page, pageSize),
    staleTime: 40000,
  });
}

export function useSolicitarCotizacion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: SolicitudCotizacion) => clientePortalService.solicitarCotizacion(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cliente-portal', 'cotizaciones'] });
    },
  });
}

// ===== ESTADÍSTICAS =====
export function useEstadisticasCliente() {
  return useQuery({
    queryKey: ['cliente-portal', 'estadisticas'],
    queryFn: () => clientePortalService.obtenerEstadisticas(),
    staleTime: 60000,
  });
}

// ===== PAGOS =====
export function useHistorialPagos(filtros?: FiltrosPago) {
  return useQuery({
    queryKey: ['cliente-portal', 'pagos', filtros],
    queryFn: () => clientePortalService.obtenerHistorialPagos(filtros),
    staleTime: 30000,
  });
}
