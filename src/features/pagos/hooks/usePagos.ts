import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pagosService } from '../services/pagosService';
import type {
  Transaccion,
  Factura,
  Reembolso,
  ConfiguracionPago,
  FiltrosPagos,
  FiltrosFacturas,
} from '../types';

const QUERY_KEYS = {
  transacciones: (filtros?: FiltrosPagos) => ['pagos', 'transacciones', filtros],
  transaccion: (id: string) => ['pagos', 'transaccion', id],
  facturas: (filtros?: FiltrosFacturas) => ['pagos', 'facturas', filtros],
  factura: (id: string) => ['pagos', 'factura', id],
  reembolsos: (transaccionId?: string) => ['pagos', 'reembolsos', transaccionId],
  reembolso: (id: string) => ['pagos', 'reembolso', id],
  configuracion: (proveedorId: string) => ['pagos', 'config', proveedorId],
  gateways: ['pagos', 'gateways'],
  gateway: (id: string) => ['pagos', 'gateway', id],
  historial: (transaccionId: string) => ['pagos', 'historial', transaccionId],
  analytics: (inicio: string, fin: string) => ['pagos', 'analytics', inicio, fin],
};

// Transacciones
export const useObtenerTransaccion = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.transaccion(id),
    queryFn: () => pagosService.obtenerTransaccion(id),
    staleTime: 2 * 60 * 1000,
  });
};

export const useListarTransacciones = (filtros?: FiltrosPagos) => {
  return useQuery({
    queryKey: QUERY_KEYS.transacciones(filtros),
    queryFn: () => pagosService.listarTransacciones(filtros),
    staleTime: 1 * 60 * 1000,
  });
};

export const useCrearTransaccion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: Partial<Transaccion>) => pagosService.crearTransaccion(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transacciones() });
    },
  });
};

export const useProcesarTransaccion = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => pagosService.procesarTransaccion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transaccion(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transacciones() });
    },
  });
};

export const useReintentar = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => pagosService.reintentar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transaccion(id) });
    },
  });
};

// Facturas
export const useObtenerFactura = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.factura(id),
    queryFn: () => pagosService.obtenerFactura(id),
    staleTime: 3 * 60 * 1000,
  });
};

export const useListarFacturas = (filtros?: FiltrosFacturas) => {
  return useQuery({
    queryKey: QUERY_KEYS.facturas(filtros),
    queryFn: () => pagosService.listarFacturas(filtros),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCrearFactura = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: Partial<Factura>) => pagosService.crearFactura(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.facturas() });
    },
  });
};

export const useGenerarPDF = () => {
  return useMutation({
    mutationFn: (id: string) => pagosService.generarPDF(id),
  });
};

export const useEnviarFactura = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, email }: { id: string; email: string }) =>
      pagosService.enviarFactura(id, email),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.factura(id) });
    },
  });
};

export const useMarcarComoPagada = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, transaccionId }: { id: string; transaccionId: string }) =>
      pagosService.marcarComoPagada(id, transaccionId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.factura(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.facturas() });
    },
  });
};

// Reembolsos
export const useListarReembolsos = (transaccionId?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.reembolsos(transaccionId),
    queryFn: () => pagosService.listarReembolsos(transaccionId),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCrearReembolso = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: Partial<Reembolso>) => pagosService.crearReembolso(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reembolsos() });
    },
  });
};

export const useAprobarReembolso = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => pagosService.aprobarReembolso(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reembolso(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reembolsos() });
    },
  });
};

export const useProcesarReembolso = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => pagosService.procesarReembolso(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reembolso(id) });
    },
  });
};

// Configuración
export const useObtenerConfiguracion = (proveedorId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.configuracion(proveedorId),
    queryFn: () => pagosService.obtenerConfiguracion(proveedorId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useActualizarConfiguracion = (proveedorId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (config: Partial<ConfiguracionPago>) =>
      pagosService.actualizarConfiguracion(proveedorId, config),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.configuracion(proveedorId),
      });
    },
  });
};

// Gateways
export const useListarGateways = () => {
  return useQuery({
    queryKey: QUERY_KEYS.gateways,
    queryFn: () => pagosService.listarGateways(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useVerificarGateway = () => {
  return useMutation({
    mutationFn: (id: string) => pagosService.verificarGateway(id),
  });
};

// Historial
export const useObtenerHistorial = (transaccionId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.historial(transaccionId),
    queryFn: () => pagosService.obtenerHistorialPago(transaccionId),
    staleTime: 3 * 60 * 1000,
  });
};

// Analíticas
export const useObtenerAnalyticas = (fechaInicio: string, fechaFin: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.analytics(fechaInicio, fechaFin),
    queryFn: () => pagosService.obtenerAnalyticas(fechaInicio, fechaFin),
    staleTime: 10 * 60 * 1000,
  });
};
