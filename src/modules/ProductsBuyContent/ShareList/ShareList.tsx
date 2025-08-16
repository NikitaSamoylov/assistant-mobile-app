'use client';

import { IoShareOutline } from "react-icons/io5";

import { ActionBtn } from "@/components/Buttons/ActionBtn";
import { useState } from "react";
import { PopupNotification } from "@/components/Popups/PopupNotification";
import { TBuyProducts } from "@/lib/types/product";
import { FadeComponent } from "@/components/AnimatedComponents/FadeComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

type TProps = {
  data: TBuyProducts[];
};

type TPopupMessage = {
  title: string;
  descr: string;
};

export const ShareList = ({ data }: TProps) => {
  const [showError, setShowError] = useState<TPopupMessage | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);

  const handleShare = () => {
    if (!isUserOnline) {
      const message = {
        title: 'Ошибка сети',
        descr: 'Для отправки списка на покупку необходим интернет',
      };
      setShowError(message);
    };

    if (navigator.share) {
      navigator.share({
        title: 'Нужно купить:',
        text: `Прикупи, пожалуйста:\n${data?.map(elem => elem?.title).join('\n')}`,
      }).then(() => {
        setShowSuccess(true);
      }).catch(() => {
        const message = {
          title: 'Ошибка отправки',
          descr: 'Не удалось отправить список на покупку. Попробуйте снова'
        };
        setShowError(message);
      });
    };
  };

  const showErrorMsg = (
    <PopupNotification
      title={showError?.title || 'Ошибка отправки'}
      subTitle={showError?.descr}
      btnTitle="Ок"
      action={() => {
        setShowError(null);
      }}
      isVisible={!!showError}
    />
  );

  const showSuccessMsg = (
    <PopupNotification
      title="Готово"
      subTitle="Список на покупку отправлен"
      btnTitle="Ок"
      action={() => {
        setShowSuccess(false);
      }}
      isVisible={showSuccess}
    />
  );

  return (
    <>
      {showErrorMsg}
      {showSuccessMsg}
      <ActionBtn variant="icon" action={handleShare}>
        <IoShareOutline size={'2.7rem'} />
      </ActionBtn>
    </>
  )
};