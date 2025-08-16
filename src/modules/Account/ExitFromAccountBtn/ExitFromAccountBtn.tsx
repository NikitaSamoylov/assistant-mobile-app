'use client';

import { ActionBtn } from "@/components/Buttons/ActionBtn";
import { PopupNotification } from "@/components/Popups/PopupNotification";
import { Spinner } from "@/components/Spinner.tsx";
import { PRELOADER_DEFAULT_SIZE } from "@/lib/consts/consts";
import { persistor, RootState } from "@/lib/store/store";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdExit } from "react-icons/io";
import { setNoInternetMsg } from "@/lib/store/features/noInternetSlice";
import useFetch from "@/utils/hooks.ts/useFetch";

export const ExitFromAccountBtn = () => {
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);
  const userId = useSelector((state: RootState) => state.userSession.userSession?.id);

  const dispatch = useDispatch();

  const [showExitPopup, setShowExitPopup] = useState(false);

  const { fetch: checkIsLoggedOut } = useFetch();

  const handleExit = async () => {
    if (!isUserOnline) {
      dispatch(setNoInternetMsg(true));
      return;
    };

    setShowExitPopup(true);

    checkIsLoggedOut('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, isLogged: false })
    });

    persistor.purge();
    signOut();
  };

  const showPopupOnExit = (
    <PopupNotification
      title="Выход из аккаунта"
      subTitle={
        <div style={{ paddingTop: '15px' }}>
          <Spinner size={PRELOADER_DEFAULT_SIZE} />
        </div>
      }
      hideActions
      isVisible={showExitPopup}
    />
  );

  return (
    <>
      {showPopupOnExit}
      <ActionBtn
        variant="text"
        action={handleExit}
        style={{ transform: 'translateY(4px)' }}
      >
        <IoMdExit style={{ fontSize: '2rem' }} />
      </ActionBtn>
    </>
  )
};