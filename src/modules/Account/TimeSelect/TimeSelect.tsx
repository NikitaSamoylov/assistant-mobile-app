/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { TextField } from '@/components/TextField';
import { IoIosArrowDown } from "react-icons/io";
import { FadeComponent } from '@/components/AnimatedComponents/FadeComponent';
import { ActionBtn } from '@/components/Buttons/ActionBtn';
import useFetch from '@/utils/hooks.ts/useFetch';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { PopupNotification } from '@/components/Popups/PopupNotification';
import { hours } from './config';
import classNames from 'classnames';
import { setNoInternetMsg } from '@/lib/store/features/noInternetSlice';
import { setUserSession } from '@/lib/store/features/sessionSlice';
import styles from './TimeSelect.module.css';

const DEFAULT_TIME = '20';

export const TimeSelect = () => {
  const userId = useSelector((state: RootState) => state.userSession.userSession?.id);
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);
  const { userSession } = useSelector((state: RootState) => state.userSession);
  const timeToNotifyExisting = useSelector((state: RootState) => state.userSession.userSession?.timeToNotify);

  const [time, setTime] = useState(timeToNotifyExisting || DEFAULT_TIME);
  const [isOpen, setIsOpen] = useState(false);
  const [isChangeTimeError, setIsChangeTimeError] = useState(false);

  const dispatch = useDispatch();

  const { fetch: updateTime, data, isError } = useFetch<{ message: string }>();

  const handleOpen = () => {
    setIsOpen(isOpen => !isOpen);
  };

  const handleClick = (hour: string) => {
    if (!isUserOnline) {
      dispatch(setNoInternetMsg(true));
      return;
    };

    setTime(hour);
    setIsOpen(false);

    if (!userId) {
      setIsChangeTimeError(true);
      return;
    };

    const dto = {
      userId,
      timeToNotify: hour,
    };

    updateTime('/api/push-time', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...dto })
    })
  };

  useEffect(() => {
    if (!isError && !isChangeTimeError) return;

    setTime(DEFAULT_TIME);
  }, [isError, isChangeTimeError]);

  useEffect(() => {
    if (!data || data.message !== 'success') return;

    const updateData = {
      ...userSession,
      timeToNotify: time,
    };
    dispatch(setUserSession(updateData as any));
  }, [data]);

  const showNoIdError = (
    <PopupNotification
      title="Пользователь не найден"
      subTitle="Перезагрузите приложение и попробуйте снова"
      btnTitle="Ок"
      action={() => {
        setIsChangeTimeError(false);
      }}
      isVisible={isChangeTimeError}
    />
  );

  return (
    <>
      {showNoIdError}
      <div style={{ position: 'relative' }}>
        <FadeComponent isVisible={isOpen}>
          <div className={styles.popup}>
            <ul>
              {
                hours.map(hour => (
                  <li key={hour} className={styles.item}>
                    <ActionBtn variant="text" action={() => handleClick(hour)}>
                      <TextField variant="p" color="main">
                        {hour}
                      </TextField>
                    </ActionBtn>
                  </li>
                ))
              }
            </ul>
          </div>
        </FadeComponent>
        <div className={styles.time}>
          <TextField variant="p" color="main">
            {time}
          </TextField>
          <ActionBtn variant="icon" action={handleOpen}>
            <IoIosArrowDown size={'1.7rem'} color="grey" className={
              classNames((isOpen && styles.isOpened) || styles.isClosed)
            } />
          </ActionBtn>
        </div>
      </div>
    </>
  )
};