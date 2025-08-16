'use client';

import styles from './MenuItem.module.css';
import { TextField } from '@/components/TextField';
import { ActionBtn } from '@/components/Buttons/ActionBtn';
import { IoIosArrowForward } from 'react-icons/io';
import { ReactElement } from 'react';

type TProps = {
  action: VoidFunction;
  icon: ReactElement;
  title: string;
}

export const MenuItem = ({ action, icon, title }: TProps) => {
  return (
    <li className={styles.item}>
      {icon}
      <TextField
        variant="p"
        color="main"
        style={{
          padding: '0 15px',
          flex: 1,
          transform: 'translateX(-10px)',
        }}>
        {title}
      </TextField>
      <ActionBtn variant="icon" color="button" action={() => action()}>
        <IoIosArrowForward className={styles.icon} />
      </ActionBtn>
    </li>
  )
};