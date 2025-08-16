'use client';

import { ActionBtn } from "@/components/Buttons/ActionBtn";
import { useState } from "react";
import { HalfScreenPopup } from "@/components/Popups/HalfScreenPopup";
import { ChangeUserNameForm } from "./ChangeUserNameForm";
import { PopupNotification } from "@/components/Popups/PopupNotification";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setNoInternetMsg } from "@/lib/store/features/noInternetSlice";
import styles from './ChangeUserName.module.css';

export const ChangeUserName = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const dispatch = useDispatch();

  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);

  const handleOpen = () => {
    if (!isUserOnline) {
      dispatch(setNoInternetMsg(true));
      return;
    };
    setIsPopupOpen(isPopupOpen => !isPopupOpen);
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
      title="Имя обновлено"
      btnTitle="Ок"
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
      <HalfScreenPopup isVisible={isPopupOpen} handleOpen={handleOpen}>
        <ChangeUserNameForm handleSuccessPopup={handleSuccessPopup} />
      </HalfScreenPopup>
    </>
  )
}