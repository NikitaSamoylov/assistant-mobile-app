'use client';

import { ReactNode } from "react";
import { ActionBtn } from "@/components/Buttons/ActionBtn";

type TProps = {
  action: VoidFunction;
  children: ReactNode;
};

export const CamActionBtn = ({ action, children }: TProps) => {
  return (
    <ActionBtn variant="icon" action={action}>
      {children}
    </ActionBtn>
  )
};