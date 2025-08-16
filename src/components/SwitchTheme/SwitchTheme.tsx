'use client';

import React from 'react';
import { FiSun } from "react-icons/fi";
import { TextField } from '../TextField';
import { IoMoonOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { setTheme, ThemeMode } from '@/lib/store/features/themeSlice';
import classNames from 'classnames';
import styles from './SwitchTheme.module.css';

type TSwitchThemeProps = {
  hideText?: boolean;
};

export const SwitchTheme = ({ hideText }: TSwitchThemeProps) => {
  const themeMode = useSelector((state: RootState) => state.theme.theme);

  const dispatch = useDispatch();

  const toggleTheme = () => {
    dispatch(setTheme(themeMode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT));
  };

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