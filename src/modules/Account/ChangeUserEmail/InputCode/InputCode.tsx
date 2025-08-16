/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { Spinner } from '@/components/Spinner.tsx';
import { PRELOADER_DEFAULT_SIZE } from '@/lib/consts/consts';
import useFetch from '@/utils/hooks.ts/useFetch';
import { PopupNotification } from '@/components/Popups/PopupNotification';
import { setUserSession } from '@/lib/store/features/sessionSlice';
import styles from './InputCode.module.css';

export const InputCode = ({
  size = 4, handleOpen, setShowSuccessPopup
}: { size?: number; handleOpen: VoidFunction; setShowSuccessPopup: (val: boolean) => void }) => {
  const systemError = useSelector((state: RootState) => state.systemError.systemError);
  const userId = useSelector((state: RootState) => state.userSession.userSession?.id);
  const { userSession } = useSelector((state: RootState) => state.userSession);

  const [input, setInput] = useState('');

  const dispatch = useDispatch();

  const { fetch: sendVerifyCode, data, isLoading, isError, setIsError } = useFetch<{ message: string }>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setInput(e.target.value);
    };
  };

  useEffect(() => {
    if (systemError) setInput('');
  }, [systemError]);

  const verfifyCode = () => {
    if (input?.length !== size) return;

    sendVerifyCode('/api/verify-code-change-email', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        code: input,
      })
    });
  };

  useEffect(() => {
    verfifyCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  useEffect(() => {
    if (!data?.message) return;
    const updateData = {
      ...userSession,
      email: data?.message,
    };
    dispatch(setUserSession(updateData as any));
    setShowSuccessPopup(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
      secondBtnAction={() => handleOpen()}
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