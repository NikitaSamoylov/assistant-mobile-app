/* eslint-disable react/no-children-prop */
'use client';

import { FooterActionBtn } from "@/components/FooterActionBtn";
import { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { PopupNotification } from "@/components/Popups/PopupNotification";
import { PopupForm } from "./PopupForm";
import styles from './AddItem.module.css';

export const AddItemBtn = () => {
  const [isModalFormOpened, setIsModalFormOpened] = useState(false);
  const [showSuccessNotice, setShowSuccessNotice] = useState(false);
  const [productIsAdded, setProductIsAdded] = useState(false); // нужен чтобы в попап показать добавить или добавить еще
  const [showLimitPopup, setShowLimitPopup] = useState(false);

  const handleOpen = () => {
    setIsModalFormOpened(isModalFormOpened => !isModalFormOpened);
  };

  useEffect(() => {
    if (showSuccessNotice) return setIsModalFormOpened(false);
  }, [showSuccessNotice]);

  const SuccessPopup = (
    <PopupNotification
      title="Продукт добавлен"
      subTitle=""
      btnTitle="Ok"
      action={() => {
        setProductIsAdded(true);
        setIsModalFormOpened(true)
        setShowSuccessNotice(false);
      }}
      isVisible={showSuccessNotice}
    />
  );

  const LimitPopup = (
    <PopupNotification
      title="Превышен лимит продуктов"
      subTitle="Пожалуйста, удалите часть продуктов"
      btnTitle="Ok"
      action={() => {
        setShowLimitPopup(false);
        setIsModalFormOpened(false);
      }}
      isVisible={showLimitPopup}
    />
  )

  return (
    <>
      {SuccessPopup}
      {LimitPopup}
      <FooterActionBtn
        isActive={false}
        title="Добавить"
        children={
          <IoIosAddCircleOutline
            size="28px"
            className={styles.icon}
          />
        }
        action={handleOpen}
      />
      <PopupForm
        isVisible={isModalFormOpened}
        handleOpen={() => handleOpen()}
        setShowSuccessNotice={setShowSuccessNotice}
        productIsAdded={productIsAdded}
        setProductIsAdded={setProductIsAdded}
        setShowLimitPopup={setShowLimitPopup}
      />
    </>
  )
};