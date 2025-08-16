'use client';

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { PopupNotification } from "../Popups/PopupNotification";
import { clearSystemError } from "@/lib/store/features/systemError";
import { useRouter } from "next/navigation";
import { Pathes } from "@/lib/types/pathes";

export const SystemErrorNotification = () => {
  const error = useSelector((state: RootState) => state.systemError);
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <PopupNotification
      title="Сетевая ошибка"
      subTitle="Проверьте интернет, перезайдите в приложение и попробуйте снова"
      btnTitle="Вернуться"
      action={() => {
        router.replace(Pathes.MAIN);
        dispatch(clearSystemError());
      }}
      isVisible={error.systemError}
    />
  )
};