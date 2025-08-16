'use client';

import { motion, AnimatePresence } from "framer-motion"
import { ReactNode } from "react";
import { popupVariants } from "./config";
import styles from './DownToUpComponent.module.css';

type TDownToUpComponent = {
  isVisible: boolean;
  children: ReactNode;
  initial?: { opacity: number } | {};
  delay?: number;
};

export const DownToUpComponent = ({
  isVisible = false, children, delay = 0
}: TDownToUpComponent) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.downToUpPopup}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={popupVariants}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}