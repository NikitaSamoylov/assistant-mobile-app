'use client';

import { ActionBtn } from "@/components/Buttons/ActionBtn";
import { Pathes } from "@/lib/types/pathes";
import { useRouter } from "next/navigation";
import { IoIosArrowForward } from "react-icons/io";
import styles from './LinkToTerms.module.css';

export const LinkToTerms = () => {
  const router = useRouter();

  const handleRouter = () => {
    router.push(Pathes.TERMS);
  };

  return (
    <>
      <ActionBtn
        variant="icon"
        style={{ transform: 'translateY(2px)' }}
        action={handleRouter}
        color="button"
      >
        <IoIosArrowForward className={styles.icon} />
      </ActionBtn>
    </>
  )
};