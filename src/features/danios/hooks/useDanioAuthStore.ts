import { useEffect, useState } from 'react';
import { authStore } from '@/store/authStore';

export function useDanioAuthStore() {
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const user = authStore.getState().user;
    if (user) {
      setUserRole(user.rol || '');
    }
  }, []);

  return { userRole };
}
