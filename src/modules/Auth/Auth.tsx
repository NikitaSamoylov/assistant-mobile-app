// 'use client';

import styles from './Auth.module.css';

import { TabsHeader } from './TabsHeader';
import { FadeComponent } from "@/components/AnimatedComponents/FadeComponent";

// interface NavigatorWithStandalone extends Navigator {
//   standalone?: boolean;
// };

// function isPwaOpen() {
//   const nav = window.navigator as NavigatorWithStandalone;
//   const result = nav.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
//   return result;
// };

export const Auth = () => {

  return (
    <div className={styles.tabsHeader}>
      <FadeComponent isVisible={true} initial={{ opacity: 0 }}>
        <TabsHeader />
      </FadeComponent>
    </div>
  )
};

