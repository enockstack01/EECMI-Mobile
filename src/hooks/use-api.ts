import { useAuth } from '@clerk/clerk-expo';
import { useMemo } from 'react';

import * as api from '@/lib/api';

/**
 * Binds the current Clerk session token to the token-required API calls, so
 * screens can call `api.getMe()` without threading the token through.
 */
export function useApi() {
  const { getToken } = useAuth();

  return useMemo(() => {
    const withToken = <A extends unknown[], R>(
      fn: (token: string, ...args: A) => Promise<R>,
    ) => async (...args: A): Promise<R> => {
      const token = await getToken();
      if (!token) throw new api.ApiError('You are signed out. Please sign in again.', 401);
      return fn(token, ...args);
    };

    return {
      getMe: withToken(api.getMe),
      patchMe: withToken(api.patchMe),
      getMyActivity: withToken(api.getMyActivity),
      getSavedDevotions: withToken(api.getSavedDevotions),
      saveDevotion: withToken(api.saveDevotion),
      unsaveDevotion: withToken(api.unsaveDevotion),
      getNotifications: withToken(api.getNotifications),
      getUnreadCount: withToken(api.getUnreadCount),
      markNotificationsRead: withToken(api.markNotificationsRead),
    };
  }, [getToken]);
}
