import { baseApi } from './baseApi';

export interface Empresa {
  id: number;
  razon_Social: string;
  nit: string;
  email: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  pais: string;
  logo_URL?: string;
  estado: string;
}

export const empresaApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getEmpresas: builder.query<Empresa[], void>({
      query: () => '/Empresa',
      providesTags: ['Cliente'],
    }),
  }),
});

export const {
  useGetEmpresasQuery,
} = empresaApi;
