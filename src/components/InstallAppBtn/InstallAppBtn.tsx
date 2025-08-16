'use client';

import { useEffect, useState } from "react";
import { PopupNotification } from "../Popups/PopupNotification";
import { ShowInstallGuide } from "../ShowInstallGuilde";
import { detectBrowser } from "@/utils/detectBrowser";
import { detectPlatrofm } from "@/utils/detectPlatform";
import { useRouter } from "next/navigation";
import { Pathes } from "@/lib/types/pathes";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FaLock } from "react-icons/fa";
import { TextField } from "../TextField";
import styles from './InstallAppBtn.module.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export const InstallAppBtn = ({ isInstall = true }: { isInstall?: boolean }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [notSupport, setNotSupport] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // Блокируем стандартное окно
      setDeferredPrompt(e as BeforeInstallPromptEvent); // Сохраняем событие для вызова позже
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = (): void => {
    if (!isInstall) {
      router.replace(Pathes.INSTALL);
      return;
    };

    const platform = detectPlatrofm();
    const browser = detectBrowser();
    if (platform === 'ios') {
      setShowInstallGuide(true);
      return;
    };

    if (platform === 'android' && browser !== 'Chrome') {
      setNotSupport(true);
      return;
    };

    if (deferredPrompt) {
      deferredPrompt.prompt(); // показываем окно установки
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Установка подтверждена');
        };
        setDeferredPrompt(null);
      });
    } else {
      console.warn('Нет deferredPrompt для вызова prompt()');
    };
  };

  const showNotSupportMsg = (
    <PopupNotification
      title="Установка невозможна"
      subTitle="Ваш браузер не поддерживает установку приложений. Используйте браузеры Chrome или Safari"
      btnTitle="Ок"
      action={() => {
        setNotSupport(false);
      }}
      isVisible={notSupport}
    />
  );

  return (
    <>
      {showNotSupportMsg}
      <ShowInstallGuide
        isOpened={showInstallGuide}
        setIsGuideOpened={setShowInstallGuide}
      />
      <div className={styles.actionBtn}>
        <div className={styles.installWrapper}>
          <div className={styles.mainInstallBtn}>
            <div className={styles.infoBlock}>
              <div className={styles.verified}>
                <RiVerifiedBadgeFill className={styles.verifiedIcon} />
                <TextField variant="span" color="main" style={{ fontSize: '10px', lineHeight: '1rem' }}>
                  официальное <br /> приложение
                </TextField>
              </div>
              <div className={styles.secured}>
                <FaLock className={styles.securedIcon} />
                <TextField variant="span" color="main" style={{ fontSize: '10px', lineHeight: '1rem' }}>
                  Подключение <br /> защищено
                </TextField>
              </div>
            </div>
            <button className={styles.installBtn} onClick={handleInstallClick}>
              Попробовать
            </button>
          </div>
        </div>
      </div>
    </>
  )
};