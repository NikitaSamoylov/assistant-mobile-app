'use client';

import NextImage from 'next/image';
import { InstallAppBtn } from "@/components/InstallAppBtn";
import { PopupNotification } from "@/components/Popups/PopupNotification";
import { isMobile } from "@/utils/isMobile";
import NextLink from 'next/link';

import styles from './Install.module.css';
import { TextField } from '@/components/TextField';
import { Pathes } from '@/lib/types/pathes';

const logoAuth = '/logo-auth.png';

export const Install = () => {
  const isMobilePlatform = isMobile();

  const showMsg = (
    <PopupNotification
      title="Пожалуйста, войти со смартфона"
      hideActions
      isVisible={!isMobilePlatform}
    />
  );

  if (!isMobilePlatform) {
    return showMsg;
  };

  return (
    <>
      <div className={styles.installWrapper}>
        <NextImage
          src={logoAuth}
          width={163.42}
          height={65.03}
          alt="Лого"
          style={{ display: 'block', margin: '0 auto', marginBottom: '20px' }}
        />
        <TextField variant="h3" color="main" style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '15px' }}>
          ИИ-помощник для дома
        </TextField>
        <InstallAppBtn />
        <div className={styles.supportWrapper}>
          <TextField variant="span" color="caption">
            Не получается установить?
          </TextField>
          <NextLink href={Pathes.SUPPORT} className={styles.link}>
            Поддержка
          </NextLink>
        </div>
      </div >
    </>
  )
};