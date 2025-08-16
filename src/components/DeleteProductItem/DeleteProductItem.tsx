'use client';

import { TextField } from "@/components/TextField";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { RefObject, useEffect, useState } from "react";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { TProduct } from "@/lib/types/product";
import { PopupNotification } from "@/components/Popups/PopupNotification";
import { deleteProductsFromStore } from "@/lib/storage/indexedDb/existingProducts";
import styles from './DeleteProductItem.module.css';
import { setBackup } from "@/lib/store/features/backupSlice";

type TProps = {
  productIds: TProduct[];
  popupRef: RefObject<HTMLDivElement | null>;
  pullData: VoidFunction;
};

export const DeleteProductItem = ({ productIds, popupRef, pullData }: TProps) => {
  const { isUserOnline } = useSelector((state: RootState) => state.isUserOnline);

  const [showPopupMsg, setShowPopupMsg] = useState(false);
  const [hideMenu, setHideMenu] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => { // здесь не закрываем меню, а делаем opacity  **0** 
    if (hideMenu) {
      if (!popupRef.current) return;
      popupRef.current.style.opacity = '0'
      setShowPopupMsg(true);
    } else {
      if (!popupRef.current) return;
      popupRef.current.style.opacity = '1'
      setShowPopupMsg(false);
    }
  }, [hideMenu]);

  const handleRemove = async () => {
    if (isUserOnline === null) return;

    await deleteProductsFromStore(productIds);
    setHideMenu(true);
    dispatch(setBackup(true));
    setShowPopupMsg(true);
  };

  const popupTitle = hideMenu && productIds?.length > 1 ? 'Продукты удалены' : 'Продукт удалён';

  const showMsg = (
    <PopupNotification
      title={popupTitle}
      subTitle=""
      btnTitle="Ок"
      action={() => {
        setHideMenu(false);
        setShowPopupMsg(false);
        pullData();
      }}
      isVisible={showPopupMsg}
    />
  );

  const handleClick = () => {
    return handleRemove();
  };

  return (
    <>
      <div
        className={styles.listItemBtnDelete}
        onClick={handleClick}
      >
        <TextField variant="p" color="error">
          {productIds?.length > 1 ? 'Закончились' : 'Закончился'}
        </TextField>
        <IoIosRemoveCircleOutline
          className={classNames(
            styles.listItemBtnIcon,
            styles.deleteListItemIcon
          )}
        />
      </div>
      {showMsg}
    </>
  )
};