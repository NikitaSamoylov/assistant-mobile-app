/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { getProductsFromIDB } from "@/lib/storage/indexedDb/existingProducts";
import { getShoppingProducts } from "@/lib/storage/indexedDb/productsToBuy";
import { setBackup } from "@/lib/store/features/backupSlice";
import { RootState } from "@/lib/store/store";
import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const BackupProvider = ({ children }: { children: ReactNode }) => {
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);
  const { backup } = useSelector((state: RootState) => state.backup);
  const userId = useSelector((state: RootState) => state.userSession.userSession?.id);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!backup || !isUserOnline || !userId) {
      dispatch(setBackup(false));
      return;
    };

    const handleSync = async () => {
      const existingProducts = await getProductsFromIDB('all') || [];
      const toBuyProducts = await getShoppingProducts() || [];

      const dto = {
        userId,
        existingProducts,
        toBuyProducts,
      };

      fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dto)
      })
        .then((data) => data.json())
        .then((resp) => {
          if (resp.message === 'Бэкап успешно сохранён') {
            dispatch(setBackup(false))
          };
        })
        .catch((e) => console.log(e))
    };

    handleSync();
  }, [backup]);

  return <>{children}</>
};