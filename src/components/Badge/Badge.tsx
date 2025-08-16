import { ReactNode } from 'react';
import styles from './Badge.module.css';
import { TextField } from '../TextField';

type TBadgeProps = {
  children: ReactNode;
  label?: string;
  color?: string;
};

export const Badge = ({ children, label, color }: TBadgeProps) => {
  return (
    <div>
      <div className={styles.badgeContainer}>
        {children}
        <div style={{ backgroundColor: color }} className={styles.badge}>
          <div className={styles.label}>
            <TextField variant="span" color="contrastWhite">
              {label}
            </TextField>
          </div>
        </div>
      </div>
    </div>
  );
};