/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { getProductsFromIDB, saveProductsToIDB } from '@/lib/storage/indexedDb/existingProducts';
import { getShoppingProducts, saveShoppingProducts } from '@/lib/storage/indexedDb/productsToBuy';
import useFetch from '@/utils/hooks.ts/useFetch';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { ReactNode, useEffect } from 'react';
import { Spinner } from '@/components/Spinner.tsx';
import { PRELOADER_DEFAULT_SIZE } from '@/lib/consts/consts';
import { TextField } from '@/components/TextField';
import { TBuyProducts, TProduct } from '@/lib/types/product';
import { FadeComponent } from '@/components/AnimatedComponents/FadeComponent';
import { setIsCheckBackup } from '@/lib/store/features/isCheckingBackupSlice';
import styles from './CheckBackup.module.css';

type TBackup = {
  message: {
    backup: {
      existingProducts: TProduct[];
      toBuyProducts: TBuyProducts[];
    };
  };
};

export const CheckBackup = ({ children }: { children: ReactNode }) => {
  const userId = useSelector((state: RootState) => state.userSession.userSession?.id);
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);
  const checkIsBackup = useSelector((state: RootState) => state.isCheckBackup.isCheckBackup);

  const { fetch: getBackup, data, isLoading } = useFetch<TBackup>();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId || !isUserOnline || !checkIsBackup) return;

    getBackup(`/api/backup?userId=${userId}`);
  }, [userId, isUserOnline, checkIsBackup]);

  useEffect(() => {
    if (!data) {
      return;
    };
    if (data?.message?.backup?.existingProducts?.length <= 0 && data?.message?.backup?.toBuyProducts?.length <= 0) {
      dispatch(setIsCheckBackup(false));
      return;
    };

    const backupExistings = data?.message?.backup?.existingProducts;
    const backupToBuy = data?.message?.backup?.toBuyProducts;

    const saveExistings = async () => {
      const existingProducts = await getProductsFromIDB('all');
      const toBuyProducts = await getShoppingProducts();

      if (backupExistings?.length && !existingProducts?.length) {
        saveProductsToIDB(backupExistings);
      };
      if (backupToBuy && !toBuyProducts?.length) {
        saveShoppingProducts(backupToBuy);
      };

      dispatch(setIsCheckBackup(false));
    };

    saveExistings();
  }, [data]);

  const loading = (
    <FadeComponent isVisible={isLoading}>
      <div className={styles.preloader}>
        <Spinner size={PRELOADER_DEFAULT_SIZE} />
        <TextField variant="p" color="main" style={{ textAlign: 'center', marginTop: '15px' }}>
          Проверка резервной копии ...
        </TextField>
      </div>
    </FadeComponent>
  );

  return (
    <>
      {loading}
      {!isLoading && children}
    </>
  )
};