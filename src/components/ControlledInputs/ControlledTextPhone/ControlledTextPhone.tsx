/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { CSSProperties, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FadeComponent } from '@/components/AnimatedComponents/FadeComponent';
import { TextField } from '@/components/TextField';
import classNames from 'classnames';
import styles from './ControlledTextPhone.module.css';

type TControlledInputProps = {
  name: string;
  placeholder: string;
  isCenterText?: boolean;
  length?: number;
  style?: CSSProperties;
};

export const ControlledTextPhone = (
  {
    name = 'phone',
    placeholder,
    isCenterText = false,
    length = 60,
    style
  }: TControlledInputProps
) => {
  const { register, formState: { errors }, setValue, watch } = useFormContext();

  const errorMessage = errors[name]?.message;
  const phoneValue = watch('phone');

  const isVisible = errorMessage && typeof errorMessage === 'string' ? true : false;

  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if ((!phoneValue || phoneValue?.length <= 1) && isFocused) {
      setValue('phone', '+7');
      return;
    };
    if (!isFocused && phoneValue?.length <= 2) {
      setValue('phone', '');
    };
  }, [isFocused, phoneValue]);

  return (
    <div className={styles.container}>
      <input
        className={classNames(styles.text, isCenterText ? styles.isCenter : {})}
        {...register(name)} placeholder={placeholder}
        maxLength={length}
        style={style}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <FadeComponent
        isVisible={isVisible}
      >
        <TextField variant="span" color="error" style={isCenterText ? { display: 'block', textAlign: 'center' } : {}}>
          {errorMessage as string}
        </TextField>
      </FadeComponent>
    </div >
  );
};

