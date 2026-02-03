import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuarioService } from '../services/usuarioService';

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
