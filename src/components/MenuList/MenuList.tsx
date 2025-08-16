'use client';

import { FadeComponent } from "../AnimatedComponents/FadeComponent"
import { TextField } from "../TextField"
import { FcKey } from "react-icons/fc";
import { FaCookie } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Pathes } from "@/lib/types/pathes";
import { MenuItem } from "../MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useState } from "react";
import { PopupNotification } from "../Popups/PopupNotification";
import moment from "moment";
import { setAiRequestCount } from "@/lib/store/features/aiRequestsCountSlice";
import { TariffesTitles } from "@/lib/types/tariffes";
import { setNoInternetMsg } from "@/lib/store/features/noInternetSlice";
import { BiSolidGift } from "react-icons/bi";
import styles from './MenuList.module.css';

export const MenuList = () => {
  const router = useRouter();
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);
  const requestsCount = useSelector((state: RootState) => state.aiRequestCountSlice.aiRequestCount);
  const userTariff = useSelector((state: RootState) => state.userSession.userSession?.tariff);

  const dispatch = useDispatch();

  const [showLimitMessage, setShowLimitMessage] = useState(false);
  const [isTariffLimitMsg, setIsTariffLimitMsg] = useState(false);

  const handleAccountRoute = () => {
    router.replace(Pathes.ACCOUNT);
  };

  const handleAiChatRoute = () => {
    if (!isUserOnline) {
      dispatch(setNoInternetMsg(true));
      return;
    };
    if (userTariff === TariffesTitles.BASE_TARIFF) {
      setIsTariffLimitMsg(true);
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
    router.replace(Pathes.AI_CHAT);
  };

  const handleGift = () => {
    if (!isUserOnline) {
      dispatch(setNoInternetMsg(true));
      return;
    };
    router.push(Pathes.GIFTS);
  };

  const showLimitRequestsMsg = (
    <PopupNotification
      title="Достигнут лимит"
      subTitle="Генерировать рецепты по имеющимся продуктам возможно до 3 раз в сутки"
      btnTitle="Ок"
      action={() => {
        setShowLimitMessage(false);
      }}
      isVisible={showLimitMessage}
    />
  );

  const showTariffLimigMessage = (
    <PopupNotification
      title="Необходим тариф"
      subTitle="Для подбора рецептов по продуктам в наличии необходим тариф ПРО"
      btnTitle="Ок"
      action={() => {
        setIsTariffLimitMsg(false);
      }}
      isVisible={isTariffLimitMsg}
    />
  );

  return (
    <FadeComponent isVisible={true} delay={0.4}>
      {showLimitRequestsMsg}
      {showTariffLimigMessage}
      <div className={styles.title}>
        <TextField variant="p" color="main">
          Ещё
        </TextField>
      </div>
      <ul>
        <MenuItem
          action={handleAccountRoute}
          icon={<FcKey className={styles.accountIcon} />}
          title="Мой аккаунт"
        />
        <MenuItem
          action={handleAiChatRoute}
          icon={<FaCookie className={styles.cookIcon} />}
          title="Рецепты"
        />
        <MenuItem
          action={handleGift}
          icon={<BiSolidGift className={styles.gift} />}
          title="Бонусы"
        />
      </ul>
    </FadeComponent>
  )
};