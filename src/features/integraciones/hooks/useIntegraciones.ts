import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { integracionesService } from '../services/integracionesService';
import type { FiltrosIntegraciones } from '../types';

// ===== QUERIES INTEGRACIONES =====
export const useListarIntegraciones = (filtros?: FiltrosIntegraciones) => {
  return useQuery({
    queryKey: ['integraciones', filtros],
    queryFn: () => integracionesService.listarIntegraciones(filtros),
    staleTime: 2 * 60 * 1000,
  });
};

export const useObtenerIntegracion = (id: string) => {
  return useQuery({
    queryKey: ['integracion', id],
    queryFn: () => integracionesService.obtenerIntegracion(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useObtenerEstadoConexion = (id: string) => {
  return useQuery({
    queryKey: ['estado-conexion', id],
    queryFn: () => integracionesService.obtenerEstadoConexion(id),
    staleTime: 1 * 60 * 1000,
    enabled: !!id,
  });
};

export const useObtenerEstadisticas = () => {
  return useQuery({
    queryKey: ['estadisticas-integraciones'],
    queryFn: () => integracionesService.obtenerEstadisticas(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerEstadisticasIntegracion = (id: string) => {
  return useQuery({
    queryKey: ['estadisticas-integracion', id],
    queryFn: () => integracionesService.obtenerEstadisticasIntegracion(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

// ===== QUERIES CREDENCIALES =====
export const useListarCredenciales = (integracionId: string) => {
  return useQuery({
    queryKey: ['credenciales', integracionId],
    queryFn: () => integracionesService.listarCredenciales(integracionId),
    staleTime: 3 * 60 * 1000,
    enabled: !!integracionId,
  });
};

export const useObtenerCredencial = (integracionId: string, credencialId: string) => {
  return useQuery({
    queryKey: ['credencial', integracionId, credencialId],
    queryFn: () => integracionesService.obtenerCredencial(integracionId, credencialId),
    staleTime: 5 * 60 * 1000,
    enabled: !!integracionId && !!credencialId,
  });
};

// ===== QUERIES WEBHOOKS =====
export const useListarWebhooks = (integracionId: string) => {
  return useQuery({
    queryKey: ['webhooks', integracionId],
    queryFn: () => integracionesService.listarWebhooks(integracionId),
    staleTime: 2 * 60 * 1000,
    enabled: !!integracionId,
  });
};

export const useObtenerWebhook = (integracionId: string, webhookId: string) => {
  return useQuery({
    queryKey: ['webhook', integracionId, webhookId],
    queryFn: () => integracionesService.obtenerWebhook(integracionId, webhookId),
    staleTime: 5 * 60 * 1000,
    enabled: !!integracionId && !!webhookId,
  });
};

// ===== QUERIES LOGS =====
export const useListarLogsSincronizacion = (integracionId: string, filtros?: { pagina?: number; limite?: number }) => {
  return useQuery({
    queryKey: ['logs-sincronizacion', integracionId, filtros],
    queryFn: () => integracionesService.listarLogsSincronizacion(integracionId, filtros),
    staleTime: 1 * 60 * 1000,
    enabled: !!integracionId,
  });
};

export const useListarLogsWebhooks = (integracionId: string, webhookId?: string, filtros?: any) => {
  return useQuery({
    queryKey: ['logs-webhooks', integracionId, webhookId, filtros],
    queryFn: () => integracionesService.listarLogsWebhooks(integracionId, webhookId, filtros),
    staleTime: 1 * 60 * 1000,
    enabled: !!integracionId,
  });
};

export const useObtenerLogWebhook = (integracionId: string, logWebhookId: string) => {
  return useQuery({
    queryKey: ['log-webhook', integracionId, logWebhookId],
    queryFn: () => integracionesService.obtenerLogWebhook(integracionId, logWebhookId),
    staleTime: 10 * 60 * 1000,
    enabled: !!integracionId && !!logWebhookId,
  });
};

// ===== QUERIES MAPEOS Y CONFIGURACIÓN =====
export const useListarMapeos = (integracionId: string) => {
  return useQuery({
    queryKey: ['mapeos', integracionId],
    queryFn: () => integracionesService.listarMapeos(integracionId),
    staleTime: 3 * 60 * 1000,
    enabled: !!integracionId,
  });
};

export const useListarConfiguraciones = (integracionId: string) => {
  return useQuery({
    queryKey: ['configuraciones', integracionId],
    queryFn: () => integracionesService.listarConfiguraciones(integracionId),
    staleTime: 3 * 60 * 1000,
    enabled: !!integracionId,
  });
};

// ===== MUTATIONS INTEGRACIONES =====
export const useCrearIntegracion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: any) => integracionesService.crearIntegracion(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integraciones'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-integraciones'] });
    },
  });
};

export const useActualizarIntegracion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }: { id: string; datos: any }) =>
      integracionesService.actualizarIntegracion(id, datos),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['integracion', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['integraciones'] });
    },
  });
};

