/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { ControlledTextField } from '@/components/ControlledInputs/ControlledTextField';
import { ActionBtn } from '@/components/Buttons/ActionBtn';
import { TextField } from '@/components/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import useFetch from '@/utils/hooks.ts/useFetch';
import { Spinner } from '@/components/Spinner.tsx';
import { PRELOADER_BTN_SIZE } from '@/lib/consts/consts';
import { useEffect } from 'react';
import { setUserSession } from '@/lib/store/features/sessionSlice';

const schema = yup.object().shape({
  userName: yup.string().required('введите имя'),
});

const resolver = yupResolver(schema);

const BTN_TITLE = 'Обновить имя';

type TProps = {
  handleSuccessPopup: VoidFunction;
};

export const ChangeUserNameForm = ({ handleSuccessPopup }: TProps) => {
  const nameOfUser = useSelector((state: RootState) => state.userSession.userSession?.userName);
  const userId = useSelector((state: RootState) => state.userSession.userSession?.id);
  const { userSession } = useSelector((state: RootState) => state.userSession);

  const methods = useForm<{ userName: string }>({
    resolver,
    defaultValues: {
      userName: '',
    },
  });

  const { fetch: postData, data, isLoading } = useFetch<{ message: string }>();

  const dispatch = useDispatch();

  const onSubmit = async (data: { userName: string }) => {
    const { userName } = data;
    if (!userName) return;

    const dto = {
      userName,
      userId,
    };

    postData('/api/credentials-update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    })
  };

  useEffect(() => {
    if (!data) return;

    const updateData = {
      ...userSession,
      userName: data?.message,
    };
    dispatch(setUserSession(updateData as any));
    handleSuccessPopup();
    methods.reset();
  }, [data]);

  const btnContent = isLoading && (
    <Spinner size={PRELOADER_BTN_SIZE} />
  ) || BTN_TITLE;

  return (
    <>
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
            Текущее имя:
          </TextField>
          <TextField
            variant="h2"
            color="caption"
            style={{
              textAlign: 'center',
              marginBottom: '25px'
            }}
          >
            {nameOfUser}
          </TextField>
          <ul style={{ width: '100%' }}>
            <li>
              <ControlledTextField
                name="userName"
                placeholder="Введите желаемое имя"
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