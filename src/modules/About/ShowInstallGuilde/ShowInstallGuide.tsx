'use client';

import NextImage from 'next/image';
import { HalfScreenPopup } from "@/components/Popups/HalfScreenPopup";
import { TextField } from "@/components/TextField";
import styles from './ShowInstallGuide.module.css';

import stepOneImg from './step1.png';
import stepTwoImg from './step2.png';

type TProps = {
  isOpened: boolean;
  setIsGuideOpened: (val: boolean) => void;
};

export const ShowInstallGuide = ({ isOpened, setIsGuideOpened }: TProps) => {

  return (
    <HalfScreenPopup isVisible={isOpened} handleOpen={() => setIsGuideOpened(false)} height="510px">
      <div className={styles.step}>
        <div style={{ display: 'flex', alignItems: 'flex-start', columnGap: '10px' }}>
          <TextField variant="h2" color="title" style={{ marginBottom: '15px' }}>
            1
          </TextField>
          <TextField variant="p" color="main" style={{ marginBottom: '15px' }}>
            Нажмите на иконку «Поделиться»
          </TextField>
        </div>
        <NextImage
          src={stepOneImg}
          width={260}
          height={97}
          alt="шаг 1"
          className={styles.stepImg}
        />
      </div>
      <div className={styles.step}>
        <div style={{ display: 'flex', alignItems: 'flex-start', columnGap: '10px' }}>
          <TextField variant="h2" color="title" style={{ marginBottom: '15px' }}>
            2
          </TextField>
          <TextField variant="p" color="main" style={{ marginBottom: '15px' }}>
            Прокрутите вниз. Нажмите на кнопку «На экран домой»
          </TextField>
        </div>
        <NextImage
          src={stepTwoImg}
          width={260}
          height={92}
          alt="шаг 1"
          className={styles.stepImg}
        />
      </div>
    </HalfScreenPopup>
  )
};