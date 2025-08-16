'use client';

import { ActionBtn } from "@/components/Buttons/ActionBtn";
import { HalfScreenPopup } from "@/components/Popups/HalfScreenPopup";
import { PopupNotification } from "@/components/Popups/PopupNotification";
import { RootState } from "@/lib/store/store";
import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RateAppForm } from "./RateAppForm";
import { setNoInternetMsg } from "@/lib/store/features/noInternetSlice";
import styles from './RateApp.module.css';

export const RateApp = () => {
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [rate, setRate] = useState<string | null>(null);

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
      title="Спасибо за оценку"
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
        <RateAppForm handleSuccessPopup={handleSuccessPopup} setRate={setRate} rate={rate} />
      </HalfScreenPopup>
    </>
  )
};