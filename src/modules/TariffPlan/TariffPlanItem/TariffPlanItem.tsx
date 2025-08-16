/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { TextField } from '@/components/TextField';
import { IoIosCheckmarkCircle } from "react-icons/io";
import { TariffesTitles, TTarifes } from '@/lib/types/tariffes';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import classNames from 'classnames';
import useFetch from '@/utils/hooks.ts/useFetch';
import { Spinner } from '@/components/Spinner.tsx';
import { PRELOADER_BTN_SIZE } from '@/lib/consts/consts';
import { useEffect, useState } from 'react';
import { setUserSession } from '@/lib/store/features/sessionSlice';
import moment from 'moment';
import { setTheme, ThemeMode } from '@/lib/store/features/themeSlice';
import { checkIsAccountExpired } from '@/utils/checkIsAccountExpired';
import { PopupNotification } from '@/components/Popups/PopupNotification';
import { setNoInternetMsg } from '@/lib/store/features/noInternetSlice';
import { Pathes } from '@/lib/types/pathes';
import { useRouter } from 'next/navigation';
import { checkIsDayToTariffExpiration } from '@/utils/checkIsDayTillTariffExpiration';
import styles from './TariffPlanItem.module.css';

type TProps = {
  tariff: TTarifes;
};

export const TariffPlanItem = ({ tariff }: TProps) => {
  const { userSession } = useSelector((state: RootState) => state.userSession);
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);
  const { theme } = useSelector((state: RootState) => state.theme);

  const dispatch = useDispatch();
  const router = useRouter();

  const { fetch: updateTariff, data: updatedTariffData, isLoading } = useFetch<{ message: string }>();

  const [currentTariffIsActiveMsg, setCurrentTariffIsActiveMsg] = useState(false);
  const [msgTariffIsPlanned, setMsgTariffIsPlanned] = useState(false);
  const [successPlannedTariff, setSuccessPlannedTariff] = useState(false);

  const currentTariffIsExpired = checkIsAccountExpired(userSession?.expired as string); //if tariff expired

  const handleClick = () => {
    if (!userSession?.id || !userSession?.tariff) {
      return;
    };

    if (userSession?.nextTariff && userSession?.isNextTariffPayed) {
      setMsgTariffIsPlanned(true);
      return;
    };

    if (!isUserOnline) {
      dispatch(setNoInternetMsg(true));
      return;
    };

    if (!currentTariffIsExpired && !checkIsDayToTariffExpiration(userSession?.expired as string)) {
      setCurrentTariffIsActiveMsg(true);
      return;
    };

    pay();
    // handleUpdateTariff();
  };

  const handleUpdateTariff = () => {
    if (currentTariffIsExpired) { //подключаем тариф
      const dto = {
        userId: userSession?.id,
        tariff: tariff.title,
        expired: moment().add(30, 'days').format('DD.MM.YYYY'),
      };

      updateTariff('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...dto })
      })
    } else { //добавляем в запланированные
      const dto = {
        userId: userSession?.id,
        nextTariff: tariff?.title,
        isNextTariffPayed: true,
      };

      updateTariff('/api/set-next-tariff', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...dto })
      })
    };
  };

  useEffect(() => {
    if (updatedTariffData?.message !== 'success' || !userSession?.userName) return;

    if (currentTariffIsExpired) {
      const dto = {
        ...userSession,
        tariff: tariff.title,
        expired: moment().add(30, 'days').format('DD.MM.YYYY'),
      };
      dispatch(setUserSession(dto));
      if (tariff.title === TariffesTitles.BASE_TARIFF) {
        dispatch(setTheme(ThemeMode.LIGHT));
      };
      router.replace(Pathes.MAIN);
    } else {
      const dto = {
        ...userSession,
        nextTariff: tariff.title,
        isNextTariffPayed: true,
      };
      dispatch(setUserSession(dto));
      setSuccessPlannedTariff(true);
    };
  }, [updatedTariffData]);

  const currentTariffIsActiveMsgDescr = `Подключить или сменить тариф возможно ${userSession?.expired}`;

  const showCurrentTariffIsActiveMsg = (
    <PopupNotification
      title="Текущий тариф активен"
      subTitle={currentTariffIsActiveMsgDescr}
      btnTitle="Ок"
      action={() => {
        setCurrentTariffIsActiveMsg(false);
      }}
      isVisible={currentTariffIsActiveMsg}
    />
  );

  const showSuccessPlannedTariffDescr = `Тариф ${tariff?.title} заработает после ${userSession?.expired}`;

  const showSuccessPlannedTariffMsg = (
    <PopupNotification
      title="Тариф запланирован"
      subTitle={showSuccessPlannedTariffDescr}
      btnTitle="Ок"
      action={() => {
        setSuccessPlannedTariff(false);
      }}
      isVisible={successPlannedTariff}
    />
  );

  const showTariffIsPlannedMsgDescr = `Тариф ${userSession?.nextTariff} будет действовать после ${userSession?.expired}`;

  const showTariffIsPlannedMsg = (
    <PopupNotification
      title="Тариф уже запланирован"
      subTitle={showTariffIsPlannedMsgDescr}
      btnTitle="Ок"
      action={() => {
        setMsgTariffIsPlanned(false);
      }}
      isVisible={msgTariffIsPlanned}
    />
  );

  const btnContent = (
    (isLoading && <Spinner size={PRELOADER_BTN_SIZE} />) ||
    ((userSession?.tariff === tariff.title && !currentTariffIsExpired) ? 'Текущий тариф' : 'Выбрать')
  );

  //==================================================================================== PAY

  //=================

  const pay = () => {
    const PUBLIC_ID = process.env.NEXT_PUBLIC_PAY_PUBLIC_ID as string;
    const receiptLabel = `Тариф ${tariff?.title || ''}`;
    const receipt = {
      items: [ //товарные позиции
        {
          label: receiptLabel,
          price: tariff?.price,
          quantity: 1.00,
          amount: tariff?.price,
          vat: 0, //ставка НДС
        }
      ],
      amounts: {
        electronic: tariff?.price, // Сумма оплаты электронными деньгами
      },
      isBso: false, //чек является бланком строгой отчетности
      // email: userSession?.email, //e-mail покупателя, если нужно отправить письмо с чеком // проверить, может и не надо, т.к. чек уходит на почту, которую ввел покупатель при оплате
      // phone: '', //телефон покупателя в любом формате, если нужно отправить сообщение со ссылкой на чек
    };

    const widget = new cp.CloudPayments();
    widget.pay('charge', // или 'auth' для двустадийной оплаты
      {
        publicId: PUBLIC_ID,
        description: `Оплата тарифа ${tariff?.title || ''}`,
        // amount: 15,
        amount: tariff?.price,
        currency: 'RUB', //валюта
        accountId: userSession?.id, //идентификатор плательщика (необязательно)
        skin: theme === 'dark' ? 'modern' : 'classic',
        requireConfirmation: false,
        autoClose: 3,
        paymentSchema: 'Single',
        emailBehavior: 'Required',
        receipt,
      },
      {
        onSuccess: function () { // success
          handleUpdateTariff();
        },
        onFail: function (reason: any, options: any) { // fail
          console.log('fail', reason)
          console.log('options', options)
        },
        // onComplete: function (paymentResult, options) { //Вызывается как только виджет получает от api.cloudpayments ответ с результатом транзакции.
        //   //например вызов вашей аналитики Facebook Pixel
        // }
      }
    )
  };

  //==================================================================================== PAY

  return (
    <>
      {showCurrentTariffIsActiveMsg}
      {showTariffIsPlannedMsg}
      {showSuccessPlannedTariffMsg}
      <div className={styles.tariffWrapper}>
        <div className={classNames(
          styles.header,
          tariff.title === TariffesTitles.BASE_TARIFF ?
            styles.headerBaseTariff :
            styles.headerProTariff
        )}>
          <TextField
            variant="span"
            color="contrastWhite"
            style={{
              textAlign: 'center',
              marginBottom: '20px',
              fontSize: '1.9rem',
              color: '#fff'
            }}
          >
            {tariff.title}
          </TextField>
          <div className={styles.price}>
            <TextField
              variant="span"
              color="contrastWhite"
              style={{
                fontSize: '3.2rem',
                color: '#fff'
              }}
            >
              {tariff.price}
            </TextField>
            <TextField
              variant="span"
              color="contrastWhite"
              style={{ color: '#fff' }}
            >
              руб/мес
            </TextField>
          </div>
        </div>
        <ul className={styles.listBody}>
          {
            tariff.items.map((elem) => (
              <li className={styles.item} key={elem}>
                <IoIosCheckmarkCircle
                  className={elem.includes('без') ?
                    styles.iconError
                    : styles.iconSuccess}
                />
                <TextField variant="p" color="main">
                  {elem}
                </TextField>
              </li>
            ))
          }
        </ul>
        {
          userSession?.id && (
            <button
              className={classNames(
                styles.button,
                tariff?.title === TariffesTitles.BASE_TARIFF ?
                  styles.buttonBgBaseTariff :
                  styles.buttonBgProTariff
              )}
              onClick={handleClick}
              disabled={isLoading}
            >
              {btnContent}
            </button>
          )
        }
      </div>
    </>
  )
};