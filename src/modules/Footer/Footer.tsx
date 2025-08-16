'use client';

import { SectionWrapper } from "@/components/SectionWrapper";
import { ToBuyBtn } from "./btns/ToBuyBtn";
import { MoreBtn } from "./btns/MoreBtn";
import { AddItemBtn } from "./btns/AddItemBtn";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Pathes } from "@/lib/types/pathes";
import { FadeComponent } from "@/components/AnimatedComponents/FadeComponent";
import { ToMainPageBtn } from "./btns/ToMainPageBtn";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import styles from './Footer.module.css';

const pathesToHide = [
  Pathes.AUTH,
  Pathes.SUPPORT,
  Pathes.POLICY,
  Pathes.TERMS,
  Pathes.TARIFF_PLAN,
  Pathes.FALLBACK,
  Pathes.ABOUT,
  Pathes.PROMO,
  Pathes.INSTALL,
  Pathes.GIFTS,
  Pathes.PROMO_FEAR,
];

export const Footer = () => {
  const pathname = usePathname();
  const { isSearch } = useSelector((state: RootState) => state.isSearch);
  const { isSearchToBuy } = useSelector((state: RootState) => state.isSearchToBuy);

  const [isHide, setIsHide] = useState(true);

  useEffect(() => {
    if (pathesToHide.every(item => !pathname.includes(item))) {
      setIsHide(false);
    } else {
      setIsHide(true);
    }
  }, [pathname]);

  if (isHide || isSearch || isSearchToBuy) return; //если страница авторизации, или search mode, то скрываем футер

  return (
    <SectionWrapper>
      <FadeComponent isVisible={true}>
        <div className={styles.gradient}></div>
        <footer className={styles.footer}>
          <ul className={styles.buttons}>
            <li>
              <ToMainPageBtn />
            </li>
            <li>
              <ToBuyBtn />
            </li>
            <li>
              <AddItemBtn />
            </li>
            <li>
              <MoreBtn />
            </li>
          </ul>
        </footer>
      </FadeComponent>
    </SectionWrapper>
  )
};