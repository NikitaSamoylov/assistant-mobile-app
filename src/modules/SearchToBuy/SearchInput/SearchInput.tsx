'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FadeComponent } from '../../../components/AnimatedComponents/FadeComponent';
import { IoSearch } from 'react-icons/io5';
import { TiDelete } from 'react-icons/ti';
import { useDispatch } from 'react-redux';
import { ActionBtn } from '../../../components/Buttons/ActionBtn';
import { setValue } from '@/lib/store/features/existingProductsSearchSlice';
import styles from './SearchInput.module.css';
import { usePathname } from 'next/navigation';
import { TProductsTabs } from '@/lib/types/productsTabs';
import { Pathes } from '@/lib/types/pathes';
import { setToBuySearchMode } from '@/lib/store/features/SearchToBuyModeSlice';
import { setToBuyValue } from '@/lib/store/features/toBuyProductsSearchSlice';

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
    dispatch(setToBuySearchMode(key));
    setShowCancelBtn(key);
  };

  const handleRemoveText = () => {
    setText('');
    inputRef?.current?.focus();
  };

  const handleCancelSearch = () => {
    setText('');
    dispatch(setToBuySearchMode(false));
    setShowCancelBtn(false);
    dispatch(setToBuyValue([]));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', columnGap: '10px' }}>
      <div className={styles.inputWrapper}>
        <label
          htmlFor="input"
          className={styles.label}
        >
          <IoSearch size="20px" color="#87888D" />
        </label>
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
      <FadeComponent isVisible={showCancelBtn}>
        <ActionBtn variant="text" action={handleCancelSearch} >
          Отменить
        </ActionBtn>
      </FadeComponent>
    </div>
  )
};