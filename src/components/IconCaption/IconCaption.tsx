import { ReactNode } from 'react';
import styles from './IconCaption.module.css';
import classNames from 'classnames';

type TIconCaptionProps = {
  children: ReactNode;
  isActive: boolean;
};

export const IconCaption = ({ children, isActive }: TIconCaptionProps) => {
  return (
    <span className={classNames(styles.caption, isActive ? styles.isActive : styles.default)} >
      {children}
    </span>
  )
};