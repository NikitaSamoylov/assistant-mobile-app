'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Checkbox } from '@/components/Checkbox';
import { TBuyProducts } from '@/lib/types/product';
import { FadeComponent } from '@/components/AnimatedComponents/FadeComponent';
import { GrUpdate } from "react-icons/gr";
import { MdEditNote } from 'react-icons/md';
import { ActionBtn } from '@/components/Buttons/ActionBtn';
import { AnimatePresence, motion } from 'framer-motion';
import { IoArrowUndoOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import {
  // addProductsToDeletedShopping,
  // clearShoppingDeleted,
  saveShoppingProducts
} from '@/lib/storage/indexedDb/productsToBuy';
import styles from './ListItemBtn.module.css';

export const animationConfig = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

type TProps = {
  item: TBuyProducts; // это элемент из data
  markItemAsBought: (val: TBuyProducts) => void;
  data: TBuyProducts[];
  pullData: () => void;
};

export const ListItem = ({
  item,
  data,
  pullData,
  markItemAsBought,
}: TProps) => {
  const [showApplyBtn, setShowApplyBtn] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [itemIsEdit, setItemIsEdit] = useState<TBuyProducts | null>(null);

  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);
  const userId = useSelector((state: RootState) => state.userSession.userSession?.id);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputDisabled = () => {
    setIsInputDisabled(isInputDisabled => !isInputDisabled);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItemIsEdit({ ...item, title: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateItemTitle();
    };
  };

  const handleBlur = () => {
    if (!isInputDisabled) return setIsInputDisabled(true)
  };

  useEffect(() => {
    if (item?._id !== itemIsEdit?._id) return;
    if (itemIsEdit?.title !== item?.title) {
      setShowApplyBtn(true)
    } else {
      setShowApplyBtn(false)
    }
  }, [itemIsEdit]);

  useEffect(() => {
    if (!isInputDisabled) {
      return inputRef?.current?.focus();
    };
    setShowApplyBtn(false);
    setItemIsEdit(null);
    inputRef?.current?.blur();
  }, [isInputDisabled]);

  const updateItemTitle = async () => { //update title
    setIsInputDisabled(true);

    if (itemIsEdit && itemIsEdit?.title === '') { //если title пуст, то удаляем элемент
      const dto = [
        ...data.filter(elem => elem._id !== item._id),
      ];
      await saveShoppingProducts(dto); //сохраняем в indexed отфильтрованную дату
      // await addProductsToDeletedShopping([itemIsEdit]); //добавляем на удаление в indexed текущий айтем
      pullData();

      setItemIsEdit(null);

      if (isUserOnline) {
        fetch('/api/buy', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            productIds: [itemIsEdit._id],
          })
        })
          // .then(() => clearShoppingDeleted()) //очищаем indexed удаленных элементов
          .catch(e => console.log(e))
      };
      return;
    };

    if (itemIsEdit && typeof itemIsEdit._id === 'string') { //иначе отправляем отредактированный элемент
      const product = {
        _id: itemIsEdit._id,
        title: itemIsEdit?.title?.trim(),
        addedAt: itemIsEdit.addedAt,
        isBought: itemIsEdit.isBought,
        isSent: false,
      };

      await saveShoppingProducts([product]); //сохраняем в indexed db 
      pullData();

      setItemIsEdit(null);

      if (isUserOnline) {
        fetch('/api/buy', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            products: [product].map(el => {
              const { isSent, ...rest } = el;
              return rest;
            }),
            markAsBoughtPatch: false, //обновляем только заголовок, пропускаем все остальные изменения
          })
        })
          .then((data) => data.json())
          .then((resp) => {
            saveShoppingProducts(resp.message)
          })
          .catch(e => console.log(e))
      };
    };
  };

  return (
    <div className={styles.wrapper}>
      <FadeComponent isVisible={true}>
        <AnimatePresence mode="wait">
          <ActionBtn variant="icon" action={handleInputDisabled}>
            {isInputDisabled ? (
              <motion.div
                key="edit"
                {...animationConfig}
              >
                <MdEditNote className={styles.editIcon} />
              </motion.div>
            ) : (
              <motion.div
                key="cancel"
                {...animationConfig}
              >
                <IoArrowUndoOutline className={styles.undoIcon} />
              </motion.div>
            )}
          </ActionBtn>
        </AnimatePresence>
      </FadeComponent>
      <li key={item._id} className={styles.item}>
        <input
          ref={inputRef}
          className={styles.itemTitle}
          value={(item?._id === itemIsEdit?._id) ?
            itemIsEdit?.title :
            item?.title}
          onFocus={() => setItemIsEdit(item)}
          onChange={handleChange}
          readOnly={isInputDisabled}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      </li>
      <AnimatePresence mode="wait">
        {showApplyBtn ? (
          <motion.div
            key="update"
            {...animationConfig}
          >
            <button
              className={styles.iconBtn}
              onClick={updateItemTitle}
            >
              <GrUpdate className={styles.icon} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="select"
            {...animationConfig}
          >
            <Checkbox checked={item.isBought} markItemAsBought={markItemAsBought} elem={item} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
};