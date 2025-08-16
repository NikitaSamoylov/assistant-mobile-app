'use client';

import { PopupNotification } from "@/components/Popups/PopupNotification";
import { setNoInternetMsg } from "@/lib/store/features/noInternetSlice";
import { RootState } from "@/lib/store/store";
import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

export const NoInternetNotifyProvider = ({ children }: { children: ReactNode }) => {
  const { showNoInternetMsg } = useSelector((state: RootState) => state.showNoInternetMessage);

  const dispatch = useDispatch();

  const showMsg = (
    <PopupNotification
      title="Без доступа к интернету"
      subTitle="Пожалуйста, проверьте интернет и попробуйте снова"
      btnTitle="Ок"
      action={() => {
        dispatch(setNoInternetMsg(false))
      }}
      isVisible={!!showNoInternetMsg}
    />
  );

  return (
    <>
      {showMsg}
      {children}
    </>
  )
};