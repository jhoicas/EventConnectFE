import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { disponibilidadService } from '../services/disponibilidadService';
import type { CrearDisponibilidadRequest, ActualizarDisponibilidadRequest } from '../types';

// Hook para obtener rango de disponibilidad
export const useDisponibilidadRango = (
  activoId: number,
  fechaInicio: string,
  fechaFin: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['disponibilidad', 'rango', activoId, fechaInicio, fechaFin],
    queryFn: () => disponibilidadService.obtenerRango(activoId, fechaInicio, fechaFin),
    enabled: enabled && !!activoId && !!fechaInicio && !!fechaFin,
    staleTime: 30000, // 30 segundos
  });
};

// Hook para obtener disponibilidad de un día
export const useDisponibilidadDia = (
  activoId: number,
  fecha: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['disponibilidad', 'dia', activoId, fecha],
    queryFn: () => disponibilidadService.obtenerDia(activoId, fecha),
    enabled: enabled && !!activoId && !!fecha,
    staleTime: 20000,
  });
};

// Hook para obtener disponibilidad por activo
export const useDisponibilidadPorActivo = (
  activoId: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['disponibilidad', 'activo', activoId],
    queryFn: () => disponibilidadService.obtenerPorActivo(activoId),
    enabled: enabled && !!activoId,
    staleTime: 40000, // 40 segundos
  });
};

// Hook para obtener calendario
export const useCalendario = (
  activoId: number,
  mes: number,
  anio: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['disponibilidad', 'calendario', activoId, mes, anio],
    queryFn: () => disponibilidadService.obtenerCalendario(activoId, mes, anio),
    enabled: enabled && !!activoId && mes > 0 && anio > 0,
    staleTime: 60000, // 1 minuto
  });
};

// Hook para verificar disponibilidad
export const useVerificacionDisponibilidad = (
  activoId: number,
  fechaInicio: string,
  fechaFin: string,
  cantidad: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['disponibilidad', 'verificar', activoId, fechaInicio, fechaFin, cantidad],
    queryFn: () => disponibilidadService.verificar(activoId, fechaInicio, fechaFin, cantidad),
    enabled: enabled && !!activoId && !!fechaInicio && !!fechaFin && cantidad > 0,
    staleTime: 10000, // 10 segundos para datos frescos
  });
};

// Hook para crear disponibilidad (mutation)
export const useCrearDisponibilidad = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CrearDisponibilidadRequest) => disponibilidadService.crear(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['disponibilidad'] });
      return data;
    },
  });
};

// Hook para actualizar disponibilidad
export const useActualizarDisponibilidad = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      activoId,
      fecha,
      data,
    }: {
      activoId: number;
      fecha: string;
      data: ActualizarDisponibilidadRequest;
    }) => disponibilidadService.actualizar(activoId, fecha, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disponibilidad'] });
    },
  });
};

// Hook para eliminar disponibilidad
export const useEliminarDisponibilidad = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ activoId, fecha }: { activoId: number; fecha: string }) =>
      disponibilidadService.eliminar(activoId, fecha),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disponibilidad'] });
    },
  });
};

// Hook para listar disponibilidades
export const useListarDisponibilidades = (page: number = 1, pageSize: number = 50) => {
  return useQuery({
    queryKey: ['disponibilidad', 'lista', page, pageSize],
    queryFn: () => disponibilidadService.listar(page, pageSize),
    staleTime: 30000,
  });
};

// Hook para listar por estado
export const useListarPorEstado = (
  estado: string,
  page: number = 1,
  pageSize: number = 50,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['disponibilidad', 'estado', estado, page, pageSize],
    queryFn: () => disponibilidadService.listarPorEstado(estado, page, pageSize),
    enabled: enabled && !!estado,
    staleTime: 30000,
  });
};

// Hook para obtener historial
export const useHistorialDisponibilidad = (activoId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['disponibilidad', 'historial', activoId],
    queryFn: () => disponibilidadService.obtenerHistorial(activoId),
    enabled: enabled && !!activoId,
    staleTime: 40000,
  });
};
