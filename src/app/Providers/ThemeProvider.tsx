'use client';

import { ThemeMode } from "@/lib/store/features/themeSlice";
import { RootState } from "@/lib/store/store";
import { TariffesTitles } from "@/lib/types/tariffes";
import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useSelector((state: RootState) => state.theme);
  const userTariff = useSelector((state: RootState) => state.userSession?.userSession?.tariff);

  useEffect(() => {
    if (theme === ThemeMode.DARK) {
      if (userTariff === TariffesTitles.BASE_TARIFF) {
        document.body.classList.remove('dark-theme');
        return;
      };
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme, userTariff]);

  return <>{children}</>
};