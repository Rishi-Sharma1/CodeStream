import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export function useAuthInit() {
  const { setUser, clearUser, setLoading } = useAuth();

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const { user } = await authService.getCurrentUser();
        setUser(user);
      } catch (error) {
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, clearUser, setLoading]);
}