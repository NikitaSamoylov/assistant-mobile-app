'use client';

import { FooterActionBtn } from "@/components/FooterActionBtn";
import { IoIosMore } from "react-icons/io";
import styles from './MoreBtn.module.css';

import { usePathname, useRouter } from "next/navigation";
import { Pathes } from "@/lib/types/pathes";

export const MoreBtn = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isCurrentPath = pathname === Pathes.ACCOUNT || pathname === Pathes.MENU_LIST;

  const handleRouter = () => {
    router.replace(Pathes.MENU_LIST);
  };

  return (
    <>
      <div className={styles.container}>
        <FooterActionBtn
          title="Ещё"
          isActive={isCurrentPath}
          children={
            <IoIosMore
              size="28px"
              className={
                isCurrentPath ?
                  styles.iconActive :
                  styles.icon
              }
            />
          }
          action={handleRouter}
        />
      </div>
    </>
  )
};