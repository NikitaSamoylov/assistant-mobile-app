'use client';

import { Pathes } from '@/lib/types/pathes';
import { usePathname, useRouter } from 'next/navigation';
import { IoIosStarOutline } from "react-icons/io";
import styles from './ToMainPageBtn.module.css';
import { FooterActionBtn } from '@/components/FooterActionBtn';

export const ToMainPageBtn = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isCurrent = pathname === Pathes.MAIN;

  return (
    <FooterActionBtn
      isActive={isCurrent}
      title="Продукты"
      children={
        <IoIosStarOutline
          size="28px"
          className={
            isCurrent ?
              styles.iconActive :
              styles.icon
          }
        />
      }
      action={() => router.replace(Pathes.MAIN)}
    />
  )
};