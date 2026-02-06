import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export function useDanioAuthStore() {
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const user = useAuthStore.getState().user;
    if (user) {
      setUserRole(user.rol || '');
    }
  }, []);

  return { userRole };
}
