'use client';

import classNames from 'classnames';
import { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { popupAnimation } from './config';
import styles from './PopupMenu.module.css';

const anchorConfig = {
  'left': styles.anchorLeft,
  'right': styles.anchorRight,
  'bottom': styles.anchorBottom,
  'top': styles.anchorTop,
};

type TPopupMenuProps = {
  isOpen: boolean;
  children: ReactNode;
  popupRef?: React.RefObject<HTMLDivElement | null> | null;
  anchor?: string;
  isLast?: boolean;
  style?: React.CSSProperties;
};

export const PopupMenu = ({
  isOpen, children, popupRef = null, anchor = 'left', style, isLast
}: TPopupMenuProps) => {

  return (
    <AnimatePresence>
      {
        isOpen && (
          <motion.div {...popupAnimation}>
            <article
              className={classNames(
                styles.popup,
                anchorConfig[anchor as keyof typeof anchorConfig],
                isLast && styles.isLast
              )}
              ref={popupRef}
              style={style}
            >
              {children}
            </article>
          </motion.div>
        )
      }
    </AnimatePresence>
  )
};
