/**
 * Exportaciones centralizadas para Chat API
 * Importa todo lo necesario desde este archivo
 */

// ============ RTK Query API ============
export { chatApi } from './chatApi';
export { serviciosApi } from './serviciosApi';

// ============ Hooks Automáticos (RTK Query) ============
export {
  useGetConversacionesQuery,
  useGetConversacionQuery,
  useGetMensajesQuery,
  useEnviarMensajeMutation,
  useCrearConversacionMutation,
  useMarcarConversacionComoLeidaMutation,
  useEliminarConversacionMutation,
  useLazyGetConversacionesQuery,
  useLazyGetMensajesQuery,
} from './chatApi';

export {
  useGetServiciosPublicosQuery,
  useGetServiciosAdminQuery,
  useCreateServicioMutation,
  useUpdateServicioMutation,
  useDeleteServicioMutation,
} from './serviciosApi';

// ============ Hooks Personalizados (con validación) ============
export {
  useCrearConversacionSegura,
  useEnviarMensajeSeguro,
  useConversacionesDelUsuario,
  useMensajesDeConversacion,
  useValidarRol,
  useUsuarioActual,
} from './chatHooks';
