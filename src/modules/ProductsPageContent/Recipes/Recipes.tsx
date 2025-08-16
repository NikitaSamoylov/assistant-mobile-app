'use client';

import NextImage from 'next/image';
import { ActionBtn } from "@/components/Buttons/ActionBtn";
import { HalfScreenPopup } from '@/components/Popups/HalfScreenPopup';
import { TextField } from '@/components/TextField';
import { Pathes } from '@/lib/types/pathes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LuCookingPot } from "react-icons/lu";
import personImg from './person.png';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { setNoInternetMsg } from '@/lib/store/features/noInternetSlice';
import moment from 'moment';
import { setAiRequestCount } from '@/lib/store/features/aiRequestsCountSlice';
import { PopupNotification } from '@/components/Popups/PopupNotification';
import styles from './Recipes.module.css';

export const Recipes = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const requestsCount = useSelector((state: RootState) => state.aiRequestCountSlice.aiRequestCount);
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showLimitMessage, setShowLimitMessage] = useState(false);

  const handleOpen = () => {
    setIsPopupOpen(isPopupOpen => !isPopupOpen);
  };

  const handleRoute = () => {
    if (!isUserOnline) {
      dispatch(setNoInternetMsg(true));
      return;
    };

    const date1 = moment(requestsCount?.date, 'DD.MM.YYYY');
    const date2 = moment();

    if (requestsCount?.count > 3 && !date1.isBefore(date2, 'day')) {
      setShowLimitMessage(true);
      return;
    };
    if (date1.isBefore(date2, 'day')) {
      dispatch(setAiRequestCount({ count: 0, date: '' }));
    };

    router.push(Pathes.AI_CHAT);
  };

  const showLimitRequestsMsg = (
    <PopupNotification
      title="Достигнут лимит"
      subTitle="Подбирать рецепты по имеющимся продуктам возможно до 3 раз в сутки"
      btnTitle="Ок"
      action={() => {
        setShowLimitMessage(false);
      }}
      isVisible={showLimitMessage}
    />
  );

  return (
    <>
      {showLimitRequestsMsg}
      <ActionBtn variant="icon" action={handleOpen}>
        <LuCookingPot className={classNames(styles.recipeIcon, styles.animate)} />
      </ActionBtn>
      <HalfScreenPopup isVisible={isPopupOpen} handleOpen={handleOpen} height="600px">
        <TextField variant="p" color="main" style={{ textAlign: 'center', lineHeight: '2.3rem', fontSize: '2rem', marginBottom: '10px' }}>
          Сроки годности некоторых продуктов истекают.
        </TextField>
        <TextField variant="h2" color="title" style={{ textAlign: 'center', lineHeight: '2.8rem', fontSize: '2.3rem' }}>
          Подобрать по этим продуктам рецепты?
        </TextField>
        <NextImage
          src={personImg}
          width={personImg.width}
          height={personImg.height}
          alt="Альфред"
          style={{ display: 'block', margin: '15px auto 5px auto' }}
        />
        <div className={styles.btnWrapper}>
          <ActionBtn variant="background" color="paper" action={handleRoute}>
            Да, подбери
          </ActionBtn>
        </div>
      </HalfScreenPopup>
    </>
  )
};