'use client';

import React, { useEffect } from 'react';
import { FiSun } from "react-icons/fi";
import { TextField } from '../TextField';
import { IoMoonOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { setTheme, ThemeMode } from '@/lib/store/features/themeSlice';
import classNames from 'classnames';
import { TariffesTitles } from '@/lib/types/tariffes';
import styles from './SwitchTheme.module.css';

type TSwitchThemeProps = {
  hideText?: boolean;
};

export const SwitchTheme = ({ hideText }: TSwitchThemeProps) => {
  const themeMode = useSelector((state: RootState) => state.theme.theme);
  const userTariff = useSelector((state: RootState) => state.userSession.userSession?.tariff);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (themeMode === ThemeMode.DARK) {
  //     document.body.classList.add('dark-theme');
  //   } else {
  //     document.body.classList.remove('dark-theme');
  //   }
  // }, [themeMode]);

  const toggleTheme = () => {
    dispatch(setTheme(themeMode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT));
  };

  if (userTariff === TariffesTitles.BASE_TARIFF) return;

  return (
    <div>
      <button onClick={toggleTheme}>
        {
          themeMode === ThemeMode.DARK && (
            <div className={styles.wrapper}>
              <FiSun className={classNames(styles.icon, hideText && styles.iconOnly)} />
              {
                !hideText && (
                  <TextField variant="span" color="caption" >
                    Светлая тема
                  </TextField>
                )
              }
            </div>
          )
        }
        {
          themeMode === ThemeMode.LIGHT && (
            <div className={styles.wrapper}>
              <IoMoonOutline className={classNames(styles.icon, hideText && styles.iconOnly)} />
              {
                !hideText && (
                  <TextField variant="span" color="caption" >
                    Тёмная тема
                  </TextField>
                )
              }
            </div>
          )
        }
      </button>
    </div>
  );
};