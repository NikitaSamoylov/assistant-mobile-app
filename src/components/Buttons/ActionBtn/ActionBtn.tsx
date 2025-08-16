import { ReactNode } from 'react';
import classNames from 'classnames';
import styles from './ActionBtn.module.css';

type TColors = 'error' | 'default' | 'success' | 'button' | 'paper';

const styledComponent = {
  text: styles.text,
  icon: '',
  background: styles.background,
  backgroundError: styles.backgroundError
};

const colorsConfig = {
  default: styles.default,
  error: styles.error,
  success: styles.success,
  button: styles.button,
  paper: styles.paper,
};

type TActionBtnProps = {
  variant: keyof typeof styledComponent;
  children: ReactNode;
  other?: React.HTMLAttributes<HTMLElement> | HTMLStyleElement;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  action?: () => void;
  disabled?: boolean;
  color?: TColors;
};

export const ActionBtn = ({
  variant,
  children,
  type = 'button',
  action,
  disabled = false,
  color = 'default',
  ...other
}: TActionBtnProps) => {
  return (
    <button
      className={classNames(
        styledComponent[variant],
        colorsConfig[color as TColors],
      )}
      type={type}
      disabled={disabled}
      onClick={action}
      {...other}
    >
      {children}
    </button>
  )
};