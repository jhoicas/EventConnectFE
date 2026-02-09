import { useQuery } from '@tanstack/react-query';
import catalogoService from '../services/catalogoService';
import type {
  CatalogoEstadoReserva,
  CatalogoEstadoActivo,
  CatalogoMetodoPago,
  CatalogoTipoMantenimiento,
} from '@/types';

/**
 * Hook para obtener estados de reserva
 */
export const useEstadosReserva = (soloActivos: boolean = true) => {
  return useQuery<CatalogoEstadoReserva[]>({
    queryKey: ['estadosReserva', soloActivos],
    queryFn: () => catalogoService.getEstadosReserva(soloActivos),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
};

/**
 * Hook para obtener estados de activos
 */
export const useEstadosActivo = (soloActivos: boolean = true) => {
  return useQuery<CatalogoEstadoActivo[]>({
    queryKey: ['estadosActivo', soloActivos],
    queryFn: () => catalogoService.getEstadosActivo(soloActivos),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
};

/**
 * Hook para obtener métodos de pago
 */
export const useMetodosPago = (soloActivos: boolean = true) => {
  return useQuery<CatalogoMetodoPago[]>({
    queryKey: ['metodosPago', soloActivos],
    queryFn: () => catalogoService.getMetodosPago(soloActivos),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
};

/**
 * Hook para obtener tipos de mantenimiento
 */
export const useTiposMantenimiento = (soloActivos: boolean = true) => {
  return useQuery<CatalogoTipoMantenimiento[]>({
    queryKey: ['tiposMantenimiento', soloActivos],
    queryFn: () => catalogoService.getTiposMantenimiento(soloActivos),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
};
