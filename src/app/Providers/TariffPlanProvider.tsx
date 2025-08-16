/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { PopupNotification } from "@/components/Popups/PopupNotification";
import { setUserSession } from "@/lib/store/features/sessionSlice";
import { RootState } from "@/lib/store/store";
import { Pathes } from "@/lib/types/pathes";
import { TUserAuth } from "@/lib/types/user";
import { checkIsAccountExpired } from "@/utils/checkIsAccountExpired";
import useFetch from "@/utils/hooks.ts/useFetch";
import moment from "moment";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type TProps = {
  children: ReactNode;
};

type TRemoveTariffResp = {
  expired: string;
  tariff: string;
  nextTariff: string;
  isNextTariffPayed: boolean;
};

export const TariffPlanProvider = ({ children }: TProps) => {
  // const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);
  // const { userSession } = useSelector((state: RootState) => state.userSession);
  // const pathname = usePathname();

  // const [isIsternetRequired, setIsInternetRequired] = useState(false);

  // const { fetch: fetchUser, data } = useFetch<{ message: TUserAuth }>();
  // const { fetch: removeNextTariff } = useFetch<{ message: string, data: TRemoveTariffResp }>();

  // const dispatch = useDispatch();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!userSession?.id || !isUserOnline) return;
  //   fetchUser(`/api/user?userId=${userSession?.id}`);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [userSession?.id, isUserOnline]);

  // useEffect(() => {
  //   if (pathname === Pathes.ABOUT || pathname === Pathes.INSTALL || pathname === Pathes.PROMO || pathname === Pathes.SUPPORT || pathname === Pathes.PROMO_FEAR) { //исключаем промо-страницу, на нее может зайти любой
  //     return;
  //   };

  //   if (!data?.message?.expired) return;

  //   const handleRemoveNextTariff = (dto: TUserAuth) => {
  //     const finishDto = {
  //       userId: dto?.id,
  //       nextTariff: '',
  //       isNextTariffPayed: false,
  //       tariff: dto?.tariff,
  //       expired: dto?.expired,
  //     };

  //     const stateDto = {
  //       ...userSession,
  //       ...finishDto,
  //     };

  //     removeNextTariff('/api/set-next-tariff', {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ ...finishDto })
  //     })
  //       .then(() => {
  //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //         dispatch(setUserSession({ ...stateDto as any }))
  //       })
  //   };

  //   const { _id, ...rest } = data.message;
  //   const dto = { ...rest, id: data.message._id };
  //   dispatch(setUserSession({ ...dto }));

  //   const isExpired = checkIsAccountExpired(data?.message?.expired);

  //   if (isExpired) {
  //     if (!isUserOnline) {
  //       setIsInternetRequired(true);
  //       return;
  //     }
  //     if (userSession?.nextTariff && userSession?.isNextTariffPayed) {
  //       const stateDto = {
  //         ...dto,
  //         expired: moment().add(30, 'days').format('DD.MM.YYYY'),
  //         tariff: userSession?.nextTariff,
  //         nextTariff: '',
  //         isNextTariffPayed: false,
  //       };
  //       handleRemoveNextTariff(stateDto);
  //     } else {
  //       router.replace(Pathes.TARIFF_PLAN);
  //     };
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data, isUserOnline]);

  // const showMsgInternetRequired = (
  //   <PopupNotification
  //     title="Без доступа к сети"
  //     subTitle="Для подключения и проверки тарифа необходим интернет"
  //     btnTitle="Ок"
  //     action={() => {
  //       setIsInternetRequired(false);
  //     }}
  //     isVisible={isIsternetRequired}
  //   />
  // );

  return (
    <>
      {/* {showMsgInternetRequired} */}
      {children}
    </>
  )
};