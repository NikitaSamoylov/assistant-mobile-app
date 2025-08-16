import styles from './Auth.module.css';

import { TabsHeader } from './TabsHeader';
import { FadeComponent } from "@/components/AnimatedComponents/FadeComponent";

export const Auth = () => {

  return (
    <div className={styles.tabsHeader}>
      <FadeComponent isVisible={true} initial={{ opacity: 0 }}>
        <TabsHeader />
      </FadeComponent>
    </div>
  )
};