export const useEliminarIntegracion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => integracionesService.eliminarIntegracion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integraciones'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-integraciones'] });
    },
  });
};

export const useHabilitarIntegracion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => integracionesService.habilitarIntegracion(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['integracion', id] });
      queryClient.invalidateQueries({ queryKey: ['integraciones'] });
    },
  });
};

export const useDeshabilitarIntegracion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => integracionesService.deshabilitarIntegracion(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['integracion', id] });
      queryClient.invalidateQueries({ queryKey: ['integraciones'] });
    },
  });
};

export const useTestearConexion = () => {
  return useMutation({
    mutationFn: (id: string) => integracionesService.testearConexion(id),
  });
};

export const useSincronizar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => integracionesService.sincronizar(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['logs-sincronizacion', id] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-integracion', id] });
    },
  });
};

// ===== MUTATIONS CREDENCIALES =====
export const useCrearCredencial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ integracionId, datos }: { integracionId: string; datos: any }) =>
      integracionesService.crearCredencial(integracionId, datos),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['credenciales', variables.integracionId] });
    },
  });
};

export const useActualizarCredencial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ integracionId, credencialId, datos }: any) =>
      integracionesService.actualizarCredencial(integracionId, credencialId, datos),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['credenciales', variables.integracionId] });
      queryClient.invalidateQueries({ queryKey: ['credencial', variables.integracionId, variables.credencialId] });
    },
  });
};

export const useEliminarCredencial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ integracionId, credencialId }: any) =>
      integracionesService.eliminarCredencial(integracionId, credencialId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['credenciales', variables.integracionId] });
    },
  });
};

export const useValidarCredencial = () => {
  return useMutation({
    mutationFn: ({ integracionId, credencialId }: any) =>
      integracionesService.validarCredencial(integracionId, credencialId),
  });
};

export const useRotarCredencial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ integracionId, credencialId }: any) =>
      integracionesService.rotarCredencial(integracionId, credencialId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['credenciales', variables.integracionId] });
    },
  });
};

// ===== MUTATIONS WEBHOOKS =====
export const useCrearWebhook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ integracionId, datos }: any) =>
      integracionesService.crearWebhook(integracionId, datos),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', variables.integracionId] });
    },
  });
};

export const useActualizarWebhook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ integracionId, webhookId, datos }: any) =>
      integracionesService.actualizarWebhook(integracionId, webhookId, datos),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', variables.integracionId] });
      queryClient.invalidateQueries({ queryKey: ['webhook', variables.integracionId, variables.webhookId] });
    },
  });
};

export const useEliminarWebhook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ integracionId, webhookId }: any) =>
      integracionesService.eliminarWebhook(integracionId, webhookId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', variables.integracionId] });
    },
  });
};

export const useActivarWebhook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ integracionId, webhookId }: any) =>
      integracionesService.activarWebhook(integracionId, webhookId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', variables.integracionId] });
    },
  });
};

export const useDesactivarWebhook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ integracionId, webhookId }: any) =>
      integracionesService.desactivarWebhook(integracionId, webhookId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', variables.integracionId] });
    },
  });
};

export const useTestearWebhook = () => {
  return useMutation({
    mutationFn: ({ integracionId, webhookId }: any) =>
      integracionesService.testearWebhook(integracionId, webhookId),
  });
};

export const useReintentarWebhook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ integracionId, logWebhookId }: any) =>
      integracionesService.reintentarWebhook(integracionId, logWebhookId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['logs-webhooks', variables.integracionId] });
    },
  });
};

// ===== MUTATIONS MAPEOS Y CONFIGURACIÓN =====
export const useCrearMapeo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ integracionId, datos }: any) =>
      integracionesService.crearMapeo(integracionId, datos),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mapeos', variables.integracionId] });
    },
  });
};

export const useActualizarMapeo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ integracionId, mapeoId, datos }: any) =>
      integracionesService.actualizarMapeo(integracionId, mapeoId, datos),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mapeos', variables.integracionId] });
    },
  });
};

export const useEliminarMapeo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ integracionId, mapeoId }: any) =>
      integracionesService.eliminarMapeo(integracionId, mapeoId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mapeos', variables.integracionId] });
    },
  });
};

export const useActualizarConfiguracion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ integracionId, clave, valor }: any) =>
      integracionesService.actualizarConfiguracion(integracionId, clave, valor),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['configuraciones', variables.integracionId] });
    },
  });
};

// ===== MUTATIONS SINCRONIZACIÓN MASIVA =====
export const useSincronizarTodas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => integracionesService.sincronizarTodas(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integraciones'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-integraciones'] });
    },
  });
};
