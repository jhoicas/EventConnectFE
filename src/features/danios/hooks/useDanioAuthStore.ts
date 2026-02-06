import { useAuthStore } from '@/store/authStore';

export function useDanioAuthStore() {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.rol || '';

  return { userRole };
}
