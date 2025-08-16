'use client';

import React, { CSSProperties } from 'react';
import styles from './ControlledTextField.module.css';

import { useFormContext } from 'react-hook-form';
import { FadeComponent } from '@/components/AnimatedComponents/FadeComponent';
import { TextField } from '@/components/TextField';
import classNames from 'classnames';

type TControlledInputProps = {
  name: string;
  placeholder: string;
  isCenterText?: boolean;
  length?: number;
  style?: CSSProperties;
};

export const ControlledTextField = ({ name, placeholder, isCenterText = false, length = 60, style }: TControlledInputProps) => {
  const { register, formState: { errors } } = useFormContext();

  const errorMessage = errors[name]?.message;

  const isVisible = errorMessage && typeof errorMessage === 'string' ? true : false;

  return (
    <div className={styles.container}>
      <input
        className={classNames(styles.text, isCenterText ? styles.isCenter : {})}
        {...register(name)} placeholder={placeholder}
        maxLength={length}
        style={style}
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

