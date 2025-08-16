'use client';

import { ActionBtn } from "@/components/Buttons/ActionBtn";
import { PopupNotification } from "@/components/Popups/PopupNotification";
import { Spinner } from "@/components/Spinner.tsx";
import { PRELOADER_BTN_SIZE, PRELOADER_DEFAULT_SIZE } from "@/lib/consts/consts";
import { deleteExistingProductsDB } from "@/lib/storage/indexedDb/existingProducts";
import { deleteProductsToDB } from "@/lib/storage/indexedDb/productsToBuy";
import { persistor, RootState } from "@/lib/store/store";
import useFetch from "@/utils/hooks.ts/useFetch";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import { setNoInternetMsg } from "@/lib/store/features/noInternetSlice";

export const RemoveAccount = () => {
  const userId = useSelector((state: RootState) => state.userSession.userSession?.id);
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);

  const { fetch: removeAccount, data, isLoading } = useFetch<{ message: string }>();

  const dispatch = useDispatch();

  const [showDeletingMsg, setShowDeletingMsg] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleExit = async () => {

    await persistor.purge();
    await Promise.all([
      deleteExistingProductsDB(),
      deleteProductsToDB(),
    ]);

    signOut();
  };

  useEffect(() => {
    if (data?.message === 'deleted') {
      handleExit();
    };
  }, [data]);

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  const handleRemove = () => {
    if (!isUserOnline) {
      dispatch(setNoInternetMsg(true));
      return;
    };

    if (!userId) return;

    setShowDeletingMsg(true);

    const dto = {
      userId,
    };

    removeAccount('/api/backup', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    });
  };

  const btnContent = isLoading && (
    <Spinner size={PRELOADER_BTN_SIZE} />
  ) || <AiOutlineDelete style={{ fontSize: '2rem' }} />;

  const showMessageWhileDeleting = (
    <PopupNotification
      title="Удаляем аккаунт"
      subTitle={
        <div style={{ paddingTop: '10px' }}>
          <Spinner size={PRELOADER_DEFAULT_SIZE} />
        </div>
      }
      hideActions
      isVisible={showDeletingMsg}
    />
  );

  const showDeleteConfirmPopup = (
    <PopupNotification
      title="Внимание"
      subTitle="Вы уверены, что хотите удалить аккаунт? Восстановить его будет невозможно"
      btnSecondTitle="Вернуться"
      btnTitle="Удалить"
      action={handleRemove}
      secondBtnAction={() => setIsConfirmed(false)}
      isVisible={isConfirmed}
    />
  );

  return (
    <>
      {showMessageWhileDeleting}
      {showDeleteConfirmPopup}
      <ActionBtn
        variant="text"
        color="error"
        action={handleConfirm}
        disabled={isLoading}
        style={{ transform: 'translateY(2px)' }}
      >
        {btnContent}
      </ActionBtn>
    </>
  )
};