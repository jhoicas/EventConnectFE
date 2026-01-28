import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productoService } from '../services/productoService';
import type { CreateProductoDto, UpdateProductoDto } from '@/types';

const QUERY_KEY = 'productos';

export const useProductos = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: productoService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useProducto = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => productoService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductosStockBajo = () => {
  return useQuery({
    queryKey: [QUERY_KEY, 'stock-bajo'],
    queryFn: productoService.getStockBajo,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProducto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (producto: CreateProductoDto) => productoService.create(producto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateProducto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (producto: UpdateProductoDto) => productoService.update(producto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
    },
  });
};

export const useDeleteProducto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => productoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
