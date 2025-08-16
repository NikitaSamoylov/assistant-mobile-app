'use client';

import { TextField } from "@/components/TextField";
import { InputCode } from "./InputCode";
import { ReturnBtn } from "@/components/Buttons/ReturnBtn";
import { useState } from "react";
import { PopupNotification } from "@/components/Popups/PopupNotification";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { CountDownTimer } from "@/components/CountDownTimer";
import { setVerifyBtnActive } from "@/lib/store/features/verifyBtnSlice";
import { removeAuthData } from "@/lib/store/features/authData";
import styles from './VerifyCode.module.css';

export const VerifyCode = () => {
  const [customAction, setCustomAction] = useState(false);
  const { endTime } = useSelector((state: RootState) => state.countdown);
  const { authData } = useSelector((state: RootState) => state.authData);

  const dispatch = useDispatch();
  const router = useRouter();

  const subTitle = !endTime ? 'Понадобится новый код' : 'Новый код только через: '

  const showNotification = (
    <PopupNotification
      title="Вы уверены?"
      subTitle={subTitle}
      btnTitle="Остаться"
      btnSecondTitle="Вернуться"
      action={() => setCustomAction(false)}
      secondBtnAction={() => {
        dispatch(removeAuthData());
        router.back();
      }}
      isVisible={customAction}
      component={
        endTime && (
          <CountDownTimer
            initialMinutes={endTime}
            onTimerEnd={() => dispatch(setVerifyBtnActive())}
            launchTimer={!!endTime}
          />
        ) || (
          null
        )
      }
    />
  );

  return (
    <main>
      {showNotification}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        rowGap: '5px',
        marginBottom: '15px',
      }}>
        <TextField
          variant="h1"
          color="subTitle"
        >
          {
            authData?.email && 'Введите код из письма.' ||
            authData?.phone && `Звоним на +${authData.phone} ...`
          }
        </TextField>
        <TextField
          variant="h1"
          color="subTitle"
          style={{
            textAlign: 'center',
          }}
        >
          {
            authData?.email && 'Отправлен на email' ||
            authData?.phone && 'Введите последние 4 цифры входящего номера'
          }
        </TextField>
      </div>
      <TextField
        color="caption"
        variant="span"
        style={{
          textAlign: 'center',
          marginBottom: '25px',
        }}
      >
        {
          authData?.email && 'Не приходит код? Проверьте папку Спам'
        }
      </TextField>
      <InputCode />
      <div className={styles.returnBtn}>
        <ReturnBtn action={() => setCustomAction(true)} />
      </div>
    </main>
  )
};