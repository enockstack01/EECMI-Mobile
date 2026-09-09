import { useAuth } from '@clerk/clerk-expo';
import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';

import { useApi } from '@/hooks/use-api';

type NotificationsValue = {
  unread: number;
  refresh: () => void;
};

const NotificationsContext = createContext<NotificationsValue>({ unread: 0, refresh: () => {} });

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  const api = useApi();
  const [count, setCount] = useState(0);

  const refresh = useCallback(() => {
    if (!isSignedIn) return;
    api.getUnreadCount()
      .then((res) => setCount(res.data?.count ?? 0))
      .catch(() => {});
  }, [api, isSignedIn]);

  useEffect(() => {
    if (!isSignedIn) return;
    refresh();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => sub.remove();
  }, [isSignedIn, refresh]);

  const value = useMemo<NotificationsValue>(
    () => ({ unread: isSignedIn ? count : 0, refresh }),
    [isSignedIn, count, refresh],
  );
  return createElement(NotificationsContext.Provider, { value }, children);
}

export const useNotifications = () => useContext(NotificationsContext);
