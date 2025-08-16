'use client';

import { FooterActionBtn } from "@/components/FooterActionBtn";
import { Pathes } from "@/lib/types/pathes";
import { usePathname, useRouter } from "next/navigation";
import { LiaShoppingBagSolid } from "react-icons/lia";
import styles from './ToBuyBtn.module.css';

export const ToBuyBtn = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isCurrent = pathname === Pathes.TO_BUY;

  return (
    <FooterActionBtn
      title="Купить"
      isActive={isCurrent}
      children={
        <LiaShoppingBagSolid
          size="28px"
          className={
            isCurrent ?
              styles.iconActive :
              styles.icon
          }
        />
      }
      action={() => router.replace(Pathes.TO_BUY)}
    />
  )
};