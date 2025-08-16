'use client';

import { FadeComponent } from "@/components/AnimatedComponents/FadeComponent";
import { TextField } from "@/components/TextField";
import { useFormContext } from "react-hook-form";
import styles from './ControlledTextArea.module.css';

type TControlledInputProps = {
  name: string;
  placeholder: string;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
};

export const ControlledTextArea = (
  { name, placeholder, rows = 3, maxLength = 500, disabled }: TControlledInputProps) => {
  const { register, formState: { errors } } = useFormContext();

  const errorMessage = errors[name]?.message;

  const isVisible = errorMessage && typeof errorMessage === 'string' ? true : false;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // чтобы Enter не добавлял новую строку, если нужно
      // вызываем onBlur
      e.currentTarget.blur();
    }
  };

  return (
    <div className={styles.container}>
      <textarea
        className={styles.text} {...register(name)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <FadeComponent
        isVisible={isVisible}
      >
        <TextField variant="span" color="error">
          {errorMessage as string}
        </TextField>
      </FadeComponent>
    </div >
  )
};