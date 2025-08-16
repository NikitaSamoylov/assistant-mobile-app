'use client';

import { ControlledTextField } from '@/components/ControlledInputs/ControlledTextField';
import { Spinner } from '@/components/Spinner.tsx';
import useFetch from '@/utils/hooks.ts/useFetch';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { ActionBtn } from '@/components/Buttons/ActionBtn';
import { ControlledTextArea } from '@/components/ControlledInputs/ControlledTextArea';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { PopupNotification } from '@/components/Popups/PopupNotification';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Support.module.css';

const schema = yup.object().shape({
  userName: yup.string().required('введите имя'),
  email: yup.string().email().required('введите email'),
  message: yup.string().required('введите сообщение').max(500),
});

const resolver = yupResolver(schema);

const BUTTON_TITLE = 'Отправить';

type TUser = {
  userName: string;
  email: string;
  message: string;
};

export const SupportForm = () => {
  const router = useRouter()

  const methods = useForm<TUser>({
    resolver,
    defaultValues: {
      userName: '',
      email: '',
      message: '',
    },
  });

  const [isMsgSent, setIsMsgSent] = useState(false);

  const systemError = useSelector((state: RootState) => state.systemError.systemError);

  const { fetch, isLoading, isError, setIsError } = useFetch<TUser>();

  const onSubmit = (data: TUser) => {
    const dto = {
      userName: data?.userName?.trim(),
      email: data?.email?.trim(),
      message: data?.message?.trim(),
    };

    fetch('/api/send-support-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    })
      .then(() => setIsMsgSent(true))
  };

  const text = isLoading ? <Spinner /> : BUTTON_TITLE;
  const showError = (
    <PopupNotification
      title="Сообщение не отправлено"
      subTitle="Перезайдите в приложение и попробуйте снова"
      btnTitle="Повторить"
      action={() => { setIsError(null) }}
      isVisible={!!isError && !systemError}
    />
  );
  const showSuccesMsg = (
    <PopupNotification
      title="Сообщение отправлено"
      subTitle="Ответ придет на ваш email "
      btnTitle="Вернуться"
      action={() => router.back()}
      isVisible={!systemError && isMsgSent}
    />
  );

  return (
    <>
      {showError}
      {showSuccesMsg}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <ul className={styles.fieldsList}>
            <li className={styles.fieldItem}>
              <ControlledTextField name="userName" placeholder="Имя" />
            </li>
            <li className={styles.fieldItem}>
              <ControlledTextField name="email" placeholder="Email" />
            </li>
            <li className={styles.fieldItem}>
              <ControlledTextArea
                name="message"
                placeholder="Сообщение"
                rows={9}
                maxLength={400}
              />
            </li>
          </ul>
          <div className={styles.formBtn}>
            <ActionBtn
              disabled={isLoading}
              variant="text"
              type="submit"
              style={{
                margin: '0 auto',
              }}
            >
              {text}
            </ActionBtn>
          </div>
        </form>
      </FormProvider>
    </>
  )
};