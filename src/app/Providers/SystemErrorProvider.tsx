'use client';

import { SystemErrorNotification } from "@/components/SystemErrorNotification";
import { ReactNode } from "react";

type TSystemErrorProps = {
  children: ReactNode;
};

export const SystemErrorProvider = ({ children }: TSystemErrorProps) => {
  return (
    <>
      <SystemErrorNotification />
      {children}
    </>
  )
};