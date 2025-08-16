/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { setIsUserOnline } from "@/lib/store/features/isOnlineSlice";
import { RootState } from "@/lib/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

async function checkInternetAccess() {
  try {
    const response = await fetch('/api/ping', { method: 'HEAD', cache: 'no-cache' });
    return response.ok;
  } catch (error) {
    return false;
  };
};

export const useCheckIsOnline = () => {
  const dispatch = useDispatch();
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. Устанавливаем изначальное состояние из navigator.onLine
    dispatch(setIsUserOnline(navigator.onLine));

    // 2. Обработчики событий
    const handleOnline = () => {
      checkInternetAccess().then((online) => {
        dispatch(setIsUserOnline(online));
      });
    };

    const handleOffline = () => {
      dispatch(setIsUserOnline(false));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    checkInternetAccess().then((online) => {
      dispatch(setIsUserOnline(online));
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (typeof isUserOnline === 'boolean') {
      setIsReady(true);
    };
  }, [isUserOnline]);

  return { isUserOnline, isReady };
};