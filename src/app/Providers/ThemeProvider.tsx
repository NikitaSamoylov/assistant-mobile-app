'use client';

import { ThemeMode } from "@/lib/store/features/themeSlice";
import { RootState } from "@/lib/store/store";
import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    if (theme === ThemeMode.DARK) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  return <>{children}</>
};