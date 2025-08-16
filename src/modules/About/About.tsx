'use client';

import { useEffect } from "react";
import classNames from "classnames";
import { InstallAppBtn } from "@/components/InstallAppBtn";
import { isMobile } from "@/utils/isMobile";
import styles from './About.module.css';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MSStream?: any;
  }
};

export const About = () => {
  useEffect(() => {
    document.body.style.setProperty('--max-width', '100%', 'important');

    return () => {
      document.body.style.setProperty('--max-width', '430px');
    };
  }, []);

  return (
    <>
      <div className={styles.promoWrapper}>
        <iframe
          src="https://assistant-pro-promo.vercel.app"
          // src="https://дворецкий.site"
          // src="https://cu18353.tw1.ru/"
          className={classNames(styles.iframe, isMobile() ? styles.isMobileHeight : styles.isDesktopHeight)}
          title="Дворецкий сайт"
        />
      </div>
      {
        isMobile() && <InstallAppBtn />
      }
    </>
  );
};