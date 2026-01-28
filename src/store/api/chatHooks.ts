import { useCallback, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  useCrearConversacionMutation,
  useEnviarMensajeMutation,
  useGetConversacionesQuery,
  useGetMensajesQuery,
} from './chatApi';
import type { CreateConversacionDto, EnviarMensajeDto, UserRole } from '@/types';

/**
 * Hook personalizado para crear conversaciones con validación de rol
 * Solo usuarios con rol 'Cliente' pueden crear nuevas conversaciones
 */
export const useCrearConversacionSegura = () => {
  const user = useAuthStore((state) => state.user);
  const [crearConversacion, result] = useCrearConversacionMutation();

  const canCreateConversacion = useMemo(() => {
    return user?.rol === 'Cliente';
  }, [user?.rol]);

  const crear = useCallback(
    async (data: CreateConversacionDto) => {
      // Validar rol antes de disparar la mutación
      if (!canCreateConversacion) {
        const error = new Error(
          'Solo usuarios con rol Cliente pueden crear conversaciones'
        );
        throw error;
      }

      // Disparar la mutación
      return crearConversacion(data);
    },
    [crearConversacion, canCreateConversacion]
  );

  return {
    crear,
    ...result,
    canCreateConversacion,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    data: result.data,
    reset: result.reset,
  };
};

/**
 * Hook personalizado para enviar mensajes
 * Incluye validación básica y manejo de errores
 */
export const useEnviarMensajeSeguro = () => {
  const user = useAuthStore((state) => state.user);
  const [enviarMensaje, result] = useEnviarMensajeMutation();

  const canSendMessage = useMemo(() => {
    return !!user?.id;
  }, [user?.id]);

  const enviar = useCallback(
    async (data: EnviarMensajeDto) => {
      // Validar que el usuario esté autenticado
      if (!canSendMessage) {
        throw new Error('Debe estar autenticado para enviar mensajes');
      }

      // Validar contenido no vacío
      if (!data.contenido || data.contenido.trim().length === 0) {
        throw new Error('El contenido del mensaje no puede estar vacío');
      }

      // Disparar la mutación
      return enviarMensaje(data);
    },
    [enviarMensaje, canSendMessage]
  );

  return {
    enviar,
    ...result,
    canSendMessage,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    data: result.data,
    reset: result.reset,
  };
};

/**
 * Hook personalizado para obtener conversaciones con información del usuario
 */
export const useConversacionesDelUsuario = () => {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError, error, refetch } = useGetConversacionesQuery(
    undefined,
    {
      skip: !user?.id, // No ejecutar si no hay usuario autenticado
    }
  );

  return {
    conversaciones: data?.conversaciones ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
    error,
    refetch,
  };
};

/**
 * Hook personalizado para obtener mensajes de una conversación
 * con manejo automático de limpieza
 */
export const useMensajesDeConversacion = (conversacionId: number | null | undefined) => {
  const { data, isLoading, isError, error, refetch } = useGetMensajesQuery(
    conversacionId!,
    {
      skip: !conversacionId, // No ejecutar si no hay ID
      pollingInterval: 3000, // Actualizar cada 3 segundos
    }
  );

  return {
    mensajes: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
};

/**
 * Hook para validar si el usuario actual tiene un rol específico
 */
export const useValidarRol = (rolesPermitidos: UserRole[]) => {
  const user = useAuthStore((state) => state.user);

  return useMemo(() => {
    if (!user?.rol) return false;
    return rolesPermitidos.includes(user.rol as UserRole);
  }, [user?.rol, rolesPermitidos]);
};

/**
 * Hook para obtener información del usuario autenticado
 */
export const useUsuarioActual = () => {
  return useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    token: state.token,
  }));
};
