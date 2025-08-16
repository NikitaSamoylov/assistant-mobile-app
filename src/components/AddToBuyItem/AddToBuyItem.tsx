'use client';

import { TextField } from "@/components/TextField";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { TProduct } from "@/lib/types/product";
import { RefObject, useEffect, useState } from "react";
import { PopupNotification } from "@/components/Popups/PopupNotification";
import moment from "moment";
import { saveShoppingProducts } from "@/lib/storage/indexedDb/productsToBuy";
import { deleteProductsFromStore } from "@/lib/storage/indexedDb/existingProducts";
import { useDispatch } from "react-redux";
import { setBackup } from "@/lib/store/features/backupSlice";
import styles from './AddToBuyItem.module.css';

type TProps = {
  productIds: TProduct[];
  popupRef: RefObject<HTMLDivElement | null>;
  pullData: VoidFunction;
};

export const AddToBuyItem = ({ productIds, popupRef, pullData }: TProps) => {
  const [showPopupMsg, setShowPopupMsg] = useState(false);
  const [hideMenu, setHideMenu] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
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

  const handleSubmit = async () => {
    setHideMenu(true);
    await deleteProductsFromStore(productIds); //удаляем из indexed db текущих продуктов

    const dtoToBuy = productIds?.map(product => { //готовим дто для добавления в to buy
      return {
        _id: product._id as string,
        title: product.title,
        addedAt: moment().format('DD.MM.YY HH:mm:ss'),
        isBought: false,
        isSent: false,
      };
    });
    await saveShoppingProducts(dtoToBuy);//repull buy не обязательно, т.к. в данный момент на другой вкладке находимся 
    dispatch(setBackup(true));
    setShowPopupMsg(true);
  };

  const popupTitle = productIds?.length && productIds?.length > 1 ?
    'Продукты перенесены' :
    'Продукт перенесён';
  const popupSubtitle = productIds?.length && productIds?.length > 1 ?
    'Они отображаются в списке на покупку' :
    'Он отображается в списке на покупку';

  const showMsg = (
    <PopupNotification
      title={popupTitle}
      subTitle={popupSubtitle}
      btnTitle="Ок"
      action={() => {
        setShowPopupMsg(false);
        pullData();
      }}
      isVisible={showPopupMsg}
    />
  );

  const handleClick = () => {
    return handleSubmit();
  };

  return (
    <>
      <div
        className={styles.listItemBtn}
        onClick={handleClick}
      >
        <TextField variant="p" color="main">
          Переместить на <br /> покупку
        </TextField>
        <HiOutlineShoppingBag className={styles.listItemBtnIcon} />
      </div>
      {showMsg}
    </>
  )
};