import { ReactNode } from 'react';
import styles from './SectionWrapper.module.css';

type TSectionWrapperProps = {
  children: ReactNode;
};

export const SectionWrapper = ({ children }: TSectionWrapperProps) => {
  return (
    <section className={styles.wrapper}>
      {children}
    </section>
  )
};