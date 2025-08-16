'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import classNames from 'classnames';
import { PopupNotification } from '../../components/Popups/PopupNotification';
import { useRouter } from 'next/navigation';
import { Pathes } from '@/lib/types/pathes';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useSignIn } from '@/utils/hooks.ts/useSignIn';
import { Spinner } from '@/components/Spinner.tsx';
import { PRELOADER_DEFAULT_SIZE } from '@/lib/consts/consts';
import styles from './VerifyCode.module.css';

export const InputCode = ({ size = 4 }: { size?: number }) => {
  const router = useRouter();
  const systemError = useSelector((state: RootState) => state.systemError.systemError);

  const { authData } = useSelector((state: RootState) => state.authData);

  const { verifyAndSignIn, isLoading, isError, setIsError } = useSignIn();

  const [input, setInput] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setInput(e.target.value);
    };
  };

  useEffect(() => {
    if (!authData?.userName) {
      return router.replace(Pathes.AUTH);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authData]);

  useEffect(() => {
    if (systemError) setInput('');
  }, [systemError]);

  const verfifyCode = () => {
    if (input?.length !== size) return;
    if (!authData?.userName) {
      return setIsError('Ошибка отправки данных');
    };

    const dto = {
      ...(authData?.email && { email: authData.email }),
      ...(authData?.phone && { phone: authData.phone }),
      verificationCode: input,
      callbackUrl: Pathes.MAIN,
    };

    verifyAndSignIn(dto);
  };

  useEffect(() => {
    verfifyCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const showError = (
    <PopupNotification
      title="Код не отправлен"
      subTitle="Проверьте код или получите новый"
      btnTitle="Повторить"
      btnSecondTitle="Вернуться"
      action={() => {
        setInput('');
        setIsError(null);
      }}
      secondBtnAction={() => router.replace(Pathes.AUTH)}
      isVisible={!!isError && !systemError}
    />
  );

  return (
    <div className={styles.container} >
      {showError}
      {isLoading && (
        <div className={styles.spinner}>
          <Spinner size={PRELOADER_DEFAULT_SIZE} />
        </div>
      )}
      {
        !isLoading && !isError && (
          <input
            className={
              classNames(
                styles.input,
                isLoading && styles.disabled
              )
            }
            value={input}
            onChange={(e) => handleChange(e)}
            maxLength={4}
            disabled={isLoading}
          />
        )
      }
    </div>
  );
};