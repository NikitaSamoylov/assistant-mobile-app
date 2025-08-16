'use client';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { ControlledTextField } from '@/components/ControlledInputs/ControlledTextField';
import { ActionBtn } from '@/components/Buttons/ActionBtn';
import { TextField } from '@/components/TextField';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import useFetch from '@/utils/hooks.ts/useFetch';
import { Spinner } from '@/components/Spinner.tsx';
import { PRELOADER_BTN_SIZE } from '@/lib/consts/consts';
import { useState } from 'react';
import { PopupNotification } from '@/components/Popups/PopupNotification';

const schema = yup.object().shape({
  email: yup.string().email('Email не валиден').required('введите email'),
});

const resolver = yupResolver(schema);

const BTN_TITLE = 'Обновить email';

type TProps = {
  setCodeIsSent: (val: boolean) => void;
};

export const ChangeUserEmailForm = ({ setCodeIsSent }: TProps) => {
  const userEmail = useSelector((state: RootState) => state.userSession.userSession?.email);
  const userId = useSelector((state: RootState) => state.userSession.userSession?.id);

  const methods = useForm<{ email: string }>({
    resolver,
    defaultValues: {
      email: '',
    },
  });

  const [showEmailsEqualsMsg, setShowEmailsEqualsMsg] = useState(false);

  const { fetch: requestCode, isLoading } = useFetch<{ message: string }>();

  const onSubmit = async (data: { email: string }) => {
    const { email } = data;
    if (!email.trim()) return;

    if (email === userEmail) {
      setShowEmailsEqualsMsg(true);
      return;
    };

    const dto = {
      newEmail: email.toLowerCase().trim(),
      userId,
    };

    requestCode('/api/send-code-change-email', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    })
      .then(() => setCodeIsSent(true))
  };

  const btnContent = isLoading && (
    <Spinner size={PRELOADER_BTN_SIZE} />
  ) || BTN_TITLE;

  const showMsg = (
    <PopupNotification
      title="Проверьте номер"
      subTitle="Новый номер должен отличаться от текущего"
      btnTitle="Ок"
      action={() => {
        setShowEmailsEqualsMsg(false);
      }}
      isVisible={showEmailsEqualsMsg}
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
            Текущий email:
          </TextField>
          <TextField
            variant="h2"
            color="caption"
            style={{
              textAlign: 'center',
              marginBottom: '25px'
            }}
          >
            {userEmail}
          </TextField>
          <ul>
            <li>
              <ControlledTextField
                name="email"
                placeholder="Введите желаемый email"
                isCenterText
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