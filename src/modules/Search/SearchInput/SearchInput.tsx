'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { FadeComponent } from '@/components/AnimatedComponents/FadeComponent';
import { IoSearch } from 'react-icons/io5';
import { TiDelete } from 'react-icons/ti';
import { useDispatch } from 'react-redux';
import { ActionBtn } from '@/components/Buttons/ActionBtn';
import { setSearchMode } from '@/lib/store/features/searchModeSlice';
import { setValue } from '@/lib/store/features/existingProductsSearchSlice';
import styles from './SearchInput.module.css';

type TProps = {
  text: string;
  setText: (val: string) => void;
};

export const SearchInput = ({ text, setText }: TProps) => {
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [showCancelBtn, setShowCancelBtn] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);
  };

  const handleSearchMode = (key: boolean) => {
    if (text) return;
    dispatch(setSearchMode(key));
    setShowCancelBtn(key);
  };

  const handleRemoveText = () => {
    setText('');
    inputRef?.current?.focus();
  };

  const handleCancelSearch = () => {
    setText('');
    dispatch(setSearchMode(false));
    setShowCancelBtn(false);
    dispatch(setValue([]));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', columnGap: '10px' }}>
      <div className={styles.inputWrapper}>
        <div
          className={styles.textFieldWrapper}
          style={{
            width: showCancelBtn ? '71%' : '100%',
            transition: '0.3s',
          }}
        >
          <label
            htmlFor="input"
            className={styles.label}
          >
            <IoSearch size="20px" color="#87888D" />
          </label>
          <div style={{ position: 'relative' }}>
            <input
              ref={inputRef}
              id="input"
              className={styles.input}
              value={text}
              onChange={handleChange}
              onFocus={() => handleSearchMode(true)}
              onBlur={() => handleSearchMode(false)}
              placeholder="Поиск"
            />
            <div className={styles.removeBtn}>
              <FadeComponent isVisible={!!text}>
                <button
                  onClick={handleRemoveText}
                >
                  <TiDelete color="#87888D" size="30px" />
                </button>
              </FadeComponent>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: '15px',
          opacity: showCancelBtn ? 1 : 0,
          transition: '0.3s',
        }}
      >
        <ActionBtn variant="text" action={handleCancelSearch} >
          Отменить
        </ActionBtn>
      </div>
    </div>
  )
};
