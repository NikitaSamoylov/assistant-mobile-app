'use client';

import { setSystemError } from '@/lib/store/features/systemError';
import { RootState } from '@/lib/store/store';
import { UserErrors } from '@/lib/types/customErrors';
import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useFetch<T>() {
  const dispatch = useDispatch();
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<Response | null>(null);

  const fetchRequest = useCallback(async (url: string, options?: RequestInit): Promise<Response | null> => {
    if (isUserOnline === null) return null;

    setIsLoading(true);
    setIsError(null);

    const response = await fetch(url, options);
    if (!response.ok) {
      if (!Object.values(UserErrors).includes(response.status)) {
        setIsLoading(false);
        dispatch(setSystemError());
        return response;
      };
      setIsLoading(false);
      setIsError(response);
      return response;
    } else {
      const result = await response.json() as T;
      setData(result);
      setIsLoading(false);
      return response;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserOnline]);

  return { fetch: fetchRequest, data, isLoading, isError, setIsError, setIsLoading, setData };
}