'use client';

import { useCheckIsOnline } from "@/utils/checkIsOnline";
import { ReactNode } from "react";

const CheckIsOnlineProvider = ({ children }: { children: ReactNode }) => {
  const { isReady } = useCheckIsOnline();

  if (!isReady) {
    return null;
  };

  return <>{children}</>;
};

export default CheckIsOnlineProvider;