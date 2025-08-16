/* eslint-disable react-hooks/exhaustive-deps */
'use  client';

import { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useFormContext } from 'react-hook-form';
import { FadeComponent } from '../AnimatedComponents/FadeComponent';
import { TextField } from '../TextField';
import moment from 'moment';
import { Value } from 'react-calendar/dist/esm/shared/types.js';
import { CgCalendarDates } from "react-icons/cg";
import { ActionBtn } from '../Buttons/ActionBtn';
import { AnimatePresence, motion } from 'framer-motion';
import { popupAnimation } from './config';
import './Calendar.css';

type TControlledInputProps = {
  name: string;
  placeholder: string;
  disabled?: boolean;
};

export const DatePicker = ({ name, placeholder, disabled = false }: TControlledInputProps) => {
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [isValue, setIsValue] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { register, setValue, formState: { errors } } = useFormContext();
  const errorMessage = errors[name]?.message;
  const isVisible = errorMessage && typeof errorMessage === 'string' ? true : false;

  const handleValue = (value: Value) => { //on calendar pick
    if (!value) return;
    const newValue = value && String(value).replace(/\s*\(.*?\)/, '') as string;
    const dateToCompare = moment(newValue);
    const currentDate = moment();
    if (dateToCompare.isBefore(currentDate)) return;
    setIsValue(value as Date);
  };

  const handleOpen = (val: boolean) => {
    setIsOpen(val);
  };

  useEffect(() => {
    if (isValue) {
      const newValue = moment(new Date(isValue)).format('DD.MM.YYYY');
      setValue('expiredDate', newValue);
    };
    handleOpen(false);
  }, [isValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current?.contains(event.target as Node)) {
        handleOpen(false);
      };
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className="container">
        <div style={{ display: 'flex' }}>
          <input
            className="text"
            {...register(name)}
            placeholder={placeholder}
            style={{ marginBottom: '10px' }}
            maxLength={8}
            readOnly={disabled}
          />
          <ActionBtn
            action={() => handleOpen(isOpen ? false : true)}
            variant="icon" type="button"
            style={{ position: 'absolute', top: '13px', right: 0, paddingRight: '15px' }}
            disabled={isOpen}
          >
            <CgCalendarDates size="2rem" />
          </ActionBtn>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div {...popupAnimation}>
              <article className="popup" ref={popupRef}>
                <Calendar onChange={handleValue} value={isValue} />
              </article>
            </motion.div>
          )}
        </AnimatePresence>
        <FadeComponent
          isVisible={isVisible}
        >
          <TextField variant="span" color="error">
            {errorMessage as string}
          </TextField>
        </FadeComponent>
      </div >
    </>
  );
};
