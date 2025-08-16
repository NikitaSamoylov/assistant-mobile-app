'use client';

import NextImage from 'next/image';
import styles from './MainLogo.module.css';

import Logo from './Logo.png';

type TMainLogo = {
  width?: number;
  height?: number;
  hideText?: boolean;
};

export const MainLogo = ({ width = 42, height = 42, hideText = true }: TMainLogo) => {
  return (
    <div className={styles.container} >
      <div className={styles.logoImg}>
        <NextImage
          src={Logo}
          width={width}
          height={height}
          alt="Логотип"
        />
      </div>

      {/* Текст, если hideText === false */}
      {!hideText && (
        <div className={styles.titleContainer}>
          <p className={styles.title}>мой</p>
          <p className={styles.subTitle}>дворецкий</p>
        </div>
      )}
    </div>
  );
};
