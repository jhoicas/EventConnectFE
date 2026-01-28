import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriaService } from '../services/categoriaService';
import type { UpdateCategoriaDto } from '@/types';

const QUERY_KEY = 'categorias';

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoria: UpdateCategoriaDto) => categoriaService.update(categoria),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, data.id] });
    },
  });
};
