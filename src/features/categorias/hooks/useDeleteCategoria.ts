import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriaService } from '../services/categoriaService';

const QUERY_KEY = 'categorias';

export const useDeleteCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
