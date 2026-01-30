import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://eventconnect-api-8oih6.ondigitalocean.app/api';

export interface Servicio {
  id_Servicio: number;
  titulo: string;
  descripcion: string;
  icono?: string;
  imagen_Url: string;
  orden: number;
  activo: boolean;
  fecha_Creacion?: string;
  fecha_Actualizacion?: string;
}

export interface CreateServicioDto {
  titulo: string;
  descripcion: string;
  imagen_Url: string;
  icono?: string;
  orden?: number;
  activo?: boolean;
}

export interface UpdateServicioDto extends Partial<CreateServicioDto> {}

export const serviciosApi = createApi({
  reducerPath: 'serviciosApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Servicios'],
  endpoints: (builder) => ({
    // Público - para landing page
    getServiciosPublicos: builder.query<Servicio[], void>({
      query: () => '/servicios?activo=true',
      providesTags: ['Servicios'],
    }),

    // Admin - todos los servicios
    getServiciosAdmin: builder.query<Servicio[], void>({
      query: () => '/servicios/admin',
      providesTags: ['Servicios'],
    }),

    // Admin - crear servicio
    createServicio: builder.mutation<Servicio, CreateServicioDto>({
      query: (data) => ({
        url: '/servicios',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Servicios'],
    }),

    // Admin - actualizar servicio
    updateServicio: builder.mutation<Servicio, { id: number; data: UpdateServicioDto }>({
      query: ({ id, data }) => ({
        url: `/servicios/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Servicios'],
    }),

    // Admin - eliminar servicio
    deleteServicio: builder.mutation<void, number>({
      query: (id) => ({
        url: `/servicios/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Servicios'],
    }),
  }),
});

export const {
  useGetServiciosPublicosQuery,
  useGetServiciosAdminQuery,
  useCreateServicioMutation,
  useUpdateServicioMutation,
  useDeleteServicioMutation,
} = serviciosApi;
