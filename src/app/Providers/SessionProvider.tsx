'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

type TSessionProviderProps = {
  children: ReactNode;
};

export const SessionAppProvider = ({ children }: TSessionProviderProps) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
};