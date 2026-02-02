import { useQuery } from '@tanstack/react-query';
import { usuarioService } from '../services/usuarioService';

const QUERY_KEY = 'usuarios';

export const useUsuarios = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: usuarioService.getAll,
    staleTime: 5 * 60 * 1000,
  });
};
