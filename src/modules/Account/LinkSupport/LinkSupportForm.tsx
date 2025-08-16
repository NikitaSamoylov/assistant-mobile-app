'use client';

import { ActionBtn } from '@/components/Buttons/ActionBtn';
import { ControlledTextArea } from '@/components/ControlledInputs/ControlledTextArea';
import { Spinner } from '@/components/Spinner.tsx';
import { TextField } from '@/components/TextField';
import { PRELOADER_BTN_SIZE } from '@/lib/consts/consts';
import { RootState } from '@/lib/store/store';
import useFetch from '@/utils/hooks.ts/useFetch';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

const schema = yup.object().shape({
  message: yup.string().min(10, 'От 10 символов').required('Что сделать нового?'),
});

const resolver = yupResolver(schema);

const BTN_TITLE = 'Отправить';

type TProps = {
  handleSuccessPopup: VoidFunction;
};

export const LinkSupportForm = ({ handleSuccessPopup }: TProps) => {
  const methods = useForm<{ message: string }>({
    resolver,
    defaultValues: {
      message: '',
    },
  });

  const userName = useSelector((state: RootState) => state.userSession.userSession?.userName);
  const userEmail = useSelector((state: RootState) => state.userSession.userSession?.email);
  const userPhone = useSelector((state: RootState) => state.userSession.userSession?.phone);

  const { fetch: postData, data, isLoading } = useFetch<{ message: string }>();

  const onSubmit = (data: { message: string }) => {
    const { message } = data;
    if (!message) return;

    const dto = {
      message,
      email: userEmail || userPhone,
      userName,
      theme: 'Обращение в поддержку'
    };

    postData('/api/send-support-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    })
  };

  useEffect(() => {
    if (!data?.message) return;
    handleSuccessPopup();
    methods.reset();
  }, [data]);

  const btnContent = isLoading && (
    <Spinner size={PRELOADER_BTN_SIZE} />
  ) || BTN_TITLE;

  return (
    <>
      <TextField
        variant="h1"
        color="main"
        style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}
      >
        Написать в поддержку
      </TextField>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <ul style={{ width: '100%' }}>
            <li>
              <ControlledTextArea
                name="message"
                placeholder={`Сообщение... ${!userEmail && 'В конце укажите ваш email, на который отправить ответ'}`}
                rows={9}
                maxLength={250}
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