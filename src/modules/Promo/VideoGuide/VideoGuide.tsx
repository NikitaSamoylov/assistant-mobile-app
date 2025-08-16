'use client';

import { ActionBtn } from '@/components/Buttons/ActionBtn';
import { useState } from 'react';
import { FadeComponent } from '@/components/AnimatedComponents/FadeComponent';
import { IoMdCloseCircle } from "react-icons/io";
import styles from './VideoGuide.module.css';

export const VideoGuide = () => {
  const [isPopup, setIsPopup] = useState(false);

  const handlePopup = () => {
    setIsPopup(isPopup => !isPopup);
  };

  return (
    <>
      <FadeComponent isVisible={isPopup}>
        <div className={styles.popupWrapper}>
          <ActionBtn variant="icon" action={handlePopup} style={{ position: 'absolute', zIndex: 2, top: '15px', right: '15px' }}>
            <IoMdCloseCircle size={'3rem'} color="grey" />
          </ActionBtn>
          <video width="280" height="auto" controls className={styles.video}>
            <source src="/promo/video-guide.mp4" type="video/mp4" />
            Ваш браузер не поддерживает тег video.
          </video>
        </div>
      </FadeComponent>
      <ActionBtn variant="text" action={handlePopup}>
        Смотреть видеообзор
      </ActionBtn>
    </>
  )
};