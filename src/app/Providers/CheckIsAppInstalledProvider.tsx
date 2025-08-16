/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Pathes } from "@/lib/types/pathes";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";


//======================= не забудь заглянуть в middleware.ts и GetUserSessionProvider !
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
};

function isPwaOpen() {
  const nav = window.navigator as NavigatorWithStandalone;
  const result = nav.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
  return result;
};

export const CheckIsAppInstalledProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  // if (pathname === Pathes.AUTH && !isPwaOpen() || pathname === Pathes.MAIN && !isPwaOpen()) {
  //   router.replace(Pathes.ABOUT);
  //   return null;
  // };

  // if (pathname === Pathes.ABOUT && isPwaOpen()) {
  //   router.replace(Pathes.MAIN);
  //   return null;
  // };


  // const pathname = usePathname();
  // const router = useRouter();

  // const [ready, setReady] = useState(false);
  // const [isPwa, setIsPwa] = useState(false);

  // // Проверка PWA при монтировании
  // useEffect(() => {
  //   const checkPwa = () => {
  //     const nav = navigator as NavigatorWithStandalone;
  //     return nav.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
  //   };
  //   setIsPwa(checkPwa());
  // }, []);

  // useEffect(() => {
  //   if (!isPwa && pathname !== Pathes.INSTALL && pathname !== Pathes.PROMO && pathname !== Pathes.ABOUT && pathname !== Pathes.SUPPORT) {
  //     router.replace(Pathes.INSTALL);
  //   } else if (isPwa && pathname !== Pathes.MAIN && pathname !== Pathes.AUTH && pathname !== Pathes.VERIFY) {
  //     router.replace(Pathes.MAIN);
  //   } else {
  //     setReady(true);
  //   }
  // }, [pathname, isPwa]);

  // if (!ready) {
  //   return null;
  // };

  return (
    <>
      {children}
    </>
  )
};