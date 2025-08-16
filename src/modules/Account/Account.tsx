'use client';

import { SectionWrapper } from "@/components/SectionWrapper"
import { TextField } from "@/components/TextField";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { ExitFromAccountBtn } from "./ExitFromAccountBtn";
import { ChangeUserEmail } from "./ChangeUserEmail";
import { ChangeUserName } from "./ChangeUserName";
import { FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { OfferNewFeature } from "./OfferNewFeature";
import { BsQuestionCircleFill } from "react-icons/bs";
import { LinkSupport } from "./LinkSupport/LinkSupport";
import { GiStarsStack } from "react-icons/gi";
import { RateApp } from "./RateApp";
import { LinkToPolicy } from "./LinkToPolicy";
import { RemoveAccount } from "./RemoveAccount";
import { RiShieldCheckFill } from "react-icons/ri";
import { TbVersionsFilled } from "react-icons/tb";
import { IoMdNotifications } from "react-icons/io";
import { MdDataUsage } from "react-icons/md";
import { Push } from "./Push";
import { ReturnBtn } from "@/components/Buttons/ReturnBtn";
import { useRouter } from "next/navigation";
import { Pathes } from "@/lib/types/pathes";
import { LinkToTerms } from "./LinkToTerms";
import { TimeSelect } from "./TimeSelect";
import { FcClock } from "react-icons/fc";
import { ChangeUserPhone } from "./ChangeUserPhone";
import classNames from "classnames";
import styles from './Account.module.css';

export const Account = () => {
  const { userSession } = useSelector((state: RootState) => state.userSession);

  const router = useRouter();

  const handleRoute = () => {
    router.push(Pathes.MENU_LIST);
  };

  //================== check cron manually

  // const handleFetch = () => {
  //   fetch('/api/products-cron', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({})
  //   })
  //     .then(data => data.json())
  //     .then(resp => console.log(resp))
  // }

  //=================

  return (
    <SectionWrapper>
      {/* <div style={{ margin: '25px 0' }}>
        <button onClick={handleFetch}>check cron</button>
      </div> */}
      <div className={styles.returnBtn}>
        <ReturnBtn action={handleRoute} />
      </div>
      <div className={styles.container}>
        <div className={styles.title}>
          <TextField variant="h1" color="main">
            Мой аккаунт
          </TextField>
        </div>
        <div className={styles.subTitle}>
          <TextField variant="p" color="caption">
            Об аккаунте
          </TextField>
        </div>
        <ul className={styles.list}>
          <li className={classNames(styles.item, styles.name)}>
            <div className={styles.itemContent}>
              <FaUser className={classNames(styles.icon, styles.iconUserName)} />
              <TextField
                variant="p"
                color="main"
                style={{
                  wordBreak: 'break-all',
                }}
              >
                {userSession?.userName}
              </TextField>
            </div>
            <ChangeUserName />
          </li>
          <li className={classNames(styles.item, styles.email)}>
            <div className={styles.itemContent}>
              <MdEmail className={classNames(styles.icon, styles.iconUserEmail)} />
              <TextField
                variant="p"
                color="main"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {userSession?.email || `+${userSession?.phone}`}
              </TextField>
            </div>
            {
              userSession?.email && (
                <ChangeUserEmail />
              )
            }
            {
              userSession?.phone && (
                <ChangeUserPhone />
              )
            }
          </li>
        </ul>
        {/* <div className={styles.subTitle}>
          <TextField variant="p" color="caption">
            Тариф
          </TextField>
        </div> */}
        {/* Обратная связь  */}
        <div className={styles.subTitle}>
          <TextField variant="p" color="caption">
            Обратная связь
          </TextField>
        </div>
        <ul className={styles.list}>
          <li className={classNames(styles.item, styles.name)}>
            <div className={styles.itemContent}>
              <HiOutlineWrenchScrewdriver className={classNames(styles.icon, styles.iconUserName)} />
              <TextField
                variant="p"
                color="main"
                style={{
                  wordBreak: 'break-all',
                }}
              >
                Предложить функцию
              </TextField>
            </div>
            <OfferNewFeature />
          </li>
          <li className={classNames(styles.item, styles.name)}>
            <div className={styles.itemContent}>
              <BsQuestionCircleFill className={classNames(styles.icon, styles.iconSupport)} />
              <TextField
                variant="p"
                color="main"
                style={{
                  wordBreak: 'break-all',
                }}
              >
                Написать в поддержку
              </TextField>
            </div>
            <LinkSupport />
          </li>
          <li className={classNames(styles.item, styles.name)}>
            <div className={styles.itemContent}>
              <GiStarsStack className={classNames(styles.icon, styles.iconStar)} />
              <TextField
                variant="p"
                color="main"
                style={{
                  wordBreak: 'break-all',
                }}
              >
                Оценить приложение
              </TextField>
            </div>
            <RateApp />
          </li>
        </ul>
        <div className={styles.subTitle}>
          <TextField variant="p" color="caption">
            Правовая информация
          </TextField>
        </div>
        <ul className={styles.list}>
          <li className={classNames(styles.item, styles.name)}>
            <div className={styles.itemContent}>
              <RiShieldCheckFill className={classNames(styles.icon, styles.iconPrivacy)} />
              <TextField
                variant="p"
                color="main"
                style={{
                  wordBreak: 'break-all',
                }}
              >
                Конфиденциальность
              </TextField>
            </div>
            <LinkToPolicy />
          </li>
          <li className={classNames(styles.item, styles.name)}>
            <div className={styles.itemContent}>
              <MdDataUsage className={classNames(styles.icon, styles.iconPrivacy)} />
              <TextField
                variant="p"
                color="main"
                style={{
                  wordBreak: 'break-all',
                }}
              >
                Условия использования
              </TextField>
            </div>
            <LinkToTerms />
          </li>
          <li className={classNames(styles.item, styles.name)}>
            <div className={styles.itemContent}>
              <TbVersionsFilled className={classNames(styles.icon, styles.iconVersion)} />
              <TextField
                variant="p"
                color="main"
                style={{
                  wordBreak: 'break-all',
                }}
              >
                Версия приложения
              </TextField>
            </div>
            <TextField color="main" variant="p" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              2.11.0
            </TextField>
          </li>
        </ul>
        <div className={styles.subTitle}>
          <TextField variant="p" color="caption">
            Уведомления
          </TextField>
        </div>
        <ul className={styles.list}>
          <li className={classNames(styles.item, styles.name)}>
            <div className={styles.itemContent}>
              <IoMdNotifications className={classNames(styles.icon, styles.iconPush)} />
              <TextField
                variant="p"
                color="main"
                style={{
                  wordBreak: 'break-all',
                }}
              >
                Пуш-уведомления
              </TextField>
            </div>
            <Push />
          </li>
          <li className={classNames(styles.item, styles.name)}>
            <div className={styles.itemContent}>
              <FcClock className={classNames(styles.icon, styles.iconPush)} />
              <TextField
                variant="p"
                color="main"
                style={{
                  wordBreak: 'break-all',
                }}
              >
                Время для уведомлений
              </TextField>
            </div>
            <TimeSelect />
          </li>
        </ul>
        <ul className={styles.btnsContainer} >
          <li className={classNames(styles.exit)}>
            <div className={styles.itemContent}>
              <TextField
                variant="p"
                color="main"
                style={{
                  wordBreak: 'break-all',
                }}
              >
                Выйти из аккаунта
              </TextField>
            </div>
            <ExitFromAccountBtn />
          </li>
          <li className={classNames(styles.remove)}>
            <div className={styles.itemContent}>
              <TextField
                variant="p"
                color="error"
                style={{
                  wordBreak: 'break-all',
                }}
              >
                Удалить аккаунт
              </TextField>
            </div>
            <RemoveAccount />
          </li>
        </ul>
      </div>
    </SectionWrapper >
  )
};