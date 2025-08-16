/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { MainLogo } from "@/components/MainLogo";
import { SectionWrapper } from "@/components/SectionWrapper";

import { TextField } from "@/components/TextField";
import { usePathname } from "next/navigation";
import { Pathes } from "@/lib/types/pathes";
import { useEffect, useState } from "react";
import { FadeComponent } from "@/components/AnimatedComponents/FadeComponent";
import { SwitchTheme } from "@/components/SwitchTheme";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import classNames from "classnames";
import { motion } from "framer-motion";
import { headerVariants } from "./config";
import { useRequestNotificationPermission } from "@/utils/useRequestNotification";
import styles from './Header.module.css';

const pathesToHideHeader = [
  Pathes.AUTH,
  Pathes.SUPPORT,
  Pathes.POLICY,
  Pathes.MENU_LIST,
  Pathes.ACCOUNT,
  Pathes.VERIFY,
  Pathes.AI_CHAT,
  Pathes.TARIFF_PLAN,
  Pathes.TERMS,
  Pathes.FALLBACK,
  Pathes.ABOUT,
  Pathes.PROMO,
  Pathes.INSTALL,
  Pathes.GIFTS,
  Pathes.PROMO_FEAR,
];

export const Header = () => {
  const pathname = usePathname();
  const { isSearch } = useSelector((state: RootState) => state.isSearch);
  const { isSearchToBuy } = useSelector((state: RootState) => state.isSearchToBuy);
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);
  const userId = useSelector((state: RootState) => state.userSession.userSession?.id);
  const userName = useSelector((state: RootState) => state.userSession.userSession?.userName);

  const { requestPermission } = useRequestNotificationPermission({ userId })

  const [isHide, setIsHide] = useState(true);

  useEffect(() => {
    if (!pathesToHideHeader.includes(pathname as Pathes)) {
      setIsHide(false);
    } else {
      setIsHide(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (!isUserOnline || !userId) return;
    requestPermission();
  }, [isUserOnline, userId]);

  return (
    <div style={{ position: 'relative' }}>
      <motion.div
        initial="visible"
        animate={isSearch ? "hidden" : "visible"}
        variants={headerVariants}
      >
        <FadeComponent isVisible={!isHide}>
          <motion.div
            variants={headerVariants}
            initial="show"
            animate={(isSearch || isSearchToBuy) ? "hide" : "show"}
          >
            <header className={classNames(styles.header)}>
              <SectionWrapper>
                <div className={styles.headerContent}>
                  <div className={styles.logoContent}>
                    <MainLogo />
                    <div>
                      <TextField
                        variant="p"
                        style={{ fontWeight: 600, fontSize: '1.3rem' }}
                        color="main"
                      >
                        Привет,
                      </TextField>
                      <TextField
                        variant="p"
                        color="main"
                        style={{
                          display: 'block',
                          maxWidth: '150px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {userName || ''}
                      </TextField>
                    </div>
                  </div>
                  <div className={styles.serviceBtns}>
                    <SwitchTheme hideText />
                  </div>
                </div>
              </SectionWrapper>
            </header>
          </motion.div>
        </FadeComponent>
      </motion.div>
    </div >
  )
};