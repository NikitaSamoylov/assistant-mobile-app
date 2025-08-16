'use client';

import { ActionBtn } from "@/components/Buttons/ActionBtn";
import { useState } from "react";
import { PopupNotification } from "@/components/Popups/PopupNotification";
import { HalfScreenPopup } from "@/components/Popups/HalfScreenPopup";
import { ChangeUserEmailForm } from "./ChangeUserEmailForm";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { TextField } from "@/components/TextField";
import { InputCode } from "./InputCode";
import useFetch from "@/utils/hooks.ts/useFetch";
import { IoIosArrowForward } from "react-icons/io";
import { setNoInternetMsg } from "@/lib/store/features/noInternetSlice";
import styles from './ChangeUserEmail.module.css';

export const ChangeUserEmail = () => {
  const dispatch = useDispatch();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [codeIsSent, setCodeIsSent] = useState(false);

  const userId = useSelector((state: RootState) => state.userSession.userSession?.id);
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);

  const { fetch: cancelChangeEmail } = useFetch<{ message: string }>();

  const handleOpen = () => { //если timer и закрываем popup то отменяем замену email 
    if (!isUserOnline) {
      dispatch(setNoInternetMsg(true));
      return;
    };
    setIsPopupOpen(isPopupOpen => !isPopupOpen);

    if (codeIsSent) {
      setCodeIsSent(false);
      cancelChangeEmail('/api/verify-code-change-email', {
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
      title="Email обновлен"
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
        {
          codeIsSent && (
            <>
              <TextField color="main" variant="h1" style={{ textAlign: 'center', marginBottom: '25px' }}>
                Код отправлен <br /> на email
              </TextField>
              <TextField
                variant="h2"
                color="subTitle"
                style={{
                  textAlign: 'center',
                  marginBottom: '25px'
                }}
              >
                Введите 4-значный код <br /> из письма
              </TextField>
              <InputCode handleOpen={handleOpen} setShowSuccessPopup={handleSuccessPopup} />
              <TextField
                color="caption"
                variant="span"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '15px'
                }}
              >
                Нет письма? Проверьте папку Спам
              </TextField>
            </>
          )
        }
        {
          !codeIsSent && (
            <ChangeUserEmailForm setCodeIsSent={setCodeIsSent} />
          )
        }
      </HalfScreenPopup >
    </>
  )
};