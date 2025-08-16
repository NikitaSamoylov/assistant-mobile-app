'use client';

import { setUserSession } from "@/lib/store/features/sessionSlice";
import { RootState } from "@/lib/store/store";
import { Pathes } from "@/lib/types/pathes";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

type TProps = {
  children: ReactNode;
};

const GetAndSetUserSession = ({ children }: TProps) => {
  const { userSession } = useSelector((state: RootState) => state.userSession);
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (pathname === Pathes.ABOUT || pathname === Pathes.PROMO || pathname === Pathes.INSTALL || pathname === Pathes.SUPPORT || pathname === Pathes.PROMO_FEAR) {
      return;
    };

    if (isUserOnline && !userSession) {
      // Пользователь онлайн, используем useSession
      if (status === 'loading') return;
      if (status === 'unauthenticated') {
        router.replace(Pathes.AUTH);
      } else if (status === 'authenticated') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(setUserSession(session?.user as any));
      }
    } else {
      // Пользователь не онлайн, используем userSession из Redux

      if (!userSession) {
        router.replace(Pathes.FALLBACK)
      };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserOnline, session, status, userSession, dispatch, router]);

  return <>{children}</>
};

export default GetAndSetUserSession;