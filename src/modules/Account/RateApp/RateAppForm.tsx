/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ActionBtn } from '@/components/Buttons/ActionBtn';
import { ControlledTextArea } from '@/components/ControlledInputs/ControlledTextArea';
import { Spinner } from '@/components/Spinner.tsx';
import { TextField } from '@/components/TextField';
import { PRELOADER_BTN_SIZE, PRELOADER_DEFAULT_SIZE } from '@/lib/consts/consts';
import { RootState } from '@/lib/store/store';
import useFetch from '@/utils/hooks.ts/useFetch';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { SetRateStars } from './SetRateStarts';
import moment from 'moment';
import { TRating } from '@/lib/types/rating';

const checkIsDayLeft = (dateString: string) => {
  const date = moment(Number(dateString));
  const now = moment();
  const diffInHours = now.diff(date, 'hours');

  if (diffInHours >= 24) {
    return true;
  } else {
    return false;
  };
};

const schema = yup.object().shape({
  message: yup.string().nullable(),
});

const resolver = yupResolver(schema);

const BTN_TITLE = 'Отправить';

type TProps = {
  handleSuccessPopup: VoidFunction;
  setRate: (val: string) => void;
  rate: string | null;
};

export const RateAppForm = ({ handleSuccessPopup, setRate, rate }: TProps) => {
  const methods = useForm<any>({
    resolver,
    defaultValues: {
      message: null,
    },
  });

  const userName = useSelector((state: RootState) => state.userSession.userSession?.userName);
  const userEmail = useSelector((state: RootState) => state.userSession.userSession?.email);
  const userPhone = useSelector((state: RootState) => state.userSession.userSession?.phone);
  const userId = useSelector((state: RootState) => state.userSession.userSession?.id);
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);

  const { fetch: fetchOldRate, data: oldRateData, isLoading: oldRateLoading } = useFetch<{ message: TRating }>();
  const { fetch: postRate, isLoading } = useFetch<{ message: string }>();
  const { fetch: sendMessageWithRate, data, isLoading: isMessageRateLoading } = useFetch<{ message: string }>();

  useEffect(() => {
    if (!isUserOnline || !userId) return;
    fetchOldRate(`/api/rate-app?userId=${userId}`);
  }, [isUserOnline, userId]);

  const onSubmit = (data: { message: string | null }) => {
    const { message } = data;
    if (!rate) return;

    const dto = {
      message: message ? `${message}, my rate is: ${rate}` : '', //добавляем оценку в конец message
      email: userEmail || userPhone,
      userName,
      theme: 'Оценка приложения' //тематика для отправки письма через support-message route
    };

    const rateDto = {
      userId,
      rate,
      message: message || '',
      rateDate: moment.now(),
    };

    postRate('/api/rate-app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rateDto)
    })
      .then(() => {
        sendMessageWithRate('/api/send-support-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dto)
        })
      })
  };

  useEffect(() => {
    if (!oldRateData?.message?.rateDate) return;

    const time = oldRateData.message.rateDate;
    const isDayLeft = checkIsDayLeft(time);
    if (isDayLeft) return;

    if (oldRateData?.message?.userId) {
      const { rate, message } = oldRateData.message;
      if (rate) {
        setRate(String(rate));
      };
      if (message) {
        methods.setValue('message', message)
      };
    };
  }, [oldRateData]);

  useEffect(() => {
    if (!data?.message) return;
    handleSuccessPopup();
    methods.reset();
  }, [data]);

  if (oldRateLoading) {
    return (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Spinner size={PRELOADER_DEFAULT_SIZE} />
      </div>
    )
  };

  const title = (oldRateData?.message?.rateDate && !checkIsDayLeft(oldRateData?.message?.rateDate)) ?
    'Ваша прошлая оценка:' :
    'Оценить приложение';

  let btnContent;

  if (isLoading || isMessageRateLoading) {
    btnContent = <Spinner size={PRELOADER_BTN_SIZE} />;
  } else {
    const rateDate = oldRateData?.message?.rateDate;
    const hasNoRateDate = !rateDate;
    const isDayLeft = rateDate && checkIsDayLeft(rateDate);

    if (hasNoRateDate || isDayLeft) {
      btnContent = BTN_TITLE;
    } else {
      btnContent = 'Оценка возможна не чаще раза в день';
    };
  };

  const isDisabled = (
    isLoading ||
    isMessageRateLoading ||
    !!(
      oldRateData?.message?.rateDate &&
      !checkIsDayLeft(oldRateData?.message?.rateDate)
    )
  );

  return (
    <>
      <TextField
        variant="h1"
        color="main"
        style={{
          textAlign: 'center',
          marginBottom: '20px'
        }}
      >
        {title}
      </TextField>
      <FormProvider {...methods}>
        <SetRateStars setRate={setRate} rate={rate} isDisabled={isDisabled} />
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <ul style={{ width: '100%' }}>
            <li>
              <ControlledTextArea
                name="message"
                placeholder="Расскажите о впечатлении от приложения..."
                rows={7}
                maxLength={250}
                disabled={isDisabled}

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
              color={isDisabled ? 'button' : 'default'}
              style={{ maxWidth: '212px' }}
              disabled={isDisabled}
            >
              {btnContent}
            </ActionBtn>
          </div>
        </form>
      </FormProvider>
    </>
  )
};