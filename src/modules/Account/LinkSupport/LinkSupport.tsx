'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { PopupNotification } from '@/components/Popups/PopupNotification';
import { ActionBtn } from '@/components/Buttons/ActionBtn';
import { IoIosArrowForward } from 'react-icons/io';
import { HalfScreenPopup } from '@/components/Popups/HalfScreenPopup';
import { LinkSupportForm } from './LinkSupportForm';
import { setNoInternetMsg } from '@/lib/store/features/noInternetSlice';
import styles from './LinkSupport.module.css';

export const LinkSupport = () => {
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const dispatch = useDispatch();

  const handleOpen = () => {
    if (!isUserOnline) {
      dispatch(setNoInternetMsg(true));
      return;
    };
    setIsPopupVisible(isPopupVisible => !isPopupVisible);
  };

  const handleSuccessPopup = () => {
    setShowSuccessPopup(showSuccessPopup => !showSuccessPopup);
    handleOpen();
  };

  const onPopupClose = () => {
    setShowSuccessPopup(false);
  };

  const showSuccessNotice = (
    <PopupNotification
      title="Готово"
      subTitle="Обращение отправлено, ответ придёт на ваш email"
      btnTitle="Вернуться"
      action={onPopupClose}
      isVisible={showSuccessPopup}
    />
  );

  return (
    <>
      {showSuccessNotice}
      <ActionBtn
        variant="icon"
        style={{ transform: 'translateY(2px)' }}
        action={handleOpen}
        color="button"
      >
        <IoIosArrowForward className={styles.icon} />
      </ActionBtn>
      <HalfScreenPopup isVisible={isPopupVisible} handleOpen={handleOpen}>
        <LinkSupportForm handleSuccessPopup={handleSuccessPopup} />
      </HalfScreenPopup>
    </>
  )
};