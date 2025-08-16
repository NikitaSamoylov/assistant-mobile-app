'use client';

import { ReactNode } from "react";
import { IconCaption } from "../IconCaption";
import styles from './FooterActionBtn.module.css';

type TFooterActionBtnProps = {
  children: ReactNode;
  title: string;
  isActive: boolean;
  action: () => void;
};

export const FooterActionBtn = ({ children, title, action, isActive }: TFooterActionBtnProps) => {
  return (
    <button
      className={styles.btn}
      onClick={action}
    >
      {children}
      <IconCaption isActive={isActive}>
        {title}
      </IconCaption>
    </button>
  )
};