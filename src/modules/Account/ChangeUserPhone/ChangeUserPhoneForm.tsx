'use client';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { ActionBtn } from '@/components/Buttons/ActionBtn';
import { TextField } from '@/components/TextField';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import useFetch from '@/utils/hooks.ts/useFetch';
import { Spinner } from '@/components/Spinner.tsx';
import { PRELOADER_BTN_SIZE } from '@/lib/consts/consts';
import { ControlledTextPhone } from '@/components/ControlledInputs/ControlledTextPhone';
import { useState } from 'react';
import { PopupNotification } from '@/components/Popups/PopupNotification';

const schema = yup.object().shape({
  phone: yup.string()
    .matches(/^\+?\d+$/, 'введите только цифры')
    .required('введите телефон'),
});

const resolver = yupResolver(schema);

type TProps = {
  setCodeIsSent: (val: boolean) => void;
};

export const ChangeUserPhoneForm = ({ setCodeIsSent }: TProps) => {
  const userPhone = useSelector((state: RootState) => state.userSession.userSession?.phone);
  const userId = useSelector((state: RootState) => state.userSession.userSession?.id);

  const methods = useForm<{ phone: string }>({
    resolver,
    mode: 'onChange',
    defaultValues: {
      phone: '',
    },
  });

  const [showNumbersEqualsMsg, setShowNumbersEqualsMsg] = useState(false);

  const { fetch: requestCode, isLoading } = useFetch<{ message: string }>();

  const onSubmit = async (data: { phone: string }) => {
    const { phone } = data;
    if (!phone.trim()) return;

    const preparedNewPhone = 7 + phone.split('').splice(2).join('').trim();

    if (preparedNewPhone === userPhone) {
      setShowNumbersEqualsMsg(true);
      return;
    };

    const dto = {
      newPhone: preparedNewPhone,
      userId,
    };

    requestCode('/api/send-code-change-phone', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    })
      .then(() => setCodeIsSent(true))
  };

  const BTN_TITLE = 'Обновить телефон';

  const btnContent = isLoading && (
    <Spinner size={PRELOADER_BTN_SIZE} />
  ) || BTN_TITLE;

  const showMsg = (
    <PopupNotification
      title="Проверьте номер"
      subTitle="Новый номер должен отличаться от текущего"
      btnTitle="Ок"
      action={() => {
        setShowNumbersEqualsMsg(false);
      }}
      isVisible={showNumbersEqualsMsg}
    />
  );

  return (
    <>
      {showMsg}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <TextField
            variant="h1"
            color="main"
            style={{
              textAlign: 'center',
              marginBottom: '10px'
            }}
          >
            Текущий телефон:
          </TextField>
          <TextField
            variant="h2"
            color="caption"
            style={{
              textAlign: 'center',
              marginBottom: '25px'
            }}
          >
            +{userPhone}
          </TextField>
          <ul>
            <li>
              <ControlledTextPhone
                placeholder="Введите желаемый номер"
                name="phone"
                length={12}
              />
            </li>
          </ul>
          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <ActionBtn
              variant="text"
              type="submit"
              disabled={isLoading}
            >
              {btnContent}
            </ActionBtn>
          </div>
        </form>
      </FormProvider>
    </>
  )
};