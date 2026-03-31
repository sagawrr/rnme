import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

function isLikelyOnline(state: NetInfoState): boolean {
  if (state.isConnected === false) return false;
  if (state.isInternetReachable === false) return false;
  return true;
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    NetInfo.fetch().then((state) => {
      if (!cancelled) setIsOnline(isLikelyOnline(state));
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(isLikelyOnline(state));
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return { isOnline };
}
