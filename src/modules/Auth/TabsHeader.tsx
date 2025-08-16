'use client';

import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { RegisterFormEmail } from './RegisterFormEmail/RegisterFormEmail';
import { RegisterFormPhone } from './RegisterFormPhone';
import styles from './Auth.module.css';

type TTabs = {
  id: string;
  label: string;
}

enum TabsIds {
  EMAIL = 'email',
  PHONE = 'phone',
};

const tabs = [
  { id: 'email', label: 'Войти по email' },
  { id: 'phone', label: 'Войти по звонку' },
];

export const TabsHeader = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleActiveTab = (id: TTabs) => {
    if (activeTab?.id === id?.id) return;

    setActiveTab(id as TTabs);
  };

  return (
    <>
      <div className={styles.tabHeader} >
        <ul className={styles.tabList}>
          {tabs.map((tab) => (
            <li
              key={tab.id}
              className={styles.tabItem}
            >
              <AnimatePresence>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className={classNames(
                    styles.tabBtn,
                    tab.id === activeTab?.id &&
                    styles.tabBtn_active
                  )}
                  onClick={() => {
                    handleActiveTab(tab)
                  }}
                >
                  {tab.label}
                </motion.button>
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>
      {
        activeTab?.id === TabsIds.EMAIL && (
          <RegisterFormEmail />
        )
      }
      {
        activeTab?.id === TabsIds.PHONE && (
          <RegisterFormPhone />
        )
      }
    </>
  )
};