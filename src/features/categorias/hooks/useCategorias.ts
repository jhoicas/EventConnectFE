import { useQuery } from '@tanstack/react-query';
import { categoriaService } from '../services/categoriaService';

const QUERY_KEY = 'categorias';

export const useCategorias = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: categoriaService.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};
