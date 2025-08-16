import { createPortal } from 'react-dom';
import { ReactNode } from 'react';
import { DownToUpComponent } from '@/components/AnimatedComponents/DownToUpComponent';
import { SectionWrapper } from '@/components/SectionWrapper';
import { ReturnBtn } from '@/components/Buttons/ReturnBtn';
import styles from './HalfScreenPopup.module.css';

type TAddPopupProps = {
  isVisible: boolean;
  children: ReactNode;
  handleOpen: VoidFunction;
  height?: string;
};

export const HalfScreenPopup = ({ isVisible, children, handleOpen, height = '550px' }: TAddPopupProps) => {
  return createPortal(
    <DownToUpComponent isVisible={isVisible}>
      <div className={styles.popup} style={{ height }}>
        <SectionWrapper>
          <div className={styles.popupContainer}>
            <div className={styles.header}>
              <ReturnBtn action={handleOpen} />
            </div>
            {children}
          </div>
        </SectionWrapper>
      </div>
    </DownToUpComponent>,
    document.body
  )
};