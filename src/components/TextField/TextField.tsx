import classNames from 'classnames';
import styles from './TextField.module.css';
import { TTextFieldColors, TTextFieldVariants } from '@/lib/types/textField';

const fontsVariants = {
  h1: styles.title,
  h2: styles.subTitle,
  h3: styles.underTitle,
  p: styles.body,
  span: styles.span,
};

const colorsVariants = {
  caption: styles.caption,
  error: styles.error,
  main: styles.main,
  subTitle: styles.subTitle,
  contrastWhite: styles.contrastWhite,
  checked: styles.checked,
  success: styles.success,
  title: styles.title,
};

interface ITextFieldProps extends React.HTMLAttributes<HTMLElement> {
  variant: TTextFieldVariants;
  color?: TTextFieldColors;
  children: React.ReactNode;
}

export const TextField: React.FC<ITextFieldProps> = ({ variant, color, children, ...other }) => {
  const Tag: React.ElementType = variant;

  return (
    <Tag
      className={
        classNames(
          fontsVariants[variant as keyof typeof fontsVariants],
          colorsVariants[color as keyof typeof colorsVariants],
        )
      }
      {...other}
    >
      {children}
    </Tag>
  )
};