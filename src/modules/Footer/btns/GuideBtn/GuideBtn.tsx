'use client';

import { ActionBtn } from "@/components/Buttons/ActionBtn";
import { useState } from "react";
import { HalfScreenPopup } from "@/components/Popups/HalfScreenPopup";
import { TextField } from "@/components/TextField";
import styles from './GuideBtn.module.css';

export const GuideBtn = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpen = () => {
    setIsPopupOpen(isPopupOpen => !isPopupOpen);
  };

  return (
    <>
      <ActionBtn variant="text" color="default" style={{ textAlign: 'left', fontSize: '1.3rem' }} action={handleOpen}>
        Как добавить срок годности овощей?
      </ActionBtn>
      <HalfScreenPopup isVisible={isPopupOpen} handleOpen={handleOpen} height="300px">
        <TextField variant="p" color="main">
          Укажите срок, например, неделю. Спустя неделю проверьте продукт. Используйте его, продлите срок или удалите.
        </TextField>
        <div className={styles.btn}>
          <ActionBtn variant="background" action={handleOpen} color="paper">
            Ок
          </ActionBtn>
        </div>
      </HalfScreenPopup>
    </>
  )
};