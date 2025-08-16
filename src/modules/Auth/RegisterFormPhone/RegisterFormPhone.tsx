/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// import { ControlledTextField } from "@/components/ControlledInputs/ControlledTextField";
import { FormProvider, useForm } from "react-hook-form";
import { Spinner } from '@/components/Spinner.tsx';
import { PopupNotification } from '@/components/Popups/PopupNotification';
import useFetch from '@/utils/hooks.ts/useFetch';
import { useRouter } from 'next/navigation';
import { Pathes } from '@/lib/types/pathes';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { TUserAuthPhone } from '@/lib/types/user';
import { CountDownTimer } from '@/components/CountDownTimer';
import { useEffect, useState } from 'react';
import { setVerifyBtnActive, setVerifyBtnDisabled } from '@/lib/store/features/verifyBtnSlice';
import { TextField } from '@/components/TextField';
import NextLink from 'next/link';
import { FadeComponent } from '@/components/AnimatedComponents/FadeComponent';
import { PRELOADER_BTN_SIZE } from '@/lib/consts/consts';
import moment from 'moment';
import 'moment-timezone';
import { ImCheckboxChecked } from "react-icons/im";
import { ImCheckboxUnchecked } from "react-icons/im";
import { setNoInternetMsg } from '@/lib/store/features/noInternetSlice';
import { setAuthData } from '@/lib/store/features/authData';
import { ControlledTextPhone } from '@/components/ControlledInputs/ControlledTextPhone';
import styles from './RegisterFormPhone.module.css';

const schema = yup.object().shape({
  // userName: yup.string().required('введите имя'),
  phone: yup.string()
    .matches(/^\+?\d+$/, 'введите только цифры')
    .required('введите телефон'),
});

const BUTTON_TITLE = 'Получить код';
const NEW_CODE_TIMER = 2;

const resolver = yupResolver(schema);

export const RegisterFormPhone = () => {
  const methods = useForm<{ phone: string }>({
    resolver,
    defaultValues: {
      // userName: '',
      phone: '',
    },
  });
  const router = useRouter();
  const systemError = useSelector((state: RootState) => state.systemError.systemError);
  const verifyBtn = useSelector((state: RootState) => state.verifyBtn.isVerifyBtnDisabled);
  const { isActive } = useSelector((state: RootState) => state.countdown);
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);

  const dispatch = useDispatch();

  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckboxError, setIsCheckboxError] = useState(false);

  const { fetch, isLoading, isError, setIsError } = useFetch<TUserAuthPhone>();

  useEffect(() => {
    if (verifyBtn) return setIsBtnDisabled(true);
    return setIsBtnDisabled(false);
  }, [verifyBtn]);

  useEffect(() => {
    if (isChecked) {
      setIsCheckboxError(false);
    };
  }, [isChecked]);

  const handleChecked = () => {
    setIsChecked(isChecked => !isChecked);
  };

  const onSubmit = (data: TUserAuthPhone) => {
    if (!isUserOnline) {
      dispatch(setNoInternetMsg(true));
      return;
    };

    if (!isChecked) {
      setIsCheckboxError(true);
      return;
    };

    const preparedNewPhone = 7 + data?.phone?.split('').splice(2).join('').trim();

    const dto = {
      // userName: data?.userName?.trim(),
      userName: 'Пользователь',
      phone: preparedNewPhone,
      timezone: moment.tz.guess(),
      expired: moment().add(14, 'days').format('DD.MM.YYYY'),
    };

    fetch('/api/send-code-phone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    })
      .then(() => dispatch(setAuthData(dto)))
      .then(() => dispatch(setVerifyBtnDisabled()))
      .then(() => router.push(Pathes.VERIFY))
  };

  const text = isLoading ? <Spinner size={PRELOADER_BTN_SIZE} color="white" /> : BUTTON_TITLE;
  const showError = (
    <PopupNotification
      title="Не удалось войти"
      subTitle="Проверьте данные или перезайдите в приложение"
      btnTitle="Повторить"
      action={() => { setIsError(null) }}
      isVisible={!!isError && !systemError}
    />
  );

  return (
    <>
      {showError}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit as any)} className={styles.form}>
          <ul className={styles.fieldsList}>
            {/* <li className={styles.fieldItem}>
              <ControlledTextField name="userName" placeholder="Имя" />
            </li> */}
            <li className={styles.fieldItem}>
              <ControlledTextPhone
                name="phone"
                placeholder="Телефон"
                length={12}
              />
            </li>
          </ul>
          <button className={styles.button} type="submit" disabled={isLoading || isBtnDisabled}>
            {text}
          </button>
        </form>
        <div className={styles.countdown}>
          <FadeComponent isVisible={isActive}>
            <TextField variant='span' color='caption'>
              Получить новый код через:
            </TextField>
          </FadeComponent>
          <CountDownTimer
            initialMinutes={NEW_CODE_TIMER}
            onTimerEnd={() => dispatch(setVerifyBtnActive())}
            launchTimer={verifyBtn}
          />
        </div>
        <FadeComponent isVisible={!isActive}>
          <div className={styles.agreement}>
            <button onClick={handleChecked} style={{ marginBottom: '10px' }}>
              {
                isChecked && (
                  <ImCheckboxChecked size={'1.7rem'} className={styles.checkboxChecked} />
                ) || (
                  <div>
                    <ImCheckboxUnchecked
                      size={'1.7rem'}
                      className={styles.checkbox}
                      style={isCheckboxError ? { color: 'tomato' } : {}}
                    />
                    {
                      isCheckboxError && (
                        <TextField color="error" variant="span">
                          Нажмите на чекбокс
                        </TextField>
                      )
                    }
                  </div>
                )
              }
            </button>
            <TextField variant="span" color="caption" style={{ display: 'block', textAlign: 'center' }}>
              Согласен с
              <NextLink href={Pathes.POLICY} className={styles.privacy}>
                Политикой конфиденциальности <br />
              </NextLink>
              и
              <NextLink href={Pathes.TERMS} className={styles.privacy}>
                Условиями пользования
              </NextLink>
            </TextField>
          </div>
        </FadeComponent>
      </FormProvider>
    </>
  );
};