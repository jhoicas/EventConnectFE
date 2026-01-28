import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriaService } from '../services/categoriaService';
import type { CreateCategoriaDto } from '@/types';

const QUERY_KEY = 'categorias';

export const useCreateCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoria: CreateCategoriaDto) => categoriaService.create(categoria),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
