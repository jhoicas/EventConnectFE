import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuarioService } from '../services/usuarioService';
import type { UsuarioApi } from '@/types';

const QUERY_KEY = 'usuarios';

export const useUsuarios = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: usuarioService.getAll,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
};

export const useUpdateUsuarioEstado = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) =>
      usuarioService.updateEstado(id, estado),
    onMutate: async ({ id, estado }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });
      const previous = queryClient.getQueryData<UsuarioApi[]>([QUERY_KEY]);

      if (previous) {
        queryClient.setQueryData<UsuarioApi[]>([QUERY_KEY],
          previous.map((usuario) =>
            usuario.id === id ? { ...usuario, estado } : usuario
          )
        );
      }

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData([QUERY_KEY], context.previous);
      }
    },
  });
};
