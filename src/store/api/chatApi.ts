import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Conversacion,
  Mensaje,
  CreateConversacionDto,
  EnviarMensajeDto,
  MensajeResponse,
  ConversacionesListResponse,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://eventconnect-api-8oih6.ondigitalocean.app/api';

/**
 * RTK Query API para Chat
 * Proporciona endpoints para gestionar conversaciones y mensajes
 */
export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/chat`,
    prepareHeaders: (headers) => {
      // Obtener token del localStorage
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Conversaciones', 'Mensajes', 'Conversacion'],
  endpoints: (builder) => ({
    /**
     * GET /chat/conversaciones
     * Obtiene la lista de todas las conversaciones del usuario autenticado
     */
    getConversaciones: builder.query<ConversacionesListResponse, void>({
      query: () => ({
        url: '/conversaciones',
        method: 'GET',
      }),
      providesTags: ['Conversaciones'],
    }),

    /**
     * GET /chat/conversaciones/:id
     * Obtiene una conversación específica por ID
     */
    getConversacion: builder.query<Conversacion, number>({
      query: (conversacionId) => ({
        url: `/conversaciones/${conversacionId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, conversacionId) => [
        { type: 'Conversacion', id: conversacionId },
      ],
    }),

    /**
     * GET /chat/conversaciones/:id/mensajes
     * Obtiene el historial de mensajes de una conversación
     */
    getMensajes: builder.query<Mensaje[], number>({
      query: (conversacionId) => ({
        url: `/conversaciones/${conversacionId}/mensajes`,
        method: 'GET',
      }),
      providesTags: (_result, _error, conversacionId) => [
        { type: 'Mensajes', id: conversacionId },
      ],
    }),

    /**
     * POST /chat/conversaciones/:id/mensajes
     * Envía un nuevo mensaje en una conversación
     * Mutation para crear/actualizar mensajes
     */
    enviarMensaje: builder.mutation<MensajeResponse, EnviarMensajeDto>({
      query: (body) => ({
        url: `/conversaciones/${body.conversacion_Id}/mensajes`,
        method: 'POST',
        body: {
          contenido: body.contenido,
          tipo_Contenido: body.tipo_Contenido || 'texto',
          archivo_URL: body.archivo_URL,
        },
      }),
      // Invalidar los tags de mensajes y conversaciones para refrescar
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Mensajes', id: arg.conversacion_Id },
        { type: 'Conversacion', id: arg.conversacion_Id },
        'Conversaciones',
      ],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        // Optimistic update - actualizar cache inmediatamente
        const patchResult = dispatch(
          chatApi.util.updateQueryData(
            'getMensajes',
            arg.conversacion_Id,
            (draft) => {
              draft.push({
                id: -1, // ID temporal
                conversacion_Id: arg.conversacion_Id,
                remitente_Id: 0,
                contenido: arg.contenido,
                tipo_Contenido: arg.tipo_Contenido || 'texto',
                archivo_URL: arg.archivo_URL,
                leido: false,
                fecha_Creacion: new Date().toISOString(),
              } as Mensaje);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (_error) {
          patchResult.undo();
        }
      },
    }),

    /**
     * POST /chat/conversaciones
     * Crea una nueva conversación
     * RESTRICCIÓN: Solo disponible para usuarios con rol 'Cliente'
     */
    crearConversacion: builder.mutation<Conversacion, CreateConversacionDto>({
      query: (body) => ({
        url: '/conversaciones',
        method: 'POST',
        body: {
          usuario_Receptor_Id: body.usuario_Receptor_Id,
          nombre_Contraparte: body.nombre_Contraparte,
          avatar_URL: body.avatar_URL,
        },
      }),
      // Invalidar lista de conversaciones para refrescar
      invalidatesTags: ['Conversaciones'],
    }),

    /**
     * PATCH /chat/conversaciones/:id/marcar-leido
     * Marca todos los mensajes de una conversación como leídos
     */
    marcarConversacionComoLeida: builder.mutation<void, number>({
      query: (conversacionId) => ({
        url: `/conversaciones/${conversacionId}/marcar-leido`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, conversacionId) => [
        { type: 'Conversacion', id: conversacionId },
        'Conversaciones',
      ],
    }),

    /**
     * DELETE /chat/conversaciones/:id
     * Elimina una conversación
     */
    eliminarConversacion: builder.mutation<void, number>({
      query: (conversacionId) => ({
        url: `/conversaciones/${conversacionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Conversaciones'],
    }),
  }),
});

// Exportar hooks auto-generados
export const {
  useGetConversacionesQuery,
  useGetConversacionQuery,
  useGetMensajesQuery,
  useEnviarMensajeMutation,
  useCrearConversacionMutation,
  useMarcarConversacionComoLeidaMutation,
  useEliminarConversacionMutation,
  // Lazy queries para obtener datos bajo demanda
  useLazyGetConversacionesQuery,
  useLazyGetMensajesQuery,
} = chatApi;
