'use client';

import { useRouter } from "next/navigation";
import { MdArrowBackIos } from "react-icons/md";
import { ActionBtn } from "../ActionBtn";
import styles from './ReturnBtn.module.css';

type TReturnBtn = {
  action?: () => void;
};

export const ReturnBtn = ({ action }: TReturnBtn) => {
  const router = useRouter();

  const onClick = action ? action : () => router.back();

  return (
    <ActionBtn variant="text" action={onClick}>
      <MdArrowBackIos className={styles.icon} />
      Вернуться
    </ActionBtn>
  )
};