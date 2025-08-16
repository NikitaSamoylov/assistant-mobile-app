'use client';

import { useRef, useState } from 'react';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { TBuyProducts } from '@/lib/types/product';
import { FadeComponent } from '@/components/AnimatedComponents/FadeComponent';
import { RiAddLine } from "react-icons/ri";
import { IoArrowUndoOutline } from "react-icons/io5";
import { ActionBtn } from '@/components/Buttons/ActionBtn';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { RootState } from '@/lib/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { saveShoppingProducts } from '@/lib/storage/indexedDb/productsToBuy';
import { CREATE_PRODUCTS_LIMIT } from '@/lib/consts/consts';
import { PopupNotification } from '@/components/Popups/PopupNotification';
import styles from './CreateNewItem.module.css';
import { setBackup } from '@/lib/store/features/backupSlice';

type TProps = {
  pullData: () => void;
  data: TBuyProducts[];
};

export const CreateNewItem = ({ data, pullData }: TProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [newItem, setNewItem] = useState<TBuyProducts | null>(null);
  const [limitMessage, setLimitMessage] = useState(false);

  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);

  const dispatch = useDispatch();

  const handleSubmitData = () => {
    handleSubmit();
    inputRef?.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmitData();
    };
  };

  const handleCancel = () => {
    setNewItem(null);
    inputRef?.current?.blur();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem({
      _id: uuidv4(),
      title: e.target.value,
      addedAt: moment().format('DD.MM.YY HH:mm:ss'),
      isBought: false,
      isSent: false,
    })
  };

  const showLimitMessage = (
    <PopupNotification
      title="Превышен лимит"
      subTitle="Пожалуйста, сократите количество продуктов"
      isVisible={limitMessage}
      btnTitle="Ок"
      action={() => {
        setNewItem(null);
        setLimitMessage(false);
      }}
    />
  );

  const handleSubmit = async () => {
    if (!newItem) return; //если нет нового заголовка 
    if (data?.length >= CREATE_PRODUCTS_LIMIT) return setLimitMessage(true);

    const dto = [{ //dto для indexed db
      _id: newItem._id,
      title: newItem.title.trim(),
      addedAt: newItem.addedAt,
      isBought: false,
      isSent: false,
      isAddedOnline: isUserOnline ? true : false,
    }];

    await saveShoppingProducts(dto); //сохраняем в indexed db
    pullData(); //перезапрашиваем данные, чтобы появились в списке
    setNewItem(null);
    dispatch(setBackup(true));
  };

  return (
    <div className={styles.wrapper}>
      {showLimitMessage}
      <div className={styles.item}>
        <input
          ref={inputRef}
          className={styles.itemTitle}
          placeholder="Добавить"
          value={newItem?.title || ''}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <FadeComponent isVisible={!!newItem?.title?.length}>
          <button
            style={{ marginLeft: 'auto' }}
            onClick={handleSubmitData}
          >
            <RiAddLine className={styles.icon} />
          </button>
        </FadeComponent>
      </div>
      <AnimatePresence>
        {
          isFocused && (
            <motion.div
              layout
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ActionBtn variant="icon" action={handleCancel}>
                <IoArrowUndoOutline className={classNames(styles.icon, styles.returnIcon)} />
              </ActionBtn>
            </motion.div>
          )
        }
      </AnimatePresence>
    </div>
  );
};