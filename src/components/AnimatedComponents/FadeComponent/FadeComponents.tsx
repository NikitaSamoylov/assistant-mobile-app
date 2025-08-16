'use client';

import { motion, AnimatePresence } from "framer-motion"
import { ReactNode } from "react";

type TFadeComponentProps = {
  isVisible: boolean;
  children: ReactNode;
  initial?: { opacity: number } | {};
  delay?: number;
};

export const FadeComponent = ({
  isVisible = false, children, delay = 0
}: TFadeComponentProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: delay }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
};
