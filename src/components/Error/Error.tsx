'use client';

import { useEffect } from 'react';
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { ActionBtn } from '../Buttons/ActionBtn';
import { TextField } from '../TextField';

import styles from './Error.module.css';

export const Error = ({ error }: any) => {
  useEffect(() => {
    // можно отправить в центр логирования
    console.error(error);
  }, [error]);

  const reset = () => {
    window.location.reload();
  };

  return (
    <div className={styles.wrapper}>
      <IoIosRemoveCircleOutline className={styles.icon} />
      <TextField variant="h1" color="main" style={{ marginBottom: '25px', textAlign: 'center' }}>
        Что-то не так
      </TextField>
      <ActionBtn action={reset} variant="text">
        Перезагрузить
      </ActionBtn>
    </div>
  );
}