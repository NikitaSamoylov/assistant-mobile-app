'use client';

import { ActionBtn } from "@/components/Buttons/ActionBtn";
import { useState } from "react";
import { PopupNotification } from "@/components/Popups/PopupNotification";
import { HalfScreenPopup } from "@/components/Popups/HalfScreenPopup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { TextField } from "@/components/TextField";
import useFetch from "@/utils/hooks.ts/useFetch";
import { IoIosArrowForward } from "react-icons/io";
import { setNoInternetMsg } from "@/lib/store/features/noInternetSlice";
import { ChangeUserPhoneForm } from "./ChangeUserPhoneForm";
import { InputCode } from "./InputCode";
import styles from './ChangeUserPhone.module.css';

export const ChangeUserPhone = () => {
  const dispatch = useDispatch();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [codeIsSent, setCodeIsSent] = useState(false);

  const userId = useSelector((state: RootState) => state.userSession.userSession?.id);
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);

  const { fetch: cancelChangePhone } = useFetch<{ message: string }>();

  const handleOpen = () => { //если timer и закрываем popup то отменяем замену phone 
    if (!isUserOnline) {
      dispatch(setNoInternetMsg(true));
      return;
    };
    setIsPopupOpen(isPopupOpen => !isPopupOpen);

    if (codeIsSent) {
      setCodeIsSent(false);
      cancelChangePhone('/api/verify-code-change-phone', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      })
    };
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
      title="Телефон обновлен"
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
        <IoIosArrowForward className={styles.icon} size={'2rem'} />
      </ActionBtn>
      <HalfScreenPopup isVisible={isPopupOpen} handleOpen={handleOpen}>
        {
          codeIsSent && (
            <>
              <TextField color="main" variant="h1" style={{ textAlign: 'center', marginBottom: '25px' }}>
                Звоним вам ...
              </TextField>
              <TextField
                variant="h2"
                color="subTitle"
                style={{
                  textAlign: 'center',
                  marginBottom: '25px'
                }}
              >
                Введите последние 4 цифры входящего номера
              </TextField>
              <InputCode handleOpen={handleOpen} setShowSuccessPopup={handleSuccessPopup} />
            </>
          )
        }
        {
          !codeIsSent && (
            <ChangeUserPhoneForm setCodeIsSent={setCodeIsSent} />
          )
        }
      </HalfScreenPopup >
    </>
  )
};