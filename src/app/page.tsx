'use client';

import { TabsHeader } from '@/modules/ProductsPageContent/TabsHeader';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { FadeComponent } from '@/components/AnimatedComponents/FadeComponent';
import { Search } from '@/modules/Search';
import { motion } from 'framer-motion';
import styles from './page.module.css';

const searchVariants = {
  initial: { y: 0, opacity: 1 },
  moveUp: { y: -55, opacity: 1, transition: { duration: 0.3 } },
  moveDown: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

export default function Home() {
  const { isSearch } = useSelector((state: RootState) => state.isSearch);

  return (
    <div>
      <main className={styles.main} >
        <div>
          <motion.div
            initial="moveDown"
            animate={isSearch ? "moveUp" : "moveDown"}
            variants={searchVariants}
          >
            <Search />
          </motion.div>
          <FadeComponent isVisible={!isSearch}>
            <TabsHeader />
          </FadeComponent>
        </div>
      </main>
    </div>
  );
};