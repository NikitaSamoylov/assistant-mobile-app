'use client';

import NextImage from 'next/image';
import { FadeComponent } from '@/components/AnimatedComponents/FadeComponent';
import styles from './AuthHeader.module.css';

const logoAuth = '/logo-auth.png';

export const AuthHeader = () => {
  return (
    <FadeComponent isVisible={true} initial={{ opacity: 0 }}>
      <div className={styles.logo}>
        <NextImage
          src={logoAuth}
          width={163.42}
          height={65.03}
          alt="Лого"
        />
      </div>
    </FadeComponent>
  )
};